// required for firebase
let firebase = require('../config/firebase');
let fireBaseJob = firebase.jobs;
let firebaseAdmin = firebase.admin;
let firebaseAuth = firebase.auth;


module.exports.displayJobPostPage = (req,res,next) => {
     return res.render('jobs/postJob', { 
    title: 'Post Job'
  });
}

module.exports.ProcessPostJob = (req,res,next) => {
    var job = req.body;    
    console.log(job)
    console.log('Saving Job')
    var user = firebaseAuth.currentUser;
    createJobPosting(user.uid, job.jobTitle, job.companyName, job.companyAddress, job.jobDescription, job.jobType, job.jobLocation, job.jobSalary, job.tags);
    res.json(job);

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
    }
}

module.exports.displayJobs = (req,res,next) => {
      
  var user = firebaseAuth.currentUser;
  if (user != null){
    console.log("List Jobs for User: " + user.uid)
    var keys = myjobs("uid",user.uid)
    console.log(keys);
     return res.render('jobs/jobsList',{
       title: 'My Jobs',
       data: JSON.stringify(keys)
     });
     

  }
 
      function myjobs(searchOn, searchByVal)
      {
        var val

        var jobSnapshot = fireBaseJob.orderByChild(searchOn).equalTo(searchByVal).on("child_added", function(snapshot) {
        console.log('snapshot ' + snapshot.key);
        
      });

      

      }
}

module.exports.searchJobs = (req,res,next,keys) => {


var newArray = [];
// Attach an asynchronous callback to read the data at our posts reference
fireBaseJob.on("value", function(snapshot) {  
  newArray.push(snapshot.val());
  console.log(snapshot.val());



}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

    
}

