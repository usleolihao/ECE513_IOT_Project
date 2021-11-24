/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. create a router as a module
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var express = require('express');
var router = express.Router();
var request = require('superagent');


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
/////////////////////////////////////////////////////////////////////////////////////////////////////////

















/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Please use your device id and access token for your testing*/
/* For your project, device ID and token should be in your database*/
var deviceInfo = {
    id: 'Your device id here',
    token: 'Your acceess token here'
};

var rxData = {};

// 2. defines some routes
router.post('/report', function(req, res){
    rxData = JSON.parse(req.body.data);
    simulatedClock(rxData);
    res.status(201).json({status: 'ok'});
});

router.post('/publish', function(req, res){
    //console.log(req.body);
    request
    .post("https://api.particle.io/v1/devices/" + deviceInfo.id + "/cloudcmd")
    .set('Authorization', 'Bearer ' + deviceInfo.token)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({ args: JSON.stringify(req.body)}) 
    .then(response => {
        res.status(200).json({cmd: 'publish', success: true});
    })
    .catch(err => {
        res.status(201).json({cmd: 'publish', success: false});  
    });
});

router.get('/ping', function (req,res) {
    request
        .put("https://api.particle.io/v1/devices/" + deviceInfo.id + "/ping")
        .set('Authorization', 'Bearer ' + deviceInfo.token)
        .set('Accept', 'application/json')
        .send() 
        .then(response => {
            res.status(200).json({cmd: 'ping', success: true, data: JSON.parse(response.text)});
        })
        .catch(err => {
            res.status(201).json({cmd: 'ping', success: false, data: JSON.parse(err.response.text)});  
        });
});

router.get('/read', function (req, res) {
    let retData = rxData;
    if (simulatedTime) retData["simclock"] = simulatedTime.toString();
    res.status(201).json({ cmd: 'read', data: retData });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Simulated clock
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var referenceTimeInSec = null;
var clockUnit = 60;     // 1 sec --> 1 minutes
let simulatedTime = null;
function simulatedClock(data) {
    let str = "";
    if ("t" in data) {
        if (referenceTimeInSec == null) {
          referenceTimeInSec = data.t;
        }
        let curTimeInSec = data.t;
        let simTimeInSec = referenceTimeInSec + (curTimeInSec-referenceTimeInSec)*clockUnit;
        let curTime = new Date(curTimeInSec*1000);
        simulatedTime = new Date(simTimeInSec*1000);
    }
}


// 3. mounts the router module on a path in the main app
module.exports = router;
