/**
 * Created by user on 16/5/27.
 */
import React,{
    Component,
} from 'react'

import {
    Animated,
    View,
    StyleSheet,
    Image,
    Easing,
    Text,

} from 'react-native';

import PropTypes from 'prop-types';
import  CommonStyle from '../CommonStyle'
export default class PageView extends Component {
    isLoad=false;
    constructor(props: any) {
        super(props);
        this.state = {
            transform: new Animated.Value(0)
        };
    }
    static propTypes = {
        isShow:PropTypes.bool
    }
    static defaultProps = {
        isShow: false,
    }
    componentDidMount(){
        this.isLoad=true;
        this.startAnimation();
    }
    componentWillUnmount(){
        this.isLoad=false;
    }
    startAnimation() {

        this.state.transform.setValue(0);
        Animated.timing(
            this.state.transform,
            {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
            },
        ).start(() => {
            if(this.isLoad){
                this.startAnimation()
            }

        });
    }

    render () {
        return (
            <View style={[styles.mainStyle,this.props.style]}>
                <View style={styles.container}>
                    <Animated.Image style={[styles.quan,{
                    transform: [{
                    rotateZ: this.state.transform.interpolate({
                        inputRange: [0,1],
                        outputRange: ['0deg', '360deg']
                    })}
                    ]}]
                    } source={require('./img/qyl_load.png')}/>
                    <Text style={{color:'white',fontSize:14}}>正在加载...</Text>
                </View>
            </View>
        )
    }
}
let styles = StyleSheet.create({
    //
    mainStyle:{
        flexDirection:'column',
        backgroundColor:'rgba(255,255,255,0.05)',
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        justifyContent:'center',
        alignItems:'center',

    },
    container:{
        borderRadius:10,
        backgroundColor:CommonStyle.color_light_black,
        width:80,
        height:80,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    icon:{
        width:22,
        height:9,
        left:14,
        top:20.5,
        position:'absolute',
    },
    quan:{
        width:42,
        height:41,
        resizeMode:'contain',
    }

});