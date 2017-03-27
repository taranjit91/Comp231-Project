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
jobsController.ProcessPostJob(req,res,next);

});

//Myjobs display work in progress
router.get('/myJobs', (req, res, next) => {
jobsController.displayJobs(req,res,next);

});

module.exports = router;