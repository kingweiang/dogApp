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
    View
} from 'react-native';

var Detail=React.createClass({
    _backToList(){
        this.props.navigator.pop()
    },

    render() {
        var row = this.props.row
        return (
            <View style={styles.container}>
                <Text onPress={this._backToList} style={styles.welcome}>
                    Welcome to Detail!{row._id}
                </Text>
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

module.exports = Detail;
/**
 * Created by ww on 2017/7/7.
 */
