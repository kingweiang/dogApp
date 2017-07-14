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
var {CountDownText} = require('react-native-sk-countdown');


var Account=React.createClass({
    render: function(){
        return (
            <View style={styles.container}>
                <Text style={styles.tip}>{'CountDown in seconds \n 以秒为单位的倒计时'}</Text>
                <View style={styles.row}>
                    <CountDownText
                        style={styles.cd}
                        countType='seconds' // 计时类型：seconds / date
                        auto={true} // 自动开始
                        afterEnd={() => {}} // 结束回调
                        timeLeft={10} // 正向计时 时间起点为0秒
                        step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                        startText='获取验证码' // 开始的文本
                        endText='获取验证码' // 结束的文本
                        intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
                    />
                </View>
                <Text style={styles.tip}>{'CountDown in timestamp \n 以日期-时间为单位的倒计时'}</Text>
                <View style={styles.row}>
                    <CountDownText // 倒计时
                        style={styles.cd}
                        countType='date' // 计时类型：seconds / date
                        auto={true} // 自动开始
                        afterEnd={() => {}} // 结束回调
                        timeLeft={10} // 正向计时 时间起点为0秒
                        step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                        startText='' // 开始的文本
                        endText='' // 结束的文本
                        intervalText={(date, hour, min, sec) => date + '天' + hour + '时' + min + '分' + sec} // 定时的文本回调
                    />
                </View>
            </View>
        )
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    row: {
        padding: 7,
        backgroundColor: 'red',
        borderRadius: 7,
    },
    tip: {
        fontSize: 20,
    },
    cd: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
    },
});

module.exports = Account;
/**
 * Created by ww on 2017/7/7.
 */
