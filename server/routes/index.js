var express = require('express');
var router = express.Router();

// required for firebase
let firebase = require('../config/firebase');
let firebaseAuth = firebase.auth;



router.get('/',(req,res,next)=> {

res.render('home',{
    title:'Welcome To CentEngage - The online job portal for Centennials',
    username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
    userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
});
});




module.exports = router;