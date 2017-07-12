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
    Platform,
    ScrollView,
    Image,
    ListView,
    RefreshControl
} from 'react-native';

var Video = require('react-native-video').default
var width = Dimensions.get('window').width
var config= require('../Main/config')
var requset = require('../Main/request')
import Icon from 'react-native-vector-icons/Ionicons';

var Detail=React.createClass({
    getInitialState(){
        var data = this.props.data
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        return{
            data:data,
            dataSource:ds.cloneWithRows([]),
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
    componentDidMount(){
        this._fetchData()
    },

    _fetchData(){
        var that = this
        var url = config.header.api.base+config.header.api.comment

        requset.get(url,{
            accessToken:'abcdef'
        })
        .then(function (data) {
            if(data && data.success){
                var comments = data.data
                if(comments && comments.length > 0){
                    that.setState({
                        comments:comments,
                        dataSource:that.state.dataSource.cloneWithRows(comments)
                    })
                }
            }
        })
        .catch((error)=>{
            console.log(error)
        })
        
    },

    _renderRow(row){
        return(
            <View key={row._id} style={styles.replyBox}>
                <Image style={styles.replyAvatar} source={{uri:row.replyBy.avatar}}/>
                <View style={styles.reply}>
                    <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
                    <Text style={styles.replyContent}>{row.content}</Text>
                </View>
            </View>
        )
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
                {/*<Text onPress={this._backToList} style={styles.welcome}>*/}
                    {/*Welcome to Detail!{data._id}*/}
                {/*</Text>*/}
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

                </View>
                {/*进度条*/}
                <View style={styles.progressBox}>
                    <View style={[styles.progressBar,{width:width*this.state.videoProgress}]}></View>
                </View>
                <ScrollView
                    style={styles.scrollView}
                    enableEmptySections={true}
                    showsVerticalScrollIndicator={false}
                    automaticallyAdjustContentInsets={false} // 当滚动视图放在一个导航条或者工具条后面的时候，iOS系统是否要自动调整内容的范围,如果你的ScrollView或ListView的头部出现莫名其妙的空白，尝试将此属性置为false
                >
                    <View style={styles.infoBox}>
                        <Image style={styles.avatar} source={{uri:data.author.avatar}}/>
                        <View style={styles.descBox}>
                            <Text style={styles.nickname}>{data.author.nickname}</Text>
                            <Text style={styles.title}>{data.title}</Text>
                        </View>
                    </View>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        enableEmptySections={true}
                        showsVerticalScrollIndicator={false}  //   隐藏滚动条
                        automaticallyAdjustContentInsets={false}
                    />
                </ScrollView>
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
        // flexDirection:'row',
        // justifyContent:'center',
        // alignItems:'center',
        // width:width,
        height:Platform.OS==='ios'?55:35,
        marginBottom:10,
        // paddingTop:20,
        // paddingLeft:10,
        // paddingRight:10,
        // borderBottomWidth:1,
        // borderColor:'rgba(0,0,0,0.1)',
        // backgroundColor:'#fff'
        width:width,
        // paddingBottom:Platform.OS==='ios'?12:24,24
        paddingTop:Platform.OS==='ios'?25:2,
        backgroundColor:'#ee735c',
        flexDirection:'row',
        // justifyContent:'center',
        // alignItems:'center'
    },
    backBox:{

      position:'absolute',
        width:Platform.OS==='ios'?45:50,
        flexDirection:'row',
        // alignItems:'center',
        // backgroundColor:'blue',
        paddingTop:Platform.OS==='ios'?25:8,
        justifyContent:'center',
        // alignItems:'center'
        paddingLeft:10,

    },
    backIcon:{
        color:'#999',
        fontSize:20,
        marginRight:5,
    },
    backText:{
        paddingTop:Platform.OS==='ios'?3:0,
      color:'#999',
        // textAlign:'center',
        // fontWeight:Platform.OS==='ios'?'600':'10',
    },
    headerTitle:{
        marginLeft:110,
        width:150,
        height:30,
        textAlign:'center',
        paddingTop:Platform.OS==='ios'?2:4,
        // marginBottom:Platform.OS==='ios'?6:5,
        color: '#fff',
        fontSize:16,
        fontWeight:'600',
        // backgroundColor:'white'
    },
    videoBox: {
        // marginTop:Platform.OS==='ios'?13:0,
        width:width,
        height:Platform.OS==='ios'?231:210,
        backgroundColor:'#000'
    },
    video: {
        width:width,
        height:Platform.OS==='ios'?249:200,
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
        marginTop:Platform.OS==='ios'?13:0,
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
        top:Platform.OS==='ios'?140:100,
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
        top:Platform.OS==='ios'?100:75,
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
    },
    infoBox:{
        width:width,
        flexDirection:'row',
        justifyContent:'center',
        marginTop:10,
    },
    avatar:{
        width:60,
        height:60,
        marginRight:10,
        marginLeft:10,
        borderRadius:30,
    },
    descBox:{
        flex:1,
    },
    nickname:{
        fontSize:Platform.OS==='ios'?18:15,
    },
    title:{
        marginTop:8,
        fontSize:Platform.OS==='ios'?16:13,
        color:'#666'
    },
    replyBox:{
        flexDirection:'row',
        justifyContent:'flex-start',
        marginTop:10
    },
    replyAvatar:{
        width:40,
        height:40,
        marginRight:10,
        marginLeft:10,
        borderRadius:20,
    },
    replyNickname:{
        color:'#666',

    },
    replyContent:{
        marginTop:4,
        fontSize:Platform.OS==='ios'?14:11,
        color:'#666'
    },
    reply:{
        flex:1
    }
});

module.exports = Detail;
/**
 * Created by ww on 2017/7/7.
 */
