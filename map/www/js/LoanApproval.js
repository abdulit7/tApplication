'use strict';

var eid, uid, ecode, secKey, cid, lid, ename, dateformat;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');
dateformat = getLocalStorageItem_String('dateformat');

$(function ($) {
    init();
});

function init() {
    populateList();
}



function populateList() {
    postRequest('GetLoanApprovals', {}, function (r) {
        var res = JSON.parse(r.d);
        if (isEmptyObj(res)) {
            $('#list').html('<center>No Approval(s) Found!</center>');
            return;
        }
        //console.log({ res });
        var template = '';

        $.each(res, function (i, item) {
            var strItem = JSON.stringify(item);
            template +=

                '<div class="col-md-6 panel panelshadow">' +
                '<span id="surveyTitle" class="surveytitle EmployeeTitle"> <small><i class="fa fa-money"></i></small><span style="color:#999;"> Req ID. </span> ' + item.RequestNo + ' <div onClick="toggleDesc(' + parseInt(item.RequestNo) + ');" class="hide pull-right toggleDesc"><i id="" class="fa fa-chevron-down" aria-hidden="true"></i></div></span>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-6"><span class="surveylbl">Employee</span></div>' +
                '<div class="col-xs-6"><span id="" class="surveytxt">' + item.EmployeeName + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-6"><span class="surveylbl">Designation</span></div>' +
                '<div class="col-xs-6"><span id="" class="surveytxt">' + item.DesignationTitle + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-6"><span class="surveylbl">Department</span></div>' +
                '<div class="col-xs-6"><span id="" class="surveytxt">' + item.DepartmentTitle + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-6"><span class="surveylbl">Loan Date</span></div>' +
                '<div class="col-xs-6"><span id="" class="surveytxt">' + getFormattedDateNew(item.RequestDate) + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-6"><span class="surveylbl">Loan Type</span></div>' +
                '<div class="col-xs-6"><span id="" class="surveytxt">' + item.AllowanceTitle + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-6"><span class="surveylbl">Loan Amount</span></div>' +
                '<div class="col-xs-6"><span id="" class="surveytxt">' + item.LoanAmount + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-6"><span class="surveylbl">Remarks</span></div>' +
                '<div class="col-xs-6"><span id="" class="surveytxt">' + item.RequesterRemarks + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="mt-2"></div><textarea id="txtRemarks' + item.RequestID + '" class="form-control" rows="4" placeholder="Enter your remarks"></textarea>' +

                '<div class="mt-2"></div>' +
                '<button id="btnApprove' + item.RequestID + '" onClick="ProcessRequest(' + item.RequestID + ', \'' + item.RequestNo + '\', ' + item.ProcessID + ',' + item.TaskID + ',' + item.WorkFlowGroupID + ',' + item.EmployeeID + ', \'Approved\')" type="button" class="btn btn-block btn-success btn-xs">Approve &nbsp;&nbsp; <i class="fa fa-check"></i></button>' +
                '<button id="btnReject' + item.RequestID + '" onClick="ProcessRequest(' + item.RequestID + ', \'' + item.RequestNo + '\', ' + item.ProcessID + ',' + item.TaskID + ',' + item.WorkFlowGroupID + ',' + item.EmployeeID + ', \'Reject\')" type="button" class="btn btn-block btn-danger btn-xs">Reject &nbsp;&nbsp; <i class="fa fa-times"></i></button>' +
                '<button id="btnReturn' + item.RequestID + '" onClick="ProcessRequest(' + item.RequestID + ', \'' + item.RequestNo + '\', ' + item.ProcessID + ',' + item.TaskID + ',' + item.WorkFlowGroupID + ',' + item.EmployeeID + ', \'Return\')" type="button" class="btn btn-block btn-default btn-xs">Return To Requester &nbsp;&nbsp; <i class="fa fa-long-arrow-left"></i></button>' +

                '</div>'

                ;
        });
        $('#list').html(template);

    }, function (err) {
        toastr.error('Something is wrong! Contact you administrator.');
    });
}

function ProcessRequest(pRequestID, pRequestNo, pProcessID, pTaskID, pWorkFlowGroupID, pRequestpEmployeeID, pApproveStatus) {

    var remarks = 'txtRemarks' + pRequestID + '';
    var btnApprove = $('#btnApprove' + pRequestID);
    var btnReject = $('#btnReject' + pRequestID);
    var btnReturn = $('#btnReturn' + pRequestID);

    if (pApproveStatus === 'Reject' && $('#' + remarks).val() === '') {
        toastr.warning('Remarks are mandatory for rejection!');
        $('#' + remarks).css('background', '#f1f1f1').focus();
        return;
    }

    if (pApproveStatus === 'Approved') {
        EnableDisableButtonSpin(btnApprove, 'd', 'Approving');
        DisableButton(btnReject, 'Reject &nbsp;&nbsp; <i class="fa fa-times"></i>');
        DisableButton(btnReturn, 'Return To Requester &nbsp;&nbsp; <i class="fa fa-long-arrow-left"></i>');
    } else if (pApproveStatus === 'Reject') {
        EnableDisableButtonSpin(btnReject, 'd', 'Rejecting');
        DisableButton(btnApprove, 'Approve &nbsp;&nbsp; <i class="fa fa-check"></i>');
        DisableButton(btnReturn, 'Return To Requester &nbsp;&nbsp; <i class="fa fa-long-arrow-left"></i>');
    } else if (pApproveStatus === 'Return') {
        EnableDisableButtonSpin(btnReturn, 'd', 'Returning To Requester');
        DisableButton(btnApprove, 'Approve &nbsp;&nbsp; <i class="fa fa-check"></i>');
        DisableButton(btnReject, 'Reject &nbsp;&nbsp; <i class="fa fa-times"></i>');
    }


    var reqPara = {
        pRequestID: pRequestID,
        pRequestNo: pRequestNo,
        pProcessID: pProcessID,
        pTaskID: pTaskID,
        pWorkFlowGroupID: pWorkFlowGroupID,
        pRequestpEmployeeID: pRequestpEmployeeID,
        pApproveStatus: pApproveStatus,
        pRemarks: $('#' + remarks).val()
    }
    //console.log(reqPara);
    postRequest('ProcessLoanApproval', reqPara, function (r) {
        var res = JSON.parse(r.d);
        var status = res['result'];
        var msg = res['msg'];

        if (status === 'error') {
            toastr.success(msg);
            populateList();
        }
        if (status === 'success') {
            toastr.success(msg);
            populateList();
        }

    });
}