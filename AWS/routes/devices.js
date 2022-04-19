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


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 2. Device REST API
/////////////////////////////////////////////////////////////////////////////////////////////////////////


// Register a device
router.post( '/register', function ( req, res, next ) {
    if ( !req.body.deviceid || !req.body.deviceapi ) {
        res.status( 401 ).json( { success: false, message: "Missing device Id and/or device API" } );
        return;
    }

    if ( !req.headers[ "x-auth" ] ) {
        return res.status( 401 ).json( { success: false, message: "Missing X-Auth header." } );
    }

    // X-Auth should contain the token 
    const token = req.headers[ "x-auth" ];

    try {
        // decode token
        const decoded = jwt.decode( token, secret );

        Device.findOne( { deviceid: req.body.deviceid }, function ( err, device ) {
            if ( err ) {
                res.status( 401 ).json( { success: false, message: err } );
            } else if ( device ) {
                let msg = "Device ID " + req.body.deviceid + " already registered.";
                res.status( 401 ).json( { success: false, message: msg } );
            } else {
                // Test device are connectted correctly
                var newdevice = new Device( {
                    email: decoded.email,
                    deviceid: req.body.deviceid,
                    deviceapi: req.body.deviceapi
                } );

                request
                    .put( "https://api.particle.io/v1/devices/" + req.body.deviceid + "/ping" )
                    .set( 'Authorization', 'Bearer ' + req.body.deviceapi )
                    .set( 'Accept', 'application/json' )
                    .send()
                    .then( response => {
                        //res.status( 200 ).json( { cmd: 'ping', success: true, data: JSON.parse( response.text ) } );
                        console.log( { cmd: 'ping', success: true, data: JSON.parse( response.text ) } );

                        // Save device. If successful, return success. If not, return error message.
                        newdevice.save( function ( err, device ) {
                            if ( err ) {
                                res.status( 400 ).json( { success: false, err: err } );
                            } else {
                                let msgStr = `Device (id:${req.body.deviceid}) has been registered.`;
                                console.log( msgStr );
                                res.status( 201 ).json( { success: true, message: msgStr } );
                                
                            }
                        } );
                    } )
                    .catch( err => {
                        res.status( 201 ).json( { cmd: 'ping', success: false, data: JSON.parse( err.response.text ),message: "Wrong deviceid or device API" } );
                    } );
            }
        } );
    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }
} );


// Remove a device
router.post( '/remove', function ( req, res ) {
    if ( !req.headers[ "x-auth" ] ) {
        return res.status( 401 ).json( { success: false, message: "Missing X-Auth header." } );
    }

    // X-Auth should contain the token 
    const token = req.headers[ "x-auth" ];

    try {
        // decode token
        const decoded = jwt.decode( token, secret );

        // Send back account information
        Device.findOne( { email: decoded.email, deviceid: req.body.deviceid, deviceapi: req.body.deviceapi }, function ( err, devices ) {
            if ( err ) {
                res.status( 400 ).json( { success: false, message: "Error contacting DB. Please contact support." } );
            }
            if ( devices ) {
                Device.deleteOne( { email: decoded.email, deviceid: req.body.deviceid }, function ( err, result ) {
                    if ( err ) {
                        res.status( 400 ).json( { success: false, message: "Error contacting DB. Please contact support." } );
                    }
                    console.log( "Deleted " + result.deletedCount );
                    res.status( 200 ).json( { success: true, message: "Device has been deleted " } );

                } );
            } else {
                res.status( 401 ).json( { success: false, message: "Invalid Device Id or Device API." } );
            }
        } );
    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }

} );


//Return user's devices
router.get( '/list', function ( req, res ) {
    if ( !req.headers[ "x-auth" ] ) {
        res.status( 401 ).json( { success: false, message: "No authentication token." } );
        return;
    }

    let token = req.headers[ "x-auth" ];

    try {
        // decode token
        const decoded = jwt.decode( token, secret );

        Device.find( { email: decoded.email }, function ( err, devices ) {
            if ( err ) {
                res.status( 400 ).json( { success: false, message: "can not connect to database, contact support." } );
            }

            if ( devices ) {
                let devicesinfo = {
                    email: decoded.email,
                    devices: []
                };

                for ( let device of devices ) {
                    devicesinfo[ 'devices' ].push( { deviceid: device.deviceid, deviceapi: device.deviceapi } );
                }
                console.log( devicesinfo );
                res.status( 200 ).json( { success: true, devices: devicesinfo } );
            } else {
                res.status( 401 ).json( { success: false, message: "No devices found" } );
            }
        } );
    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }
} );

// 3. mounts the router module on a path in the main app
module.exports = router;