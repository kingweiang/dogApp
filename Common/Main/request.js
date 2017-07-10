'use strict'

var queryString = require('query-string')
var _ = require('lodash')
var Mock = require('mockjs')
var request = {}  // 声明空对象
var config = require('./config')

request.get = function (url,params) {
    if (params){
        url +='?'+queryString.stringify(params)
    }
    return fetch(url)
        .then((response) => response.text())
        .then((responseText) => Mock.mock(JSON.parse(responseText.replace(/\\'/g,''))))
}

request.post = function (url,body) {
    var options = _.extend(config.header,{
        body:JSON.stringify(body)
    })
    return fetch(url,options)
        .then((response) => response.text())
        .then((responseText) =>Mock.mock(JSON.parse(responseText.replace(/\\'/g,''))))
}

module.exports = request