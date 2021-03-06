var express = require('express');
var fetch = require("node-fetch");
var router = express.Router();

router.post('/scan', function(req, res) {
    scanPorts(req, res);
});

router.post('/open', function(req, res) {
    openPort(req, res);
});

router.post('/close', function(req, res) {
    closePort(req, res);
});

router.post('/write', function(req, res) {
    writePort(req, res);
});

router.post('/read', function(req, res) {
    let retData = rxData;
    if (simulatedTime) retData["simclockLocal"] = simulatedTime.toString();
    res.status(201).json({ cmd: req.body.cmd, data: retData });
});

router.post('/weather', function(req, res) {
    const zip = "85719";
    //console.log( zip );

    const params = new URLSearchParams({
        zip: zip,
        units: "imperial",
        appid: "6f3938f149acae38bb8daa7c60d6558e"
    });
    fetch("http://api.openweathermap.org/data/2.5/weather?" + params)
        .then(response => response.json())
        .then(data => {
            const locals = {
                data: data,
                zip: zip,
                cmd: 'weather'
            };
            //console.log( locals );
            res.status(200).json({ success: true, message: locals });
        })
        .catch(error => res.status(201).json({ success: false, message: error }));
});

// APIs: https://serialport.io/docs/api-serialport
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Serial communication
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var serialPort = require('serialport');
const Delimiter = require('@serialport/parser-delimiter')

// global varialbes for serial communication
var serialPortsList = [];
var serialComPort = null;
var parser = null;
var rxData = {};

// scan available serial ports
function scanPorts(req, res) {
    serialPort.list().then(
        (ports) => {
            console.log(`-- available serial ports (# of ports: ${ports.length}) --`);
            let index = 0;
            serialPortsList = [];
            ports.forEach(port => {
                serialPortsList.push(port.path);
                console.log(`[${index++}] ${port.path}`);
            });

            res.status(201).json({ cmd: req.body.cmd, list: serialPortsList });
        }
    );
}

function openPort(req, res) {
    if (!("path" in req.body)) {
        let msg = `Error check your path`;
        res.status(201).json({ cmd: req.body.cmd, mgs: msg });
    }
    let pathStr = req.body.path;
    if (serialComPort != null) {
        let msg = `Please close your ${serialComPort.path}!!`
        console.log(msg);
        res.status(201).json({ cmd: req.body.cmd, msg: msg });
        return;
    }
    console.log(`Opening serial monitor for com port: "${pathStr}"`)
    serialComPort = new serialPort(pathStr, { baudRate: 9600, autoOpen: false });
    parser = serialComPort.pipe(new Delimiter({ delimiter: '\r\n' }));
    parser.on('data', function(data) {
        try {
            rxData = JSON.parse(data);
            simulatedClock(rxData);
        } catch (err) {
            if (err.message === "Unexpected number in JSON at position 1") {
                console.log("DHT Reading value error.");
            } else {
                console.log(err.message);
            }
        }
    });

    serialComPort.open(function(err) {
        if (err) {
            let msg = `Error opening port: ${err.message}`;
            res.status(201).json({ cmd: req.body.cmd, mgs: msg });
            console.log(msg);
        } else {
            let msg = `Serial monitor opened successfully (Data rate: ${this.baudRate})`;
            console.log(msg);
            res.status(201).json({ cmd: req.body.cmd, msg: msg });
        }
    });
}

function closePort(req, res) {
    serialComPort.close(function(err) {
        if (err) {
            let msg = `Something wrong while closing your comport ${this.path}`;
            console.log(msg);
            res.status(500).json({ cmd: req.body.cmd, msg: msg });
        } else {
            let msg = `${this.path} has been closed`;
            console.log(msg);
            res.status(201).json({ cmd: req.body.cmd, msg: msg });
            serialComPort = null;
            parser = null;
        }
    });
}

function writePort(req, res) {

    if (serialComPort != null) {
        serialComPort.write(JSON.stringify(req.body.data), function(err) {
            if (err) {
                let msg = 'Error on write: ' + JSON.stringify(err.message);
                res.status(201).json({ cmd: req.body.cmd, msg: msg, subcmd: req.body.data, error: err, success: false });
                console.log(msg);
            } else {
                let msg = 'message written';
                res.status(201).json({ cmd: req.body.cmd, msg: msg, subcmd: req.body.data, success: true });
                console.log(msg);
            }
        });
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Simulated clock
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var referenceTimeInSec = null;
var clockUnit = 60; // 1 sec --> 1 minutes
let simulatedTime = null;

function simulatedClock(data) {
    let str = "";
    if ("t" in data) {
        if (referenceTimeInSec == null) {
            referenceTimeInSec = data.t;
        }
        let curTimeInSec = data.t;
        let simTimeInSec = referenceTimeInSec + (curTimeInSec - referenceTimeInSec) * clockUnit;
        let curTime = new Date(curTimeInSec * 1000);
        simulatedTime = new Date(simTimeInSec * 1000);
    }
}


module.exports = router;