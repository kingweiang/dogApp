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
    Dimensions
} from 'react-native';

var Video = require('react-native-video').default
var width = Dimensions.get('window').width

var Detail=React.createClass({
    getInitialState(){
        var data = this.props.data
        return{
            data:data,
            rete:1,
            muted:false,
            resizeMode:'contain',  // 包含
            repeat:false
        }
    },

    _onLoadStart(){
        console.log('load start')
    },

    _onLoad(){
        console.log('load')
    },

    _onProgress(){
        // console.log(data)
        console.log('_onProgress')
    },

    _onEnd(){
        console.log('end')
    },

    _onError(e){
        console.log(e)
        console.log('error')
    },

    _backToList(){
        this.props.navigator.pop()
    },

    render() {
        var data = this.props.data
        return (
            <View style={styles.container}>
                <Text onPress={this._backToList} style={styles.welcome}>
                    Welcome to Detail!{data._id}
                </Text>
                <View style={styles.videoBox}>
                    <Video
                        ref="videoPlayer"
                        source={{uri:data.video}}
                        style={styles.video}
                        volume={5}
                        paused={false}
                        rate={this.state.rate}
                        muted={this.state.muted}    //是否静音
                        resizeMode={this.state.resizeMode}  // 显示区域设置
                        repeat={this.state.repeat}    // 是否重复播放

                        onLoadStart={this._onLoadStart}    // 视频开始加载这个时候调用的方法
                        onLoad={this._onLoad}    // 当视频不断加载这个时候不断的调用这个方法
                        onProgress={this._onProgress}   // 视频播放时，每隔250毫秒执行这个方法。控制播放进度
                        onEnd={this._onEnd}
                        onError={this._onError}
                    />
                </View>
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
    videoBox: {
        width:width,
        height:360,
        backgroundColor:'#000'
    },
    video: {
        width:width,
        height:360,
        backgroundColor:'#000'
    },
});

module.exports = Detail;
/**
 * Created by ww on 2017/7/7.
 */
