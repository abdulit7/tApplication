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

jQuery(function ($) {
    var scheduleDate, dateformat;

    dateformat = getLocalStorageItem_String('dateformat');
    $('#datetimepicker,#datetimepicker1').datetimepicker({
        format: dateformat.toUpperCase(),
        ignoreReadonly: true
    });

    init();

});

function init() {

    var dateformat = getLocalStorageItem_String('dateformat');
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    txtFromDate.val(sysdate);
    txtToDate.val(sysdate);
    populateList();
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

        var para_ = { pFromDate: txtFromDate.val().trim(), pToDate: txtToDate.val().trim() }
        postRequest('GetLeaveRequestList', para_, function (response_) {
            var resdata = JSON.parse(response_.d);
            var leaveList = $('#leaveList');
            if (!isEmptyObj(resdata)) {
                var template = '';
                var statusClass = '';
                var statusIcon = '';
                //console.log(resdata);
                $.each(resdata, function (i, item) {
                    statusClass = '';
                    statusIcon = '';
                    if (item.Status === 'Approved') {
                        statusClass = 'text-success';
                        statusIcon = '<i style="color:#3c763d;" class="fa fa-check"></i>';
                    } else if (item.Status === 'Rejected') {
                        statusClass = 'text-danger';
                        statusIcon = '<i style="color:#a94442;" class="fa fa-times"></i>';
                    }
                    template +=
                        '<div class="panel panelshadow">' +
                        '<div class="panel-body">' +
                        '<span id="surveyTitle" class="surveytitle EmployeeTitle"> <small><i class="fa fa-caret-right"></i></small><span style="color:#999;"> Req No. </span> ' + item.LeaveTranRefNo + ' <div onClick="toggleDesc(' + parseInt(item.LeaveTranRefNo) + ');" class="pull-right toggleDesc"><i id="icon' + parseInt(item.LeaveTranRefNo) + '" class="fa fa-chevron-down" aria-hidden="true"></i></div></span>' +
                        '<div id="p' + parseInt(item.LeaveTranRefNo) + '">' +
                        '<div class="row">' +
                        '<div class="surveyinfo">' +
                        '<div class="col-xs-4"><span class="surveylbl">Leave Type</span></div>' +
                        '<div class="col-xs-8"><span id="fromDate" class="surveytxt">' + item.LeaveTitle + '</span></div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row">' +
                        '<div class="surveyinfo">' +
                        '<div class="col-xs-4"><span class="surveylbl">Request Date</span></div>' +
                        '<div class="col-xs-8"><span id="fromDate" class="surveytxt">' + item.ApplicationDate + '</span></div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row">' +
                        '<div class="surveyinfo">' +
                        '<div class="col-xs-4"><span class="surveylbl">From Date</span></div>' +
                        '<div class="col-xs-8"><span id="fromDate" class="surveytxt">' + item.FromDate + '</span></div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row">' +
                        '<div class="surveyinfo">' +
                        '<div class="col-xs-4"><span class="surveylbl">To Date</span></div>' +
                        '<div class="col-xs-8"><span id="toDate" class="surveytxt">' + item.ToDate + '</span></div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row">' +
                        '<div class="surveyinfo">' +
                        '<div class="col-xs-4"><span class="surveylbl">No Of Days</span></div>' +
                        '<div class="col-xs-8"><span id="toDate" class="surveytxt">' + item.NoOfDays + '</span></div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row">' +
                        '<div class="surveyinfo">' +
                        '<div class="col-xs-4"><span class="surveylbl">Status</span></div>' +
                        '<div class="col-xs-8"><span id="toDate" class="surveytxt ' + statusClass + '">' + item.Status + '</span> ' + statusIcon + ' </div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row">' +
                        '<div class="surveyinfo">' +
                        '<div class="col-xs-4"><span class="surveylbl">Remarks</span></div>' +
                        '<div class="col-xs-8"><span id="toDate" class="surveytxt">' + item.Remarks + '</span></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                        ;
                });

                leaveList.html(template);
            } else {
                leaveList.html('<div class="text-center"><small>No Data Found!</small></div>');
            }
        });
    } catch (error) {
        toastr.error('Something is wrong! ');
    }


}

function toggleDesc(id) {
    $('#p' + id).slideToggle();
    $('#icon' + id).toggleClass('fa-chevron-up fa-chevron-down');
}