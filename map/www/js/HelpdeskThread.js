'use strict';

var varType;
var varUrl;
var varData;
var varContentType;
var varDataType;
var varProcessData;

var eid, uid, ecode, secKey, cid, lid, ename;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');

var lblComplainRefNo = $("#lblComplainRefNo");
var lblRequestType = $("#lblRequestType");
var lblCustomer = $("#lblCustomer");
var lblProject = $("#lblProject");
var lblNature = $("#lblNature");
var lblSummary = $("#lblSummary");
var lblDescription = $("#lblDescription");

var ddlFromUser = $("#ddlFromUser");
var ddlStatus = $("#ddlStatus");
var txtdesctiption = $("#txtdesctiption");

var _complainID;


$(function ($) { //just like $(document).ready()
    var scheduleDate, dateformat;

    //console.log($("footer").innerHeight());

    _complainID = getParameterByName('cpid');

    init();
    var footerHeight = $('.navbar-fixed-bottom').innerHeight();
    $('.fixedinput').css('bottom', footerHeight * 3);

});


function init() {
    fillHelpDeskInfo();
    fillStatus();
    fillEmployees();
    getComplainDetails();

    //$(".addonbordertxt").attr('readonly', true);


    $("#areaFromUser").hide();
    $("#areaStatus").hide();
    $("#areaComments").hide();



    $("#iconfromuser").click(function () {
        var length = $('#ddlFromUser > option').length;
        $("#ddlFromUser").attr('size', length);
        $("#areaFromUser").slideToggle();
        $("#areaStatus").hide();
        $("#areaComments").hide();
    });

    $("#iconstatus").click(function () {
        var length = $('#ddlStatus > option').length;
        $("#ddlStatus").attr('size', length);
        $("#areaStatus").slideToggle();
        $("#areaFromUser").hide();
        $("#areaComments").hide();

    });

    $("#iconcomment").click(function () {
        $("#areaComments").slideToggle();
        $("#areaFromUser").hide();
        $("#areaStatus").hide();
        $(".note-editable").focus();
    });

    $("#iconupload").click(function () {
        $("#areaComments").slideToggle();
        $("#areaFromUser").hide();
        $("#areaStatus").hide();
        $(".note-editable").focus();

    });
}

function fillHelpDeskInfo() {
    var Type, Url, Data, ContentType, DataType, ProcessData;
    _complainID = getParameterByName('cpid');
    Type = "POST";
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    Url = getBaseUrl() + "wsttmapp.asmx/GetComplainDataByComplainID";
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: cid,
        pComplainID: _complainID
    }

    params = JSON.stringify(params);

    $.ajax({
        type: Type, //GET or POST or PUT or DELETE verb
        url: Url, // Location of the service
        data: params, //Data sent to server
        contentType: ContentType, // content type sent to server
        dataType: DataType, //Expected data format from server
        processdata: ProcessData, //True or False
        success: function (result) {//On Successfull service call

            var json = JSON.parse(result.d);
            if (!isNull(json)) {
                //console.log(json);
                lblComplainRefNo.html(json[0].ComplainRefNo);
                lblRequestType.html(json[0].RequestType);
                lblCustomer.html(json[0].CustomerTitle);
                lblProject.html(json[0].ProjectTitle);
                lblNature.html(json[0].ComplainNatureTitle);
                lblSummary.html(json[0].ComplainSummary);
                lblDescription.html(json[0].Description);
            } else {
                toastr.error('something is wrong!');
            }
        },
        error: OnWsError// When Service call fails
    });

}


