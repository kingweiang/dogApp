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
    TextInput,
    AlertIOS,
    Alert,
    Platform,
} from 'react-native';

import Button from 'react-native-button';
var request = require('../../Common/Main/request')
var config = require('../../Common/Main/config')

var Login=React.createClass({
    getInitialState(){
        return{
            phoneNumber:'',
            codeSent:false,
            verifyCode:'',
        }
    },

    _showVerifyCode(){
        this.setState({
            codeSent:true
        })
    },

    _sendVerifyCode(){
        var that = this
        var phoneNumber = this.state.phoneNumber
        if(!phoneNumber){
            return  Platform.OS=='ios'? AlertIOS.alert('手机号不能为空！'):Alert.alert('手机号不能为空！')
        }
        var body={
            phoneNumber:phoneNumber
        }
        var url = config.header.api.base+config.header.api.signup
        request.post(url,body)
            .then((data)=>{
                if(data &&data.success){
                    that._showVerifyCode()
                }else{
                    Platform.OS=='ios'? AlertIOS.alert('获取验证码失败，请检查手机号码是否正确！'):Alert.alert('获取验证码失败，请检查手机号码是否正确！')
                }
            })
            .catch((err)=>{
                Platform.OS=='ios'? AlertIOS.alert('获取验证码失败，请检查手机网络是否正常！'):Alert.alert('获取验证码失败，请检查手机网络是否正常！')
            })
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.signupBox}>
                <Text style={styles.title}>
                    快速登录
                </Text>
                    <TextInput
                        placeholder="请输入手机号"   // 站位符
                        autoCaptialize={'none'}     // 不处理大小写
                        autoCorrect={false}          // 不纠正对错
                        keyboradType={'number-pad'}  // 键盘类型  数字型
                        style={styles.inputField}
                        underlineColorAndroid="transparent"
                        onChangeText={(text)=>{
                            this.setState({
                                phoneNumber:text
                            })
                        }}
                    />
                    {
                        this.state.codeSent
                            ? <View style={styles.verifyCodeBox}>
                            <TextInput
                                placeholder="请输入验证码"   // 站位符
                                autoCaptialize={'none'}     // 不处理大小写
                                autoCorrect={false}          // 不纠正对错
                                keyboradType={'number-pad'}  // 键盘类型  数字型
                                style={styles.inputField}
                                underlineColorAndroid="transparent"
                                onChangeText={(text)=>{
                                    this.setState({
                                        verifyCode:text
                                    })
                                }}
                            />
                        </View>:null
                    }
                    {
                        this.state.codeSent
                        ?<Button
                            style={styles.btn}
                            onPress={this._submit}
                        >登录</Button>
                        :<Button
                            style={styles.btn}
                            onPress={this._sendVerifyCode}
                        >获取验证码</Button>
                    }
                </View>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        color:'#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    signupBox: {
        marginTop: 30,
    },
    inputField:{
        // flex:1,
        // padding:15,
        height:40,
        color:'#666',
        fontSize:16,
        backgroundColor:'#fff',
        borderRadius:4,
        borderWidth:1,
        marginTop:5,

    },
    btn:{
        padding:10,
        marginTop:10,
        backgroundColor:'transparent',
        borderColor:'#ee735c',
        borderWidth:1,
        borderRadius:4,
        color:'#ee735c',
        fontSize:Platform.OS=='ios'?16:14,
        fontWeight:Platform.OS=='ios'?'400':'200',
    }
});

module.exports = Login;
/**
 * Created by ww on 2017/7/7.
 */
