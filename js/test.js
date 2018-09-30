import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react';

@observer
export default class Test extends Component<Props> {
    render(){
        return (
            <Text>test</Text>
        );
    }
}