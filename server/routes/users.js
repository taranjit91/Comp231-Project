// modules required for routing
let express = require('express');
let router = express.Router();

// require the users controller
let usersController = require('../controllers/users');

// GET /login - render the login view
router.get('/login', (req, res, next)=>{
  usersController.DisplayLogin(req, res,next);
  // POST /login - process the login attempt
}).post('/login', (req,res,next) => {
  usersController.ProcessLogin(req,res,next);
});

// GET /logout - process the logout request
router.get('/logout', (req, res, next)=>{
  usersController.ProcessLogout(req, res);
});


router.get('/edit/:id', (req, res, next) => {
usersController.DisplayEditPage(req,res,next);
});

router.post('/edit/:id', (req, res, next) => {
usersController.processMemberUpdate(req,res,next);
});

router.get('/editEmp/:id', (req, res, next) => {
usersController.DisplayEmployerEditPage(req,res,next);
});

router.post('/editEmp/:id', (req, res, next) => {
usersController.processEmployerUpdate(req,res,next);
});


router.get('/registerMember', (req, res, next) => {
  usersController.displayMemberRegistrationPage(req,res,next);

});

router.post('/registerMember',(req,res,next)=> {
usersController.processMemberRegistration(req,res,next);
});

router.get('/registerEmployer', (req, res, next) => {
usersController.displayEmployerRegistrationPage(req,res,next);

});

router.post('/registerEmployer', (req, res, next) => {

usersController.ProcessEmployerRegistration(req,res,next);

});

module.exports = router;