'use strict';

var varType;
var varUrl;
var varData;
var varContentType;
var varDataType;
var varProcessData;

var eid, uid, ecode, secKey, cid, lid;
eid = getLocalStorageItem_Int('eid');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');

var ddlRequestType = $("#ddlRequestType");
var txtDate = $("#txtDate");
var txtRefrenceNo = $("#txtRefrenceNo");
var ddlCustomer = $("#ddlCustomer");
var txtCustEmail = $("#txtCustEmail");
var ddlProject = $("#ddlProject");
var ddlNature = $("#ddlNature");
var txtSummary = $("#txtSummary");
var txtdescription = $("#txtdescription");


var _complainID;
var _customerID;
var _projectID;

//Generic function to call AXMX/WCF  Service
jQuery(function ($) { //just like $(document).ready()
    var scheduleDate, dateformat;


    dateformat = getLocalStorageItem_String('dateformat');
    scheduleDate = getParameterByName('sd');
    if (!isNull(scheduleDate) && scheduleDate.trim() !== '') {
        getAttendanceDetails(scheduleDate);
    }

    $('#datetimepicker1').datetimepicker({
        format: dateformat.toUpperCase(),
        ignoreReadonly: true
    });

    _complainID = getParameterByName('cpid');
    _customerID = getParameterByName('cid');
    _projectID = getParameterByName('pid');

    init();





});


function init() {
    clearForm();
    //fillCustomers(_customerID);
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
        valueToPush["pCustomerID"] = ddlCustomer.val();
        valueToPush["page"] = params.page;

        return valueToPush;
    });
    fillNature(0);

}


function fillCustomers(id) {
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
    fillDropDownGeneric(params, ddlProject, true, 0);
}


function fillNature(id) {
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        PID1: 'tblComplainNature',
        PID2: 'ComplainNatureTitle',
        PID3: 'ComplainNatureID',
        pCompanyID: cid,
        PID4: ''
    }
    var ddlNature = document.getElementById("ddlNature");
    fillDropDownGeneric(params, ddlNature, true, id);
}

function ddlCustomerChange(selectedValue) {
    if (selectedValue !== '') {
        getCustomerEmail(selectedValue);
        fillProjects(selectedValue);
    }

}


function getCustomerEmail(customerID) {
    varType = "POST";
    varUrl = getBaseUrl() + "wsttmapp.asmx/GetCustomersForHelpdesk";

    varData = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: cid,
        pCustomerID: customerID
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

            var txtCustEmail = $("#txtCustEmail");
            var json = JSON.parse(result.d);
            //console.log(json);
            txtCustEmail.val(json[0].Email);
        },
        error: OnWsError// When Service call fails
    });
}

// $("#btnSave").click(function (e) {
//    // if (!validate()) { return; } //Validation
//    // DisableButton(this,'Submitting ...')
//    // performSaving();
//    // EnableButton(this,'Submit')

// });

$('#helpdeskform').submit(function (e) {
    e.preventDefault();
    if (!validate()) { return; } //Validation
    DisableButton($("#btnSave"), 'Submitting ...');
    performSaving();
    //EnableButton($("#btnSave"),'Submit');
});

function performSaving() {
    var params_ = {
        pLangID: lid,
        pCustomerID: ddlCustomer.val().trim(),
        pProjectID: ddlProject.val().trim(),
        //pDescription: txtdescription.val().trim(),
        pDescription: txtdescription.val(),
        pEmployeeID1: eid,
        pFileUrl: '',
        pNatureID: ddlNature.val().trim(),
        pEntryBy: 'E',
        pComplainSummary: txtSummary.val().trim(),
        pComplainType: ddlRequestType.val().trim()
    }
    postRequest('SaveHelpDeskRequest', params_, function (response) {
        toastr.success('Request Save Successfully!');
        clearForm();
        EnableButton($("#btnSave"), 'Submit');
    });
}

// function performSaving() {

//     var Type, Url, Data, ContentType, DataType, ProcessData;

//     if (!validate()) { return; } //Validation

//     Type = "POST";
//     var filepath = ''; //uploadFile();

//     Url = getBaseUrl() + "wsttmapp.asmx/SaveHelpDeskRequest";
//     Data = {
//         pSecKey: secKey,
//         pEmployeeID: eid,
//         pEmployeeRefNo: ecode,
//         pUserID: uid,
//         pLangID: lid,
//         pCompanyID: cid,
//         pCustomerID: ddlCustomer.val().trim(),
//         pProjectID: ddlProject.val().trim(),
//         //pDescription: txtdescription.val().trim(),
//         pDescription: txtdescription.val(),
//         pEmployeeID1: eid,
//         pFileUrl: filepath,
//         pNatureID: ddlNature.val().trim(),
//         pEntryBy: 'E',
//         pComplainSummary: txtSummary.val().trim(),
//         pComplainType: ddlRequestType.val().trim()
//     }

//     //console.log(varData);
//     //console.log(JSON.stringify(varData));
//     Data = JSON.stringify(Data);
//     ContentType = "application/json; charset=utf-8";
//     DataType = "json";
//     ProcessData = true;