function getComplainDetails() {
    $("#comentsdtl").html('<div style="text-align:center;color:#F5770B;"><i class="fa fa-spinner fa-spin" style="font-size:24px;text-align:center;"></i><div></div></div>');
    var Type, Url, Data, ContentType, DataType, ProcessData;
    _complainID = getParameterByName('cpid');
    Type = "POST";
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    Url = getBaseUrl() + "wsttmapp.asmx/GetComplainDetailComplainID";
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: cid,
        pComplainID: _complainID
    }

    params = JSON.stringify(params);

    $.ajax({
        type: Type, //GET or POST or PUT or DELETE verb
        url: Url, // Location of the service
        data: params, //Data sent to server
        contentType: ContentType, // content type sent to server
        dataType: DataType, //Expected data format from server
        processdata: ProcessData, //True or False
        success: function (result) {//On Successfull service call

            var d = JSON.parse(result.d);
            var FileURL = ''; //'<div class="pull-right"><span>No Attachment!</span></div>'
            //console.log(d);
            var html = '';
            if (d.length > 0) {

                $.each(d, function (i) {
                    var FileURL = ''; //'<div class="pull-right"><span>No Attachment!</span></div>'
                    if (d[i].FileURL !== '') {
                        FileURL = '<div class="pull-right"><i class="fa fa-paperclip"></i> <a href="' + getBaseUrl() + 'CMSFiles/' + d[i].FileURL + '"> View Attachment</a></div>'; // getBaseUrl() + 'CMSFiles/' + d[i].FileURL;
                    }
                    var dt = getDateByASPNETTimeStamp(d[i].StatusDate);
                    var dateformat = getLocalStorageItem_String('dateformat');
                    var timeformat = getLocalStorageItem_String('timeformat');
                    var ctime = DTHelper.GetFormattedTime(dt, timeformat);
                    dt = DTHelper.GetFormattedDate(dt, dateformat)
                    html += '<div class="direct-chat-msg">' +
                        '<div class="direct-chat-info clearfix">' +
                        '<span class="direct-chat-name pull-left">' + d[i].EmployeeName + '</span>' +
                        '<span class="direct-chat-timestamp pull-right">' + d[i].ComplainStatusTitle + '</span>' +
                        '</div>' +
                        '<img class="direct-chat-img" src="img/avatar.png" alt="message user image">' +
                        '<div class="direct-chat-text">' + d[i].Description + '</span>' +
                        FileURL +
                        '</div>' +
                        '<div class="direct-chat-info clearfix">' +
                        '<span class="direct-chat-timestamp pull-right">' + dt + '-' + ctime + '</span>' +
                        '</div>' +
                        '</div>';
                });
            } else {
                html = '<span style="">Thread not started yet!</span>';
            }

            $("#comentsdtl").html(html);


        },
        error: OnWsError// When Service call fails
    });

}

function fillStatus() {
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        PID1: 'tblComplainStatus',
        PID2: 'ComplainStatusTitle',
        PID3: 'ComplainStatusID',
        pCompanyID: cid,
        PID4: ''
    }
    var ddlStatus = document.getElementById("ddlStatus");
    fillDropDownGeneric(params, ddlStatus, true, 0);
}

function fillEmployees() {

    var Type, Url, Data, ContentType, DataType, ProcessData;
    Type = "POST";
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    Url = getBaseUrl() + "wsttmapp.asmx/GetDataForApproverCriteria";

    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: cid,
    }

    params = JSON.stringify(params);

    $.ajax({
        type: Type, //GET or POST or PUT or DELETE verb
        url: Url, // Location of the service
        data: params, //Data sent to server
        contentType: ContentType, // content type sent to server
        dataType: DataType, //Expected data format from server
        processdata: ProcessData, //True or False
        success: function (result) {//On Successfull service call

            var json = JSON.parse(result.d);
            checkLoggedIn(json);
            var ddlFromUser = document.getElementById("ddlFromUser");
            // console.log(json);
            _fillDropDown(json, ddlFromUser, 'EmployeeID', 'EmployeeData', true);
            $("#ddlFromUser").val(eid);
            $("#ddlFromUser").prop('disabled', 'disabled');

        },
        error: OnWsError// When Service call fails
    });


}

function afterfillDropDownGenericSuccess() {

}


$("#btnSave").click(function (e) {
    if (!validate()) { return; } //Validation 
    enabledisablesave('d');
    performSaving();



});

