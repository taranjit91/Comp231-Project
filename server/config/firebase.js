// firebase requirements
let firebase = require('firebase');
let admin = require('firebase-admin');
let serviceAccount = require('./firebase.json');

// initialize firebase admin for database access
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://comp231-centage.firebaseio.com"
})

// initialize firebase app

let config = {
    apiKey: "AIzaSyCxWVz5cArT737pxeIHaZxeO246muY_d3c",
    authDomain: "comp231-centage.firebaseapp.com",
    databaseURL: "https://comp231-centage.firebaseio.com",
    storageBucket: "comp231-centage.appspot.com",
    messagingSenderId: "809164555117"
};

 firebase.initializeApp(config);

let firebaseDB = admin.database();
module.exports.firebaseDatabase = admin.database();
module.exports.jobs = firebaseDB.ref("jobs");
module.exports.employers = firebaseDB.ref("users/employers");
module.exports.members = firebaseDB.ref("users/personal");

module.exports.admin = admin;

module.exports.auth = firebase.auth();