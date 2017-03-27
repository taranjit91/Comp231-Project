var express = require('express');
var router = express.Router();
let firebase = require('../config/firebase');


/* GET Search page. */
router.get('/search', (req, res, next) => {
  res.render('search', { 
    title: 'Edit Profile'
  });
});





module.exports = router;