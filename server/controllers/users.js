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
      userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
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

var email = firebaseAuth.currentUser.email;
firebase.firebaseDatabase.ref("users/personal/"+firebaseAuth.currentUser.uid).once('value', function(snap) { 
  if(snap.child('email').val()==email) {
    console.log("Logged in as Member");

        req.session.accType = "Member";
    return res.redirect('/member/'+firebaseAuth.currentUser.uid);
    //req.session.accountType=type;
  }
  else {
    firebase.firebaseDatabase.ref("users/employers/"+firebaseAuth.currentUser.uid).once('value', function(secondSnap) { 
     if(secondSnap.child('email').val()==email) {
       console.log("Logged in as Employer");

       //req.session.accountType=type;
       req.session.accType = "Employer";
       return res.redirect('/employer/'+firebaseAuth.currentUser.uid);
     }
    });
  }
});


  })
  .catch((err) =>{
    console.log(err);

    return res.render('users/login', {
      title: 'Login',
       username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
        userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
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

//-----------------------------------------------------
    if(firebaseAuth.currentUser)
{


var firstName = "";
var lastName = ""
var status = "";

firebase.firebaseDatabase.ref("users/personal/"+req.params.id).once('value', function(snap) {
 firstName = snap.child('firstname').val();
 lastName = snap.child('lastname').val();
status = snap.child('status').val();



return res.render('accounts/editProfile', { 
    title: 'Edit Profile',
    firstName:firstName,
    lastName:lastName,
    status:status,
    uid:req.params.id,
     username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
      userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
  });

});
}
else
{
  return res.redirect('/users/login');
}

//-----------------------------------------------------

      
}

module.exports.processMemberUpdate = (req,res,next) => {
var user = req.body
updateMemberAccount(user.firstName,user.lastName,user.status,user.password,req,res,next);

}

function updateMemberAccount(firstName,lastName,status,password,req,res,next)
      {
          var onComplete = function(error) {
                if (error) {
                  console.log('Account Update failed');
                } else {
                  console.log('Synchronization succeeded');
                  res.redirect('/member/'+firebaseAuth.currentUser.uid);
                }
              };
              
              var updateMemberPassword = function(password) {
                firebaseAuth.currentUser.updatePassword(password).then(function() {
               // Update successful.
               console.log("Password update successful")
             }, function(error) {
               // An error happened.
               console.log("Password update failure: "+error);
               });

              }

if(typeof password == "undefined") {
              console.log("Password update not requested");
              firebase.firebaseDatabase.ref("users/personal/"+firebaseAuth.currentUser.uid).update({
              firstname: firstName,
              lastname: lastName,
              status:status,
              }, onComplete)
            }
            else if(password=="") {
              console.log("Null password");
              firebase.firebaseDatabase.ref("users/personal/"+firebaseAuth.currentUser.uid).update({
              firstname: firstName,
              lastname: lastName,
              status:status,
              }, onComplete)
            } 
            else{
              console.log("Password Update requested");
              updateMemberPassword(password);
              firebase.firebaseDatabase.ref("users/personal/"+firebaseAuth.currentUser.uid).update({
              firstname: firstName,
              lastname: lastName,
              status:status,
              }, onComplete)
}
        
          
      }

module.exports.displayMemberRegistrationPage = (req,res,next) => {
    return res.render('auth/registerMember', { 
    title: 'Sugn Up',
     username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
      userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
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
      userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
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

module.exports.DisplayEmployerEditPage = (req,res,next) => {
//-----------------------------------------------------
    if(firebaseAuth.currentUser)
{


var address = "";
var number = "";
var webSite = "";

firebase.firebaseDatabase.ref("users/employers/"+req.params.id).once('value', function(snap) {
 address = snap.child('address').val();
 number = snap.child('number').val();
webSite = snap.child('website').val();



return res.render('accounts/editEmployer', { 
    title: 'Edit Profile',
    address:address,
    number:number,
    webSite:webSite,
    uid:req.params.id,
     username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
      userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
  });

});
}
else
{
  return res.redirect('/users/login');
}

//-----------------------------------------------------


}

module.exports.processEmployerUpdate = (req,res,next) => {
  var emp = req.body
updateEmployerAccount(emp.address,emp.number,emp.webSite,emp.password,req,res,next);
}

function updateEmployerAccount(address,number,webSite,password,req,res,next)
      {
          var onComplete = function(error) {
                if (error) {
                  console.log('Account Update failed');
                } else {
                  console.log('Synchronization succeeded');
                  res.redirect('/employer/'+firebaseAuth.currentUser.uid);
                }
              };
              
              var updateEmployerPassword = function(password) {
                firebaseAuth.currentUser.updatePassword(password).then(function() {
               // Update successful.
               console.log("Password update successful")
             }, function(error) {
               // An error happened.
               console.log("Password update failure: "+error);
               });

              }

if(typeof password == "undefined") {
              console.log("Password update not requested");
              firebase.firebaseDatabase.ref("users/employers/"+firebaseAuth.currentUser.uid).update({
              address: address,
              number: number,
              website:webSite,
              }, onComplete)
            }
            else if(password=="") {
              console.log("Null password");
              firebase.firebaseDatabase.ref("users/employers/"+firebaseAuth.currentUser.uid).update({
              address: address,
              number: number,
              website:webSite,
              }, onComplete)
            } 
            else{
              console.log("Password Update requested");
              updateEmployerPassword(password);
              firebase.firebaseDatabase.ref("users/employers/"+firebaseAuth.currentUser.uid).update({
              address: address,
              number: number,
              website:webSite,
              }, onComplete)
}
        
          
      }