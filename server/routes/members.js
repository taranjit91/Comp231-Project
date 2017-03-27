// modules required for routing
let express = require('express');
let router = express.Router();
let membersController = require('../controllers/members');

/* GET CandidateProfile page. */
router.get('/:id', (req, res, next) => {

membersController.displayMemberProfile(req,res,next);

});



module.exports = router;