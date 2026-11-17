
'use strict';

var varType;
var varUrl;
var varData;
var varContentType;
var varDataType;
var varProcessData;
var IsOpenFromKIOSK;
//var varBaseUrl;
//varBaseUrl = "http://localhost:3560/TimeTraxWeb/"
//Generic function to call AXMX/WCF  Service 
jQuery(function ($) { //just like $(document).ready()
    var scheduleDate, dateformat;

    dateformat = getLocalStorageItem_String('dateformat');
    scheduleDate = getParameterByName('sd');
    IsOpenFromKIOSK = getParameterByName('IsOpenFromKIOSK');

    if (IsOpenFromKIOSK == 1) {
        jQuery('.main-sidebar').hide();
        jQuery('.main-header').hide();
        jQuery('body').addClass('skin-blue fixed sidebar-mini sidebar-collapse');
        jQuery('footer').hide();
        jQuery('.content-wrapper').removeClass('content-wrapper');
        jQuery('.wrapper').css('background', '#fff');
        jQuery('.content').css('background', '#fff');
        jQuery('.shortcutpanel').hide();
        jQuery('.form-control').css({
            'padding': '6px',
            'font-size': '14px',
            'height': '32px'
        });
        jQuery('#txtDetail').css('height', '80px');
        jQuery('.control-label').css('color', '#666');


    }

    if (!isNull(scheduleDate) && scheduleDate.trim() !== '') {
        getAttendanceDetails(scheduleDate);
    }

    $('#datetimepicker6').datetimepicker({
        format: dateformat.toUpperCase(),
        ignoreReadonly: true
    });

    $('#datetimepicker7').datetimepicker({
        format: dateformat.toUpperCase(),
        ignoreReadonly: true
    });

    FillLeaveYear();
    FillLeavePortion();
});


function FillLeaveYear() {
    var eid, uid, ecode, secKey, cid;

    eid = getLocalStorageItem_Int('eid');
    uid = getLocalStorageItem_Int('uid');
    cid = getLocalStorageItem_Int('cid');
    ecode = getLocalStorageItem_String('ecode');
    secKey = getLocalStorageItem_String('secKey');
    varType = "POST";
    varUrl = getBaseUrl() + "wsttmapp.asmx/GetLeaveYearJson";

    varData = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: cid
    }
    varData = JSON.stringify(varData);

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
        success: function (result) {//On Successfull service call
            var ddlObject = document.getElementById("ddlLeaveYear");
            for (var j = ddlObject.options.length - 1; j >= 0; j--) { ddlObject.remove(j); }
            var resultObject = null;
            if (varDataType == "json") {
                var json = JSON.parse(result.d);
                checkLoggedIn(json);
                jQuery.each(json, function (rec) {
                    var opt = document.createElement("option");
                    opt.value = this.TranID;
                    opt.text = this.LeaveYear; //resultObject[i];
                    ddlObject.options.add(opt)

                    if (this.IsCurrentLeaveYear === true) {
                        ddlObject.value = this.TranID;
                    }
                });

                FillLeaveType();
            }
        },
        error: OnWsError// When Service call fails
    });

}

