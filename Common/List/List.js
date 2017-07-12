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
    Platform,
    ListView,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    AlertIOS,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// var Mock = require('mockjs')
var requset = require('../Main/request')
var config= require('../Main/config')
var Detail=require('./Detail')
var width = Dimensions.get('window').width

var cachedResults ={
    nextPage:1,
    items:[],
    total:0
}
/**
 * Item 组件
 */
var Item=React.createClass({
    getInitialState(){
        var row = this.props.row

        return{
            up:row.voted,
            row:row
        }
    },

    _up(){
        var that = this
        var up = !this.state.up
        var row = this.state.row
        var url = config.header.api.base + config.header.api.up

        var body = {
            id:row._id,
            up:up ? 'yes':'no',
            accessToken:'abcde'
        }
        requset.post(url,body)
            .then(function (data) {
                if (data && data.success){
                    that.setState({
                        up:up
                    })
                }else{
                    Platform.OS=='ios'? AlertIOS.alert('点赞失败，稍后重试！'):Alert.alert('点赞失败，稍后重试！')
                }
            })
            .catch(function (err) {
                console.log(err)
                Platform.OS=='ios'? AlertIOS.alert('点赞失败，稍后重试！'):Alert.alert('点赞失败，稍后重试！')
            })
    },

    render(){
        var row = this.state.row
        return(
            <TouchableOpacity onPress={this.props.onSelect}>
                <View style={styles.item}>
                    <Text style={styles.title}>{row.title}</Text>
                    <Image
                        source={{uri:row.thumb}}
                        style={styles.thumb}
                    >
                        <Icon
                            name='ios-play'
                            size={28}
                            style={styles.play}
                        />
                    </Image>
                    <View style={styles.itemFooter}>
                        <View style={styles.handleBox}>
                            <Icon
                                name={this.state.up?'ios-heart':'ios-heart-outline'}
                                size={28}
                                style={[styles.up,this.state.up?null:styles.down]}
                                onPress={this._up}
                            />
                            <Text style={styles.handleText} onPress={this._up}>喜欢</Text>
                        </View>
                        <View style={styles.handleBox}>
                            <Icon
                                name='ios-chatboxes-outline'
                                size={28}
                                style={styles.up}
                            />
                            <Text style={styles.handleText}>评论</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
})

/**
 * list组件
 */
var List=React.createClass({
    getInitialState(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        return {
            isRefreshing:false,
            isLoadingTail:false,
            dataSource: ds.cloneWithRows([]),  //当渲染的是空数组，listView需要定义enableEmptySections
        };
    },
    // row 详情显示
    _renderRow(row){
        return <Item
            key={row._id}
            onSelect={()=>this._loadPage(row)}
            row={row}/>
    },
    // 组件安装完毕后调取数据
    componentDidMount(){
        this._fetchData(1);
    },

    _fetchData(page) {
        var that = this

        if(page !== 0){
            this.setState({
                isLoadingTail:true
            })
        }else {
            this.setState({
                isRefreshing:true
            })
        }

        requset.get(config.header.api.base + config.header.api.creations,{
            accessToken:'abcdef',
            page:page
        })
            .then((data) => {
                if(data.success){
                    var items = cachedResults.items.slice()

                    if(page !==0){
                        items = items.concat(data.data)
                        cachedResults.nextPage += 1
                    }else {
                        items = data.data.concat(items)
                    }

                    cachedResults.items =items
                    cachedResults.total=data.total

                    setTimeout(function () {
                        if(page !==0) {
                            that.setState({
                                isLoadingTail: false,
                                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        }else {
                            that.setState({
                                isRefreshing: false,
                                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        }
                    },100)
                }
            })
            .catch((error) => {
                if(page !==0) {
                    that.setState({
                        isLoadingTail: false,
                    })
                }else {
                    that.setState({
                        isRefreshing: false,
                    })
                }
                console.error(error);
            });
    },

    // _fetchData() {
    //     fetch('http://rapapi.org/mockjs/20376/api/creactions?accessToken=abcdef')
    //         .then((response) => response.text())
    //         .then((responseText) => {
    //             // throw new Error('错误信息')
    //             var resp =JSON.parse(responseText.replace(/\\'/g,''))
    //             var data= Mock.mock(resp)
    //             console.log(data)
    //             if(data.success){
    //                 this.setState({
    //                     dataSource:this.state.dataSource.cloneWithRows(data.data)
    //                 })
    //             }
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // },

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

    _onRefresh(){
        if(!this._hasMore() || this.state.isRefreshing){
            return
        }

        this._fetchData(0)
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>列表页面</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    renderFooter={this._renderFooter}
                    onEndReached={this._fetchMoreData}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}    // 正在刷新
                            onRefresh={this._onRefresh}  //  回调
                            tintColor="#ff6600"
                            title="拼命加载中。。。"
                            titleColor="#00ff00"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />
                    }
                    onEndReachedThreshold={20}
                    enableEmptySections={true}
                    showsVerticalScrollIndicator={false}  //   隐藏滚动条
                    automaticallyAdjustContentInsets={false}
                />
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    header: {
        paddingBottom:12,
        paddingTop:Platform.OS==='ios'?25:15,
        backgroundColor:'#ee735c'
    },
    headerTitle: {
        color: '#fff',
        fontSize:16,
        textAlign:'center',
        fontWeight:'600',
    },
    item:{
        width:width,
        marginBottom:10,
        backgroundColor:'white',
    },
    thumb:{
        width:width,
        height:Platform.OS==='ios'?width*0.56:width*0.56-15,
        resizeMode:'cover'
    },
    title:{
        padding:10,
        fontSize:Platform.OS==='ios'?18:15,
        color:'#333'
    },
    itemFooter:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#eee'
    },
    handleBox:{
        padding:10,
        flexDirection:'row',
        justifyContent:'center',
        width:width/2-0.5,
        backgroundColor:'white'
    },
    play:{
        position:'absolute',
        bottom:16,
        right:16,
        width:40,
        height:40,
        paddingTop:6,
        paddingLeft:15,
        backgroundColor:'transparent',
        borderColor:'#fff',
        borderWidth:1,
        borderRadius:20,
        color:'orange',
    },
    handleText:{
        paddingLeft:12,
        fontSize:18,
        color:'#333'
    },
    up:{
        fontSize:22,
        color:'red'
    },
    down:{
        fontSize:22,
        color:'#333'
    },
    loadingMore:{
        marginVertical:20
    },
    loadingText:{
        color:'#777',
        textAlign:'center'
    }
});

module.exports = List;
