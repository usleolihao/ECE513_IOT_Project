var express = require('express');
var router = express.Router();
var swig = require('swig');

/* GET home page. */
router.get('/',function(req, res, next){
    res.render('index',{
        title:'SmartHome (Team #16)'
    });
})

/* Signup page. */
router.get('/signup',function(req, res, next){
    res.render('signup',{
        title:'Sign Up - SmartHome'
    })
})

/*
res.sendFile('/dashboard.html');
*/

module.exports = router;
