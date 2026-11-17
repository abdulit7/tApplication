'use strict';

var d = new Date();
var month = d.getMonth() + 1;
var day = d.getDate();
var sysdate = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();

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

var ddlCustomer = $("#ddlCustomer");
var ddlProject = $("#ddlProject");
var ddlWorkPosition = $("#ddlWorkPosition");
var ddlTaskType = $("#ddlTaskType");
var txtWorkDate = $("#txtWorkDate");
var txtDuration = $("#txtDuration");
var txtWorkDescription = $("#txtWorkDescription");
var ddlStatus = $("#ddlStatus");
var fileAttachment = $("#fileAttachment");



var _tid;
var _cid;
var _pid;
var _ttid;


//Generic function to call AXMX/WCF  Service
jQuery(function ($) { //just like $(document).ready()
    var scheduleDate, dateformat;

    dateformat = getLocalStorageItem_String('dateformat');
    $('#datetimepicker1').datetimepicker({
        format: dateformat.toUpperCase(),
        ignoreReadonly: true
    });

    clearForm();

    //_tid = getParameterByName('tid');
    //_cid = getParameterByName('cid');
    //_pid = getParameterByName('pid');

    try {
        init();
    } catch (error) {
        toastr.error(error);
    }




});



function init() {

    txtWorkDate.val(sysdate);
    txtDuration.val(0);

    //ddlCustomer.select2();
    // DropDowns Fill

    _tid = getParameterByName('tid');
    _cid = getParameterByName('cid');
    _pid = getParameterByName('pid');
    _ttid = getParameterByName('ttid');

    if (_tid !== undefined && _tid !== null && _tid > 0) {
        setContainer(_tid, _cid, _pid);
        fillWorkPosition();
        fillTaskType(_ttid);
        // If task transaction is aganist task assignment then fill normal customer dropdown
        fillCustomer(_cid);
        //funcFillDropDownListSelec2(10,"GetCustomerListJson");
        fillProjects(_pid);
    } else {
        fillWorkPosition();
        fillTaskType();
        // fillCustomer(_cid);
        // If task transaction is not aganist task assignment then fill select2 customer dropdown // on demand data
        funcFillDropDownListSelec2(10, "GetCustomerListJson", ddlCustomer, function (params) {
            var valueToPush = {};
            valueToPush["q"] = params.term;
            valueToPush["pagesize"] = 10;
            //var PControl1 = document.getElementById(ddlEmployee);
            valueToPush["pSecKey"] = secKey;
            valueToPush["pEmployeeID"] = eid;
            valueToPush["pEmployeeRefNo"] = ecode;
            valueToPush["pUserID"] = uid;
            valueToPush["pLangID"] = lid;
            valueToPush["pCompanyID"] = cid;

            valueToPush["PID1"] = uid;
            valueToPush["PID2"] = cid;
            valueToPush["PID3"] = "True";
            valueToPush["PID4"] = "False";
            valueToPush["page"] = params.page;
            return valueToPush;
        });

        // If task transaction is not aganist task assignment then fill select2 customer dropdown // on demand data
        funcFillDropDownListSelec2(10, "GetProjectListJson", ddlProject, function (params) {
            var valueToPush = {};
            valueToPush["q"] = params.term;
            valueToPush["pagesize"] = 10;
            //var PControl1 = document.getElementById(ddlEmployee);
            valueToPush["pSecKey"] = secKey;
            valueToPush["pEmployeeID"] = eid;
            valueToPush["pEmployeeRefNo"] = ecode;
            valueToPush["pUserID"] = uid;
            valueToPush["pLangID"] = lid;
            valueToPush["pCompanyID"] = cid;

            valueToPush["PID1"] = uid;
            valueToPush["PID2"] = cid;
            valueToPush["PID3"] = "True";
            valueToPush["PID4"] = "False";
            valueToPush["pCustomerID"] = ddlCustomer.val(); //0; //"False"; 
            valueToPush["page"] = params.page;
            return valueToPush;
        });
        //fillProjects(_pid);
    }



}

function setContainer(_tid, _cid, _pid) {

    fillStatus();
    $("#divddlStatus").show();
    var ddlCustomer0 = $("#ddlCustomer");
    var ddlProject0 = $("#ddlProject");

    $("#btnBack").show();

    ddlCustomer.prop('disabled', true);
    ddlProject.prop('disabled', true);


}

