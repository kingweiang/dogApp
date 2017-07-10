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
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// var Mock = require('mockjs')
var requset = require('../Main/request')
var config= require('../Main/config')
var width = Dimensions.get('window').width

var List=React.createClass({
    getInitialState(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        return {
            dataSource: ds.cloneWithRows([
                {
                    "_id":"410000199304119439","thumb":"http://dummyimage.com/480/0a53ab)","title":"@cparagraph(1, 3)","video":"'http://alicdn.ku6.com/v145/9/58/ab67b274f3edb66f45f07c383a5e2226-f4v-h264-aac-251-32-281334.0-10148555-1388158506769-2b10b0f32e98ed4243641f424085ec2d-1-00-00-00.f4v.mp4?auth_key=1496920863-0-0-5176b9010b3a2ab1584962f94ad4c1c9&start=0'"
                }
                ,
                {
                    "_id":"420000201209225884","thumb":"http://dummyimage.com/480/f2d396)","title":"@cparagraph(1, 3)","video":"'http://alicdn.ku6.com/v145/9/58/ab67b274f3edb66f45f07c383a5e2226-f4v-h264-aac-251-32-281334.0-10148555-1388158506769-2b10b0f32e98ed4243641f424085ec2d-1-00-00-00.f4v.mp4?auth_key=1496920863-0-0-5176b9010b3a2ab1584962f94ad4c1c9&start=0'"
                }
                ,
                {
                    "_id":"530000200405251888","thumb":"http://dummyimage.com/480/aaab3c)","title":"@cparagraph(1, 3)","video":"'http://alicdn.ku6.com/v145/9/58/ab67b274f3edb66f45f07c383a5e2226-f4v-h264-aac-251-32-281334.0-10148555-1388158506769-2b10b0f32e98ed4243641f424085ec2d-1-00-00-00.f4v.mp4?auth_key=1496920863-0-0-5176b9010b3a2ab1584962f94ad4c1c9&start=0'"
                }
                ,
                {
                    "_id":"810000200805206354","thumb":"http://dummyimage.com/480/72de62)","title":"@cparagraph(1, 3)","video":"'http://alicdn.ku6.com/v145/9/58/ab67b274f3edb66f45f07c383a5e2226-f4v-h264-aac-251-32-281334.0-10148555-1388158506769-2b10b0f32e98ed4243641f424085ec2d-1-00-00-00.f4v.mp4?auth_key=1496920863-0-0-5176b9010b3a2ab1584962f94ad4c1c9&start=0'"
                }
                ,
                {
                    "_id":"460000200802134847","thumb":"http://dummyimage.com/480/406f36)","title":"@cparagraph(1, 3)","video":"'http://alicdn.ku6.com/v145/9/58/ab67b274f3edb66f45f07c383a5e2226-f4v-h264-aac-251-32-281334.0-10148555-1388158506769-2b10b0f32e98ed4243641f424085ec2d-1-00-00-00.f4v.mp4?auth_key=1496920863-0-0-5176b9010b3a2ab1584962f94ad4c1c9&start=0'"
                }
                ,
                {
                    "_id":"650000199704273624","thumb":"http://dummyimage.com/480/744fe8)","title":"@cparagraph(1, 3)","video":"'http://alicdn.ku6.com/v145/9/58/ab67b274f3edb66f45f07c383a5e2226-f4v-h264-aac-251-32-281334.0-10148555-1388158506769-2b10b0f32e98ed4243641f424085ec2d-1-00-00-00.f4v.mp4?auth_key=1496920863-0-0-5176b9010b3a2ab1584962f94ad4c1c9&start=0'"
                }
                ,
                {
                    "_id":"50000020070705733X","thumb":"http://dummyimage.com/480/b0b92f)","title":"@cparagraph(1, 3)","video":"'http://alicdn.ku6.com/v145/9/58/ab67b274f3edb66f45f07c383a5e2226-f4v-h264-aac-251-32-281334.0-10148555-1388158506769-2b10b0f32e98ed4243641f424085ec2d-1-00-00-00.f4v.mp4?auth_key=1496920863-0-0-5176b9010b3a2ab1584962f94ad4c1c9&start=0'"
                }
                ,
                {
                    "_id":"360000197206201363","thumb":"http://dummyimage.com/480/d39fa9)","title":"@cparagraph(1, 3)","video":"'http://alicdn.ku6.com/v145/9/58/ab67b274f3edb66f45f07c383a5e2226-f4v-h264-aac-251-32-281334.0-10148555-1388158506769-2b10b0f32e98ed4243641f424085ec2d-1-00-00-00.f4v.mp4?auth_key=1496920863-0-0-5176b9010b3a2ab1584962f94ad4c1c9&start=0'"
                }
                ,
                {
                    "_id":"620000198808214426","thumb":"http://dummyimage.com/480/8202e3)","title":"@cparagraph(1, 3)","video":"'http://alicdn.ku6.com/v145/9/58/ab67b274f3edb66f45f07c383a5e2226-f4v-h264-aac-251-32-281334.0-10148555-1388158506769-2b10b0f32e98ed4243641f424085ec2d-1-00-00-00.f4v.mp4?auth_key=1496920863-0-0-5176b9010b3a2ab1584962f94ad4c1c9&start=0'"
                }
                ,
                {
                    "_id":"620000197504011561","thumb":"http://dummyimage.com/480/3f8e85)","title":"@cparagraph(1, 3)","video":"'http://alicdn.ku6.com/v145/9/58/ab67b274f3edb66f45f07c383a5e2226-f4v-h264-aac-251-32-281334.0-10148555-1388158506769-2b10b0f32e98ed4243641f424085ec2d-1-00-00-00.f4v.mp4?auth_key=1496920863-0-0-5176b9010b3a2ab1584962f94ad4c1c9&start=0'"
                }
            ]),  //当渲染的是空数组，listView需要定义enableEmptySections
        };
    },

    renderRow(row){
        return(
            <TouchableOpacity>
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
                                name='ios-heart-outline'
                                size={28}
                                style={styles.up}
                            />
                            <Text style={styles.handleText}>喜欢</Text>
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
    },
    // 组件安装完毕后调取数据
    componentDidMount(){
        this._fetchData();
    },

    _fetchData() {
        requset.get(config.header.api.base + config.header.api.creations,{accessToken:'abcdef'})
            .then((data) => {
                if(data.success){
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(data.data)
                    })
                }
            })
            .catch((error) => {
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
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>列表页面</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    enableEmptySections={true}
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
        height:width*0.56,
        resizeMode:'cover'
    },
    title:{
        padding:10,
        fontSize:18,
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
        paddingTop:7,
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
        color:'#333'
    }
});

module.exports = List;
