var OnlineInterval = null;
var guiUpdated = false;
var datetime = null,
    date = null;

var update = function () {
    date = moment( new Date() );
    datetime.html( date.format( 'dddd, MMMM Do YYYY, h:mm:ss a' ) );
};

$( function () {

    if ( !window.localStorage.getItem( "authToken" ) ) {
        window.location = "login";
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Initialize the GUI
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    initialPanelModules();
    initRangeSliders();
    //Online Communication
    initialCloudbtns();

    initial_widgets();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // automatic updates
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    datetime = $( '#curTimeReal' )
    update();
    // updates time by second
    setInterval( update, 1000 );
    // updates weather by hour
    setInterval( checkweather, 3600000 );
} );

async function initial_widgets() {
    setTimeout( () => { pingonce(); }, 1000 );
    setTimeout( () => {
        if ( $( '#online_com_status' ).text() === "Device is Online" ) {
            cloudreadall();
        } else {
            alert( "Your device is Offline!" );
        }
    }, 2000 );
    setTimeout( () => { pullhistory(); }, 1000 );
}


function initialPanelModules() {
    weather_module();
    temperature_module();
    LED_module();
    humidity_module();
    doorstatus_module();
    power_module();
    AC_module();
    Thermostat_module();
    historyTH_module();
    warning_module();
}


function initialCloudbtns() {
    //load Devices and add into list
    getOnlineDevices();

    //set Ping button
    $( "#onlineping" ).click( pingonce );

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

    $( '#cloudreadall' ).click( cloudreadall );

    $( '#stoprecord' ).click(stoprecordhistory);
}




function pingonce() {
    try {
        let device = $( '#online_device_list' ).find( ":selected" ).val();
        device = JSON.parse( device );
        //console.log( device );
        onlineCmd( {
            cmd: "ping",
            deviceid: device.id,
            deviceapi: device.api
        } );
    } catch ( err ) {
        //console.log( err );
        alert( "No available device." );
    }
}

function cloudreadall() {
    let device = $( '#online_device_list' ).find( ":selected" ).val();
    device = JSON.parse( device );

    onlineCmd( {
        cmd: "value",
        deviceid: device.id,
        deviceapi: device.api,
        variable: "allvar"
    } );
    /*$( '#readvalue option' ).each( function () {
        onlineCmd( {
            cmd: "value",
            deviceid: device.id,
            deviceapi: device.api,
            variable: $( this ).val()
        } );
    } );*/

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
    //console.log( data ,typeof data);
    if ( !guiUpdated ) {
        if ( "light" in data ) {
            if ( "L0" in data.light ) {
                $( "#smartlightonoff" ).prop( "src", data.light.L0 ? led_on : led_off ).change();
                //console.log("testlight_icon:" + light_icon);
                //console.log("testlight_icon2:" + $( "#smartlightonoff" ).attr( "src"));
                //$( '#smartlightonoff' ).prop( "checked",  ).change();
            }
            if ( "L1" in data.light ) $( '#smartlightMode' ).prop( "checked", data.light.L1 ).change();
            if ( "L2" in data.light ) $( '#smartlightbed' ).prop( "checked", data.light.L1 ).change();
            if ( "L3" in data.light ) $( '#smartlightwake' ).prop( "checked", data.light.L1 ).change();
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

    //updated door senosr widget 2.0
    if ( "doorstatus" in data ) {
        //console.log( typeof data.doorstatus );
        if ( typeof data.doorstatus === "boolean" ) {
            $( '#doorstatus' ).html( data.doorstatus ? "Open" : "Close" );
        } else {
            $( '#doorstatus' ).html( data.doorstatus );
        }

    }
    // updated humidity widget 2.0
    if ( "Humidity" in data ) $( '#humidity' ).html( data.Humidity );
    // updated Temperature widget 2.0
    if ( "TemperatureF" in data ) $( '#Temperature_Farenheit' ).html( data.TemperatureF );
    if ( "TemperatureC" in data ) $( '#Temperature_Celcius' ).html( data.TemperatureC );
    // updates acmode 2.0
    if ( "acmode" in data ) {
        $( "#" + modes[ data.acmode ] ).prop( "checked", true );
        $( "#ac_status" ).text( modes[ data.acmode ].toUpperCase() );
    }
    // updates actemp
    if ( "actemp" in data ) $( "#ac_set_temp" ).html( data.actemp );
    // door_opentime for warning
    if ( "door_opentime" in data ) {
        // larger than one min warning
        if ( data.door_opentime > 60 ) {
            $( '.warning' ).show();
            $( '#warningtext' ).html( "Door has opened " + ( data.door_opentime / 60 ).toFixed() + " minutes" );
        } else {
            $( '.warning' ).hide();
        }
    }
    // updated power_consumption 1 seconds = 10mins usages
    if ( "power_consumption" in data ) $( "#power_cons" ).html( data.power_consumption / 1000 );


}