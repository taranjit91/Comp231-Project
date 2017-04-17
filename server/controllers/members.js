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

 var postedKeyid = [];
        var posteJobCollection = [];
var favouriteJobId = [];
var favouriteJobCollection = []
//------------------------------------ find all jobs posted by this member
firebaseAdmin.database().ref("jobs/postings/").orderByChild("uid").equalTo(firebaseAuth.currentUser.uid).
                                                                      once("value", function(snapshot) { 
       
        snapshot.forEach(function(item) {
          var itemKey = item.key;
          postedKeyid.push(itemKey);

          var jobJson = item.toJSON();
          posteJobCollection.push(jobJson);
        });

        //------------LEVEL 1-----------

firebaseAdmin.database().ref("users/personal/"+firebaseAuth.currentUser.uid).
once("value", function(snapshot) { 
       
        console.log(snapshot.child('favourites').val())
        var favourites = snapshot.child('favourites').forEach(function(item){
          item.forEach(function(job){
            console.log(job.val());
            favouriteJobId.push(job.val());
          })
        });

        //-----------LEVEL 2-------------

console.log("Job from IDs")
favouriteJobId.forEach(function(id){
firebaseAdmin.database().ref("jobs/postings/"+id).once("value", function(snapshot) { 
       
        var jobJson = snapshot.toJSON();
        favouriteJobId.push(snapshot.key);
        favouriteJobCollection.push(jobJson);
console.log(jobJson)

      });

});

//-----------RENDER-----------
  return res.render('accounts/candidateProfile', { 
    title: 'Profile Information',
    name: name,
    email: email,
    postedKeyid:postedKeyid,
    posteJobCollection:posteJobCollection,
    favouriteJobId:favouriteJobId,
    favouriteJobCollection:favouriteJobCollection,
    currentStatus: status,
    profilePic: "/Assets/images/photo.png",
    uid:firebaseAuth.currentUser.uid,
     username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
      userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : ''
  });

      });

      });
//-----------------------------------

//---------------------------------------------------------- find all favourite jobs IDs of this member



//------------------------------------------------------

//------------------------------------------------------ fetch all job objects from the favourite job IDs



//------------------------------------------------------




});
}
else
{
  return res.redirect('/users/login');
}
}

