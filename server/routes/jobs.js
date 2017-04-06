// modules required for routing
let express = require('express');
let router = express.Router();
let jobsController = require('../controllers/jobs');

/* GET Post page. */
router.get('/postJob', (req, res, next) => {
    jobsController.displayJobPostPage(req,res,next);
});

/* Post new Job POST . */
router.post('/postJob', (req, res, next) => {
    jobsController.ProcessPostJob(req,res,next)
        
});

//View Account created jobs
router.get('/myJobs', (req, res, next) => {
    jobsController.myJobs(req,res,next);
});


router.post('/editjob', (req, res, next) => {
    jobsController.editJob(req,res,next);
});

router.post('/savejob', (req, res, next) => {
    jobsController.saveJob(req,res,next);
});

router.post('/deletejob', (req, res, next) => {
    jobsController.deleteJob(req,res,next);
});


router.post('/deletejobid', (req, res, next) => {
    jobsController.confirmedDelete(req,res,next);
});

/* GET Search page. */
router.get('/search', (req, res, next) => {
    console.log('search page')
    jobsController.renderSearch(req,res,next);
});

router.post('/search', (req,res,next)=> {
    jobsController.searchJobs(req,res,next);
});


router.get('/:id', (req, res, next) => {
    jobsController.displayJob(req,res,next);
});


module.exports = router;