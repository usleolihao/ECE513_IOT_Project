/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. create a router as a module
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var express = require( 'express' );
var router = express.Router();
var request = require( 'superagent' );
const jwt = require( "jwt-simple" );
const bcrypt = require( "bcryptjs" );
const fs = require( 'fs' );
const moment = require('moment')

const History = require( "../models/history" );

// For encoding/decoding JWT, stored the secret in a separate file On AWS EC2
const secret = fs.readFileSync( __dirname + '/../keys/jwtkey' ).toString();


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 2. History REST API
/////////////////////////////////////////////////////////////////////////////////////////////////////////


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
        const today = moment().startOf('day');

        console.log(today);

        History.find( {
            email: req.body.email,
            created_at: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }, function ( err, dayhist ) {
            if ( err ) {
                res.status( 401 ).json( { success: false, message: err } );
            } else {
                //handle the value
                res.status( 201 ).json( { success: true, message: dayhist } );
            }
        } );
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
        const week = moment().startOf('week').toDate();
        const today = moment().endOf('day').toDate();


        console.log(today);

        History.find( {
            email: req.body.email,
            created_at: {
                $gte: week,
                $lte: today
            }
        }, function ( err, weekhist ) {
            if ( err ) {
                res.status( 401 ).json( { success: false, message: err } );
            } else {
                //handle the value
                res.status( 201 ).json( { success: true, message: weekhist } );
            }
        } );
    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }
} );

router.get( '/monthhist', function ( req, res ) {
    if ( !req.headers[ "x-auth" ] ) {
        res.status( 401 ).json( { success: false, message: "No authentication token." } );
        return;
    }

    let token = req.headers[ "x-auth" ];

    try {
        // decode token
        const decoded = jwt.decode( token, secret );
        const month = moment().startOf('month').toDate();
        const today = moment().endOf('day').toDate();


        console.log(today);

        History.find( {
            email: req.body.email,
            created_at: {
                $gte: month,
                $lte: today
            }
        }, function ( err, monthhist ) {
            if ( err ) {
                res.status( 401 ).json( { success: false, message: err } );
            } else {
                //handle the value
                res.status( 201 ).json( { success: true, message: monthhist } );
            }
        } );
    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }
} );


// 3. mounts the router module on a path in the main app
module.exports = router;