//     $.ajax({
//         type: Type, //GET or POST or PUT or DELETE verb
//         url: Url, // Location of the service
//         data: Data, //Data sent to server
//         contentType: ContentType, // content type sent to server
//         dataType: DataType, //Expected data format from server
//         processdata: ProcessData, //True or False
//         aysnc: false,
//         success: function (result) {//On Successfull service call
//             toastr.success('Request Save Successfully!');
//             clearForm();
//         },
//         error: OnWsError// When Service call fails
//     });

// }

function validate() {
    var msg = "", result;


    console.log(ddlCustomer.val());
    msg += ddlCustomer.val() === "0" || ddlCustomer.val() === "" || isNull(ddlCustomer.val()) ? "-Customer <br>" : "";
    msg += ddlProject.val() === "0" || ddlProject.val() === "" || isNull(ddlProject.val()) ? "-Project <br>" : "";
    msg += txtSummary.val().trim() === "" ? "-Summary <br>" : "";

    if (msg.trim() !== "") {
        msg = "Please fill the following fields <br>" + msg;
        toastr.error(msg);
    }
    return msg.trim() === "";
}

function clearForm() {
    ddlRequestType.val('E');
    txtDate.val(sysdate);
    txtRefrenceNo.val('');
    ddlCustomer.val(0).trigger('change');
    txtCustEmail.val('');
    ddlProject.val(0).trigger('change');
    ddlNature.val(0);
    txtSummary.val('');
    txtdescription.summernote('code', '');
}






// function getFileBytes(file) {  
// debugger  
//     var reader = new FileReader();
//     var fileByteArray = [];
//     reader.readAsArrayBuffer(file);

//     reader.onloadend = function(evt) {
//         console.log(evt);
//     }

// //    reader.onloadend = function(evt) {
// //        if (evt.target.readyState == FileReader.DONE) {
// //            var arrayBuffer = evt.target.result,
// //           array = new Uint8Array(arrayBuffer);
// //            for (var i = 0; i < array.length; i++) {
// //                fileByteArray.push(array[i]);
// //            }
// //        }
// //    }
//     return fileByteArray;
// }

// function upnew() {

//     //var pfileName = document.getElementById('fileAttachment').files[0]; // $("#fileAttachment").val().replace(/C:\\fakepath\\/i, '')
//     var objFile = $jQuery("#fileAttachment");
//     var file = objFile[0].files[0];
//     var a = getFileBytes(file);
//     console.log(a);
// }


// function uploadFile3() {
//     var files = $jQuery("#fileAttachment");
//     var files = myInput.files[0];
//     var reader = new FileReader();
//     reader.onload = processFile(files);
//     reader.readAsArrayBuffer(files);
// }

// function processFile(theFile) {
//     return function(e) {
//         var theBytes = e.target.result; //.split('base64,')[1]; // use with uploadFile2
//         fileByteArray.push(theBytes);
//         document.getElementById('file').innerText = '';
//         for (var i = 0; i < fileByteArray.length; i++) {
//             document.getElementById('file').innerText += fileByteArray[i];
//         }
//     }
// }

// function uploadFile() {

//     var Type, Url, Data, ContentType, DataType, ProcessData;

//     var strFilePath = '';
//     Type = "POST";
//     Url = getBaseUrl() + "wsttmapp.asmx/UploadNewF";

//   //  var byteData = reader.result;
//     //byteData = byteData.split(';')[1].replace("base64,", "");


//   //  var arrayBuffer = byteData;
//    // var bytes = new Uint8Array(arrayBuffer);
//     //console.log(bytes);

//     var Data = {
//         pdata: array ,
//         pfileName: $("#fileAttachment").val().replace(/C:\\fakepath\\/i, '')
//     }


//     Data = JSON.stringify(Data);
//     //console.log(varData1 );

//     ContentType = "application/json; charset=utf-8";
//     DataType = "json";
//     ProcessData = true;


//     $.ajax({
//         type: Type, //GET or POST or PUT or DELETE verb
//         url: Url, // Location of the service
//         data: Data, //Data sent to server
//         contentType: ContentType, // content type sent to server
//         dataType: DataType, //Expected data format from server
//         processdata: ProcessData, //True or False
//         async: false,
//         success: function(r) {
//             //console.log(JSON.stringify(r.d));
//             var a = r.d;
//             console.log(a);
//             strFilePath = a;
//         },
//         error: function(r) {
//             alert(r.responseText);

//         }

//     });

//     return strFilePath;
// }


//var reader = new FileReader();
//var fileName;
// var array;
// document.getElementById('fileAttachment').addEventListener('change', function() {

//     var reader = new FileReader();
//     reader.onload = function() {
//         var arrayBuffer = this.result;
//         array = new Uint8Array(arrayBuffer);
//         //var binaryString = String.fromCharCode.apply(null, array);
//         console.log(array);
//     }
//     reader.readAsArrayBuffer(this.files[0]);


// }, false);