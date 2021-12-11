var myInterval = null;
var guiUpdated = false;
var datetime = null,
    date = null;

var update = function() {
    date = moment(new Date())
    datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(function() {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Initialize the GUI
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    initialPanelModules();
    //Local Communication
    initRangeSliders();
    serailCmd({ cmd: "scan" });
    initialLocalbtns();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // automatic update time by seconds
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    datetime = $('#curTimeReal')
    update();
    setInterval(update, 1000);

});

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

function initialLocalbtns() {
    $('#btnConnect').click(connectDisconnect);
}

function initRangeSliders() {
    var inputs = $('input[type="range"]');
    var ranges = {};
    for (var i = 0; i < inputs.length; i++) {
        var id = $(inputs[i]).attr("id");
        var $element = $('input[id=\"' + id + '\"]');
        $element
            .rangeslider({
                polyfill: false,
                onInit: function() {
                    ranges[id] = this.$range;
                    var $handle = $('.rangeslider__handle', this.$range);
                    updateHandle($handle[0], this.value);
                }
            })
            .on('input', function() {
                var $handle = $('.rangeslider__handle', ranges[this.id]);
                updateHandle($handle[0], this.value);
            });
    }

    function updateHandle(el, val) {
        el.textContent = val;
    }
}

function updateGUI( data ) {
    //console.log( data );
    if ( !guiUpdated ) {
        if ( "light" in data ) {
            if ( "L0" in data.light ) {
                let light_icon = data.light.L0 ? led_on : led_off;
                $( "#smartlightonoff" ).attr( "src", light_icon );
                //$( '#smartlightonoff' ).prop( "checked",  ).change();
            }
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

    //updated door senosr widget 2.0
    if ( "door_sensor" in data ) {
        if ( data.door_sensor > 500 ) $( '#doorstatus' ).html( "Open" );
        else $( '#doorstatus' ).html( "Close" );
    }
    // updated humidity widget 2.0
    if ( "Humidity" in data ) $( '#humidity' ).html( data.Humidity );
    // updated Temperature widget 2.0
    if ( "TemperatureF" in data ) $( '#Temperature_Farenheit' ).html( data.TemperatureF ? data.TemperatureF : "fail" );
    if ( "TemperatureC" in data ) $( '#Temperature_Celcius' ).html( data.TemperatureC ? data.TemperatureC : "fail" );
}