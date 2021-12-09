var express = require( 'express' );
var router = express.Router();
const jwt = require( "jwt-simple" );
const bcrypt = require( "bcryptjs" );
const fs = require( 'fs' );
const fetch = require( "node-fetch" );

const User = require( "../models/user" );

// For encoding/decoding JWT
// store the secret in a separate file On AWS EC2
const secret = fs.readFileSync( __dirname + '/../keys/jwtkey' ).toString();

// Endpoint /user/signup
// signup an account for smart home
router.post( "/signup", function ( req, res ) {
    User.findOne( { email: req.body.email }, function ( err, user ) {
        if ( err ) {
            res.status( 401 ).json( { success: false, message: err } );
        } else if ( user ) {
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

            newuser.save( function ( err, user ) {
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
                user.save( ( err, user ) => {
                    console.log( "User's last access has been update." );
                    // Send back a token that contains the user's username
                    res.status( 201 ).json( { success: true, dashboard: user.dashboard, token: token, message: "Login success" } );
                } );
            } else {
                res.status( 401 ).json( { success: false, message: "Email or password invalid." } );
            }
        }
    } );
} );

// Endpoint /user/account
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
                //update user's last access time
                user.updated_at = new Date();

                let userinfo = {
                    "email": user.email,
                    "fullName": user.fullName,
                    "lastAccess": user.updated_at,
                    "zip": user.zip,
                    "dashboard": user.dashboard,
                    "devices": []
                }
                //console.log( userinfo );
                // TODO: Get enrolled device from collection

                res.status( 200 ).json( userinfo );
            }
        } );
    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }
} );


// Endpoint /user/updatezipcode
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

// Endpoint /user/updatepreference
// Update user's Preference panel
router.post( '/updatepreference', function ( req, res ) {
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
                user.dashboard = req.body.dashboard;
                user.save( function ( err, user ) {
                    if ( err ) {
                        res.status( 400 ).json( { success: false, message: "can not connect to database, contact support." } );
                    } else {
                        res.status( 200 ).json( { success: true, dashboard: user.dashboard, message: "User's Preference Panel has been updated." } );
                    }
                } );
            }
        } );
    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }

} );

// Endpoint /user/updateall
// Update user's profile
router.post( '/updateall', function ( req, res ) {
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
                user.fullName = req.body.fullName
                user.zip = req.body.zip
                user.dashboard = req.body.dashboard;
                user.updated_at = new Date();

                // If user is changing password
                if ( req.body.cpassword ) {
                    // check the old password
                    if ( bcrypt.compareSync( req.body.cpassword, user.password ) ) {
                        let newpassword = bcrypt.hashSync( req.body.password, 10 );
                        user.password = newpassword;
                        //update user's last access time
                        user.save( ( err, user ) => {
                            console.log( "User's account information has been update." );
                            // Send back a token that contains the user's username
                            res.status( 201 ).json( { success: true, dashboard: user.dashboard, token: token, message: "Updates account information successfully" } );
                        } );
                    } else {
                        res.status( 401 ).json( { success: false, message: "The current password is invalid." } );
                    }
                    //console.log(req.body.cpassword);
                    // Not change the password
                } else {
                    user.save( function ( err, user ) {
                        if ( err ) {
                            res.status( 400 ).json( { success: false, message: "can not connect to database, contact support." } );
                        } else {
                            res.status( 200 ).json( { success: true, dashboard: user.dashboard, token: token, message: "User's Preference Panel has been updated." } );
                        }
                    } );
                }
            }
        } );
    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }

} );


router.post( '/deleteaccount', function ( req, res ) {
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
            }

            if ( bcrypt.compareSync( req.body.password, user.password ) ) {
                User.deleteOne( { email: decoded.email }, function ( err, result ) {
                    if ( err ) {
                        res.status( 400 ).json( { success: false, message: "Error contacting DB. Please contact support." } );
                    }
                    console.log( "Deleted " + result.deletedCount );
                    res.status( 200 ).json( { success: true, message: "User has been deleted " } );

                } );
            } else {
                res.status( 401 ).json( { success: false, message: "The current password is invalid." } );
            }
        } );
    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }

} );


router.post( '/weather', function ( req, res ) {
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
                const zip = user.zip;
                //console.log( zip );

                const params = new URLSearchParams( {
                    zip: zip,
                    units: "imperial",
                    appid: "6f3938f149acae38bb8daa7c60d6558e"
                } );
                fetch( "http://api.openweathermap.org/data/2.5/weather?" + params )
                    .then( response => response.json() )
                    .then( data => {
                        const locals = {
                            data: data,
                            zip: zip,
                            cmd: 'weather'
                        };
                        //console.log( locals );
                        res.status( 200 ).json( { success: true, message: locals } );
                    } )
                    .catch( error => res.status( 201 ).json( { success: false, message: error } ) );
            }
        } );
    } catch ( ex ) {
        // Token was invalid
        res.status( 401 ).json( { success: false, message: "Invalid authentication token." } );
    }
} );


module.exports = router;