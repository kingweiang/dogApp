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
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Platform
} from 'react-native';

var Video = require('react-native-video').default
var width = Dimensions.get('window').width
import Icon from 'react-native-vector-icons/Ionicons';

var Detail=React.createClass({
    getInitialState(){
        var data = this.props.data
        return{
            data:data,
            rete:1,
            muted:false,
            resizeMode:'contain',  // 包含
            repeat:false,
            videoLoaded:false,  // 视频是否开启
            videoProgress:0.001, // 视频进度初始值
            videoTotal:0,  // 视频整个时长
            currentTime:0, // 视频当前时间
            playing:false,  // 播放状态
            paused:false,  // 暂停状态
            videoOK:true,  // 是否报错
        }
    },

    _onLoadStart(){
        console.log('load start')
    },

    _onLoad(){
        console.log('load')
    },

    _onProgress(data){
        if (!this.state.videoLoaded){
            this.setState({
                videoLoaded:true,
            })
        }
        var duration=data.playableDuration   // 视频总时长
        var currentTime=data.currentTime   // 视频当前时间
        var percent=Number((currentTime/duration).toFixed(3))   // 视频当前播放时间比率,结果保留小数点3位
        var newState = {
            videoTotal:duration,
            currentTime:Number(data.currentTime.toFixed(3)),
            videoProgress:percent
        }

        if (!this.state.videoLoaded){
            newState.videoLoaded = true
        }

        if (!this.state.playing){
            newState.playing = true
        }
        this.setState(newState)
        // console.log(data)
        // console.log('_onProgress')
    },

    _onEnd(){
        this.setState({
            videoProgress:1,
            playing:false,
            videoLoaded:false
        })
        console.log('end')
    },

    _onError(e){
        console.log(e)
        console.log('error')
        this.setState({
                videoOK:false,
        })
    },

    _backToList(){
        this.props.navigator.pop()
    },

    _rePlay(){

        this.refs.videoPlayer.seek(0)
    },
    // 暂停
    _pause(){
        if (!this.state.paused){
            this.setState({
                paused:true
            })
        }
    },
    _resume(){
        if (this.state.paused){
            this.setState({
                paused:false
            })
        }
    },
    render() {
        var data = this.props.data
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBox} onPress={this._backToList}>
                        <Icon name='ios-arrow-back' style={styles.backIcon}/>
                        <Text style={styles.backText}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOflines={1}>视频详情页</Text>
                </View>
                <Text onPress={this._backToList} style={styles.welcome}>
                    Welcome to Detail!{data._id}
                </Text>
                <View style={styles.videoBox}>
                    <Video
                        ref="videoPlayer"
                        source={{uri:data.video}}
                        style={styles.video}
                        volume={5}
                        paused={this.state.paused}
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
                    {
                        !this.state.videoOK && <Text style={styles.failText}>视频出错了，很抱歉！</Text>
                    }
                    {
                        !this.state.videoLoaded && <ActivityIndicator color='#ee735c' style={styles.loading} />
                    }
                    {/*播放按钮*/}
                    {
                        this.state.videoLoaded && !this.state.playing
                        ?<Icon
                            onPress={this._rePlay}
                            size={50}
                            name='ios-play'
                            style={styles.playIcon}/>:null
                    }
                    {/*暂停按钮*/}
                    {
                        this.state.videoLoaded && this.state.playing
                        ?<TouchableOpacity
                            onPress={this._pause}
                            style={styles.pauseBtn}
                        >
                            {
                                this.state.paused
                                ?<Icon
                                    onPress={this._resume}
                                    size={50}
                                    name='ios-play'
                                    style={styles.resumeIcon}
                                />:<Text></Text>
                            }
                        </TouchableOpacity>:null
                    }
                    {/*进度条*/}
                    <View style={styles.progressBox}>
                        <View style={[styles.progressBar,{width:width*this.state.videoProgress}]}></View>
                    </View>
                </View>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    header:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:width,
        height:64,
        paddingTop:20,
        paddingLeft:10,
        paddingRight:10,
        borderBottomWidth:1,
        borderColor:'rgba(0,0,0,0.1)',
        backgroundColor:'#fff'
    },
    backBox:{
      position:'absolute',
        left:12,
        top:32,
        width:50,
        flexDirection:'row',
        alignItems:'center',
    },
    backIcon:{
        color:'#999',
        fontSize:20,
        marginRight:5,
    },
    backText:{
      color:'#999'
    },
    headerTitle:{
      width:width-120,
        textAlign:'center'
    },
    videoBox: {
        width:width,
        height:Platform.OS==='ios'?320:240,
        backgroundColor:'#000'
    },
    video: {
        width:width,
        height:Platform.OS==='ios'?320:240,
        backgroundColor:'#000'
    },
    loading:{
        position:'absolute',
        left:0,
        top:140,
        width:width,
        alignSelf:'center',
        backgroundColor:'transparent'
    },
    progressBox:{
        width:width,
        height:5,
        backgroundColor:'#ccc'
    },
    progressBar:{
        width:1,
        height:5,
        backgroundColor:'#ff6600'
    },
    playIcon:{
        position:'absolute',
        top:140,
        left:width/2-30,
        width:60,
        height:60,
        paddingTop:5,
        paddingLeft:22,
        backgroundColor:'transparent',
        borderColor:'#fff',
        borderWidth:1,
        borderRadius:30,
        color:'orange',
    },
    pauseBtn:{
        width:width,
        height:360,
        position:'absolute',
    },
    resumeIcon:{
        position:'absolute',
        top:140,
        left:width/2-30,
        width:60,
        height:60,
        paddingTop:5,
        paddingLeft:22,
        backgroundColor:'transparent',
        borderColor:'#fff',
        borderWidth:1,
        borderRadius:30,
        color:'orange',
    },
    failText:{
        position:'absolute',
        left:0,
        top:180,
        width:width,
        textAlign:'center',
        color:'white',
        backgroundColor:'transparent'
    }
});

module.exports = Detail;
/**
 * Created by ww on 2017/7/7.
 */