function fillCustomer(id) {
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        PID1: 'tblCustomer',
        PID2: 'CustomerTitle',
        PID3: 'CustomerID',
        pCompanyID: cid,
        PID4: ''
    }
    var ddlCustomer = document.getElementById("ddlCustomer");
    fillDropDownGeneric(params, ddlCustomer, true, id);
}


function fillProjects(id) {
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        PID1: 'tblProject',
        PID2: 'ProjectTitle',
        PID3: 'ProjectID',
        pCompanyID: cid,
        PID4: ''
    }
    var ddlProject = document.getElementById("ddlProject");
    fillDropDownGeneric(params, ddlProject, true, id);
}

function fillTaskType(pttid) {
    var params = { pSecKey: secKey, pEmployeeID: eid, pEmployeeRefNo: ecode, pUserID: uid, PID1: 'tblTaskType', PID2: 'TaskTypeTitle', PID3: 'TaskTypeID', pCompanyID: cid, PID4: '' }
    var ddlTaskType = document.getElementById("ddlTaskType");
    fillDropDownGeneric(params, ddlTaskType, true, pttid);
}

function fillWorkPosition() {
    var params = { pSecKey: secKey, pEmployeeID: eid, pEmployeeRefNo: ecode, pUserID: uid, PID1: 'tblWorkPosition', PID2: 'WorkPositionTitle', PID3: 'WorkPositionID', pCompanyID: cid, PID4: '' }
    var ddlWorkPosition = document.getElementById("ddlWorkPosition");
    fillDropDownGeneric(params, ddlWorkPosition, true);
}

function fillStatus() {
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        PID1: 'tblTaskStatus',
        PID2: 'TaskStatusTitle',
        PID3: 'TaskStatusID',
        pCompanyID: cid,
        PID4: ''
    }
    var ddlCustomer = document.getElementById("ddlStatus");
    fillDropDownGeneric(params, ddlCustomer, true, 0);
}

$("#btnSave").click(function (e) {
    if (!validate()) { return; } //Validation
    EnableDisableButtonSpin($("#btnSave"), 'D');
    performSaving();

});

function performSaving() {

    try {

        var Type, Url, Data, ContentType, DataType, ProcessData;
        Type = "POST";
        ContentType = "application/json; charset=utf-8";
        DataType = "json";
        ProcessData = true;
        Url = getBaseUrl() + "wsttmapp.asmx/SaveTaskTranaction";

        var _ddlCustomer = ddlCustomer.val().trim();
        var _ddlProject = ddlProject.val().trim();
        var _ddlWorkPosition = ddlWorkPosition.val().trim();
        var _ddlTaskType = ddlTaskType.val().trim();
        var _txtWorkDate = txtWorkDate.val().trim();
        var _txtDuration = txtDuration.val().trim();
        //var _txtWorkDescription = txtWorkDescription.val().trim();
        var _txtWorkDescription = txtWorkDescription.val();
        var _fileAttachment = fileAttachment.val().trim();


        Data = {
            pSecKey: secKey,
            pEmployeeID: eid,
            pEmployeeRefNo: ecode,
            pUserID: uid,
            pTranID: 0,
            pCustomerID: _ddlCustomer,
            pProjectID: _ddlProject,
            pWorkDate: _txtWorkDate,
            pWorkPositionID: _ddlWorkPosition,
            pWorkDescription: _txtWorkDescription,
            pHour: _txtDuration,
            pCompanyID: cid,
            pTaskTypeID: _ddlTaskType,
            pTaskAssignmentID: _tid > 0 ? _tid : 0,
            pstrFileName: _fileAttachment,
            pTaskStatus: _tid > 0 ? ddlStatus.val().trim() : 1
        }

        Data = JSON.stringify(Data);

        $.ajax({
            type: Type, //GET or POST or PUT or DELETE verb
            url: Url, // Location of the service
            data: Data, //Data sent to server
            contentType: ContentType, // content type sent to server
            dataType: DataType, //Expected data format from server
            processdata: ProcessData, //True or False
            aysnc: true,
            success: function (result) {//On Successfull service call
                if (result.d === "success") {
                    // alert('Transaction Save Successfully!');
                    //console.log(result);
                    if (!isNull(_tid) && _tid > 0) {
                        window.location.replace('TaskAssignemntList.html?populateList=true&showMsg=true');
                    } else {
                        toastr.success('Transaction Save Successfully!');
                        clearForm();
                        EnableDisableButtonSpin($("#btnSave"), 'e', 'Save');
                    }
                } else {
                    toastr.error('Transaction saved fail!');
                    EnableDisableButtonSpin($("#btnSave"), 'e', 'Save');
                }
            },
            error: OnWsError,// When Service call fails
            failure: function (res) {
                // alert('Transaction saved fail!');
                toastr.error('Transaction saved fail!');
                EnableDisableButtonSpin($("#btnSave"), 'e', 'Save');
                // clearForm();
            }
        });

    } catch (error) {
        toastr.error(error);
        //  clearForm();

    }



}



