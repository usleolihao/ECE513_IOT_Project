var OnlineInterval = null;
var guiUpdated = false;
var datetime = null,
    date = null;

var update = function () {
    date = moment( new Date() )
    datetime.html( date.format( 'dddd, MMMM Do YYYY, h:mm:ss a' ) );
};

const weather = {
    "cloud": 'fa-cloud',
    "cloud-rain": 'fa-cloud-rain',
    "cloud-sun": 'fa-cloud-sun',
    "sun": 'fa-sun',
    "wind": 'fa-wind',
    "snowflake": 'fa-snowflake'
};

function updateWeather() {
    $( '#weather' ).html( '<i class="fas fa-sun"></i>' );
}



$( function () {

    if ( !window.localStorage.getItem( "authToken" ) ) {
        window.location = "login";
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Initialize the GUI
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    initRangeSliders();

    //Online Communication
    initialCloudbtns();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // automatic update time by seconds
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    datetime = $( '#curTimeReal' )
    update();
    setInterval( update, 1000 );

} );



function initialCloudbtns() {
    //load Devices and add into list
    getOnlineDevices();

    //set Ping button
    $( "#onlineping" ).click( function () {
        let device = $( '#online_device_list' ).find( ":selected" ).val();
        device = JSON.parse( device );
        //console.log( device );
        onlineCmd( {
            cmd: "ping",
            deviceid: device.id,
            deviceapi: device.api
        } );
    } );

    $( "#publishonoff" ).click( function () {
        let On = $( "#publishonoff" ).is( ':checked' );
        console.log( On );
        // check dievice is Online first later.

        let device = $( '#online_device_list' ).find( ":selected" ).val();
        device = JSON.parse( device );
        onlineCmd( {
            cmd: "publish",
            deviceid: device.id,
            deviceapi: device.api,
            publish: { publish: On }
        } );

    } );

    $( '#cloudread' ).click( function () {
        let device = $( '#online_device_list' ).find( ":selected" ).val();
        let valuetoread = $( '#readvalue' ).find( ":selected" ).val();
        device = JSON.parse( device );
        onlineCmd( {
            cmd: "value",
            deviceid: device.id,
            deviceapi: device.api,
            variable: valuetoread
        } );
    } );
}

function initRangeSliders() {
    var inputs = $( 'input[type="range"]' );
    var ranges = {};
    for ( var i = 0; i < inputs.length; i++ ) {
        var id = $( inputs[ i ] ).attr( "id" );
        var $element = $( 'input[id=\"' + id + '\"]' );
        $element
            .rangeslider( {
                polyfill: false,
                onInit: function () {
                    ranges[ id ] = this.$range;
                    var $handle = $( '.rangeslider__handle', this.$range );
                    updateHandle( $handle[ 0 ], this.value );
                }
            } )
            .on( 'input', function () {
                var $handle = $( '.rangeslider__handle', ranges[ this.id ] );
                updateHandle( $handle[ 0 ], this.value );
            } );
    }

    function updateHandle( el, val ) {
        el.textContent = val;
    }
}

function updateGUI( data ) {
    if ( !guiUpdated ) {
        if ( "light" in data ) {
            if ( "L0" in data.light ) $( '#smartlightonoff' ).prop( "checked", data.light.L0 ).change();
            if ( "L1" in data.light ) $( '#smartlightMode' ).prop( "checked", data.light.L1 ).change();
            if ( "b" in data.light ) $( '#birghtnessSlider' ).val( data.light.b ).change();
            if ( "m" in data.light ) $( '#sensorMinSlider' ).val( data.light.m ).change();
            if ( "M" in data.light ) $( '#sensorMaxSlider' ).val( data.light.M ).change();
        }
        if ( "led" in data ) {
            if ( "h" in data.led ) $( '#ledHzSlider' ).val( data.led.h ).change();
        }
        guiUpdated = true;
    }
    if ( "light" in data ) {
        if ( "s" in data.light ) $( "#sensorVal" ).html( data.light.s );
        if ( "b" in data.light ) {
            $( '#curBrightness' ).css( "background-color", `hsl(61, ${data.light.b}%, 50%)` );
            $( '#curBrightness' ).html( data.light.b );
        }
    }
    if ( "simclockOnline" in data ) $( '#onlinesimulatedtime' ).html( data.simclockOnline );
    if ( "simclockLocal" in data ) $( '#localsimulatedtime' ).html( data.simclockLocal );
    //door senosr
    if ( "door_sensor" in data ) {
        if ( data.door_sensor > 500 ) $( '#door_status' ).html( "Open" );
        else $( '#door_status' ).html( "Close" );
    }
    if ( "Humidity" in data ) $( '#Humidity' ).html( data.Humidity + "%" );
    if ( "Temperature" in data ) $( '#Temperature' ).html( data.Temperature + "°" );


}