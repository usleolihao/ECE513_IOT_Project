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
        data: JSON.stringify( data ),
        dataType: 'json'
    } ).done( cloudSuccess ).fail( cloudFailure );
}

function cloudSuccess( data, textStatus, jqXHR ) {

    if ( "cmd" in data ) {
        if ( data.cmd === "ping" ) {
            let msg = `Device is ${data.success && data.data.online ? "Online":"Offline"}`;
            $( '#online_com_status' ).html( msg );
        } else if ( data.cmd === "publish" ) {
            let msg = `Device published ${data.success ? "successful":"fail"}`;
            $( '#online_com_status' ).html( msg );
        }
        //else if ( data.cmd === "open" ) finishOpenClose( data );
        //else if ( data.cmd === "close" ) finishOpenClose( data );
        else if ( data.cmd === "read" ) {
            let curStr = $( '#rdData' ).html();
            curStr += JSON.stringify( data.data );
            $( '#rdData' ).html( curStr );
            document.getElementById( "rdData" ).scrollTop = document.getElementById( "rdData" ).scrollHeight;
            // update GUI
            //updateGUI( data.data );
        } else {
            $( '#online_com_status' ).html( JSON.stringify( data, null, 2 ) );
        }
    }
}


function cloudFailure( jqXHR, textStatus, errorThrown ) {
    $( '#online_com_status' ).html( JSON.stringify( jqXHR, null, 2 ) );
}