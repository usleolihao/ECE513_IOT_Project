/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. create a router as a module
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var express = require( 'express' );
var router = express.Router();
var request = require( 'superagent' );
const jwt = require( "jwt-simple" );
const bcrypt = require( "bcryptjs" );
const fs = require( 'fs' );

const History = require( "../models/history" );

// For encoding/decoding JWT, stored the secret in a separate file On AWS EC2
const secret = fs.readFileSync( __dirname + '/../keys/jwtkey' ).toString();


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 2. History REST API
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Save a record of temp/hum/power usage
router.get( '/save', function ( req, res ) {
    if ( !req.headers[ "x-auth" ] ) {
        res.status( 401 ).json( { success: false, message: "No authentication token." } );
        return;
    }
    let token = req.headers[ "x-auth" ];

    try {
        // decode token
        const decoded = jwt.decode( token, secret );





    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }
} );

// Return day history
router.get( '/dayhist', function ( req, res ) {
    if ( !req.headers[ "x-auth" ] ) {
        res.status( 401 ).json( { success: false, message: "No authentication token." } );
        return;
    }

    let token = req.headers[ "x-auth" ];

    try {
        // decode token
        const decoded = jwt.decode( token, secret );




    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }
} );

// Return week history

router.get( '/weekhist', function ( req, res ) {
    if ( !req.headers[ "x-auth" ] ) {
        res.status( 401 ).json( { success: false, message: "No authentication token." } );
        return;
    }

    let token = req.headers[ "x-auth" ];

    try {
        // decode token
        const decoded = jwt.decode( token, secret );




    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }
} );


// 3. mounts the router module on a path in the main app
module.exports = router;