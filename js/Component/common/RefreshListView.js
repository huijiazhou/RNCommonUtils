/**
 * zhj
 */

import React, {PureComponent} from 'react'
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ViewPropTypes,Dimensions} from 'react-native'
const ScreenHight = Dimensions.get('window').height
export const RefreshState = {
    Idle: 0,
    HeaderRefreshing: 1,
    FooterRefreshing: 2,
    NoMoreData: 3,
    Failure: 4,
}

const DEBUG = false
const log = (text: string) => {DEBUG && console.log(text)}

type Props = {
    refreshState: number,
    onHeaderRefresh: Function,
    onFooterRefresh?: Function,
    data: Array<any>,

    footerContainerStyle?: ViewPropTypes.style,
    footerTextStyle?: ViewPropTypes.style,

    listRef?: any,

    footerRefreshingText?: string,
    footerFailureText?: string,
    footerNoMoreDataText?: string,
    footerEmptyDataText?: string,

    renderItem: Function,
}

type State = {

}

class RefreshListView extends PureComponent<Props, State> {

    static defaultProps = {
        footerRefreshingText: '数据加载中…',
        footerFailureText: '点击重新加载',
        footerNoMoreDataText: '已加载全部数据',
        footerEmptyDataText: '暂时没有相关数据',
    }

    componentWillReceiveProps(nextProps: Props) {
        log('[RefreshListView]  RefreshListView componentWillReceiveProps ' + nextProps.refreshState)
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        log('[RefreshListView]  RefreshListView componentDidUpdate ' + prevProps.refreshState)
    }

    onHeaderRefresh = () => {
        log('[RefreshListView]  onHeaderRefresh')

        if (this.shouldStartHeaderRefreshing()) {
            log('[RefreshListView]  onHeaderRefresh')
            if (this.props.onHeaderRefresh)
                this.props.onHeaderRefresh(RefreshState.HeaderRefreshing)
        }
    }

    onEndReached = (info: {distanceFromEnd: number}) => {
        log('[RefreshListView]  onEndReached   ' + info.distanceFromEnd)

        if (this.shouldStartFooterRefreshing()) {
            log('[RefreshListView]  onFooterRefresh')
            this.props.onFooterRefresh && this.props.onFooterRefresh(RefreshState.FooterRefreshing)
        }
    }

    shouldStartHeaderRefreshing = () => {
        log('[RefreshListView]  shouldStartHeaderRefreshing')

        if (this.props.refreshState == RefreshState.HeaderRefreshing ||
            this.props.refreshState == RefreshState.FooterRefreshing) {
            return false
        }

        return true
    }

    shouldStartFooterRefreshing = () => {
        log('[RefreshListView]  shouldStartFooterRefreshing')

        let {refreshState, data} = this.props
        if (data.length == 0 || data.length < (this.props.loadnumOnetime?this.props.loadnumOnetime:1)) {
            return false
        }

        return (refreshState == RefreshState.Idle)
    }

    render() {
        log('[RefreshListView]  render')

        let {renderItem, ...rest} = this.props

        return (
            <FlatList
                style={this.props.style}
                ref={this.props.listRef}
                onEndReached={this.onEndReached}
                onRefresh={this.onHeaderRefresh}
                refreshing={this.props.onHeaderRefresh ?this.props.refreshState == RefreshState.HeaderRefreshing :false}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.01}
                ListEmptyComponent={this._renderEmptyItem()}
                renderItem={renderItem}
                onScroll={this.props.onScroll}
                scrollEventThrottle={100}
                {...rest}
            />
        )
    }
    _renderEmptyItem=()=>{
        return (
            <View style={{flex:1 ,marginTop:ScreenHight/3, alignItems:'center', justifyContent:'center' }} >
                <Text> {'暂无数据'} </Text>
            </View>  
        );
    }
    renderFooter = () => {
        let footer = null

        let footerContainerStyle = [styles.footerContainer, this.props.footerContainerStyle]
        let footerTextStyle = [styles.footerText, this.props.footerTextStyle]
        let {footerRefreshingText, footerFailureText, footerNoMoreDataText, footerEmptyDataText} = this.props

        switch (this.props.refreshState) {
            case RefreshState.Idle:
                footer = (<View style={footerContainerStyle} />)
                break;
            case RefreshState.Failure: {
                footer = (
                    <TouchableOpacity
                        style={footerContainerStyle}
                        onPress={() => {
                            this.props.onFooterRefresh && this.props.onFooterRefresh(RefreshState.FooterRefreshing)
                        }}
                    >
                        <Text style={footerTextStyle}>{footerFailureText}</Text>
                    </TouchableOpacity>
                )
                break;
            }
            case RefreshState.FooterRefreshing: {
                footer = (
                    <View style={footerContainerStyle} >
                        <ActivityIndicator size="small" color="#888888" />
                        <Text style={[footerTextStyle, {marginLeft: 7}]}>{footerRefreshingText}</Text>
                    </View>
                )
                break;
            }
            case RefreshState.NoMoreData: {
                footer = (
                    <View style={footerContainerStyle} >
                        <Text style={footerTextStyle}>{footerNoMoreDataText}</Text>
                    </View>
                )
                break;
            }
        }

        return footer
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 44,
    },
    footerText: {
        fontSize: 14,
        color: '#555555'
    }
})

export default RefreshListView