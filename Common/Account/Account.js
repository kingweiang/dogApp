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
    Alert,
    AlertIOS,
} from 'react-native';
var ImagePicker = require('react-native-image-picker');
var sha1 = require('sha1');
// var ImagePicker= require('NativeModules').ImagePickerManager
var {CountDownText} = require('react-native-sk-countdown');
import Icon from 'react-native-vector-icons/Ionicons';
var width = Dimensions.get('window').width
var config = require('../Main/config')
var request = require('../Main/request')
import * as Progress from 'react-native-progress';

//  图床配置参数cloudinary
var CLOUDINARY = {
    cloud_name: 'duy4kia4y',
    api_key: '665833873512597',
    api_secret: '9Gtvmhl0crBgo1r00Ha3uuVAO8Y',
    baseUri:	'http://res.cloudinary.com/duy4kia4y',
    image: 'https://api.cloudinary.com/v1_1/duy4kia4y/image/upload',
    video: 'https://api.cloudinary.com/v1_1/duy4kia4y/video/upload',
    audio: 'https://api.cloudinary.com/v1_1/duy4kia4y/raw/upload'
}

// 上传头像组件配置参数image-picker
const options = {
    title: '选择头像图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
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
    allowsEditing: true,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

function avater(id,type) {
    return CLOUDINARY.baseUri + '/'+ type + '/upload/' + id
}

var Account=React.createClass({
    getInitialState(){
        var user = this.props.user || {}
        return{
            user:user,
            avatarProgress:0,
            avatarUploading:false,
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

                // user.avatar = ''
                // AsyncStorage.setItem('user',JSON.stringify(user))

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
            // var user = that.state.user
            // user.avatar = avatarData
            // that.setState({
            //     user:user
            // })

            var timestamp = Date.now()   // 当前时间戳
            var tags = 'app,avatar'
            var folder = 'avatar'
            var sigantureURL= config.header.api.base+ config.header.api.signature
            var accessToken = this.state.user.accessToken

            request.post(sigantureURL,{
                accessToken:accessToken,
                timestamp:timestamp,
                type:'avatar'
            })
                .catch((err)=>{
                    console.log(err)
                })
                .then((data)=>{
                    console.log(data)
                    if(data){
                        var signature = 'folder='+ folder + '&tags='+ tags +'&timestamp='+ timestamp + CLOUDINARY.api_secret

                        signature = sha1(signature)

                        var body = new FormData()
                        console.log(body)

                        body.append('folder',folder)
                        body.append('signature',signature)
                        body.append('tags',tags)
                        body.append('timestamp',timestamp)
                        body.append('api_key',CLOUDINARY.api_key)
                        body.append('resource_type','image')
                        body.append('file',avatarData)

                        that._upload(body)
                    }
                })
        })
    },
    //  图床上传方法
    _upload(body){
        var that = this
        var xhr = new XMLHttpRequest()
        var url = CLOUDINARY.image

        console.log(body)
        this.setState({
            avatarUploading:true,
            avatarProgress:0,
        })
        xhr.open('POST',url)
        xhr.onload=()=>{
            if(xhr.status !== 200){
                Platform.OS=='ios'? AlertIOS.alert('请求失败！'):Alert.alert('请求失败！')
                console.log(xhr.responseText)
                return
            }
            if (!xhr.responseText){
                Platform.OS=='ios'? AlertIOS.alert('请求失败！'):Alert.alert('请求失败！')
                return
            }
            var response

            try{
                response = JSON.parse(xhr.response)
            }
            catch (e){
                console.log(e)
                console.log('parse fails')
            }

            if(response && response.public_id){
                var user = this.state.user
                user.avatar = avater(response.public_id,'image')
                that.setState({
                    avatarUploading:false,
                    avatarProgress:0,
                    user:user
                })
            }
        }
        // 图片上传进度
        if (xhr.upload){
            xhr.upload.onprogress = (event)=>{
                if(event.lengthComputable){
                    var percent = Number((event.loaded /event.total).toFixed(2))

                    that.setState({
                        avatarProgress:percent
                    })
                }
            }
        }
        xhr.send(body)
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
                                    {
                                        this.state.avatarUploading
                                            ?<Progress.Circle
                                            showsText={true}
                                            color={'#ee735c'}
                                            size={75}
                                            progress ={this.state.avatarProgress}
                                        />
                                            :<Image
                                            source={{uri: user.avatar}}
                                            style={styles.avatar}
                                        />
                                    }
                                    
                                </View>
                                <Text style={styles.avatarTip}>点击头像更换</Text>
                            </Image>
                        </TouchableOpacity>
                        : <TouchableOpacity onPress={this._pickPhoto} style={styles.avatarContainer}>
                        <Text style={styles.avatarTip}>添加头像</Text>
                        <View style={styles.avatarBox}>
                            {
                                this.state.avatarUploading
                                    ?<Progress.Circle
                                    showsText={true}
                                    color={'#ee735c'}
                                    size={75}
                                    progress ={this.state.avatarProgress}
                                     />
                                :<Icon
                                    name='ios-cloud-upload-outline'
                                    style={styles.plusIcon}
                                />
                            }
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
