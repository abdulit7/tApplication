
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

jQuery(function () {
    init();
});

function init() {
    getComensatoryLeaveApprovalList();

    $("#btnRefresh").click(function () {
        getComensatoryLeaveApprovalList();
    });
}

function getComensatoryLeaveApprovalList() {

    try {
        $('#placeholder').html(progress(' Loading '));
        postRequest('GetCompensatoryLeaveApprovalList', { pStatus: 'Pending' }, function (r) {
            r = JSON.parse(r.d);

            var requestHead = r["Head"];
            var requestDetail = r["Detail"];

            console.log(r);

            if (requestHead.length <= 0) {
                $('#placeholder').html(data404());
                return;
            }

            var template = '';
            var statusClass = '';
            var statusIcon = '';
            var sourcepage = location.href.split("/").slice(-1);
            $.each(requestHead, function (i, item) {

                var dtl = requestDetail.filter(function (value) {
                    return value.RequestID == item.RequestID;
                })

                var rows = '';
                var table = '';
                var drows = '';

                drows += '<tr class="active"><td>No of Days</td><td>Off Day</td><td>Detail</td></tr>';
                $.each(dtl, function (j, jitem) {
                    drows += '<tr><td>' + jitem.LeaveValue + '</td><td>' + getCustomDate(getFormattedDateNew(jitem.OffDay)) + '</td><td>' + jitem.Remarks + '</td></tr>';
                });

                rows += '<tr><td>Requisition ID:</td><td>' + item.RequestNo + '</td></tr>';
                rows += '<tr><td>Requisition Date:</td><td>' + getCustomDate(getFormattedDateNew(item.RequestDate)) + '</td></tr>';
                rows += '<tr><td>Department :</td><td>' + item.DepartmentTitle + '</td></tr>';
                rows += '<tr><td>Designation :</td><td>' + item.DesignationTitle + '</td></tr>';
                rows += '<tr><td>Days Compensate:</td><td>' + item.CompensatoryLeaveDays + '</td></tr>';
                rows += '<tr><td>Status:</td><td>' + item.Status + '</td></tr>';

                rows += '<div class="table-responsive" style="margin:0;"><table class="table table-condensed"><tbody><tr class="active"><td colspan="4"><b>Detail(s)</b></td></tr>' + drows + '</tbody></table></div>';


                table += '<table class="table table-condensed"><tbody>' + rows + '</tbody></table>';

                table += '<center><div class="input-area"><textarea id="txtRemarks' + item.RequestID + '" placeholder="Enter your remarks ..." class="form-control" rows="4"></textarea></div><div class="btn-group btn-group-sm" style="margin-top:10px;">' +
                    '<button type="button" id="btnApprove' + item.RequestID + '" onClick="processRequest(\' ' + btoa(JSON.stringify(item)) + ' \' ,\'Approved\');" class="btn btn-success btn-sm">Approve  ' + getIcon('check') + '</button>' +
                    '<button type="button" id="btnReject' + item.RequestID + '" onClick="processRequest(\' ' + btoa(JSON.stringify(item)) + ' \',\'Reject\');" class="btn btn-danger btn-sm">Reject  ' + getIcon('times') + '</button>' +
                    '<button type="button" id="btnReturn' + item.RequestID + '" onClick="processRequest(\' ' + btoa(JSON.stringify(item)) + ' \',\'Return\');" class="btn btn-primary btn-sm">Return  ' + getIcon('undo') + '</button>' +
                    '</div></center><br>';

                template +=
                    '<div class="col-md-6 col-sm-12"><div class="box-group" id="accordion' + item.TranID + '">' +
                    '<div class="panel box box-primary">' +
                    '<div class="box-header with-border"><a class="">' +
                    '<h4 class="box-title"><i class="fa fa-user"></i><a href="ViewProfileCompany.html?eid=' + this.EmployeeID + '&source=' + sourcepage + '"> ' + item.EmployeeName + '</a></h4>' +
                    '<span class="pull-right">' +
                    '<i data-toggle="collapse" data-parent="#accordion' + item.RequestID + '"' +
                    'href="#collapse' + item.RequestID + '" aria-expanded="true" onclick="jQuery(this).toggleClass(\'fa-chevron-down\');" class="fa fa-chevron-down fa-chevron-up"></i></span>' +
                    '</a></div>' +
                    '<div id="collapse' + item.RequestID + '" class="panel-collapse collapse in" aria-expanded="true">' +
                    '<div class="box-body no-padding">' +
                    table +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '' +
                    '</div>';

            })

            $('#placeholder').html('<div class="row">' + template + '</div>');

        })

    } catch (error) {
        toastr.error(error.message)
    }

}

function processRequest(pRequest, pStatus) {

    pRequest = JSON.parse(atob(pRequest));
    if (pStatus.toLowerCase() == 'reject' || pStatus.toLowerCase() == 'return') {
        if (!confirm('Are you sure to ' + pStatus.toLowerCase() + ' ?')) {
            return;
        }
    }


    var _pTranID = pRequest.RequestID;
    var params = {
        // pTranID: _pTranID,
        // pStatus: pStatus,
        // pRemarks: $('#txtRemarks' + _pTranID + '').val()
        pRequestID: pRequest.RequestID,
        pRequestNo: pRequest.RequestNo,
        pRequisitionEmployeeID: pRequest.EmployeeID,
        pTaskID: pRequest.TaskID,
        pProcessID: pRequest.ProcessID,
        pWorkFlowGroupID: pRequest.WorkFlowGroupID,
        pApprovalStatus: pStatus,
        pRemarks: $('#txtRemarks' + _pTranID + '').val(),
    }

    var pStatusa = pStatus.toLowerCase() == 'approved' ? 'Approving' : 'Approve';
    var pStatusr = pStatus.toLowerCase() == 'reject' ? 'Rejecting' : 'Reject';
    var pStatusrt = pStatus.toLowerCase() == 'return' ? 'Returning' : 'Return'

    EnableDisableButtonSpin($('#btnApprove' + _pTranID + ''), 'd', pStatusa);
    EnableDisableButtonSpin($('#btnReject' + _pTranID + ''), 'd', pStatusr);
    EnableDisableButtonSpin($('#btnReturn' + _pTranID + ''), 'd', pStatusrt);

    postRequest('ProcessCompensatoryLeaveRequest', params, function (r) {

        r = JSON.parse(r.d);

        var res = r.result;
        var msg = r.msg;

        if (res === "success") {
            toastr.success(msg);

        } else {
            toastr.error(msg);
        }
        getComensatoryLeaveApprovalList();


    })

}

function getCustomDate(strDate) {
    return new Date(strDate.split("/")[2], strDate.split("/")[1], strDate.split("/")[0]).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}

