var express = require('express');
var router = express.Router();

var config = {
 apiKey: "AIzaSyCxWVz5cArT737pxeIHaZxeO246muY_d3c",
    authDomain: "comp231-centage.firebaseapp.com",
    databaseURL: "https://comp231-centage.firebaseio.com",
    storageBucket: "comp231-centage.appspot.com",
    messagingSenderId: "809164555117"  
  };

var firebase = require('firebase').initializeApp(config);




/* GET CandidateProfile page. */
router.get('/candidate', (req, res, next) => {
 //firebase.initializeApp(config);
if(firebase.auth().currentUser)
{
  res.render('candidateProfile', { 
    title: 'Sugn Up',
    name: "Name",
    email: "example@gmail.com",
    address: "123 Street Rd",
    phone: "1234567890",
    currentStatus: "Student",
    profilePic: "/Assets/images/photo.png"
  });
}
else
{
  res.redirect('/login');
}



});

/* GET home page. */
router.get('/edit', (req, res, next) => {
  res.render('editProfile', { 
    title: 'Edit Profile'
  });
});

/* GET home page. */
router.get('/search', (req, res, next) => {
  res.render('search', { 
    title: 'Edit Profile'
  });
});

/* GET home page. */
router.get('/login', (req, res, next) => {
  res.render('login', { 
    title: 'Edit Profile'
  });
});

router.post('/login',(req,res,next) => {
  //firebase.initializeApp(config);
firebase.auth().signInWithEmailAndPassword(req.body.username, 
    req.body.password).then(function(user) {
    var user = firebase.auth().currentUser;
    
    console.log("current user id :: "+user.uid);
    var uid = user.uid;
    res.redirect('/candidate');
  }, function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Authentication failed: "+ errorMessage);
});
});

/* GET home page. */
router.get('/logout', (req, res, next) => {

firebase.auth().signOut().then(function() {
  // Sign-out successful.
  console.log("Singout Successful");
  res.redirect('/login');
}, function(error) {
  Console.log("Could not sign out: "+error.message);
});
});


/* GET home page. */
router.get('/registerMember', (req, res, next) => {
  res.render('registerMember', { 
    title: 'Sugn Up'
  });
});

router.post('/registerMember',(req,res,next)=> {
//firebase.initializeApp(config);

firebase.auth().createUserWithEmailAndPassword(req.body.memberEmail, req.body.memberPassword)
    .then(function(user) {
      var user = firebase.auth().currentUser;
addUserInfo(user.uid,req.body.memberFirstName,req.body.memberLastName,req.body.memberEmail);


    }).catch(function(error) {
console.log("Error Creating User:" + error.message);
    });

    var addUserInfo = function(uid,firstName, lastName,email)
{

var userInfoRef = firebase.database().ref("users/personal/");
userInfoRef.child(uid).set({
      firstname: firstName,
      lastname: lastName,
      email:email
   })
   .then(function () {
     console.log("Data added Successfully and properties updated");
res.redirect('/candidate');
   })
   .catch(function(error) {
console.log("Data addition error: "+ error.message);

   });
}
 
});

router.get('/registerEmployer', (req, res, next) => {

  res.render('registerEmployer', { 
    title: 'Sugn Up'
  });
});

router.post('/registerEmployer', (req, res, next) => {

//register employer here
firebase.auth().createUserWithEmailAndPassword(req.body.compEmail, req.body.compPassword)
    .then(function(user) {
      var user = firebase.auth().currentUser;
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

});

/* GET home page. */
router.get('/postJob', (req, res, next) => {
  res.render('postJob', { 
    title: 'Sugn Up'
  });
});


module.exports = router;