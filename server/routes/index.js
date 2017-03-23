var express = require('express');
var router = express.Router();




/* GET CandidateProfile page. */
router.get('/candidate', (req, res, next) => {
  let currentDate = new Date();
  res.render('candidateProfile', { 
    title: 'Sugn Up',
    name: "Jishnu",
    email: "jishnusundar423@gmail.com",
    address: "149 Poplar Rd",
    phone: "6477826210",
    currentStatus: "Student",
    profilePic: "/Assets/images/photo.jpg"
  });
});

/* GET home page. */
router.get('/edit', (req, res, next) => {
  let currentDate = new Date();
  res.render('editProfile', { 
    title: 'Edit Profile'
  });
});

/* GET home page. */
router.get('/search', (req, res, next) => {
  let currentDate = new Date();
  res.render('search', { 
    title: 'Edit Profile'
  });
});

/* GET home page. */
router.get('/login', (req, res, next) => {
  let currentDate = new Date();
  res.render('login', { 
    title: 'Edit Profile'
  });
});

/* GET home page. */
router.get('/register', (req, res, next) => {
  let currentDate = new Date();
  res.render('register', { 
    title: 'Sugn Up'
  });
});



module.exports = router;