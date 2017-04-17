let firebase = require('../config/firebase');
let firebaseDB = firebase.members;
let firebaseAdmin = firebase.admin;
let firebaseAuth = firebase.auth;

module.exports.displayEmployerPage = (req,res,next) => {

    if(firebaseAuth.currentUser)
{


var companyName = "";
var address = "";
var email = "";
var industry = "";
var number = "";
var website = "";

firebase.firebaseDatabase.ref("users/employers/"+firebaseAuth.currentUser.uid).once('value', function(snap) {
 companyName = snap.child('companyName').val();
 address = snap.child('address').val();
 email = snap.child('email').val();
 industry = snap.child('industry').val();
 number = snap.child('number').val();
 website = snap.child('website').val();

  return res.render('accounts/employerProfile', { 
    title: 'Profile Information',
    companyName: companyName,
    address:address,
    email:email,
    number:number,
    website:website,
    industry:industry,
     username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
      userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : ''
  });
});
}
else
{
  return res.redirect('/users/login');
}

}