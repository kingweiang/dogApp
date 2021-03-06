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
    Image,
    TabBarIOS,
    Platform,    // 用来判断安卓和IOS平台
    AsyncStorage
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';
import {Navigator} from 'react-native-deprecated-custom-components';

var Edit = require('../Edit/Edit');
var List =require('../List/List');
var Account= require('../Account/Account');
var Login= require('../Account/login');


var Main = React.createClass({
    getInitialState(){
        return{
            user:null,
            selectedTab:'more',   // 默认选择的tarbar页面
            logined:false   // 登录状态
        }
    },

    componentDidMount(){
      this._asyncAppStatus()
    },
    _asyncAppStatus(){
        var that = this
        AsyncStorage.getItem('user')
            .then((data)=>{
                var user
                var newState = {}

                if(data){
                    user = JSON.parse(data)
                }

                if(user && user.accessToken){
                    newState.user =user
                    newState.logined = true
                }else{
                    newState.logined = false
                }

                that.setState(newState)
            })
    },
    _afterLogin(user){
        var that = this
        user = JSON.stringify(user)
      AsyncStorage.setItem('user',user)
          .then(()=>{
            that.setState({
                logined:true,
                user:user
            })
          })
    },
    render: function() {
        if(!this.state.logined){
            return <Login afterLogin = {this._afterLogin}/>
        }
        return (
            <TabNavigator>
                {this.renderTabBarItem('视频','ios-videocam-outline','ios-videocam','videocam',List,'列表页面')}
                {this.renderTabBarItem('记录','ios-recording-outline','ios-recording','recording',Edit,'编辑页面')}
                {this.renderTabBarItem('更多','ios-more-outline','ios-more','more',Account,'账户页面')}
            </TabNavigator>
        );
    },

    renderTabBarItem(title,iconName,selectedIconName,selectedTab,componentName,componentTitle,badg){
        return(
            <TabNavigator.Item
                title = {title}  //  传递变量用大括号
                renderIcon={()=><Icon name={iconName} style={styles.iconStyle} />}
                renderSelectedIcon={() =><Icon name={selectedIconName} style={styles.iconStyle}/>}
                selected={this.state.selectedTab === selectedTab}
                onPress={() => this.setState({ selectedTab: selectedTab})}
                selectedTitleStyle={styles.selectedTitleStyle}
                badgeText = {badg}

            >
                <Navigator
                    initialRoute={{name:componentTitle,component:componentName}}
                    configureScene={()=>{
                        return Navigator.SceneConfigs.PushFromRight;
                    }}
                    renderScene={(route,navigator)=>{
                        let Component = route.component;
                        return <Component {...route.params} navigator={navigator} />; //passProps改为params 才能将前一页的参数代入下一页
                    }}
                />
            </TabNavigator.Item>
        )
    },
});

var styles = StyleSheet.create({
    iconStyle:{
        fontSize:35,
        color:'orange',
        marginBottom:-6
    },
    tabContent: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center',
    },
    tabText: {
        color: 'white',
        margin: 50,
    },
});

module.exports = Main;
