var myInterval = null;
var guiUpdated = false;
var datetime = null,
    date = null;

var update = function () {
    date = moment( new Date() )
    datetime.html( date.format( 'dddd, MMMM Do YYYY, h:mm:ss a' ) );
};

$( function () {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Initialize the GUI
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Local Communication
    initRangeSliders();
    serailCmd( { cmd: "scan" } );
    initialLocalbtns();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // automatic update time by seconds
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    datetime = $( '#curTimeReal' )
    update();
    setInterval( update, 1000 );

} );

function initialLocalbtns() {
    $( '#btnConnect' ).click( connectDisconnect );
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
    if ( "simclock" in data ) $( '#localsimulatedtime' ).html( data.simclock );
}