var OnlineInterval = null;
var SaveInterval = null;

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
            headers: { 'x-auth': localStorage.getItem( "authToken" ) },
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
        headers: { 'x-auth': localStorage.getItem( "authToken" ) },
        contentType: 'application/json',
        data: JSON.stringify( data ),
        dataType: 'json'
    } ).done( cloudSuccess ).fail( cloudFailure );
}

function cloudFailure( jqXHR, textStatus, errorThrown ) {
    $( '#online_com_status' ).html( JSON.stringify( jqXHR, null, 2 ) );
}

const modes = { 0: "ac_off", 1: "ac_cool", 2: "ac_heat", 3: "ac_auto" };

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
                    SaveInterval = setInterval( function () {
                        savehthistory();
                    }, 10000 ); // simulated clock = 1 record 10 mins 
                }
            } else {
                msg = `Device disabled publish ${data.success ? "successful":"fail"}`;
                if ( data.success ) {
                    if ( OnlineInterval != null ) {
                        clearInterval( OnlineInterval );
                        OnlineInterval = null;
                        clearInterval( SaveInterval );
                        SaveInterval = null;
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

        } else if ( data.cmd === "write" ) {
            //console.log( data );
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

            if ( "temp" in data.subcmd ) {
                if ( data.success ) {
                    set_temp = data.subcmd.temp;
                    $( "#ac_set_temp" ).html( set_temp );
                } else {
                    alert( "A/C control is offline" );
                }
            }

            if ( "acmode" in data.subcmd ) {
                if ( !data.success ) {
                    alert( "A/C control is offline" );
                    $( "#ac_off" ).prop( "checked", true );
                } else {
                    $( "#" + modes[ data.subcmd.acmode ] ).prop( "checked", true );
                }
            }
        } else if ( data.cmd === "dayhist" ) {
            //console.log( data.message );
            hourchart.destroy();

            hourlabels = [];
            hourtemp = [];
            hourhum = [];
            hourpower = [];

            var filter = {};
            for ( var i = 0; i < data.message.length; i++ ) {
                try {
                    var label = moment( data.message[ i ].created_at.toString(), 'HH:mm A' ).format( 'h:mm a' );
                    if ( !filter[ label ] )
                        filter[ label ] = {}
                    filter[ label ][ "temp" ] = data.message[ i ].temperature;
                    filter[ label ][ "hum" ] = data.message[ i ].humidity;
                    filter[ label ][ "power" ] = data.message[ i ].power;
                } catch ( err ) {
                    continue;
                }
            }

            for ( var [ key, value ] of Object.entries( filter ) ) {
                //console.log( key, value );
                hourlabels.push( key );
                hourtemp.push( value[ "temp" ] );
                hourhum.push( value[ "hum" ] );
                hourpower.push( value[ "power" ] );
            }
            hourdata = {
                labels: hourlabels,
                datasets: [ {
                        label: 'Temperature',
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: hourtemp,
                    },
                    {
                        label: 'Humidity',
                        backgroundColor: 'rgb(54, 162, 235)',
                        borderColor: 'rgb(54, 162, 235)',
                        data: hourhum,
                    }, {
                        label: 'Power Used',
                        backgroundColor: 'rgb(255, 205, 86)',
                        borderColor: 'rgb(255, 205, 86)',
                        data: hourpower,
                    }
                ]
            };

            hourconfig = {
                type: 'line',
                data: hourdata,
                options: {}
            };

            hourchart = new Chart(
                $( '#hourhistory' ),
                hourconfig
            );

        } else if ( data.cmd === "weekhist" ) {
            //console.log( data.message );
            weekchart.destroy();
            daylabels = [];
            daytemp = [];
            dayhum = [];
            daypower = [];

            var filter = {};
            for ( var i = 0; i < data.message.length; i++ ) {
                try {
                    var label = moment( data.message[ i ].created_at.toString()).format( 'MM/DD' );
                    //console.log( label);
                    if ( !filter[ label ] )
                        filter[ label ] = {}
                    filter[ label ][ "temp" ] = data.message[ i ].temperature;
                    filter[ label ][ "hum" ] = data.message[ i ].humidity;
                    filter[ label ][ "power" ] = data.message[ i ].power;
                } catch ( err ) {
                    continue;
                }
            }

            

            for ( var [ key, value ] of Object.entries( filter ) ) {
                //console.log( key, value );
                daylabels.push( key );
                daytemp.push( value[ "temp" ] );
                dayhum.push( value[ "hum" ] );
                daypower.push( value[ "power" ] );
            }

            //console.log( daylabels, daytemp, dayhum, daypower );

            weekdata = {
                labels: daylabels,
                datasets: [ {
                        label: 'Temperature',
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: daytemp,
                    },
                    {
                        label: 'Humidity',
                        backgroundColor: 'rgb(54, 162, 235)',
                        borderColor: 'rgb(54, 162, 235)',
                        data: dayhum,
                    }, {
                        label: 'Power Used',
                        backgroundColor: 'rgb(255, 205, 86)',
                        borderColor: 'rgb(255, 205, 86)',
                        data: daypower,
                    }
                ]
            };

            //console.log(daylabels);

            dayconfig = {
                type: 'line',
                data: weekdata,
                options: {}
            };

            weekchart = new Chart(
                $( '#dayhistory' ),
                dayconfig
            );


        } else if ( data.cmd === "monthhist" ) {
            //console.log( data.message );
            monthchart.destroy();

            weeklabels = [];
            weektemp = [];
            weekhum = [];
            weekpower = [];

            var filter = {};
            for ( var i = 0; i < data.message.length; i++ ) {
                try {

                    var label = moment( data.message[ i ].created_at.toString()).format( 'MM/DD' );
                    if ( !filter[ label ] )
                        filter[ label ] = {}
                    filter[ label ][ "temp" ] = data.message[ i ].temperature;
                    filter[ label ][ "hum" ] = data.message[ i ].humidity;
                    filter[ label ][ "power" ] = data.message[ i ].power;
                } catch ( err ) {
                    continue;
                }
            }

            for ( var [ key, value ] of Object.entries( filter ) ) {
                //console.log( key, value );
                weeklabels.push( key );
                weektemp.push( value[ "temp" ] );
                weekhum.push( value[ "hum" ] );
                weekpower.push( value[ "power" ] );
            }

            weekdata = {
                labels: weeklabels,
                datasets: [ {
                        label: 'Temperature',
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: weektemp,
                    },
                    {
                        label: 'Humidity',
                        backgroundColor: 'rgb(54, 162, 235)',
                        borderColor: 'rgb(54, 162, 235)',
                        data: weekhum,
                    }, {
                        label: 'Power Used',
                        backgroundColor: 'rgb(255, 205, 86)',
                        borderColor: 'rgb(255, 205, 86)',
                        data: weekpower,
                    }
                ]
            };

            weekconfig = {
                type: 'line',
                data: weekdata,
                options: {}
            };

            monthchart = new Chart(
                $( '#monthhistory' ),
                weekconfig
            );
        }
        //else if ( data.cmd === "open" ) finishOpenClose( data );
        //else if ( data.cmd === "close" ) finishOpenClose( data );
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

function publish( value ) {
    try {
        let device = $( '#online_device_list' ).find( ":selected" ).val();
        device = JSON.parse( device );
        let txcmd = {
            cmd: "publish",
            deviceid: device.id,
            deviceapi: device.api,
            data: { "publish": value }
        }
        //console.log( JSON.stringify( txcmd ) );
        onlineCmd( txcmd );
    } catch ( err ) {
        console.log( err );
        alert( "No available device." );
        window.location = 'devices';
    }
}

function stoprecordhistory() {
    if ( SaveInterval != null ) {
        clearInterval( SaveInterval );
        SaveInterval = null;
        console.log( "Stop recording successfully" );
    } else {
        alert( "no recording event" );
    }
}

function smartLightControl( option, value ) {
    try {
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
    } catch ( err ) {
        //console.log( err );
        alert( "No available device." );
        window.location = 'devices';
    }

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

function savehthistory() {
    let data = {
        temperature: parseInt( $( '#Temperature_Farenheit' ).text() ),
        humidity: parseInt( $( '#humidity' ).text() ),
        power: parseInt( $( "#power_cons" ).text() ),
        created_at: moment( $( '#onlinesimulatedtime' ).text() ).toDate()
    }
    $.ajax( {
        url: '/history/save',
        method: 'POST',
        headers: { 'x-auth': localStorage.getItem( "authToken" ) },
        contentType: 'application/json',
        data: JSON.stringify( data ),
        dataType: 'json'
    } ).done( cloudSuccess ).fail( cloudFailure );
    console.log( "Saved a record " + data.created_at );
}

function pullhistory() {
    $.ajax( {
        url: '/history/dayhist',
        method: 'GET',
        headers: { 'x-auth': localStorage.getItem( "authToken" ) },
        contentType: 'application/json',
        dataType: 'json'
    } ).done( cloudSuccess ).fail( cloudFailure );
    $.ajax( {
        url: '/history/weekhist',
        method: 'GET',
        headers: { 'x-auth': localStorage.getItem( "authToken" ) },
        contentType: 'application/json',
        dataType: 'json'
    } ).done( cloudSuccess ).fail( cloudFailure );
    $.ajax( {
        url: '/history/monthhist',
        method: 'GET',
        headers: { 'x-auth': localStorage.getItem( "authToken" ) },
        contentType: 'application/json',
        dataType: 'json'
    } ).done( cloudSuccess ).fail( cloudFailure );
}