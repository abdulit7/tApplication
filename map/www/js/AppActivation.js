var varUrl;
var varUUID;
//add event listener
document.addEventListener("deviceready", onDeviceReady, false);

//device.name -> Gives the name of device.
//device.cordova -> Gives current version of cordova running on device.
//device.platrof -> Gives the name of platform.
//device.uuid -> Gives the UUID.
//device.version -> Gives the Android Version.

function onDeviceReady() {
    try {

        if (window.localStorage != null) {
            //alert("local storage is enable");

            var isregister = localStorage.getItem('isregister');

            if (isregister != "undefined" && isregister != null) {

                if (isregister == 'Y') {
                    document.location.href = "login.html";
                }

            }
            else {
                //var element = document.getElementById('divdid');
                //element.innerHTML = '<p>' + device.uuid + '</p>';
                
            }
        }


    } catch (e) {

        var element1 = document.getElementById('divdid');
        element1.innerHTML = '<p>' + e + '</p>';
    }

}

//Click Event for btnSave------------------
$(function () {
    if (window.localStorage != null) {
        var isregister = localStorage.getItem('isregister');
        if (isregister != "undefined" && isregister != null) {
            if (isregister == 'Y') {
                document.location.href = "login.html";
            }

        }
    }
    $('#activationForm').on('submit', saveActivation);

    
});

function saveActivation(e) {
    //alert('test');
    e.preventDefault();
    var isregister = localStorage.getItem('isregister');
    if (isregister != "undefined" && isregister != null) {
        if (isregister == 'Y') {
            document.location.href = "login.html";
        }

    }
    else {

       
        var varType;
        var varData;
        var varContentType;
        var varDataType;
        var varProcessData;
        var varBaseUrl1, deviceID, deviceOS, deviceVersion,$diverror,log;

        $diverror = $('#diverror');
        log = "";

        //TODO : Rollback for production mode
        varBaseUrl1 = "http://ttappactivation.efrotech.com/"//http://localhost:3560/TimeTraxWeb/
        //varBaseUrl1 = "http://localhost:3550/TimeTraxWeb/"

        varType = "POST";
        varUrl = varBaseUrl1 + "wsttactivate.asmx/ttAppActivate";

        //TODO : Rollback for production mode
        deviceID = device.uuid;
        deviceOS= device.platform;
        deviceVersion = device.version;
    //    deviceID = "1";
    //    deviceOS = "Windows";
    //    deviceVersion = "7";

        varData = {
            pFSecKey: '+Imw91aCSvXvCq9RdpwYjw==',
            pDeviceID: deviceID,
            pDeviceOS: deviceOS,
            pDeviceVersion: deviceVersion,
            pFullName: $('#txtName').val(),
            pEmail: $('#txtEmail').val(),
            pAKey: $('#txtAKey').val()
        };
        varData = JSON.stringify(varData);        
        
        varContentType = "application/json; charset=utf-8";
        varDataType = "json";
        varProcessData = true;

        //Logging-----
        log += "Making request to the server <br/>";
        $diverror.html(log);
        //------------

        $.ajax({
            type: varType, //GET or POST or PUT or DELETE verb
            url: varUrl, //Location of the service
            data: varData, //Data sent to server
            contentType: varContentType, //content type sent to server
            dataType: varDataType, //Expected data format from server
            processdata: varProcessData, //True or False
            success: function(result) {//On Successfull service call
                //Logging-----
                log += "Request successfull <br/>";
                $diverror.html(log);
                //------------

                var obj = JSON.parse(result.d);
                obj = obj[Object.keys(obj)[0]];
                if (obj.AKey !== "") {
                    //Logging-----
                    log += "Saving data in local storage <br/>";
                    $diverror.html(log);
                    //------------
                    localStorage.setItem('isregister', 'Y');
                    localStorage.setItem('DeviceID', obj.DeviceID);
                    localStorage.setItem('AKey', obj.AKey);

                    //Logging-----
                    log += "Data saved in local storage <br/>";
                    $diverror.html(log);
                    //------------

                    //TODO : Rollback for production mode
                    document.location.href = "login.html";

                    alert(obj.Message);
                }
                else {
                    //Logging-----
                    log += "Error in data returned from the server <br/>";
                    $diverror.html(log);
                    //------------
                    document.getElementById("diverror").innerHTML = "<p>" + obj.Message + "</p>";
                }
            },
            error: function(err){
                //Logging-----
                log += "Error occured while making request to the server <br/>";
                $diverror.html(log);
                //------------

                OnWsError(err);
            } //When Service call fails
        });
    }

}

// function OnWsError(result) {
//     alert('Service call failed: ' + varUrl + result.status + '' + result.statusText);
//     varType = null; varUrl = null; varData = null; varContentType = null; varDataType = null; varProcessData = null;
// }