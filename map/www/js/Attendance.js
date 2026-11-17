var varType;
var varUrl;
var varData;
var varContentType;
var varDataType;
var varProcessData;

var isFaceAvailable = false;
var Latitude = 0.000000000;
var Longitude = 0.000000000;

//not in use
function FillActivityType() {
    varType = "POST";
    varUrl = getBaseUrl() + "wsttmapp.asmx/GetLeaveYearJson";
    varData = '{"pCompanyID": "1"}';
    varContentType = "application/json; charset=utf-8";
    varDataType = "json";
    varProcessData = true;
    $.ajax({
        type: varType, //GET or POST or PUT or DELETE verb
        url: varUrl, // Location of the service
        data: varData, //Data sent to server
        contentType: varContentType, // content type sent to server
        dataType: varDataType, //Expected data format from server
        processdata: varProcessData, //True or False
        success: function(result) {//On Successfull service call
            var ddlObject = document.getElementById("ddlLeaveYear");
            for (j = ddlObject.options.length - 1; j >= 0; j--) { ddlObject.remove(j); }
            var resultObject = null;
            if (varDataType == "json") {
                var json = JSON.parse(result.d);
                var opt = document.createElement("option");
                opt.value = 0;
                opt.text = '- Select -'; //resultObject[i];
                ddlObject.options.add(opt)
                jQuery.each(json, function(rec) {
                    var opt = document.createElement("option");
                    opt.value = this.TranID;
                    opt.text = this.LeaveYear; //resultObject[i];
                    ddlObject.options.add(opt)
                });
                //$("#ddlLeaveYear").chosen();
            }
        },
        error: OnWsError// When Service call fails
    });

}


// function OnWsError(result) {
//     alert('Service call failed: ' + varUrl + result.status + '' + result.statusText);
//     varType = null; varUrl = null; varData = null; varContentType = null; varDataType = null; varProcessData = null;
// }

//Click Event for btnSave------------------
$(function() {

    $("#btnSave").click(function() {
        if ($('#ddlActivityType').val() == -1) {
            //alert("Select Activity Type");
            toastr.error("Select Activity Type");
        }
        else {
            //alert("location 1 ");
            //navigator.geolocation.getCurrentPosition(locationsuccess, errorHandler, { enableHighAccuracy: true });
            if (checkIfGPSEnabled()) {
                var msg = "Your Device does not supports GeoLocation.";
                try {

                    EnableDisableButtonSpin($('#btnSave'), 'd', 'Submitting ');
                    var geoService = navigator.geolocation;
                    if (geoService) {
                        navigator.geolocation.getCurrentPosition(locationsuccess, errorHandler, { enableHighAccuracy: true });
                    } else {
                        document.getElementById("divcurrentlocation").innerHTML = msg;
                    }
                }
                catch (e) {
                    document.getElementById("divcurrentlocation").innerHTML = msg;
                    //alert(msg);
                }

            }
        }
    });
});

//Click Event for btnImage------------------
$(function() {
    $("#btnImage").click(function() {

        if ($('#ddlActivityType').val() == -1) {
            alert("Select Activity Type");
        }
        else {
            cameraTakePicture();

        }
    });
});

