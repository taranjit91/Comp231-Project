// required for firebase
let firebase = require('../config/firebase');
let firebaseDB = firebase.members;
let firebaseAdmin = firebase.admin;
let firebaseAuth = firebase.auth;

module.exports.displayMemberProfile = (req,res,next) => {
    if(firebaseAuth.currentUser)
{
console.log(" logged in");

var name = "";
var email = "";

firebase.firebaseDatabase.ref("users/personal/"+req.params.id).once('value', function(snap) {
 name = snap.child('firstname').val()+' '+ snap.child('lastname').val();
 email = snap.child('email').val();
  console.log(name);

  return res.render('accounts/candidateProfile', { 
    title: 'Profile Information',
    name: name,
    email: email,
    address: "123 Street Rd",
    phone: "1234567890",
    currentStatus: "Student",
    profilePic: "/Assets/images/photo.png",
    uid:firebaseAuth.currentUser.uid
  });
});
}
else
{
  return res.redirect('auth/login');
}
}

