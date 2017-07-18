'use strict'

module.exports={
    header:{
        method:'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        api:{
            base:'http://rapapi.org/mockjs/20376/',
            creations:'api/creactions',
            up:'api/up',
            comment:'api/comments',
            signup:'api/u/signup',
            verify:'api/u/verify',
            signature:'api/signature',
        }
    }
}
