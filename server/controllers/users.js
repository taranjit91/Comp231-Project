// required for firebase
let firebase = require('../config/firebase');
let firebaseMembers = firebase.members;
let firebaseEmployers = firebase.employers;
let firebaseAdmin = firebase.admin;
let firebaseAuth = firebase.auth;

module.exports.DisplayLogin = (req, res, next) => {
// check to see if the user is not already logged in
  if(!req.user) {
    // render the login page
     res.render('auth/login', { 
    title: 'Login',
     username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
      userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : ''
  });
    return;
  } else {
    return res.redirect('/member/'+firebaseAuth.currentUser.uid); 
  }
}

module.exports.ProcessLogin = (req,res,next) => {
    let email = req.body.email;
    let password = req.body.password;
      firebaseAuth.signInWithEmailAndPassword(email, password)
  .then(()=> {
    console.log("signed in as member: " + firebaseAuth.currentUser.uid);
    return res.redirect('/member/'+firebaseAuth.currentUser.uid);
  })
  .catch((err) =>{
    let errorCode = err.code;
    let errorMessage = err.message;
    if(errorCode == 'auth/wrong-password') {
      req.flash('loginMessage', 'Incorrect Password');
    }
    if(errorCode == 'auth/user-not-found') {
      req.flash('loginMessage', 'Incorrect Username');
    }

    return res.render('auth/login', {
      title: 'Login',
       username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
        userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : ''
    });
  });
}

// Process the Logout request
module.exports.ProcessLogout = (req, res) => {
    firebaseAuth.signOut()
  .then(()=> {
        console.log("Logout successful");
    return res.redirect('/users/login'); // redirect back to login page after logout

  });
 
}

module.exports.DisplayEditPage = (req,res,next) => {
      res.render('accounts/editProfile', { 
    title: 'Edit Profile',
    uid:req.params.id,
     username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
      userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : ''
  });
}

module.exports.displayMemberRegistrationPage = (req,res,next) => {
    return res.render('auth/registerMember', { 
    title: 'Sugn Up',
     username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
      userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : ''
  });
}

module.exports.processMemberRegistration = (req,res,next) => {
  //console.log("Status: "+req.body.status);



firebaseAuth.createUserWithEmailAndPassword(req.body.memberEmail, req.body.memberPassword)
    .then(function(user) {
      var user = firebaseAuth.currentUser;
addUserInfo(user.uid,req.body.memberFirstName,req.body.memberLastName,req.body.memberEmail,req.body.status);


    }).catch(function(error) {
console.log("Error Creating User:" + error.message);
    });

    var addUserInfo = function(uid,firstName, lastName,email,status)
{

//var userInfoRef = firebase.database().ref("users/personal/");
firebaseMembers.child(uid).set({
      firstname: firstName,
      lastname: lastName,
      email:email,
      status: status
   })
   .then(function () {
     console.log("Data added Successfully and properties updated");
return res.redirect('/member/'+firebaseAuth.currentUser.uid);
   })
   .catch(function(error) {
console.log("Data addition error: "+ error.message);

   });
}
 
 
}

module.exports.displayEmployerRegistrationPage = (req,res,next) => {
    return res.render('auth/registerEmployer', { 
    title: 'Sugn Up',
     username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
      userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : ''
  });
}

module.exports.ProcessEmployerRegistration = (req,res,next) => {
  /*
  //register employer here
firebaseAuth.createUserWithEmailAndPassword(req.body.compEmail, req.body.compPassword)
    .then(function(user) {
      var user = firebaseAuth.currentUser;
addEmployerInfo(user.uid,req.body.compName,req.body.compAddress,req.body.compNumber,req.body.compEmail,req.body.compWebSite,req.body.industry);


    }).catch(function(error) {
console.log("Error Creating User:" + error.message);
    });

    var addEmployerInfo = function(uid,companyName, address,number,email,website,industry)
{

var userInfoRef = firebase.database().ref("users/employer/");
userInfoRef.child(uid).set({
      companyName: companyName,
      address: address,
      email:email,
      website:website,
      industry:industry
   })
   .then(function () {
     console.log("Data added Successfully and properties updated");
res.redirect('/candidate');
   })
   .catch(function(error) {
console.log("Data addition error: "+ error.message);

   });
}

*/

  firebaseAdmin.auth().createUser({
    email: req.body.compEmail,
    emailVerified: true,
    password: req.body.compPassword,
    displayName: req.body.compName,
    disabled: false
    
  })
  .then((userRecord) => {
    console.log(req.body.industry);
    //add employer infor to DB
addEmployerInfo(userRecord.uid,req.body.compName,req.body.compAddress,req.body.compNumber,req.body.compEmail,req.body.compWebSite,req.body.industry);
    // sign in the user after registration
    firebaseAuth.signInWithEmailAndPassword(req.body.compEmail, req.body.compPassword)
    .then(()=>{
      console.log("Logged in as employer: " + firebaseAuth.currentUser.uid);
      return res.redirect('/users/logout');
    })
    .catch((err) =>{
      console.log(err);
      return res.redirect('auth/login');
    });
  })
  .catch((err) => {
    let errorCode = err.code;
    let errorMessage = err.message;
console.log(errorMessage);
  });

}

        var addEmployerInfo = function(uid,companyName, address,number,email,website,industry)
{

firebaseEmployers.child(uid).set({
      companyName: companyName,
      address: address,
      number: number,
      email:email,
      website:website,
      industry:industry
   })
   .then(function () {
     console.log("Data added Successfully and properties updated");
return res.redirect('/users/logout');
   })
   .catch(function(error) {
console.log("Data addition error: "+ error.message);

   });
}