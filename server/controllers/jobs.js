// required for firebase
let firebase = require('../config/firebase');
let fireBaseJob = firebase.jobs;
let firebaseAdmin = firebase.admin;
let firebaseAuth = firebase.auth;


module.exports.displayJobPostPage = (req,res,next) => {
     if (firebaseAuth.currentUser != null){
     return   res.render('jobs/postJob', { 
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
        return res.render('jobs/myjobs',{
        title: 'My Jobs',
        keys: keyid,
        data: jobCollection       
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
          jobId: id
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

      console.log("display the posting details")
      firebaseAdmin.database().ref("jobs/postings/"+req.params.id).once("value", function(snapshot){
      
      var data = snapshot.toJSON()
      //var name = getCreatedby(data.uid);
      //return processJobDisplay(data,req.params.id,req,res,next);
      return res.render('jobs/viewjob',{
              title: 'View Job Posting',
              jobId: req.params.id,
              jobData: data,
              name: data.uid
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
              name: data.uid
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
          jobId: req.body.id
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

            return res.send("delete good")
}


module.exports.renderSearch = (req,res,next) => {
    return res.render('jobs/search')
    
}



