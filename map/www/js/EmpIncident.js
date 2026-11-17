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

var ddlIncidentCategory = $("#ddlIncidentCategory");
var ddlIncidentType = $("#ddlIncidentType");
var txtSummary = $("#txtSummary");
var txtDetail = $("#txtDetail");
var txtDate = $("#txtDate");
var ddlEmployee = $("#ddlEmployee");


jQuery(function ($) {
    var scheduleDate, dateformat;
    dateformat = getLocalStorageItem_String('dateformat');
    $('#datetimepicker1').datetimepicker({
        format: dateformat.toUpperCase(),
        ignoreReadonly: true
    });

    try {
        init();
    } catch (error) {
        toastr.error(error);
    }


});


function init() {
    txtDate.val(sysdate);
    ddlEmployee.select2();
    fillIncidentCategory(0);
    fillIncidentType(0);
    funcFillDropDownListSelec2(10, "GetEmployeeListJson")
}

function fillIncidentCategory(id) {
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        PID1: 'tblincidentcategory',
        PID2: 'IncidentCategoryTitle',
        PID3: 'IncidentCategoryID',
        pCompanyID: cid,
        PID4: ''
    }
    var ddlIncidentCategory = document.getElementById("ddlIncidentCategory");
    fillDropDownGeneric(params, ddlIncidentCategory, true, 0);
}

function fillIncidentType(id) {
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        PID1: 'tblincidenttype',
        PID2: 'incidenttypeTitle',
        PID3: 'incidenttypeID',
        pCompanyID: cid,
        PID4: ' and incidentcategoryID =' + ddlIncidentCategory.val()
    }
    var ddlIncidentType = document.getElementById("ddlIncidentType");
    fillDropDownGeneric(params, ddlIncidentType, true, 0);
}



$("#btnSave").click(function (e) {
    //  if (!validate()) { return; } //Validation
    if (!validate()) { return; } //Validation
    EnableDisableButtonSpin($("#btnSave"), 'D');
    //  performSaving();
    var Data = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pLangID: lid,
        pCompanyID: cid,
        pIncidentDate: txtDate.val(),
        pIncidentDetails: txtDetail.val(),
        pStartDate: "",
        pEndDate: "",
        pCustomerID: 0,
        pProjectID: 0,
        pIncidentTypeID: ddlIncidentType.val(),
        pFileName: "",
        pAssignByID: ddlEmployee.val().trim(),
        pIsActive: true,
        pIncidentSummary: txtSummary.val().trim(),
        pIncidentPriorityID: 0,
        pIncidentStatusID: 0,
        pModifiedDate: "",
        pModifiedByID: 0,
        pParentIncidentAssignmentID: 0,
        pDuration: 0,
        pIncidentCategoryID: ddlIncidentCategory.val().trim(),
    }
    postRequest('SaveIncidentRequest', Data, function (result) {
        var json = JSON.parse(result.d);
        var res = json[0].msg0
        var msg = json[0].msg1

        if (res === "success") {
            toastr.success(msg);
            clearForm()

        }
        else if (res === "fail") {
            toastr.error(msg);
        }
        EnableDisableButtonSpin($("#btnSave"), 'E');
    });

});


// function performSaving() {

//     var Type, Url, Data, ContentType, DataType, ProcessData;

//     if (!validate()) { return; } //Validation

//     Type = "POST";
//     var filepath = ''; //uploadFile();

//     Url = getBaseUrl() + "wsttmapp.asmx/SaveIncidentRequest";
//     Data = {
//         pSecKey: secKey,
//         pEmployeeID: eid,
//         pEmployeeRefNo: ecode,
//         pUserID: uid,
//         pLangID: lid,
//         pCompanyID: cid,
//         pIncidentDate: txtDate.val(),
//         pIncidentDetails: txtDetail.val(),
//         pStartDate: "",
//         pEndDate: "",
//         pCustomerID: 0,
//         pProjectID: 0,
//         pIncidentTypeID: ddlIncidentType.val(),
//         pFileName: "",
//         pAssignByID: ddlEmployee.val().trim(),
//         pIsActive: true,
//         pIncidentSummary: txtSummary.val().trim(),
//         pIncidentPriorityID: 0,
//         pIncidentStatusID: 0,
//         pModifiedDate: "",
//         pModifiedByID: 0,
//         pParentIncidentAssignmentID: 0,
//         pDuration: 0,
//         pIncidentCategoryID: ddlIncidentCategory.val().trim(),
//     }

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
//             console.log(result);
//             var json = JSON.parse(result.d);           
//             var res = json[0].msg0            
//             var msg = json[0].msg1

//             if (res === "success"){
//                 toastr.success(msg);
//                 clearForm()
//             }
//             else if(res === "fail"){
//                 toastr.error(msg);
//             }

//            // clearForm();
//         },
//         error: OnWsError// When Service call fails
//     });

// }

function validate() {
    var msg = "", result;

    msg += isNull(ddlEmployee.val()) || ddlEmployee.val() === "0" ? "-Employee <br>" : "";
    msg += ddlIncidentCategory.val().trim() === "0" ? "-Incident Category <br>" : "";
    msg += ddlIncidentType.val().trim() === "0" ? "-Incident Type <br>" : "";
    msg += txtSummary.val().trim() === "" ? "-Summary <br>" : "";

    if (msg.trim() !== "") {
        msg = "Please fill the following fields <br>" + msg;
        toastr.error(msg);
    }
    return msg.trim() === "";
}

function clearForm() {
    ddlIncidentCategory.val(0);
    ddlIncidentType.val(0);
    txtSummary.val('');
    txtDetail.summernote('code', '');
    txtDate.val(sysdate);
    //ddlEmployee.val(0);
    ddlEmployee.val(0).trigger('change');
}

$("#ddlIncidentCategory").change(function () {
    fillIncidentType(0);
});

function funcFillDropDownListSelec2(pagingSize, WSMethodName) {
    //alert('inside');

    //var $ = jQuery.noConflict(); Change by HMN on 24-09-2018 (Remove var)
    $ = jQuery.noConflict();
    var result = ddlEmployee.select2({
        ajax: {
            url: getBaseUrl() + "wsttmapp.asmx/" + WSMethodName,
            type: "POST",
            dataType: 'json',
            delay: 500,
            data: function (params) {
                var valueToPush = {};
                valueToPush["q"] = params.term;
                valueToPush["pagesize"] = pagingSize;
                //var PControl1 = document.getElementById(ddlEmployee);
                valueToPush["pSecKey"] = secKey;
                valueToPush["pEmployeeID"] = eid;
                valueToPush["pEmployeeRefNo"] = ecode;
                valueToPush["pUserID"] = uid;
                valueToPush["pLangID"] = lid;
                valueToPush["pCompanyID"] = cid;

                valueToPush["PID1"] = uid;
                valueToPush["PID2"] = cid;
                valueToPush["PID3"] = "False";
                valueToPush["PID4"] = "False";
                valueToPush["page"] = params.page;
                return valueToPush;
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: data.items,
                    pagination:
                    {
                        more: (params.page * pagingSize) < parseInt(data.total_count)
                    }
                };
            },
            cache: true
        },
        placeholder: "Select",
        allowClear: true,
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        minimumInputLength: 1,
        templateResult: function (repo) {
            var markup;
            if (repo.loading) { return repo.text; }
            markup = "<div class='select2-result-repository__title'>" + repo.text + "</div>";
            return markup;
        }, //formatRepoddlItem omitted for brevity, see the source of this page
        templateSelection: function (repo) { return repo.text; }
        //formatRepoSelectionddlItem // omitted for brevity, see the source of this page

    });

    return result;
}



