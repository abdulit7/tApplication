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

var txtFromDate = $("#txtFromDate");
var txtToDate = $("#txtToDate");
var globalData = [];
var globalDetail = [];

//var _populateList = getParameterByName('populateList');
//var _showMsg = getParameterByName('showMsg');

//Generic function to call AXMX/WCF  Service
jQuery(function ($) { //just like $(document).ready()

    var scheduleDate, dateformat;
    dateformat = getLocalStorageItem_String('dateformat');
    $('#datetimepicker,#datetimepicker1').datetimepicker({
        format: dateformat.toUpperCase(),
        ignoreReadonly: true
    });

    init();



});

function init() {
    txtFromDate.val(sysdate);
    txtToDate.val(sysdate);

    funcFillDropDownListSelec2(10, "GetEmployeeListJson", $('#ddlEmployee'), function (params) {
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
        valueToPush["PID3"] = "False";
        valueToPush["PID4"] = "False";
        valueToPush["page"] = params.page;

        return valueToPush;
    });
    //  fillStatus();

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



$("#frmTaskList").submit(function (e) {
    e.preventDefault();

    populateList();
});


function populateList() {

    var pEmpIDs = $('#ddlEmployee').val() === null ? 0 : $('#ddlEmployee').val()

    var pData = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pFromDate: txtFromDate.val().trim(),
        pToDate: txtToDate.val().trim(),
        pStatusID: 0,
        pEmployeeID1: pEmpIDs,
        pAssignmentNo: $('#txtAssignmentNo').val(),
        pCompanyID: cid,
        pType: 'GroupHeader'
    }
    postRequest('GetTaskTranactionByEmployeeIDAndDates', pData, function (r) {

        var d = JSON.parse(r.d);
        //console.log(d);
        globalData = JSON.parse(r.d);
        pData.pType = 'dt';
        postRequest('GetTaskTranactionByEmployeeIDAndDates', pData, function (r) {
            globalDetail = JSON.parse(r.d);
            d.length > 0 ? $('#searchBar').slideDown() : $('#searchBar').slideUp();
            $("#taskList").html(GetTemplateData(d, globalDetail, pData, ''));
        });

    });


}


function GetTemplateData(d, dt, pData, strq) {
    if (dt.length <= 0 || d.length <= 0) {
        html = '<center><small style="font-size:16px;"> &nbsp;&nbsp; <br>No Data Found!</small></center>';
        return html;
    }
    var html = '';
    var htmlDetail = '';

    //console.table(d);
    //console.table(dt);
    $.each(d, function (i, item) {
        htmlDetail = '';
        var fdetail = dt.filter(function (itm) {
            return itm.EmployeeID === item.EmployeeID && getFormattedDateNew(itm.WorkDate).replace(/\//g, '') === getFormattedDateNew(item.WorkDate).replace(/\//g, '');
        });
        $.each(fdetail, function (j, jitem) {

            var assignment = jitem.AssignmentRefNo;
            if (assignment === '0') {
                assignment = 'XXXXX';
            }

            htmlDetail +=
                '<div class="groupItem"><div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-5"><span class="surveylbl">Customer</span></div>' +
                '<div class="col-xs-7"><span id="toDate" class="surveytxt">' + getHighlighted(jitem.CustomerTitle, strq) + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-5"><span class="surveylbl">Project</span></div>' +
                '<div class="col-xs-7"><span id="toDate" class="surveytxt">' + getHighlighted(jitem.ProjectTitle, strq) + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-5"><span class="surveylbl">Task Type</span></div>' +
                '<div class="col-xs-7"><span id="toDate" class="surveytxt">' + getHighlighted(jitem.TaskTypeTitle, strq) + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-5"><span class="surveylbl">Work Position</span></div>' +
                '<div class="col-xs-7"><span id="toDate" class="surveytxt">' + getHighlighted(jitem.WorkPositionTitle, strq) + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-5"><span class="surveylbl">Hours</span></div>' +
                '<div class="col-xs-7"><span id="toDate" class="surveytxt">' + jitem.Duration + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-5"><span class="surveylbl">Assignment No</span></div>' +
                '<div class="col-xs-7"><span id="toDate" class="surveytxt">' + assignment + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-12"><span class="surveylbl"><i class="fa fa-info-circle"> </i> Work Description : </span></div>' +
                '<div class="col-xs-12"><span class="surveytxt">' + getHighlighted(jitem.WorkDescription, strq) + '</span></div>' +
                '</div>' +
                '</div>' +

                '</div>'
                ;


        });
        var toggleID = getFormattedDateNew(item.WorkDate).replace(/\//g, '') + item.EmployeeID;

        var expandorcollapse = 'none';

        if (strq !== '') {
            expandorcollapse = 'block';
        }

        html +=
            '<div class="panel panelshadow">' +
            '<div class="panel-body">' +


            '<span id="surveyTitle" class="surveytitle"> <small><i class="fa fa-list-alt"></i></small> ' + getHighlighted(item.EmployeeName, strq) + '<span class="pull-right"><i id="icon' + toggleID + '" onClick="toggleDesc(\'' + toggleID + '\')" class="fa fa-chevron-up"></i></span>' +
            '<br><small>' + getHighlighted(getFormattedDateNew(item.WorkDate), strq) + '</small> <span class="pull-right"><small>Hour(s) : ' + item.Hours + '</small></span>' +
            '</span>' +
            '<div>' +

            '<div  id="p' + toggleID + '" class="groupDetail" style="display: ' + expandorcollapse + ';">' +

            htmlDetail +

            '</div>' +

            '</div>' +
            '</div>' +
            '</div>'
            ;
    });

    return html;
}

function toggleDesc(id) {
    $('#p' + id).slideToggle();
    $('#icon' + id).toggleClass('fa-chevron-down fa-chevron-up');
}

function searchList(q) {
    var html = '';
    var filterData = globalDetail.filter(function (item) {
        return item.ProjectTitle.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
            item.CustomerTitle.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
            item.EmployeeName.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
            item.EmployeeRefNo.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
            item.AssignmentRefNo.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
            item.WorkDescription.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
            item.WorkDate.toLowerCase().indexOf(q.toLowerCase()) > -1;
    });
    $("#taskList").html('');
    //alert(q);
    html = GetTemplateData(globalData, filterData, {}, q);
    $("#taskList").html(html);
}

function gotoTaskTrans(tid, cid, pid) {
    window.location.replace("TaskTransaction.html?tid=" + tid + "&cid=" + cid + "&pid=" + pid);
}






