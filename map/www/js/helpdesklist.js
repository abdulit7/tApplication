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

var _populateList = getParameterByName('populateList');
var _showMsg = getParameterByName('showMsg');


//Generic function to call AXMX/WCF  Service
jQuery(function ($) { //just like $(document).ready()
    var scheduleDate, dateformat;

    dateformat = getLocalStorageItem_String('dateformat');
    $('#datetimepicker,#datetimepicker1').datetimepicker({
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

    var dateformat = getLocalStorageItem_String('dateformat');
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    txtFromDate.val(formatDate(firstDay));
    txtToDate.val(formatDate(lastDay));
    fillStatusDDL();

}

function fillStatusDDL() {
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
    fillDropDownGeneric(params, ddlStatus, false, 0);
}

function formatDate(date) {
    // var monthNames = [
    //   "January", "February", "March",
    //   "April", "May", "June", "July",
    //   "August", "September", "October",
    //   "November", "December"
    // ];
    var monthNames = [
        "01", "02", "03",
        "04", "05", "06", "07",
        "08", "09", "10",
        "11", "12"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    day = day < 9 ? '0' + day : day
    return day + '/' + monthNames[monthIndex] + '/' + year;
}

$("#btnShow").click(function (e) {
    //alert(txtStartDate.val().trim());
    if (txtFromDate.val().trim() !== '') {

        populateList();

    } else {
        toastr.error('Please select Date!');
    }

});


function populateList() {
    try {
        var para = {
            pFromDate: txtFromDate.val().trim(),
            pToDate: txtToDate.val().trim(),
            pComplainStatusID: $('#ddlStatus').val()
        }
        postRequest('GetHelpDeskListByEmployeeIDAndDateRange', para, function (result) {
            //console.log(result);
            var d = JSON.parse(result.d);
            globalData = JSON.parse(result.d);
            var html = GetDataTemplate(d);
            $("#taskList").html(html);
        });


    } catch (error) {
        toastr.error('Something is wrong! ');
    }


}

function GetDataTemplate(d) {
    var html = '';
    if (!isEmptyObj(d)) {
        $.each(d, function (i) {
            var dt = getDateByASPNETTimeStamp(d[i].ComplainDate);
            var dateformat = getLocalStorageItem_String('dateformat');
            var timeformat = getLocalStorageItem_String('timeformat');
            var ctime = DTHelper.GetFormattedTime(dt, timeformat);
            dt = DTHelper.GetFormattedDate(dt, dateformat);
            html +=
                '<li onclick="gotoHelpdeskForm(' + d[i].ComplainID + ',' + d[i].CustomerID + ',' + d[i].ProjectID + ');" class="list-group-item assignmentlist">' +
                '<span class="EmployeeTitle"><i class="fa fa-ticket"></i> ' + d[i].ComplainRefNo + ' - ' + d[i].ComplainSummary + '</span><br><span style="font-weight:bold;">' +
                '<small>Complain Date :</small> ' + dt + ' - ' + ctime + ' </span><br>' +
                '<small>Status :</small> ' + d[i].ComplainStatusTitle + ' </span><br>' +
                '<span><small>Project :</small>' + d[i].ProjectTitle + '</span><br>' +
                '<span class=""><small>Customer :</small>' + d[i].CustomerTitle + '</span><br></li>';
        });
    } else {
        html = '<center><small style="font-size:16px;"> &nbsp;&nbsp; <br>No Data Found!</small></center>';
    }
    return html;
}

function searchList(q) {
    var html = '';
    var filterData = globalData.filter(function (item) {
        return item.ComplainRefNo.indexOf(q) > -1 ||
            item.CustomerTitle.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
            item.ProjectTitle.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
            item.ComplainSummary.toLowerCase().indexOf(q.toLowerCase()) > -1;
    });
    $("#taskList").html('');
    html = GetDataTemplate(filterData);
    $("#taskList").html(html);
}

function gotoHelpdeskForm(tid, cid, pid) {
    window.location.replace("HelpDeskThread.html?cpid=" + tid + "&cid=" + cid + "&pid=" + pid);
}



