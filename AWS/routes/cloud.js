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
    simulatedClock( rxData );
    res.status( 201 ).json( { status: 'ok' } );
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