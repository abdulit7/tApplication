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

var txtStartDate = $("#txtStartDate");
var globalData = [];

var _populateList = getParameterByName('populateList');
var _showMsg = getParameterByName('showMsg');

//Generic function to call AXMX/WCF  Service
jQuery(function ($) { //just like $(document).ready()
    var scheduleDate, dateformat;

    dateformat = getLocalStorageItem_String('dateformat');
    $('#datetimepicker').datetimepicker({
        format: dateformat.toUpperCase(),
        ignoreReadonly: true
    });



    init();
    if (_showMsg === 'true') {
        toastr.success('Transition Saved Successfully!');
    }
    if (_populateList === 'true') {
        populateList();
    }


});

function init() {
    txtStartDate.val(sysdate);
    fillStatus();
}

function fillStatus() {
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        PID1: 'tbltaskstatus',
        PID2: 'TaskStatusTitle',
        PID3: 'TaskStatusID',
        pCompanyID: cid,
        PID4: ''
    }
    var ddlStatus = document.getElementById("ddlStatus");
    fillDropDownGeneric(params, ddlStatus, false, 0);
}

$("#btnShow").click(function (e) {
    //alert(txtStartDate.val().trim());
    if (txtStartDate.val().trim() !== '') {

        populateList();

    } else {
        toastr.error('Please select Date!');
    }

});


function populateList() {
    try {

        var Type, Url, Data, ContentType, DataType, ProcessData;
        Type = "POST";
        ContentType = "application/json; charset=utf-8";
        DataType = "json";
        ProcessData = true;
        Url = getBaseUrl() + "wsttmapp.asmx/GetTaskAssignmentByEmployeeIDAndStartDate";
        Data = {
            pSecKey: secKey,
            pEmployeeID: eid,
            pEmployeeRefNo: ecode,
            pUserID: uid,
            pStartDate: txtStartDate.val().trim(),
            pStatusID: $('#ddlStatus').val(),
            pCompanyID: cid
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
                // console.log(result);
                var d = JSON.parse(result.d);
                globalData = JSON.parse(result.d);
                d.length > 0 ? $('#searchBar').slideDown() : $('#searchBar').slideUp();
                $("#taskList").html(GetTemplateData(d));

            },
            error: OnWsError,// When Service call fails
            failure: function (res) {
                // alert('Transaction saved fail!');
                toastr.error('Transaction saved fail!');
            }
        });


    } catch (error) {
        toastr.error('Something is wrong! ');
    }


}

function GetTemplateData(d) {
    var html = '';
    if (d.length > 0) {
        $.each(d, function (i) {
            //html += "<li onclick='gotoTaskTrans(" + d[i].TranID + "," + d[i].CustomerID + "," + d[i].ProjectID + ");' class='list-group-item assignmentlist'><span class='EmployeeTitle'>" + d[i].TaskSummary + "</span><br><span style='font-weight:bold;'> <small>Assign Date :</small> " + d[i].AssignDate + "</span><br><span>" + d[i].StartDate + " - " + d[i].EndDate + "</span><br><span class='txtCompanyTit'><small>Project :</small>" + d[i].ProjectTitle + "</span><br><span class='txtCompanyTit'><small>Customer :</small>" + d[i].CustomerTitle + "</span><br></li>"
            //html += '<div  onclick="gotoTaskTrans(' + d[i].TranID + ',' + d[i].CustomerID + ',' + d[i].ProjectID + ');" class="panel panelshadow">' +
            html += '<div  onclick="gotoTaskTrans(' + d[i].TranID + ',' + d[i].CustomerID + ',' + d[i].ProjectID + ',' + d[i].TaskTypeID + ');" class="panel panelshadow">' +
                '<div class="panel-body">' +

                '<span id="surveyTitle" class="surveytitle"> <small><i class="fa fa-list-alt"></i></small> ' + d[i].TaskSummary + ' </span>' +

                '<div class="surveyinfo">' +
                '<div class="col-xs-5"><span class="surveylbl">Assign Date</span></div>' +
                '<div class="col-xs-7"><span id="fromDate" class="surveytxt">' + d[i].AssignDate + '</span></div>' +
                '</div>' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-5"><span class="surveylbl">Start Date</span></div>' +
                '<div class="col-xs-7"><span id="fromDate" class="surveytxt">' + d[i].StartDate + '</span></div>' +
                '</div>' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-5"><span class="surveylbl">End Date</span></div>' +
                '<div class="col-xs-7"><span id="fromDate" class="surveytxt">' + d[i].EndDate + '</span></div>' +
                '</div>' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-5"><span class="surveylbl">Customer</span></div>' +
                '<div class="col-xs-7"><span id="fromDate" class="surveytxt">' + d[i].CustomerTitle + '</span></div>' +
                '</div>' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-5"><span class="surveylbl">Project</span></div>' +
                '<div class="col-xs-7"><span id="fromDate" class="surveytxt">' + d[i].ProjectTitle + '</span></div>' +
                '</div>' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-5"><span class="surveylbl">Task Type</span></div>' +
                '<div class="col-xs-7"><span id="fromDate" class="surveytxt">' + d[i].TaskTypeTitle + '</span></div>' +
                '</div>' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-5"><span class="surveylbl">Status</span></div>' +
                '<div class="col-xs-7"><span id="fromDate" class="surveytxt">' + d[i].TaskStatusTitle + '</span></div>' +
                '</div>' +

                '</div>' +
                '</div>';

        });
    } else {
        html = '<center><small style="font-size:16px;"> &nbsp;&nbsp; <br>No Data Found!</small></center>';
    }

    return html;
}


function searchList(q) {
    var html = '';
    var filterData = globalData.filter(function (item) {
        return item.ProjectTitle.toLowerCase().indexOf(q.toLowerCase()) > -1 || item.CustomerTitle.toLowerCase().indexOf(q.toLowerCase()) > -1;
    });
    $("#taskList").html('');
    html = GetTemplateData(filterData);
    $("#taskList").html(html);
}

function gotoTaskTrans(tid, cid, pid, ttid) {
    window.location.replace("TaskTransaction.html?tid=" + tid + "&cid=" + cid + "&pid=" + pid + "&ttid=" + ttid);
}



