var express = require('express');
var router = express.Router();
var swig = require('swig');

/* GET home page. */
router.get('/',function(req, res, next){
    res.render('index',{
        title:'SmartHome (Team #16)'
    });
})

/*
res.sendFile('/dashboard.html');
*/

/* Signup page. */
router.get('/signup',function(req, res, next){
    res.render('signup',{
        title:'Sign Up - SmartHome'
    })
})

router.get('/login',function(req, res, next){
    res.render('login',{
        title:'Login - SmartHome'
    })
})

router.get('/account',function(req, res, next){
    res.render('account',{
        title:'Account - SmartHome'
    })
})

module.exports = router;