function cameraTakePicture() {
    var mycamera = navigator.camera;
    if (mycamera) {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
    } else {
        alert("Your Device does not supports Camera.");
    }



    function onSuccess(imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function locationsuccess(position) {
    //alert("position");
    // console.log('locationsuccess');

    getDateTimeFromServer(function(serverDateTime) {

        function isValidDate(d) { return d instanceof Date && !isNaN(d); }
        if (isValidDate(serverDateTime)) {
            serverDateTime = serverDateTime;
        } else {
            serverDateTime = new Date();
        }


        var $btnSave;
        $btnSave = $('#btnSave');
        //DisableButton($btnSave, 'Submitting...');
        //EnableDisableButtonSpin($btnSave, 'd', 'Submitting...');

        var _methodName = !IsWSUpd() ? 'SaveDeviceLog' : 'SaveDeviceLog_New';

        varType = "POST";
        varUrl = getBaseUrl() + "wsttmapp.asmx/" + _methodName;
        //varData = '{"Country": "USA"}';
        var secKey;
        Latitude = position.coords.latitude;
        Longitude = position.coords.longitude;
        var eid = getLocalStorageItem_Int('eid');
        //eid++;
        var cid = getLocalStorageItem_Int('cid');
        var uid = getLocalStorageItem_Int('uid');
        var ecode = getLocalStorageItem_String('ecode');
        secKey = getLocalStorageItem_String('secKey');
        var ActivityDate = '2017-11-09';

        var ActivityTime = '17:50:00';
        var WorkCode = 1;
        var ampm, hour, marker, min, newTime, aday, amonth, asec;
        ampm = $('.time').hasClass('ampm');
        newTime = new Date(serverDateTime);
        if (ampm) {
            hour = newTime.getHours() % 24;
            if (hour === 0) {
                //hour = 12;
            }

        } else {
            hour = newTime.getHours();
        }

        hour = hour < 10 ? ['0', hour.toString()].join('') : hour.toString();
        min = newTime.getMinutes() < 10 ? ['0', newTime.getMinutes()].join('') : newTime.getMinutes();
        asec = newTime.getSeconds() < 10 ? ['0', newTime.getSeconds()].join('') : newTime.getSeconds();

        aday = newTime.getDate() < 10 ? ['0', newTime.getDate()].join('') : newTime.getDate();
        amonth = (newTime.getMonth() + 1) < 10 ? ['0', (newTime.getMonth() + 1)].join('') : (newTime.getMonth() + 1);

        ActivityTime = hour + ':' + min + ':' + asec;
        ActivityDate = newTime.getFullYear() + '-' + amonth + '-' + aday;
        var DeviceID_ = localStorage.getItem('DeviceID');
        //alert('Activity Date :' + ActivityDate + ' Activity Time' + ActivityTime);
        if ((ecode != "") && (cid != "")) {
            varData = {
                pSecKey: secKey,
                pEmployeeID: eid,
                pUserID: uid,
                pEmployeeRefNo: ecode,
                pActivity: $('#ddlActivityType').val(),
                pActivityDate: ActivityDate,
                pActivityTime: ActivityTime,
                pWorkCode: WorkCode,
                pLatitude: Latitude,
                pLongitude: Longitude,
                pFileName: "",
                pDeviceID: DeviceID_, //1, //device.uuid,
                pCompanyID: cid
            };

            varData = JSON.stringify(varData);
            varContentType = "application/json; charset=utf-8";
            varDataType = "json";
            varProcessData = true;
            //alert(varData);

            $.ajax({
                type: varType, //GET or POST or PUT or DELETE verb
                url: varUrl, // Location of the service
                data: varData, //Data sent to server
                contentType: varContentType, // content type sent to server
                dataType: varDataType, //Expected data format from server
                processdata: varProcessData, //True or False
                success: function(result) {//On Successfull service call
                    var obj = JSON.parse(result.d);
                    if (!checkLoggedIn_parent(JSON.parse(result.d))) {
                        return;
                    }
                    obj = obj[Object.keys(obj)[0]];
                    if (obj.Status === 'False') {
                        toastr.error(obj.Message);
                    } else {
                        toastr.success(obj.Message);
                    }

                    EnableButton($btnSave, 'Submit');
                },
                error: function(err) {
                    OnWsError(err);
                    EnableButton($btnSave, 'Submit');
                }
            });
        }
        else {
            alert("Invalid Employee Code");
        }

    });

}

(function() {

    getDateTimeFromServer(function(serverDateTime) {

        function isValidDate(d) { return d instanceof Date && !isNaN(d); }
        if (isValidDate(serverDateTime)) {
            serverDateTime = serverDateTime;
        } else {
            serverDateTime = new Date();
        }

        var hideRightMenu, resize, rightMenu, scaleMode, time;

        scaleMode = 1;

        resize = function() {
            return $('.time').css('font-size', Math.min($('.time').width() / (scaleMode * 10), parseFloat($(window).height() * 0.75)));
        };

        time = function() {
            var ampm, hour, marker, min, newTime;
            ampm = $('.time').hasClass('ampm');
            newTime = new Date(serverDateTime);
            if (ampm) {
                hour = newTime.getHours() % 24;
                if (hour === 0) {
                    hour = '00';
                    //hour = 12;
                }

            } else {
                hour = newTime.getHours();
            }
            min = newTime.getMinutes() < 10 ? ['0', newTime.getMinutes()].join('') : newTime.getMinutes();
            $('.time').find('.hour').text(hour).end().find('.minutes').text(min).end().find('.divider').toggleClass('blink');
            $('.time').find('.curdate').text(newTime.toDateString());

        };
        time();

        $("#btnSave").attr('disabled', false);
        $("#btnSave").html('Submit');

        time.interval = setInterval(time, 1000);
        resize();
        $(window).on('resize orientationchange', resize).on('contextmenu', rightMenu).on('click', hideRightMenu);
        setTimeout((function() {
            return $('.note').slideUp();
        }), 15000);

    });
}).call(this);

function getDateTimeFromServer(callback) {
    try {
        $("#btnSave").attr('disabled', true);
        $("#btnSave").html(progress('Validating Datetime '));

        var params = { PID1: 'tblFilterCriteria', PID2: 'getDate()', PID3: 'top 1 getDate()', PID4: '', pCompanyID: 0 }
        postRequest('FillDropDownGeneric', params, function(r) {
            var serverDateTime = "";
            alert(r.d);
            r = JSON.parse(r.d);
            serverDateTime = getFormattedDateNew(r[0].Column1)
            serverDateTime = new Date(getFormattedTimeNew(r[0].Column1));
            callback(serverDateTime);
        }, function(err) {
            toastr.error('Something is wrong! Error in validating datetime.');
            $("#btnSave").attr('disabled', false);
            $("#btnSave").html('Submit');
        });

    } catch (error) {
        callback(new Date());
        //toastr.error(error.message);
    }
}


function findMyCurrentLocation() {
    try {
        var geoService = navigator.geolocation;
        //console.log('geoService : ',geoService);
        if (geoService) {
            navigator.geolocation.getCurrentPosition(showCurrentLocation, errorHandler, { enableHighAccuracy: true });
        } else {
            document.getElementById("divcurrentlocation").innerHTML = "Your Device does not supports GeoLocation.";
        }
    }
    catch (e) {
        document.getElementById("divcurrentlocation").innerHTML = "Your Device does not supports GeoLocation.";
    }
}

function showCurrentLocation(position) {
    var template = '';
    template += '<div><label>Current location : </label></div>';
    template += 'Latitude &nbsp;&nbsp;&nbsp; : &nbsp;&nbsp;' + position.coords.latitude + '<br>';
    template += 'Longitude : &nbsp;&nbsp;' + position.coords.longitude;
    //document.getElementById("divcurrentlocation").innerHTML = "Current location -->  Latitude : " + position.coords.latitude + " , Longitude : " + position.coords.longitude;
    document.getElementById("divcurrentlocation").innerHTML = template;
}

function errorHandler(error) {
    // console.log('error', error.code);

    EnableButton($('#btnSave'), 'Submit');

    switch (error.code) {
        case 1:
            document.getElementById("divcurrentlocation").innerHTML = "Your Device does not supports GeoLocation."
            break;
        case error.PERMISSION_DENIED:
            document.getElementById("divcurrentlocation").innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("divcurrentlocation").innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            document.getElementById("divcurrentlocation").innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("divcurrentlocation").innerHTML = "An unknown error occurred."
            break;
        default:
            document.getElementById("divcurrentlocation").innerHTML = "An unknown error occurred."
            break;
    }
    //document.getElementById("divcurrentlocation").innerHTML = "Error while retrieving current position. Error code: " + error.code + ",Message: " + error.message;
}


function checkIfGPSEnabled() {

    if (typeof cordova != 'undefined') {
        //var whichDevice = device.platform;
        //alert(whichDevice.toString().toLowerCase());
        cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {

            if (enabled == false) {
                toastr.info('Location is disabled! Please enable it.');
                //if ($('#ddlActivityType').val() > -1) {
                EnableButton($('#btnSave'), 'Submit');
                return false;
                //}
                // if (confirm('Enable Location ?')) {
                //     if (whichDevice.toString().toLowerCase() == 'ios') {
                //         cordova.plugins.diagnostic.switchToSettings();
                //     } else {
                //         cordova.plugins.diagnostic.switchToLocationSettings();
                //     }
                // } else {
                //     if ($('#ddlActivityType').val() > -1) {
                //         EnableButton($('#btnSave'), 'Submit');
                //     }
                // }
            } else {
                findMyCurrentLocation();
            }
        }, function(error) {
            findMyCurrentLocation();
        });

    } else {
        findMyCurrentLocation();
    }
    return true;


    // if (typeof cordova != 'undefined') {
    //     cordova.plugins.diagnostic.isGpsLocationEnabled(function (enabled) {
    //         if (enabled == false) {
    //             toastr.info('Location is disabled! Please enable it.');
    //             if (confirm('Enable Location ?')) {
    //                 cordova.plugins.diagnostic.switchToLocationSettings();
    //             } else {
    //                 if ($('#ddlActivityType').val() > -1) {
    //                     EnableButton($('#btnSave'), 'Submit');
    //                 }
    //             }
    //         } else {
    //             findMyCurrentLocation();
    //         }

    //     }, function (error) {

    //     });
    // } else {
    //     findMyCurrentLocation();
    // }

}

jQuery(function($) { //just like $(document).ready()
    //FillActivityType();
    findMyCurrentLocation();
    checkIfGPSEnabled();
});

