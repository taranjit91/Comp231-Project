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

setTimeout(getAllPostedJobs, 1500);  // STEP 1 find all jobs posted by this member

setTimeout(findAllFavouriteJobIds, 1500); //STEP 2 find all favourite jobs' IDs from his favourites list

setTimeout(getAllFavJobsFromIds, 1500); //STEP 3 Get all the job objects from those IDs

setTimeout(renderIt, 1500);  // STEP 4 Render the page



 function getAllPostedJobs() {

//------------------------------------ find all jobs posted by this member
 firebaseAdmin.database().ref("jobs/postings/").orderByChild("uid").equalTo(firebaseAuth.currentUser.uid).
                                                                      once("value", function(snapshot) { 
       
        snapshot.forEach(function(item) {
          var itemKey = item.key;
          postedKeyid.push(itemKey);

          var jobJson = item.toJSON();
          posteJobCollection.push(jobJson);
        });

      });
}

function findAllFavouriteJobIds() {
  firebaseAdmin.database().ref("users/personal/"+firebaseAuth.currentUser.uid).
once("value", function(snapshot) { 
       
        console.log(snapshot.child('favourites').val())
        var favourites = snapshot.child('favourites').forEach(function(item){
          item.forEach(function(job){
            console.log(job.val());
            favouriteJobId.push(job.val());
          })
        });


     });
}

function getAllFavJobsFromIds() {
  console.log("Job from IDs")
 favouriteJobId.forEach(function(id){
firebaseAdmin.database().ref("jobs/postings/"+id).once("value", function(snapshot) { 
       
        var jobJson = snapshot.toJSON();
        favouriteJobId.push(snapshot.key);
        favouriteJobCollection.push(jobJson);
console.log(jobJson)

      });

});
}

function renderIt() {
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

}


});
}
else
{
  return res.redirect('/users/login');
}
}

