var createError = require( 'http-errors' );
var express = require( 'express' );
var path = require( 'path' );
var cookieParser = require( 'cookie-parser' );
var logger = require( 'morgan' );
var swig = require( 'swig' );

// Parses JSON in body
const bodyParser = require( 'body-parser' );

// Models
const User = require( "./models/user" );
const Device = require( "./models/device" );

// Router
var indexRouter = require( './routes/index' );
var usersRouter = require( './routes/users' );
var deviceRouter = require( './routes/devices' );
var cloudRouter = require( './routes/cloud' );

// app
var app = express();

app.use( express.static( 'public' ) );



// view engine setup
swig.setDefaults( {
    cache: false
} )
app.set( 'view cache', false );
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'html' );
app.engine( 'html', swig.renderFile );



//enable cross-origin access
app.use( function ( req, res, next ) {
    // Website you wish to allow to connect
    res.setHeader( 'Access-Control-Allow-Origin', '*' );
    // Request methods you wish to allow
    res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE' );
    // Request headers you wish to allow
    res.setHeader( 'Access-Control-Allow-Headers', 'X-Requested-With,content-type' );
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader( 'Access-Control-Allow-Credentials', true );
    // Pass to next layer of middleware
    next();
} );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

app.use( logger( 'dev' ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );

// setup the router
app.use( '/', indexRouter );
app.use( '/user', usersRouter );
app.use( '/device', deviceRouter );
app.use( '/cloud', cloudRouter );


// catch 404 and forward to error handler
app.use( function ( req, res, next ) {
    next( createError( 404 ) );
} );

// error handler
app.use( function ( err, req, res, next ) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

    // render the error page
    res.status( err.status || 500 );
    res.render( 'error' );
} );


module.exports = app;