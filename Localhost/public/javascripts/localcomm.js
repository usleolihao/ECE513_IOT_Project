function serailCmd(data) {
    $.ajax({
        url: '/serial/' + data.cmd,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json'
    }).done(serailSuccess).fail(serialFailure);
}

const modes = { 0: "ac_off", 1: "ac_cool", 2: "ac_heat", 3: "ac_auto" };

function serailSuccess(data, textStatus, jqXHR) {
    if ("cmd" in data) {
        if (data.cmd === "scan") updateAvailableSerialList(data);
        else if (data.cmd === "open") finishOpenClose(data);
        else if (data.cmd === "close") finishOpenClose(data);
        else if (data.cmd === "write") {
            //console.log(data);
            if ("smartlight" in data.subcmd) {
                console.log(data);
                if (!data.success) {
                    //let res = JSON.parse(data.error.response.text);
                    $("#smartlightonoff").attr("src", led_off);
                    //alert(res.error);
                } else {
                    let light_icon = data.subcmd.smartlight.on ? led_on : led_off;
                    $("#smartlightonoff").attr("src", light_icon);
                }
            }

            if ("temp" in data.subcmd) {
                if (data.success) {
                    set_temp = data.subcmd.temp;
                    $("#ac_set_temp").html(set_temp);
                } else {
                    alert("A/C control is offline");
                }
            }

            if ("acmode" in data.subcmd) {
                if (!data.success) {
                    alert("A/C control is offline");
                    $("#ac_off").prop("checked", true);
                } else {
                    $("#" + modes[data.subcmd.acmode]).prop("checked", true);
                }
            }
        }

        if (data.cmd === "read") {
            let curStr = $('#rdData').html();
            curStr += JSON.stringify(data.data);
            $('#rdData').html(curStr);
            document.getElementById("rdData").scrollTop = document.getElementById("rdData").scrollHeight;
            // update GUI
            updateGUI(data.data);
        } else {
            $('#cmdStatusData').html(JSON.stringify(data, null, 2));
        }
    }
}

function serialFailure(jqXHR, textStatus, errorThrown) {
    $('#cmdStatusData').html(JSON.stringify(jqXHR, null, 2));
}

function updateAvailableSerialList(data) {
    if ("list" in data) {
        let curList = data.list;
        for (let newPort of curList) {
            $('#com_ports_list').append(`<option value="${newPort}">${newPort}</option>`);
        }
        if (curList.length == 1) {
            $("#com_ports_list option:eq(1)").prop("selected", true);
            connectDisconnect();
        }
    }
}

function connectDisconnect() {
    if ($("#btnConnect").text() == "Connect") {
        let selectedPort = $("#com_ports_list").val();
        if (selectedPort === "null") {
            window.alert("Please select your COM port");
            return;
        }
        serailCmd({ cmd: "open", path: selectedPort });
    } else {
        serailCmd({ cmd: "close" });
    }
}

function finishOpenClose(data) {
    if ($("#btnConnect").text() == "Connect") {
        $("#btnConnect").text("Disconnect");
        $("#com_status").val(data.msg);
        myInterval = setInterval(function() { serailCmd({ cmd: "read" }); }, 1000);
    } else {
        $("#btnConnect").html("Connect");
        $("#com_status").val(data.msg);
        if (myInterval != null) {
            clearInterval(myInterval);
            myInterval = null;
        }
    }
}

function smartLightControl(option, value) {
    let txcmd = {
        cmd: "write",
        data: {
            smartlight: {}
        }
    };
    txcmd.data.smartlight[option] = value;

    console.log(JSON.stringify(txcmd));
    serailCmd(txcmd);
}

function toggleLedControl(value) {
    let txcmd = {
        cmd: "write",
        data: {
            led: { frequency: value }
        }
    };
    console.log(JSON.stringify(txcmd));
    serailCmd(txcmd);
}