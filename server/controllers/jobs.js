// required for firebase
let firebase = require('../config/firebase');
let fireBaseJob = firebase.jobs;
let firebaseAdmin = firebase.admin;
let firebaseAuth = firebase.auth;


module.exports.displayJobPostPage = (req,res,next) => {
     if (firebaseAuth.currentUser != null){
     return   res.render('jobs/postJob', { 
          title: 'Post Job',
           username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
            userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
        });
    }
    else{
      return res.redirect ("../users/login")
    }
     
}

module.exports.ProcessPostJob = (req,res,next) => {
    var job = req.body;    
    console.log(job)
    console.log('Saving Job')
    var user = firebaseAuth.currentUser;
    createJobPosting(user.uid, job.jobTitle, job.companyName, job.companyAddress, job.jobDescription,
                       job.jobType, job.jobLocation, job.jobSalary, job.tags);
    // create job posting
    function createJobPosting(uid,title,company,company_address, job_description,job_type,location,salary,tags)
    {
    fireBaseJob.push({ // using push for inserting record will create id for each record automatically
          uid: uid,
          title: title,
          company: company,
          company_address:company_address,
          job_description: job_description,
          job_type: job_type,
          location: location,
          salary: salary,
          tags: tags
      }), function(error) {
      if (error) {
        console.log("Data could not be saved." + error);
      } else {
        console.log("Data saved successfully.");
      };
    }   
    return res.redirect("/jobs/"+getNewJobID())
    
    }

    function getNewJobID(){
    var id;
    firebaseAdmin.database().ref("jobs/postings/").once("child_added",function(snapshot){
      id = snapshot.key;
    })
    return id;
    } 

}

module.exports.myJobs = (req,res,next) => {
  //hardcoded login for testing
  //firebaseAuth.signInWithEmailAndPassword("mchua@cencol.ca", "test123")    
  var user = firebaseAuth.currentUser;
  if (user != null){
    console.log("List Jobs for User: " + user.uid)
    viewmyjobs(user.uid)
  }
 
      function viewmyjobs(searchByVal)
      {
       
        var x = firebaseAdmin.database().ref("jobs/postings/").orderByChild("uid").equalTo(searchByVal).
                                                                      once("value", function(snapshot) { 
        var keyid = [];
        var jobCollection = [];
        snapshot.forEach(function(item) {
          var itemKey = item.key;
          keyid.push(itemKey);

          var jobJson = item.toJSON();
          jobCollection.push(jobJson);
        });

        //render view
        return res.render('jobs/myJobs',{
        title: 'My Jobs',
        keys: keyid,
        data: jobCollection,
         username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : ''  ,
          userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
        });
      });
      
      }
}

module.exports.editJob = (req,res,next) => {

  var id = req.body.id;
  firebaseAdmin.database().ref("jobs/postings/"+id).once("value", function(snapshot){
      var data = snapshot.toJSON()
      console.log(data)

      //render view
      return res.render('jobs/editjob',{
          title: 'My Jobs',
          jobData: data,
          jobId: id,
           username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
            userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
      });
  })  
}

module.exports.saveJob = (req,res,next) => {

  var job = req.body  
  console.log(job)
  updateJobPosting(job.jobId, job.jobTitle, job.companyName, job.companyAddress, job.jobDescription, job.jobType, job.jobLocation, job.jobSalary, job.tags,req,res,next);
  
}

function updateJobPosting(postingid,title,company,company_address, 
                          job_description,job_type,location,salary,tags,req,res,next)
      {
          var onComplete = function(error) {
                if (error) {
                  console.log('Synchronization failed');
                } else {
                  console.log('Synchronization succeeded');
                  res.redirect('/jobs/'+postingid)
                }
              };

         firebaseAdmin.database().ref("jobs/postings/"+postingid).update({
              title: title,
              company: company,
              company_address:company_address,
              job_description: job_description,
              job_type: job_type,
              location: location,
              salary: salary,
              tags: tags   
              }, onComplete)
          
      }


module.exports.displayJob = (req,res,next) => {

var accType = ""
  if(req.session.accType=="Member") {
accType="Member"
  } else {
accType="Employer"
  }


      console.log("display the posting details")
      console.log("Account type "+accType)
      firebaseAdmin.database().ref("jobs/postings/"+req.params.id).once("value", function(snapshot){
      
      var data = snapshot.toJSON()
      //var name = getCreatedby(data.uid);
      //return processJobDisplay(data,req.params.id,req,res,next);
      return res.render('jobs/viewjob',{
              title: 'View Job Posting',
              jobId: req.params.id,
              jobData: data,
              name: data.uid,
              accType:accType,
               username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
                userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
        }) 
      })  

      
}

function getCreatedby(uid) {
        var name;
        firebaseAdmin.database().ref("users/personal/"+uid).once('value', function(snap) {
          name = snap.child('firstname').val()+' '+ snap.child('lastname').val()
          console.log(name)
        })
        console.log("In Get User " + name)
        return name
      }

function processJobDisplay(data,jobID,req,res,next){
      return res.render('jobs/viewjob',{
              title: 'View Job Posting',
              jobId: jobID,
              jobData: data,
              name: data.uid,
               username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
                userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
        });
      }
      
module.exports.deleteJob = (req,res,next) => {
    console.log(req.body)
    firebaseAdmin.database().ref("jobs/postings/"+req.body.id).once("value", function(snapshot){
      var data = snapshot.toJSON()
      console.log(data)

      //render view
      return res.render('jobs/confirmDelete',{
          title: 'Delete this job',
          jobData: data,
          jobId: req.body.id,
           username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
            userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
      });
  })  
}

module.exports.confirmedDelete = (req,res,next) => {
    //console.log(req.body)
    firebaseAdmin.database().ref("jobs/postings/"+req.body.id).remove(), function(error){
              if (error) {
                console.log("Data could not be deleted." + error);
              } else {
                console.log("Data deleted.");
              };
            }

            return res.redirect("/jobs/myjobs")
}


module.exports.renderSearch = (req,res,next) => {
    return res.render('jobs/search',{
      title:'Search',
       username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
        userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '',
      accType:req.session.accType
    })
    
}

module.exports.searchJobs = (req,res,next) => {
    //res.send(req.body)
    var field = req.body.field
    var searchByVal = req.body.searchKeywords
    var x = firebaseAdmin.database().ref("jobs/postings/").orderByChild(field).equalTo(searchByVal).
                                                                      once("value", function(snapshot) { 
        var keyid = [];
        var jobCollection = [];
        snapshot.forEach(function(item) {
          var itemKey = item.key;
          keyid.push(itemKey);

          var jobJson = item.toJSON();
          jobCollection.push(jobJson);
        });

        //render view
        return res.render('jobs/searchJob',{
        title: 'Search Results',
        keys: keyid,
        data: jobCollection,
        username: firebaseAuth.currentUser? firebaseAuth.currentUser.email : '',
        userid: firebaseAuth.currentUser? firebaseAuth.currentUser.uid : '' ,
      accType:req.session.accType
        });
      });

}

module.exports.addToFavourites = (req,res,next) => {
addJobToUserFavourites(req.params.id,req,res,next);
}

function addJobToUserFavourites(jobId,req,res,next)
      {
          var onComplete = function(error) {
                if (error) {
                  console.log(jobId + 'Failed while adding job to favourites');
                } else {
                  console.log('Job Added to user favourites');
                  res.redirect('/jobs/myJobs');
                }
              };
              
         
   firebase.firebaseDatabase.ref("users/personal/"+firebaseAuth.currentUser.uid).child("favourites").push({
              jobId: jobId
              }, onComplete)
        
          
      }

