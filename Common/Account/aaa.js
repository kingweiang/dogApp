/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';

var Edit=React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={{uri:row.thumb}}
                    style={styles.thumb}
                >
                <Image soure={{uri:'http://mall.jupiterland.com.cn/3.jpg'}} style={{resizeMode:'cover',flex:1}} />
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

module.exports = Edit;
