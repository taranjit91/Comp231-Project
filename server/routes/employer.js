let express = require('express');
let router = express.Router();
let employersController = require('../controllers/employer');

router.get('/:id',(req,res,next) => {
employersController.displayEmployerPage(req,res,next);
});

module.exports = router;