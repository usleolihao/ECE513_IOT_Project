var express = require( 'express' );
var router = express.Router();
const jwt = require( "jwt-simple" );
const bcrypt = require( "bcryptjs" );
const fs = require( 'fs' );

const User = require( "../models/user" );

// For encoding/decoding JWT
// store the secret in a separate file On AWS EC2
const secret = fs.readFileSync( __dirname + '/../keys/jwtkey' ).toString();

// Endpoint /user/signup
// signup an account for smart home
router.post( "/signup", function ( req, res ) {
    User.findOne( { email: req.body.email }, function ( err, customer ) {
        if ( err ) {
            res.status( 401 ).json( { success: false, message: err } );
        } else if ( customer ) {
            // for protect user information
            // should notice that information is not valid instead of
            // "This email already used"
            let errmsg = "The provided information is not valid.";
            res.status( 401 ).json( { success: false, message: errmsg } );
        } else {
            let password = bcrypt.hashSync( req.body.password, 10 );
            let newuser = new User( {
                email: req.body.email,
                password: password,
                fullName: req.body.fullName
            } );

            newuser.save( function ( err, customer ) {
                if ( err ) {
                    res.status( 400 ).json( { success: false, err: err } );
                } else {
                    let msgStr = `User account (${req.body.email}) has been created.`;
                    res.status( 201 ).json( { success: true, message: msgStr } );
                    console.log( msgStr );
                }
            } );
        }
    } );
} );



// Endpoint /user/login
// login
// perform authentication process for a user
router.post( '/login', function ( req, res ) {
    if ( !req.body.email || !req.body.password ) {
        res.status( 401 ).json( { success: false, message: "Missing email and/or password" } );
        return;
    }
    // Get user from the database
    User.findOne( { email: req.body.email }, function ( err, user ) {
        let errmsg = "";
        if ( err ) {
            res.status( 400 ).send( err );
        } else if ( !user ) {
            // Username not in the database
            errmsg = "Email or password invalid."
            res.status( 401 ).json( { success: false, message: errmsg } );
        } else {
            // since we only store password in hash, compare with hashed password directly
            if ( bcrypt.compareSync( req.body.password, user.password ) ) {
                const token = jwt.encode( { email: req.body.email }, secret );
                //update user's last access time
                user.updated_at = new Date();
                user.save( ( err, customer ) => {
                    console.log( "User's last access has been update." );
                    // Send back a token that contains the user's username
                    res.status( 201 ).json( { success: true, token: token, message: "Login success" } );
                } );
            } else {
                res.status( 401 ).json( { success: false, message: "Email or password invalid." } );
            }
        }
    } );
} );

// Return account information
router.get( '/account', function ( req, res ) {
    if ( !req.headers[ "x-auth" ] ) {
        return res.status( 401 ).json( { success: false, message: "Missing X-Auth header." } );
    }

    // X-Auth should contain the token 
    const token = req.headers[ "x-auth" ];
    //console.log(token);

    try {
        // decode token
        const decoded = jwt.decode( token, secret );
        //console.log( decoded );

        // Send back account information
        User.findOne( { email: decoded.email }, function ( err, user ) {
            if ( err ) {
                res.status( 400 ).json( { success: false, message: "Error contacting DB. Please contact support." } );
            } else {
                let userinfo = {
                    "email": user.email,
                    "fullName": user.fullName,
                    "lastAccess": user.updated_at,
                    "zip": user.zip,
                    "devices": []
                }
                console.log( userinfo );
                // TODO: Get enrolled device from collection

                res.status( 200 ).json( userinfo );
            }
        } );
    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }
} );


// Update user's zipcode
router.post( '/updatezip', function ( req, res ) {
    if ( !req.headers[ "x-auth" ] ) {
        return res.status( 401 ).json( { success: false, message: "Missing X-Auth header." } );
    }

    // X-Auth should contain the token 
    const token = req.headers[ "x-auth" ];

    try {
        // decode token
        const decoded = jwt.decode( token, secret );

        // Send back account information
        User.findOne( { email: decoded.email }, function ( err, user ) {
            if ( err ) {
                res.status( 400 ).json( { success: false, message: "Error contacting DB. Please contact support." } );
            } else {
                user.zip = req.body.zip;
                user.save( function ( err, user ) {
                    if ( err ) {
                        res.status( 400 ).json( { success: false, message: "can not connect to database, contact support." } );
                    } else {
                        res.status( 200 ).json( { success: true, message: "User's Zipcode has been updated." } );
                    }
                } );
            }
        } );
    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }

} );

module.exports = router;