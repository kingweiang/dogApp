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
    TouchableOpacity,
    Dimensions,
    Platform,
    Image,
    AsyncStorage,
} from 'react-native';
var ImagePicker = require('react-native-image-picker');
// var ImagePicker= require('NativeModules').ImagePickerManager
var {CountDownText} = require('react-native-sk-countdown');
import Icon from 'react-native-vector-icons/Ionicons';
var width = Dimensions.get('window').width

const options = {
    title: '选择图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '图片库',
    cameraType: 'back',
    mediaType: 'photo',
    videoQuality: 'high',
    durationLimit: 10,
    maxWidth: 600,
    maxHeight: 600,
    aspectX: 2,
    aspectY: 1,
    quality: 0.8,
    angle: 0,
    allowsEditing: false,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

var Account=React.createClass({
    getInitialState(){
        var user = this.props.user || {}
        return{
            user:user
        }
    },
    componentDidMount(){
        var that = this
        AsyncStorage.getItem('user')
            .then((data)=>{
                var user
                if(data){
                    user = JSON.parse(data)
                }
                if(user && user.accessToken){
                    that.setState({
                        user:user

                    })
                }

            })
    },
    _pickPhoto(){

        var that = this
        ImagePicker.showImagePicker(options,(response) => {
            if (response.didCancel) {
                return
            }

            var avatarData = 'data:image/jpeg;base64,' + response.data
            var user = that.state.user
            user.avatar = avatarData
            that.setState({
                user:user
            })
        })
    },
    render: function(){
        var user = this.state.user
        return (
            <View style={styles.container}>
                <View style={styles.toolbar}>
                    <Text style={styles.toolbarTitle}>我的账户</Text>
                </View>
                {console.log(user.avatar)}
                {
                    user.avatar ?
                        <TouchableOpacity onPress={this._pickPhoto} style={styles.avatarContainer}>
                            <Image source={{uri: user.avatar}} style={styles.avatarContainer}>
                                <View style={styles.avatarBox}>
                                    <Image
                                        source={{uri: user.avatar}}
                                        style={styles.avatar}
                                    />
                                </View>
                                <Text style={styles.avatarTip}>点击头像更换</Text>
                            </Image>
                        </TouchableOpacity>
                        : <TouchableOpacity onPress={this._pickPhoto} style={styles.avatarContainer}>
                        <Text style={styles.avatarTip}>添加头像</Text>
                        <View style={styles.avatarBox}>
                            <Icon
                                name='ios-cloud-upload-outline'
                                style={styles.plusIcon}
                            />
                        </View>
                    </TouchableOpacity>
                }
            </View>
        )
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    toolbar: {
        backgroundColor: '#ee735c',
        flexDirection:'row',
        paddingTop:Platform.OS==='ios'?25:10,
        paddingBottom:Platform.OS==='ios'?8:4,
    },
    toolbarTitle: {
        flex:1,
        fontSize: Platform.OS==='ios'?16:15,
        color:'#fff',
        textAlign:'center',
        fontWeight:Platform.OS==='ios'?'500':'400',
    },
    avatarContainer: {
        marginTop:1,
        width:width,
        height:Platform.OS==='ios'?140:125,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#666',
    },
    avatarTip:{
        fontSize:Platform.OS==='ios'?15:13,
        color:'#fff',
        backgroundColor:'transparent',
        justifyContent:'center'
    },
    avatar:{
        marginBottom:Platform.OS==='ios'?15:12,
        width: Platform.OS==='ios'?70:64,
        height:Platform.OS==='ios'?70:64,
        resizeMode:'cover',
        borderWidth:1,
        borderColor:'#fff',
        borderRadius:Platform.OS==='ios'?35:32,
        backgroundColor: Platform.OS==='ios'?'#fff':'transparent',
    },
    avatarBox:{
        marginTop:15,
        alignItems:'center',
        justifyContent:'center',
    },
    plusIcon:{
        padding:20,
        paddingLeft:25,
        paddingRight:25,
        color:'#999',
        fontSize:25,
        backgroundColor:'#fff',
        borderRadius:8,
    }
});

module.exports = Account;
/**
 * Created by ww on 2017/7/7.
 */