function FillLeaveType() {
    var baseurl, requestType, params, data, contentType, dataType, processdata, companyid, employeeid, year, yearID,
        uid, ecode, secKey;

    requestType = "POST";
    baseurl = getBaseUrl() + "wsttmapp.asmx/GetLeaveTypeJSON";
    contentType = "application/json; charset=utf-8";
    dataType = "json";

    companyid = getCompanyID();
    employeeid = getEmployeeID();
    uid = getLocalStorageItem_Int('uid');
    ecode = getLocalStorageItem_String('ecode');
    secKey = getLocalStorageItem_String('secKey');
    year = $("#ddlLeaveYear option:selected").text();
    yearID = $("#ddlLeaveYear").val();
    year = yearID === '0' ? yearID : year;

    data = {
        pSecKey: secKey,
        pEmployeeID: employeeid,
        pYear: year,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: companyid,
    };
    data = JSON.stringify(data);        //make it a json string
    processdata = true;

    $.ajax({
        type: requestType,
        url: baseurl, // Location of the service
        data: data, //Data sent to server
        contentType: contentType, // content type sent to server
        dataType: dataType, //Expected data format from server
        processdata: processdata, //True or False
        success: function (result) {//On Successfull service call
            //alert('aa');
            var ddlObject = document.getElementById("ddlleavetype");

            for (var j = ddlObject.options.length - 1; j >= 0; j--) { ddlObject.remove(j); }

            var resultObject = null;
            if (varDataType == "json") {
                var json = JSON.parse(result.d);
                checkLoggedIn(json);
                var opt = document.createElement("option");
                opt.value = 0;
                opt.text = '- Select -'; //resultObject[i];
                ddlObject.options.add(opt)
                jQuery.each(json, function (rec) {
                    var opt = document.createElement("option");
                    //alert(rec);
                    opt.value = this.LeaveID;
                    opt.text = this.LeaveTitle; //resultObject[i];
                    ddlObject.options.add(opt)
                });
                //$("#ddlLeaveYear").chosen();
            }
        },
        error: OnWsError// When Service call fails
    });

}

function FillLeaveBalance() {
    var type, url, data, contentType, dataType, processdata;
    var leaveID, leaveYear, companyID, employeeID, gradeID, requisitionDate, leaveTranID, isAmend, isApproved, formType,
        uid, ecode, secKey;

    leaveID = $('#ddlleavetype').val();
    leaveYear = $('#ddlLeaveYear option:selected').text();
    companyID = getLocalStorageItem_Int('cid');
    employeeID = getLocalStorageItem_Int('eid');
    //employeeID++;
    gradeID = getLocalStorageItem_Int('gid');
    uid = getLocalStorageItem_Int('uid');
    ecode = getLocalStorageItem_String('ecode');
    secKey = getLocalStorageItem_String('secKey');
    leaveTranID = 0;
    requisitionDate = DTHelper.GetFormattedDate(new Date(), 'YYYY-MM-DD');
    isAmend = "False";
    isApproved = "p";
    formType = "";

    varType = "POST";
    varUrl = getBaseUrl() + "wsttmapp.asmx/GetLeaveBalancebyYear";
    varData = {
        pSecKey: secKey,
        pEmployeeID: employeeID,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pGradeID: gradeID,
        pLeaveYear: leaveYear,
        pLeaveID: leaveID,
        pFromDate: requisitionDate,
        pIsAmend: isAmend,
        pLeaveTranID: leaveTranID,
        pIsApproved: isApproved,
        pCompanyID: companyID,
    };

    varData = JSON.stringify(varData);
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
        success: function (result) {//On Successfull service call
            var txtLeaveBalance = document.getElementById("txtLeaveBalance");
            var resultObject = null;
            if (varDataType == "json") {
                var json = JSON.parse(result.d);
                if (checkLoggedIn(json) === true) {
                    txtLeaveBalance.value = result.d;
                }
            }
        },
        error: OnWsError// When Service call fails
    });

}

function FillLeavePortion() {
    var type, url, data, contentType, dataType, processdata, companyID, languageID, ddlShortLeavePortion, result, opt,
        eid, uid, ecode, secKey;
    companyID = getCompanyID();
    languageID = getLanguageID();

    eid = getLocalStorageItem_Int('eid');
    uid = getLocalStorageItem_Int('uid');
    ecode = getLocalStorageItem_String('ecode');
    secKey = getLocalStorageItem_String('secKey');

    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetLeavePortionJSON";
    data = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: companyID,
        pLanguageID: languageID
    };
    data = JSON.stringify(data);
    contentType = "application/json; charset=utf-8";
    dataType = "json";
    processdata = true;

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: dataType,
        processdata: processdata,
        success: function (result) {
            ddlShortLeavePortion = document.getElementById("ddlShortLeavePortion");
            for (var j = ddlShortLeavePortion.options.length - 1; j >= 0; j--) { ddlShortLeavePortion.remove(j); }
            result = JSON.parse(result.d);
            checkLoggedIn(result);
            jQuery.each(result, function (rec) {
                opt = document.createElement("option");
                opt.value = this.LeaveQtyValue;
                opt.text = this.LeaveQtyText;
                ddlShortLeavePortion.options.add(opt)
            });
            ddlShortLeavePortion.value = "1";
        },
        error: OnWsError// When Service call fails
    });
}

