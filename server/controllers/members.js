// required for firebase
let firebase = require('../config/firebase');
let firebaseDB = firebase.members;
let firebaseAdmin = firebase.admin;
let firebaseAuth = firebase.auth;

module.exports.displayMemberProfile = (req,res,next) => {
    if(firebaseAuth.currentUser)
{


var name = "";
var email = "";
var status = "";

firebase.firebaseDatabase.ref("users/personal/"+req.params.id).once('value', function(snap) {
 name = snap.child('firstname').val()+' '+ snap.child('lastname').val();
 email = snap.child('email').val();
 status = snap.child('status').val();
  console.log(name);

  return res.render('accounts/candidateProfile', { 
    title: 'Profile Information',
    name: name,
    email: email,
    currentStatus: status,
    profilePic: "/Assets/images/photo.png",
    uid:firebaseAuth.currentUser.uid,
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

