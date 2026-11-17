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

var lblTraining = $("#lblTraining");
var lblDates = $("#lblDates");
var lblTrainer = $("#lblTrainer");
var lblContent = $("#lblContent");
var lblVenue = $("#lblVenue");

var txtRemarks = $("#txtRemarks");



var _TrainingID;


$(function ($) { //just like $(document).ready()
    var scheduleDate, dateformat;

    init();

});


function init() {
    fillTrainingInfo();
    getTrainingAttachement();
}


function fillTrainingInfo() {

    var Type, Url, Data, ContentType, DataType, ProcessData;
    _TrainingID = getParameterByName('trainingid');
    Type = "POST";
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    Url = getBaseUrl() + "wsttmapp.asmx/GetAvailableTraining";
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: cid,
        pTrainingID: _TrainingID
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

                var FromDate = getDateByASPNETTimeStamp(json[0].FromDate);
                var ToDate = getDateByASPNETTimeStamp(json[0].ToDate);
                var dateformat = getLocalStorageItem_String('dateformat');
                FromDate = DTHelper.GetFormattedDate(FromDate, dateformat)
                ToDate = DTHelper.GetFormattedDate(ToDate, dateformat)
                var _Dates = FromDate + ' - ' + ToDate
                lblTraining.html(json[0].TrainingTitle);
                lblDates.html(_Dates);
                lblTrainer.html(json[0].TrainerName);
                lblContent.html(json[0].TrainingContents);
                lblVenue.html(json[0].TrainingVenue);
            } else {
                toastr.error('something is wrong!');
            }
        },
        error: OnWsError_Toaster// When Service call fails
    });

}

function getTrainingAttachement() {
    var Type, Url, Data, ContentType, DataType, ProcessData;
    _TrainingID = getParameterByName('trainingid');
    Type = "POST";
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    Url = getBaseUrl() + "wsttmapp.asmx/GetTrainingAttachementsByTrainingID";
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: cid,
        pTrainingID: _TrainingID
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
            if (!isEmptyObj(json)) {
                //console.log(json);
                var html = '';
                var cpin = getLocalStorageItem_String('pincode');
                var AttachmentBaseUrl = getBaseUrl() + 'Attachments/' + cpin + '/TrainingAttachments/';
                //console.log(AttachmentBaseUrl);

                $.each(json, function (i) {
                    var AttachmentUrl = AttachmentBaseUrl + encodeURIComponent(json[i].Attachment.trim());
                    //console.log(AttachmentUrl);
                    html += "<li class='list-group-item'><a href=" + AttachmentUrl + "><i class='fa fa-paperclip'></i><span style='font-weightnormal;'> " + json[i].Attachment.substr(2) + "</span><a><br></li>"
                });

            } else {

                html = '<small style="font-size:11px;"> &nbsp;&nbsp;No Attachments Found!</small>';
            }
            $("#AttachementList").html(html);
        },
        error: OnWsError_Toaster// When Service call fails
    });

}



$("#form1").submit(function (e) {
    e.preventDefault();
    var btnave = $("#btnSave");
    DisableButton(btnave, 'Submitting ...');
    performSaving(btnave);

});

function performSaving(btnave) {

    try {
        var isSuccess = false;
        var Type, Url, Data, ContentType, DataType, ProcessData;
        Type = "POST";
        ContentType = "application/json; charset=utf-8";
        DataType = "json";
        ProcessData = true;
        Url = getBaseUrl() + "wsttmapp.asmx/SaveTrainingRequest";

        Data = {
            pSecKey: secKey,
            pEmployeeID: eid,
            pEmployeeRefNo: ecode,
            pUserID: uid,
            pCompanyID: cid,
            PTrainingID: _TrainingID,
            pRequesterID: eid,
            pRemarks: txtRemarks.val().trim(),
            pStatus: "Submitted"
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

                var json = JSON.parse(result.d);
                // var res = json[0].msg0;            
                // var msg = json[0].msg1;
                var res = json.result;
                var msg = json.msg;

                //console.log(json);

                if (res === "Applied") {
                    toastr.error(msg);
                    EnableButton(btnave, 'Submit Request');
                }
                if (res === 'Success') {
                    window.location.replace('TrainingList.html?populateList=true&showMsg=true');
                }
                if (res === "fail" || res === "ProcessID_404") {
                    toastr.error(msg);
                    EnableButton(btnave, 'Submit Request');
                }
            },
            error: OnWsError_Toaster,// When Service call fails

        });

    } catch (error) {
        toastr.error('fail!');
    }



}