// function OnWsError(result) {
//     alert('Service call failed: ' + varUrl + result.status + '' + result.statusText);
//     varType = null; varUrl = null; varData = null; varContentType = null; varDataType = null; varProcessData = null;
// }

function getAttendanceDetails(pDate) {

    var type, url, data, contentType, dataType, processdata, employeeID, companyID, ecode, uid, secKey, $btnSubmit;

    companyID = getLocalStorageItem_Int('cid');
    employeeID = getLocalStorageItem_Int('eid');
    uid = getLocalStorageItem_Int('uid');
    ecode = getLocalStorageItem_String('ecode');
    secKey = getLocalStorageItem_String('secKey');



    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetAttendanceDetailsJSON";
    data = {
        pSecKey: secKey,
        pEmployeeID: employeeID,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pDate: pDate,
        pCompanyID: companyID
    };
    data = JSON.stringify(data);
    contentType = "application/json; charset=utf-8";
    dataType = "json";
    processdata = true;

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: dataType,
        processdata: processdata,
        success: function (res) {
            DisplayData(res, pDate);
        },
        error: function (err) {
            OnWsError(err);
        }
    });


}

function DisplayData(res, pDate) {
    var obj, actualAttendance, inDate, outDate, scheduleInDate;
    obj = JSON.parse(res.d);
    checkLoggedIn(obj);

    if (Object.keys(obj).length > 0) {
        obj = obj[Object.keys(obj)[0]];
        inDate = new Date(obj._InDate);
        scheduleInDate = new Date(obj._ScheduleDate);
        // console.log(inDate.toLocaleDateString() !== new Date('1/1/1900 12:00:00 AM').toLocaleDateString(),inDate.toLocaleDateString() ,
        //     new Date('1/1/1900 12:00:00 AM').toLocaleDateString());
        if (inDate.toLocaleDateString() !== new Date('1/1/1900 12:00:00 AM').toLocaleDateString()) {
            $("#datetimepicker6").data('DateTimePicker').date(inDate);
            $("#datetimepicker7").data('DateTimePicker').date(new Date(obj._OutDate));
        }
        else {
            $("#datetimepicker6").data('DateTimePicker').date(scheduleInDate);
            $("#datetimepicker7").data('DateTimePicker').date(scheduleInDate);
        }
    } else {
        $("#datetimepicker6").data('DateTimePicker').date(pDate);
        $("#datetimepicker7").data('DateTimePicker').date(pDate);
    }
}

//Click Event for btnSave------------------
$(function () {
    $("#btnSave").click(function (e) {
        if (1 == 2) {
            //alert("No items selected...");            
        }
        else {
            var ecode, secKey, $btnSave, leaveType, description, fromDate, toDate;
            $btnSave = $('#' + e.target.id);


            varType = "POST";
            varUrl = getBaseUrl() + "wsttmapp.asmx/SaveLeaveMobileJson";
            //varData = '{"Country": "USA"}';
            var eid = localStorage.getItem('eid');
            var cid = localStorage.getItem('cid');
            var uid = localStorage.getItem('uid');
            //eid++;
            ecode = getLocalStorageItem_String('ecode');
            secKey = getLocalStorageItem_String('secKey');

            leaveType = $('#ddlleavetype').val();
            description = $('#txtDetail').val();
            fromDate = $('#txtFromDate').val();
            toDate = $('#txtToDate').val();

            if (!validateFields(leaveType, description, fromDate, toDate)) {
                return;
            }

            DisableButton($btnSave, 'Submitting...');
            varData = '{"pSecKey" : "' + secKey +
                '","pEmployeeID": "' + eid +
                '","pEmployeeRefNo" : "' + ecode +
                '" , "pLeaveYear": "' + $('#ddlLeaveYear option:selected').html() +
                '" , "pLeaveID": "' + $('#ddlleavetype').val() +
                '" , "pFromDate": "' + $('#txtFromDate').val() +
                '" , "pToDate": "' + $('#txtToDate').val() +
                '" , "pDetail": "' + $('#txtDetail').val() +
                '" , "pCompanyID": "' + cid +
                '" , "pIsShortLeave": "' + $('#ddlShortLeave').val() +
                '" , "pUserID": "' + uid +
                '" , "pLeaveFor": "' + $('#ddlShortLeaveFor').val() +
                '" , "pShortLeavePortion": "' + $('#ddlShortLeavePortion').val() + '"}';

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
                success: function (result) {//On Successfull service call
                    //var isObj = false;
                    if (isJSONString(result.d)) {
                        checkLoggedIn(JSON.parse(result.d));
                    }
                    else {
                        //alert(result.d);
                        toastr.info(result.d);
                    }
                    EnableButton($btnSave, 'Submit');
                },
                error: function (err) {
                    OnWsError(err);
                    EnableButton($btnSave, 'Submit');
                }
            });

        }
    });
});