function validate() {
    var msg = "", result;
    _tid = getParameterByName('tid');

    msg += isNull(ddlCustomer.val()) || ddlCustomer.val() === "0" ? "-Customer <br>" : "";
    msg += isNull(ddlProject.val()) || ddlProject.val() === "0" ? "-Project <br>" : "";
    msg += ddlWorkPosition.val().trim() === "0" ? "-Work Position <br>" : "";
    msg += ddlTaskType.val().trim() === "0" ? "-Task Type <br>" : "";
    msg += txtDuration.val().trim() <= "0" ? "-Duration <br>" : "";
    msg += txtWorkDescription.val().trim() === "" ? "-Work Description <br>" : "";
    if (_tid !== undefined && _tid !== null && _tid > 0) {
        msg += ddlStatus.val().trim() === "0" ? "-Status <br>" : "";
    }

    if (msg.trim() !== "") {
        msg = "Please fill the following fields <br>" + msg;
        // alert(msg);
        toastr.error(msg);
    }
    return msg.trim() === "";
}

function clearForm() {
    ddlCustomer.val(0).trigger('change');
    ddlProject.val(0).trigger('change');
    ddlWorkPosition.val(0);
    ddlTaskType.val(0);
    txtWorkDate.val(sysdate);
    txtDuration.val('');
    txtWorkDescription.summernote('code', '');
    fileAttachment.val('');
}

// function funcFillDropDownListSelec2( pagingSize,   WSMethodName) {
//     //alert('inside');

//         //var $ = jQuery.noConflict(); Change by HMN on 24-09-2018 (Remove var)
//         $ = jQuery.noConflict();
//         var result = ddlCustomer.select2({
//             ajax: {
//                 url : getBaseUrl() + "wsttmapp.asmx/"+WSMethodName,
//                 type: "POST",
//                 dataType: 'json',
//                 delay: 500,
//                 data: function(params) {
//                     var valueToPush = {};
//                     valueToPush["q"] = params.term;
//                     valueToPush["pagesize"] = pagingSize;                    
//                     //var PControl1 = document.getElementById(ddlEmployee);
//                     valueToPush["pSecKey"] = secKey;
//                     valueToPush["pEmployeeID"] = eid;
//                     valueToPush["pEmployeeRefNo"] = ecode;
//                     valueToPush["pUserID"] = uid;
//                     valueToPush["pLangID"] = lid;
//                     valueToPush["pCompanyID"] = cid;

//                     valueToPush["PID1"] = uid;                 
//                     valueToPush["PID2"] = cid;                 
//                     valueToPush["PID3"] = "True";                 
//                     valueToPush["PID4"] = "False";                 
//                     valueToPush["page"] = params.page;
//                     return valueToPush;
//                 },
//                 processResults: function(data, params) {
//                     params.page = params.page || 1;
//                     return {
//                         results: data.items,
//                         pagination:
//                             {
//                                 more: (params.page * pagingSize) < parseInt(data.total_count)
//                             }
//                     };
//                 },
//                 cache: true
//             },
//             placeholder: "Select",
//             allowClear: true,
//             escapeMarkup: function(markup) { return markup; }, // let our custom formatter work
//             minimumInputLength: 1,
//             templateResult: function(repo) {
//                 var markup;
//                 if (repo.loading) { return repo.text; }
//                 markup = "<div class='select2-result-repository__title'>" + repo.text + "</div>";
//                 return markup;
//             }, //formatRepoddlItem omitted for brevity, see the source of this page
//             templateSelection: function(repo) { return repo.text; }
//             //formatRepoSelectionddlItem // omitted for brevity, see the source of this page

//         });

//     return result;
// }
