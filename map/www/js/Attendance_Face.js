var varType;
var varUrl;
var varData;
var varContentType;
var varDataType;
var varProcessData;

var isFaceAvailable = false;
var Latitude = 1;
var Longitude = 1;
//var varBaseUrl;
//varBaseUrl = "http://localhost:3560/TimeTraxWeb/"
//Generic function to call AXMX/WCF  Service        
function CallService() {
    $.ajax({
        type: varType, //GET or POST or PUT or DELETE verb
        url: varUrl, // Location of the service
        data: varData, //Data sent to server
        contentType: varContentType, // content type sent to server
        dataType: varDataType, //Expected data format from server
        processdata: varProcessData, //True or False
        success: function(result) {//On Successfull service call
            LeaveTypeSuccess(result);
        },
        error: OnWsError// When Service call fails
    });
}



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

//page not in use
//method not in use
function OnWsError(result) {
    alert('Service call failed: ' + varUrl + result.status + '' + result.statusText);
    varType = null; varUrl = null; varData = null; varContentType = null; varDataType = null; varProcessData = null;
}


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//Click Event for btnSave------------------
$(function() {
    $("#btnSave").click(function() {
        if ($('#ddlActivityType').val() == 0) {
            alert("Select Activity Type");
        }
        else {
            navigator.geolocation.getCurrentPosition(locationsuccess, errorHandler, { enableHighAccuracy: true });
        }
    });
});

function locationsuccess(position) {
    //alert("position");
    varType = "POST";
    varUrl = getBaseUrl() + "wsttmapp.asmx/SaveDeviceLog";
    //varData = '{"Country": "USA"}';

    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;
    var empcode = getParameterByName("ecode");
    var compid = getParameterByName("cid");
    var ActivityDate = '1900-01-01';
    var ActivityTime = '00:00:00';
    var WorkCode = 1;

    if ((empcode != "") && (compid != "")) {
        varData = '{"pEmployeeCode": "' + empcode + '" , "pActivity": "' + $('#ddlActivityType').val() + '" , "pActivityDate": "' + ActivityDate + '" , "pActivityTime": "' + ActivityTime + '" , "pWorkCode": "' + WorkCode + '" , "pLatitude": "' + Latitude + '" , "pLongitude": "' + Longitude + '" , "pFileName": "" , "pCompanyID": "' + compid + '"}';

        //alert(varData);
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
                if (result.d == "True") {
                    alert("Attendance Saved Successfully");
                }
            },
            error: OnWsError// When Service call fails
        });
    }
    else {
        alert("Invalid Employee Code");
    }

}



(function() {
    var hideRightMenu, resize, rightMenu, scaleMode, time;

    scaleMode = 1;

    resize = function() {
        return $('.time').css('font-size', Math.min($('.time').width() / (scaleMode * 10), parseFloat($(window).height() * 0.75)));
    };

    time = function() {
        var ampm, hour, marker, min, newTime;
        ampm = $('.time').hasClass('ampm');
        newTime = new Date();
        if (ampm) {
            hour = newTime.getHours() % 24;
            if (hour === 0) {
                hour = 12;
            }

        } else {            
            hour = newTime.getHours();
        }
        min = newTime.getMinutes() < 10 ? ['0', newTime.getMinutes()].join('') : newTime.getMinutes();
        $('.time').find('.hour').text(hour).end().find('.minutes').text(min).end().find('.divider').toggleClass('blink');
        $('.time').find('.curdate').text(newTime.toDateString());

    };
    time();
    time.interval = setInterval(time, 1000);
    resize();
    $(window).on('resize orientationchange', resize).on('contextmenu', rightMenu).on('click', hideRightMenu);
    setTimeout((function() {
        return $('.note').slideUp();
    }), 15000);
}).call(this);


function findMyCurrentLocation() {
    var geoService = navigator.geolocation;
    if (geoService) {
        navigator.geolocation.getCurrentPosition(showCurrentLocation, errorHandler, { enableHighAccuracy: true });
    } else {
        document.getElementById("divcurrentlocation").innerHTML = "Your Device does not support GeoLocation.";
    }
}

function showCurrentLocation(position) {
    document.getElementById("divcurrentlocation").innerHTML = "Current location -->  Latitude : " + position.coords.latitude + " , Longitude : " + position.coords.longitude;
}

function errorHandler(error) {
    document.getElementById("divcurrentlocation").innerHTML = "Error while retrieving current position. Error code: " + error.code + ",Message: " + error.message;
}

$(function() {

});

jQuery(function($) { //just like $(document).ready()
    //FillActivityType();
    findMyCurrentLocation();
});