function validateFields(pLeaveType, pDescription, pFromDate, pToDate) {
    var msg = "", result;

    msg += pLeaveType.trim() === "0" ? "- Leave Type <br>" : "";
    msg += pDescription.trim() === "" ? "- Description <br>" : "";
    msg += pFromDate.trim() === "" ? "- Start of Duration <br>" : "";
    msg += pToDate.trim() === "" ? "- End of Duration <br>" : "";

    if (msg.trim() !== "") {
        msg = "Please fill the following fields <br>" + msg;
        //alert(msg);
        toastr.error(msg);
    }

    return msg.trim() === "";
}

//Change Event for ddlleaveyear------------------
$(function () {
    $("#ddlLeaveYear").change(function () {
        FillLeaveType();
    });
});

//Change Event for ddlleavetype------------------
$(function () {
    $("#ddlleavetype").change(function () {
        FillLeaveBalance();
    });
});

//Change Event for ddlShortLeave------------------
$(function () {
    $("#ddlShortLeave").change(function () {
        var minValue;
        var ddlShortLeave = document.getElementById("ddlShortLeave");
        // var ddlShortLeavePortion = document.getElementById("ddlShortLeavePortion");
        var ddlShortLeavePortion = $("#ddlShortLeavePortion");
        var ddlShortLeaveFor = document.getElementById("ddlShortLeaveFor");
        if (ddlShortLeave.value == 1) {
            //ddlShortLeavePortion.disabled = false
            ddlShortLeavePortion.prop('disabled', false);
            ddlShortLeaveFor.disabled = false

            for (var j = ddlShortLeaveFor.options.length - 1; j >= 0; j--) { ddlShortLeaveFor.remove(j); }

            var opt = document.createElement("option");
            opt.value = "M";
            opt.text = "1st Half"; //resultObject[i];
            ddlShortLeaveFor.options.add(opt)

            opt = document.createElement("option");
            opt.value = "E";
            opt.text = "2nd Half"; //resultObject[i];
            ddlShortLeaveFor.options.add(opt)

            ddlShortLeaveFor.value = "M"

            //ddlShortLeavePortion.value = "0.5";            
            var options = ddlShortLeavePortion.children('option');
            ddlShortLeavePortion.children('option[value="1"]').remove();
            ddlShortLeavePortion.val(options[0].value);
        }
        else {
            //ddlShortLeavePortion.disabled = true
            ddlShortLeavePortion.prop('disabled', true);
            ddlShortLeaveFor.disabled = true
            //ValidatorEnable(document.getElementById('<%=val_Shortleave.ClientID%>'), false);

            var opt = document.createElement("option");
            opt.value = "F";
            opt.text = "Whole Day"; //resultObject[i];
            ddlShortLeaveFor.options.add(opt)

            // opt = document.createElement("option");
            // opt.value = "1";
            // opt.text = "1"; //resultObject[i];
            // ddlShortLeavePortion.options.add(opt)

            ddlShortLeaveFor.value = "F"
            //ddlShortLeavePortion.value = "1"
            $("<option></option>").val('1').html('1').appendTo(ddlShortLeavePortion);
            ddlShortLeavePortion.val('1');
        }


    });
});


