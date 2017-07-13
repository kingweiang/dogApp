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
    Image,
    ListView,
    TextInput,
    Modal,
    AlertIOS,
    Alert,
} from 'react-native';

var Video = require('react-native-video').default
var width = Dimensions.get('window').width
var config= require('../Main/config')
var requset = require('../Main/request')
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';

var cachedResults ={
    nextPage:1,
    items:[],
    total:0
}

var Detail=React.createClass({
    getInitialState(){
        var data = this.props.data
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        return{
            data:data,   // 当前视频的数据
            dataSource:ds.cloneWithRows([]),   // comments 数据来源
            //  video 控制方面值
            muted:false,
            resizeMode:'contain',  // 包含
            repeat:false,
            rete:1,
            //  video 启动方面值
            videoLoaded:false,  // 视频是否开启
            videoProgress:0.001, // 视频进度初始值
            videoTotal:0,  // 视频整个时长
            currentTime:0, // 视频当前时间
            playing:false,  // 播放状态
            paused:false,  // 暂停状态
            videoOK:true,  // 是否报错

            //modal
            animationType:'none',
            content:'',
            modalVisible:false,
            isSending:false, // 评论发送状态

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

    _fetchData(page) {
        var that = this

        this.setState({
            isLoadingTail:true
        })

        var url = config.header.api.base+config.header.api.comment
        requset.get(url,{
            accessToken:'abcdef',
            creation:123,
            page:page
        })
            .then((data) => {
                if(data.success){
                    var items = cachedResults.items.slice()
                    items = items.concat(data.data)
                    cachedResults.nextPage += 1
                    cachedResults.items =items
                    cachedResults.total=data.total

                    that.setState({
                        isLoadingTail: false,
                        dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                    })
                }
            })
            .catch((error) => {
                that.setState({
                    isLoadingTail: false,
                })
                console.error(error);
            });
    },

    _hasMore(){
        return cachedResults.items.length !== cachedResults.total
    },

    _fetchMoreData(){
        if(!this._hasMore()|| this.state.isLoadingTail){
            return
        }
        var page = cachedResults.nextPage
        this._fetchData(page)
    },

    _renderFooter(){
        if(!this._hasMore() && cachedResults.total !==0){
            return (
                <View style={styles.loadingMore}>
                    <Text style={styles.loadingText}>别扯了，已经到底了。。。</Text>
                </View>
            )
        }
        if(!this.state.isLoadingTail){
            return <View style={styles.loadingMore}/>
        }
        return <ActivityIndicator
            style={[styles.loadingMore, {height: 80}]}
        />
    },
    /**
     * 调用Detail页,将数据带入Detail页
     */
    _loadPage(row){
        this.props.navigator.push({
            name:'detail',
            component:Detail,
            params:{
                data:row
            }
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
    _focus(){
        this._setModalVisible(true)
    },
    _blur(){},
    _closeModal(){
        this._setModalVisible(false)
    },
    _setModalVisible(isVisible){
        this.setState({
            modalVisible:isVisible,
            content:''
        })
    },
    _submit(){
      var that = this
      if(!this.state.content){
          console.log('Pressed1!');
          return  Platform.OS=='ios'? AlertIOS.alert('留言不能为空！'):Alert.alert('留言不能为空！')
      }
      if(this.state.isSending){
          console.log('Pressed2!');
          return  Platform.OS=='ios'? AlertIOS.alert('正在评论中。。。！'):Alert.alert('正在评论中。。。！')
      }
      this.setState({
          isSending:true
      },function () {
          var body = {
              accessToken:'abc',
              creation:'123',
              content:this.state.content
          }
          var url = config.header.api.base+ config.header.api.comment
          requset.post(url,body)
              .then(function (data) {
                  if(data && data.success){
                      // 拿到之前的items
                      var items = cachedResults.items.slice()
                      var content = that.state.content

                      // 将输入数据和前面的items进行拼接
                      items=[{
                          content:that.state.content,
                          replyBy:{
                              avatar:'http://img1.7wenta.com/upload/qa_headIcons/20150212/14237418269486667.jpg',
                              nickname:'lisi'
                          }
                      }].concat(items)

                      cachedResults.items = items
                      cachedResults.total=cachedResults.total+1

                      that.setState({
                          // content:'',
                          isSending:false,
                          dataSource:that.state.dataSource.cloneWithRows(
                              cachedResults.items
                          )
                      })
                      that._setModalVisible(false)
                  }
              })
              .catch((err)=>{
                console.log(err)
                  that.setState({isSending:false})
                  that._setModalVisible(false)
                  Platform.OS=='ios'? AlertIOS.alert('留言失败，稍后重试！'):Alert.alert('留言失败，稍后重试！')
              })
      })
    },
    _handlePress() {
        console.log('Pressed!');
        if(!this.state.content){
            console.log('Pressed2!');
            return  Platform.OS=='ios'? AlertIOS.alert('留言不能为空！'):Alert.alert('留言不能为空！')
        }
    },
    _renderHeader(){
        var data = this.state.data
        return(
        <View style={styles.listHeader}>
            <View style={styles.infoBox}>
                <Image style={styles.avatar} source={{uri:data.author.avatar}}/>
                <View style={styles.descBox}>
                    <Text style={styles.nickname}>{data.author.nickname}</Text>
                    <Text style={styles.title}>{data.title}</Text>
                </View>
            </View>
            <View  style={styles.commentBox}>
                <View  style={styles.comment}>
                    <TextInput
                        placeholder="我也要点评一下。。。"
                        style={styles.content}
                        multiline={true}   //多行
                        onFocus={this._focus}
                    />
                </View>
            </View>
            <View style={styles.commentArea}>
                <Text style={styles.commentTitle}>精彩点评</Text>
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

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    renderFooter={this._renderFooter}
                    renderHeader={this._renderHeader}
                    onEndReached={this._fetchMoreData}
                    onEndReachedThreshold={20}
                    enableEmptySections={true}
                    showsVerticalScrollIndicator={false}  //   隐藏滚动条
                    automaticallyAdjustContentInsets={false}
                />
                <Modal
                    animationType={'fade'}  // 浮层动画形式
                    visible={this.state.modalVisible}
                    onRequestClose={()=>{this._setModalVisible(false)}}
                >
                    <View style={styles.modalContainer}>
                        <Icon
                            onPress={this._closeModal}
                            name='ios-close-outline'
                            style={styles.closeIcon}
                        />
                        <View  style={styles.commentBox}>
                            <View  style={styles.comment}>
                                <TextInput
                                    placeholder="我也要点评一下。。。"
                                    style={styles.content}
                                    multiline={true}   //多行
                                    // onFocus={this._focus}
                                    // onBlur={this._blur}  // 失去焦点的时候
                                    defaultValue={this.state.content}
                                    onChangeText={(text)=>{
                                        this.setState({
                                            content:text
                                        })
                                    }}
                                />
                            </View>
                        </View>
                        <Button
                            style={styles.submitBtn}
                            styleDisabled={{color: 'red'}}
                            onPress={() => this._submit()}>
                            Press Me!
                        </Button>
                    </View>
                </Modal>
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
    modalContainer:{
      flex:1,
        paddingTop:45,
        backgroundColor:'#fff'
    },
    submitBtn:{
        padding:16,
        marginLeft:10,
        marginTop:30,
        // marginBottom:20,
        borderWidth:1,
        borderColor:'#ee735c',
        borderRadius:4,
        fontSize:18,
        color:'#ee735c',
        marginBottom:10,
        width:width-20,
},
    closeIcon:{
        alignSelf:'center',
        fontSize:30,
        color:'#ee735c'
    },
    header:{
        // flexDirection:'row',
        // justifyContent:'center',
        // alignItems:'center',
        // width:width,
        height:Platform.OS==='ios'?55:35,
        marginBottom:6,
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
        fontSize:Platform.OS==='ios'?20:18,
        marginRight:5,
    },
    backText:{
        paddingTop:Platform.OS==='ios'?2:1,
      color:'#999',
        fontSize:Platform.OS==='ios'?14:12,
        // textAlign:'center',
        // fontWeight:Platform.OS==='ios'?'600':'10',
    },
    headerTitle:{
        marginLeft:110,
        width:150,
        height:26,
        textAlign:'center',
        paddingTop:Platform.OS==='ios'?2:7,
        // marginBottom:Platform.OS==='ios'?6:5,
        color: '#fff',
        fontSize:Platform.OS==='ios'?16:14,
        fontWeight:Platform.OS==='ios'?'600':'300',
        // backgroundColor:'white'
    },
    videoBox: {
        width:width,
        height:Platform.OS==='ios'?205:180,
        backgroundColor:'#000',
        opacity:1,
    },
    video: {
        marginTop:Platform.OS==='ios'?10:0,
        width:width,
        height:Platform.OS==='ios'?195:180,
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
        marginTop:Platform.OS==='ios'?0.3:0.5,
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
        top:Platform.OS==='ios'?85:70,
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
        top:Platform.OS==='ios'?85:70,
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
    },
    loadingMore:{
        marginVertical:20
    },
    loadingText:{
        color:'#777',
        textAlign:'center'
    },
    commentBox:{
        marginTop:2,
        marginBottom:10,
        padding:8,
        width:width,
    },
    content:{
        paddingLeft:2,
        color:'#333',
        borderWidth:1,
        borderColor:'#ddd',
        borderRadius:4,
        fontSize:12,
        height:60,
    },
    listHeader:{
        width:width,
        marginTop:10,
    },
    commentArea:{
        width:width,
        marginTop:2,
        paddingBottom:6,
        paddingLeft:10,
        paddingRight:10,
        borderBottomWidth:1,
        borderBottomColor:'#eee',
    },
    commentTitle:{

    },
});

module.exports = Detail;
/**
 * Created by ww on 2017/7/7.
 */
