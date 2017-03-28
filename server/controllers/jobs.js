// required for firebase
let firebase = require('../config/firebase');
let fireBaseJob = firebase.jobs;
let firebaseAdmin = firebase.admin;
let firebaseAuth = firebase.auth;


module.exports.displayJobPostPage = (req,res,next) => {
     if (firebaseAuth.user != null){
     return   res.render('postJob', { 
          title: 'Post Job'
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
  //hardcoded login for testing
  //firebaseAuth.signInWithEmailAndPassword("mchua@cencol.ca", "test123")    
  var user = firebaseAuth.currentUser;
  if (user != null){
    console.log("List Jobs for User: " + user.uid)
    myjobs(user.uid)
    
  }
 
      function myjobs(searchByVal)
      {
       
        var x = firebaseAdmin.database().ref("jobs/postings/").orderByChild("uid").equalTo(searchByVal).
                                                                      on("value", function(snapshot) { 
        //a = snapshot.toJSON();
        var keyid = [];
        var jobCollection = [];
        snapshot.forEach(function(item) {
          var itemKey = item.key;
          keyid.push(itemKey);

          var jobJson = item.toJSON();
          jobCollection.push(jobJson);
        });
        console.log(keyid)
        console.log(jobCollection)
        //render view
        return res.render('jobs/myjobs',{
        title: 'My Jobs',
        keys: keyid,
        data: jobCollection       
        });
      });
      
      }
}