function enabledisablesave(_type) {
    if (_type === 'e') {
        $('#btnSave').removeClass('fa-paper-plane fa-spin');
        $('#btnSave').addClass('fa-spinner fa-spin');
        $("#btnSave").css("pointer-events", "none");
    } else if (_type === 'd') {
        $('#btnSave').removeClass('fa-paper-plane fa-spin');
        $('#btnSave').addClass('fa-spinner fa-spin');
        $("#btnSave").css("pointer-events", "none");
    }
}

function performSaving() {

    try {
        var isSuccess = false;
        var Type, Url, Data, ContentType, DataType, ProcessData;
        Type = "POST";
        ContentType = "application/json; charset=utf-8";
        DataType = "json";
        ProcessData = true;
        Url = getBaseUrl() + "wsttmapp.asmx/SaveComplainDetail";


        Data = {
            pSecKey: secKey,
            pEmployeeID: eid,
            pEmployeeRefNo: ecode,
            pUserID: uid,
            pCompanyID: cid,
            pComplainID: _complainID,
            pFromUser: ddlFromUser.val().trim(),
            pComplainStatusID: ddlStatus.val().trim(),
            pStatusDate: sysdate,
            pDescription: txtdesctiption.val()

        }

        Data = JSON.stringify(Data);

        $.ajax({
            type: Type, //GET or POST or PUT or DELETE verb
            url: Url, // Location of the service
            data: Data, //Data sent to server
            contentType: ContentType, // content type sent to server
            dataType: DataType, //Expected data format from server
            processdata: ProcessData, //True or False
            success: function (result) {//On Successfull service call
                if (result.d === "success") {
                    window.location.replace('HelpdeskList.html?populateList=true&showMsg=true');
                } else {
                    enabledisablesave('e');
                }

            },
            error: OnWsError,// When Service call fails
            failure: function (res) {
                // alert('Transaction saved fail!');
                toastr.error('Transaction saved fail!');
                clearForm();
                enabledisablesave('e');
            }
        });

    } catch (error) {
        toastr.error('Transaction saved fail!');
        clearForm();
        enabledisablesave('e');
    }



}


function validate() {


    if (isNull(ddlFromUser.val().trim()) || ddlFromUser.val() === "0") {
        var length = $('#ddlFromUser > option').length;
        $("#ddlFromUser").attr('size', length);
        $("#areaFromUser").slideToggle();
        return false;
    }
    if (isNull(ddlStatus.val().trim()) || ddlStatus.val() === "0") {
        var length = $('#ddlStatus > option').length;
        $("#ddlStatus").attr('size', length);
        $("#areaStatus").slideToggle();
        return false;
    }

    if (isNull(txtdesctiption.val().trim()) || txtdesctiption.val() === '') {
        $("#areaComments").slideToggle();
        return false;
    }

    if (txtdesctiption.val().length > 4194304) { // 4MB
        //console.log(txtdesctiption.val().length);
        toastr.error('Maximun limit reached! (4MB) , (Description)');
        $("#areaComments").fadeIn();
        return false;
    }

    return true;

}

// ddl change events
$("#areaFromUser").change(function () {
    $("#areaFromUser").fadeOut();

    var ddlStatus = $("#ddlStatus");
    if (ddlStatus.val() <= 0) {
        var length = $('#ddlStatus > option').length;
        $("#ddlStatus").attr('size', length);
        $("#areaStatus").slideToggle();
    }
});

$("#areaStatus").change(function () {
    $("#areaStatus").fadeOut();
    var ddlFromUser = $("#ddlFromUser");
    if (txtdesctiption.val() === '') {
        $("#areaComments").slideToggle();
        $(".note-editable").focus();
    }
});

// $(document).ajaxStart(function(){
//     $("#wait").css("display", "block");
//   });

//   $(document).ajaxComplete(function(){
//     $("#wait").css("display", "none");
//   });


// var btm = 5 + 0.313;
// $('.fixedinput').css('bottom', ''+btm+'%');









