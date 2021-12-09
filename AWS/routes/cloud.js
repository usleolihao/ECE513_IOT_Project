/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. create a router as a module
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var express = require( 'express' );
var router = express.Router();
var request = require( 'superagent' );
const jwt = require( "jwt-simple" );
const bcrypt = require( "bcryptjs" );
const fs = require( 'fs' );

const Device = require( "../models/device" );

// For encoding/decoding JWT, stored the secret in a separate file On AWS EC2
const secret = fs.readFileSync( __dirname + '/../keys/jwtkey' ).toString();
var rxData = {};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 2. defines routes for Online Communication
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Please use your device id and access token for your testing*/
/* For your project, device ID and token should be in your database*/

router.post( '/ping', function ( req, res ) {
    request
        .put( "https://api.particle.io/v1/devices/" + req.body.deviceid + "/ping" )
        .set( 'Authorization', 'Bearer ' + req.body.deviceapi )
        .set( 'Accept', 'application/json' )
        .send()
        .then( response => {
            res.status( 200 ).json( { cmd: 'ping', success: true, data: JSON.parse( response.text ) } );
        } )
        .catch( err => {
            res.status( 201 ).json( { cmd: 'ping', success: false, data: JSON.parse( err.response.text ) } );
        } );
} );

router.post( '/read', function ( req, res ) {
    let retData = rxData;
    if ( simulatedTime ) retData[ "simclockOnline" ] = simulatedTime.toString();
    res.status( 201 ).json( { cmd: 'read', data: retData } );
} );

router.post( '/report', function ( req, res ) {
    rxData = JSON.parse( req.body.data );
    //console.log( rxData );
    simulatedClock( rxData );
    res.status( 201 ).json( { status: 'ok' } );
} );

//curl "https://api.particle.io/v1/devices/3d004f000f51353338363333/smart_light_analogvalue?access_token=c5f4cc8be75dbc10720a259d2219acc0c82e5caf"
router.post( '/value', function ( req, res ) {
    request
        .get( "https://api.particle.io/v1/devices/" + req.body.deviceid + "/" + req.body.variable + "?access_token=" + req.body.deviceapi )
        .send()
        .then( response => {
            let variable = req.body.variable;
            let result = JSON.parse( response.text ).result;
            if ( req.body.variable === "Temperature_Farenheit" ) {
                res.status( 200 ).json( { cmd: 'value', subcmd: variable, data: { TemperatureF: result.toFixed( 2 ) }, success: true } );
            } else if ( req.body.variable === "Temperature_Celcius" ) {
                res.status( 200 ).json( { cmd: 'value', subcmd: variable, data: { TemperatureC: result }, success: true } );
            } else if ( req.body.variable === "Humidity" ) {
                res.status( 200 ).json( { cmd: 'value', subcmd: variable, data: { Humidity: result }, success: true } );
            } else if ( req.body.variable === "door_analogvalue" ) {
                res.status( 200 ).json( { cmd: 'value', subcmd: variable, data: { door_sensor: result }, success: true } );
            } else if ( req.body.variable === "smart_light_analogvalue" ) {
                res.status( 200 ).json( { cmd: 'value', subcmd: variable, data: { light: { s: result } }, success: true } );
            }
        } )
        .catch( err => {
            console.log( err );
            res.status( 201 ).json( { cmd: 'value', subcmd: req.body.variable, success: false } );
        } );
} );

router.post( '/write', function ( req, res ) {
    console.log( req.body.data );
    request
        .post( "https://api.particle.io/v1/devices/" + req.body.deviceid + "/cloudcmd" )
        .set( 'Authorization', 'Bearer ' + req.body.deviceapi )
        .set( 'Accept', 'application/json' )
        .set( 'Content-Type', 'application/json' )
        .send( { args: JSON.stringify( req.body.data ) } )
        .then( response => {
            res.status( 200 ).json( { cmd: 'write', subcmd: req.body.data, success: true } );
        } )
        .catch( err => {
            res.status( 201 ).json( { cmd: 'write', subcmd: req.body.data, error: err, success: false } );
        } );
} );


router.post( '/publish', function ( req, res ) {
    //console.log( req.body.publish );
    request
        .post( "https://api.particle.io/v1/devices/" + req.body.deviceid + "/cloudcmd" )
        .set( 'Authorization', 'Bearer ' + req.body.deviceapi )
        .set( 'Accept', 'application/json' )
        .set( 'Content-Type', 'application/json' )
        .send( { args: JSON.stringify( req.body.publish ) } )
        .then( response => {
            res.status( 200 ).json( { cmd: 'publish', success: true, status: req.body.publish.publish } );
        } )
        .catch( err => {
            res.status( 201 ).json( { cmd: 'publish', success: false } );
        } );
} );


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Simulated clock
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var referenceTimeInSec = null;
var clockUnit = 60; // 1 sec --> 1 minutes
let simulatedTime = null;

function simulatedClock( data ) {
    let str = "";
    if ( "t" in data ) {
        if ( referenceTimeInSec == null ) {
            referenceTimeInSec = data.t;
        }
        let curTimeInSec = data.t;
        let simTimeInSec = referenceTimeInSec + ( curTimeInSec - referenceTimeInSec ) * clockUnit;
        let curTime = new Date( curTimeInSec * 1000 );
        simulatedTime = new Date( simTimeInSec * 1000 );
    }
}

// 3. mounts the router module on a path in the main app
module.exports = router;