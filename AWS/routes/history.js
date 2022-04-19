/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. create a router as a module
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var express = require( 'express' );
var router = express.Router();
var request = require( 'superagent' );
const jwt = require( "jwt-simple" );
const bcrypt = require( "bcryptjs" );
const fs = require( 'fs' );
const moment = require( 'moment' )

const History = require( "../models/history" );

// For encoding/decoding JWT, stored the secret in a separate file On AWS EC2
const secret = fs.readFileSync( __dirname + '/../keys/jwtkey' ).toString();


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 2. History REST API
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Register a device
router.post( '/save', function ( req, res, next ) {
    if ( !req.headers[ "x-auth" ] ) {
        return res.status( 401 ).json( { success: false, message: "Missing X-Auth header." } );
    }

    // X-Auth should contain the token 
    const token = req.headers[ "x-auth" ];

    try {
        // decode token
        const decoded = jwt.decode( token, secret );

        console.log( req.body.created_at );
        let dhtdata = new History( {
            email: decoded.email,
            temperature: req.body.temperature,
            humidity: req.body.humidity,
            power: req.body.power,
            created_at: req.body.created_at
        } );

        dhtdata.save( function ( err, user ) {
            if ( err ) {
                res.status( 400 ).json( { success: false, err: err } );
            } else {
                let msgStr = `data (${dhtdata}) has been saved.`;
                res.status( 201 ).json( { success: true, cmd: "record", message: msgStr } );
                console.log( msgStr );
            }
        } );

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
        const today = moment().startOf( 'day' ).toDate();
        const endday = moment( today ).endOf( 'day' ).toDate();
        //console.log( today );

        History.find( {
            email: decoded.email,
            created_at: {
                $gte: today,
                $lte: endday
            }
        }, function ( err, dayhist ) {
            if ( err ) {
                res.status( 401 ).json( { success: false, cmd: "dayhist", message: err } );
            } else {
                //console.log( dayhist );
                //handle the value
                res.status( 201 ).json( { success: true, cmd: "dayhist", message: dayhist } );
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
        const week = moment().add( 7, 'days' ).startOf( 'day' ).toDate();
        const today = moment().startOf( 'day' ).toDate();


        console.log( week );

        History.find( {
            email: decoded.email,
            created_at: {
                $gte: today,
                $lte: week
            }
        }, function ( err, weekhist ) {
            if ( err ) {
                res.status( 401 ).json( { success: false, cmd: "weekhist", message: err } );
            } else {
                console.log( weekhist.length );
                //handle the value
                res.status( 201 ).json( { success: true, cmd: "weekhist", message: weekhist } );
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
        const month = moment().add( 1, 'months' ).startOf( 'day' ).toDate();
        const today = moment().startOf( 'day' ).toDate();


        console.log( month );

        History.find( {
            email: decoded.email,
            created_at: {
                $gte: today,
                $lte: month
            }
        }, function ( err, monthhist ) {
            if ( err ) {
                res.status( 401 ).json( { success: false, cmd: "monthhist", message: err } );
            } else {
                console.log( monthhist.length );
                //handle the value
                res.status( 201 ).json( { success: true, cmd: "monthhist", message: monthhist } );
            }
        } );
    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }
} );


// 3. mounts the router module on a path in the main app
module.exports = router;