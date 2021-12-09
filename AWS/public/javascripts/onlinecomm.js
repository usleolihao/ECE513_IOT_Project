var OnlineInterval = null;


function updateAvailableDevicelList( data ) {
    for ( let device in data ) {
        let deviceid = data[ device ].deviceid;
        let deviceapi = data[ device ].deviceapi;
        let json = JSON.stringify( { id: deviceid, api: deviceapi } );
        let option = `<option id=device"${device}" value=${json}>ID:${deviceid}</option>`;
        $( '#online_device_list' ).append( option );
    }
    //console.log(data.length);
    if ( data.length == 1 ) {
        $( "#online_device_list option:eq(1)" ).prop( "selected", true );
    }

}


// list devices
function getOnlineDevices() {
    $.ajax( {
            url: '/device/list',
            method: 'GET',
            headers: { 'x-auth': window.localStorage.getItem( "authToken" ) },
            dataType: 'json'
        } ).done( function ( data, textStatus, jqXHR ) {
            // Add new device to the device list
            if ( data.success ) {
                //console.log( data.devices.devices );
                updateAvailableDevicelList( data.devices.devices );
            }
        } )
        .fail( function ( jqXHR, textStatus, errorThrown ) {
            let response = JSON.parse( jqXHR.responseJSON );
            errormsg( response.message );
        } );
}


function onlineCmd( data ) {
    const GETMETHOD = []
    ajaxMethod = 'POST';
    if ( GETMETHOD.includes( data.cmd ) ) {
        ajaxMethod = 'GET';
    }
    $.ajax( {
        url: '/cloud/' + data.cmd,
        method: ajaxMethod,
        contentType: 'application/json',
        headers: { 'x-auth': window.localStorage.getItem( "authToken" ) },
        data: JSON.stringify( data ),
        dataType: 'json'
    } ).done( cloudSuccess ).fail( cloudFailure );
}

function cloudFailure( jqXHR, textStatus, errorThrown ) {
    $( '#online_com_status' ).html( JSON.stringify( jqXHR, null, 2 ) );
}

function cloudSuccess( data, textStatus, jqXHR ) {

    if ( "cmd" in data ) {
        if ( data.cmd === "ping" ) {
            let msg = `Device is ${data.success && data.data.online ? "Online":"Offline"}`;
            $( '#online_com_status' ).html( msg );
        } else if ( data.cmd === "publish" ) {
            //console.log( data );
            let msg = "";
            if ( data.status ) {
                msg = `Device published ${data.success ? "successful":"fail"}`;
                if ( data.success ) {
                    OnlineInterval = setInterval( function () {
                        onlineCmd( { cmd: "read" } );
                    }, 1000 );
                }
            } else {
                msg = `Device disabled publish ${data.success ? "successful":"fail"}`;
                if ( data.success ) {
                    if ( OnlineInterval != null ) {
                        clearInterval( OnlineInterval );
                        OnlineInterval = null;
                    }
                }
            }

            $( '#online_com_status' ).html( msg );
        } else if ( data.cmd == "value" ) {
            //console.log( data );
            if ( data.success ) {
                $( '#online_com_status' ).html( "Read variable successfully." );
                updateGUI( data.data );
            } else {
                $( '#online_com_status' ).html( data );
            }

        }
        //else if ( data.cmd === "open" ) finishOpenClose( data );
        //else if ( data.cmd === "close" ) finishOpenClose( data );
        else if ( data.cmd === "read" ) {
            let curStr = $( '#rdData' ).html();
            curStr += JSON.stringify( data.data );
            $( '#rdData' ).html( curStr );
            document.getElementById( "rdData" ).scrollTop = document.getElementById( "rdData" ).scrollHeight;
            // update GUI
            updateGUI( data.data );
        } else if ( data.cmd === "write" ) {
            if ( "smartlight" in data.subcmd ) {
                //console.log( data );
                if ( !data.success ) {
                    let res = JSON.parse( data.error.response.text );
                    $( "#smartlightonoff" ).attr( "src", led_off );
                    alert( res.error );
                } else {
                    let light_icon = data.subcmd.smartlight.on ? led_on : led_off;
                    $( "#smartlightonoff" ).attr( "src", light_icon );
                }
            }
        } else {
            $( '#cmdStatusData' ).html( JSON.stringify( data, null, 2 ) );

        }
    }
}

function smartLightControl( option, value ) {
    let device = $( '#online_device_list' ).find( ":selected" ).val();
    device = JSON.parse( device );
    let txcmd = {
        cmd: "write",
        deviceid: device.id,
        deviceapi: device.api,
        data: {
            smartlight: {}
        }
    };
    txcmd.data.smartlight[ option ] = value;
    //console.log( JSON.stringify( txcmd ) );
    onlineCmd( txcmd );
}

function toggleLedControl( value ) {
    let device = $( '#online_device_list' ).find( ":selected" ).val();
    device = JSON.parse( device );
    let txcmd = {
        cmd: "write",
        deviceid: device.id,
        deviceapi: device.api,
        data: {
            led: { frequency: value }
        }
    };
    //console.log( JSON.stringify( txcmd ) );
    onlineCmd( txcmd );
}