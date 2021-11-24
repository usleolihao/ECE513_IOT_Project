var myInterval = null;
var guiUpdated = false;
$( function () {
    initRangeSliders();
    serailCmd( { cmd: "scan" } );
} );

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
    if ( "simclock" in data ) $( '#curTime' ).html( data.simclock );
}

function serailCmd( data ) {
    $.ajax( {
        url: '/serial/' + data.cmd,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify( data ),
        dataType: 'json'
    } ).done( serailSuccess ).fail( serialFailure );
}

function serailSuccess( data, textStatus, jqXHR ) {
    if ( "cmd" in data ) {
        if ( data.cmd === "scan" ) updateAvailableSerialList( data );
        else if ( data.cmd === "open" ) finishOpenClose( data );
        else if ( data.cmd === "close" ) finishOpenClose( data );

        if ( data.cmd === "read" ) {
            let curStr = $( '#rdData' ).html();
            curStr += JSON.stringify( data.data );
            $( '#rdData' ).html( curStr );
            document.getElementById( "rdData" ).scrollTop = document.getElementById( "rdData" ).scrollHeight;
            // update GUI
            updateGUI( data.data );
        } else {
            $( '#cmdStatusData' ).html( JSON.stringify( data, null, 2 ) );
        }
    }
}

function serialFailure( jqXHR, textStatus, errorThrown ) {
    $( '#cmdStatusData' ).html( JSON.stringify( jqXHR, null, 2 ) );
}

function updateAvailableSerialList( data ) {
    if ( "list" in data ) {
        let curList = data.list;
        for ( let newPort of curList ) {
            $( '#com_ports_list' ).append( `<option value="${newPort}">${newPort}</option>` );
        }
        if ( curList.length == 1 ) {
            $( "#com_ports_list option:eq(1)" ).prop( "selected", true );
            connectDisconnect();
        }
    }
}

function connectDisconnect() {
    if ( $( "#btnConnect" ).html() == "Connect" ) {
        let selectedPort = $( "#com_ports_list" ).val();
        if ( selectedPort === "null" ) {
            window.alert( "Please select your COM port" );
            return;
        }
        serailCmd( { cmd: "open", path: selectedPort } );
    } else {
        serailCmd( { cmd: "close" } );
    }
}

function finishOpenClose( data ) {
    if ( $( "#btnConnect" ).html() == "Connect" ) {
        $( "#btnConnect" ).html( "Disconnect" );
        $( "#com_status" ).val( data.msg );
        myInterval = setInterval( function () { serailCmd( { cmd: "read" } ); }, 1000 );
    } else {
        $( "#btnConnect" ).html( "Connect" );
        $( "#com_status" ).val( data.msg );
        if ( myInterval != null ) {
            clearInterval( myInterval );
            myInterval = null;
        }
    }
}

function smartLightControl( option, value ) {
    let txcmd = {
        cmd: "write",
        data: {
            smartlight: {}
        }
    };
    txcmd.data.smartlight[ option ] = value;

    console.log( JSON.stringify( txcmd ) );
    serailCmd( txcmd );
}

function toggleLedControl( value ) {
    let txcmd = {
        cmd: "write",
        data: {
            led: { frequency: value }
        }
    };
    console.log( JSON.stringify( txcmd ) );
    serailCmd( txcmd );
}