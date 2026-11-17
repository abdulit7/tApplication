'use strict';
var eid, uid, ecode, secKey, cid, lid, ename, pincode;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');
pincode = getLocalStorageItem_String('pincode');
var expensettachments;
var otherInfoFlags;
var travelDetail = [];
$(function () {
    __inti();
})



function __inti() {
    getExpenseApprovalList();
}

function getExpenseApprovalList() {

    try {
        $('#placeholder').html(progress(' Loading '));
        postRequest('GetExpenseApprovalList', {}, function (r) {
            r = JSON.parse(r.d);

            var expenseRequests = r["ExpenseRequests"];
            var requestDetail = r["RequestDetail"];
            travelDetail = r['TravelDetail'];
            otherInfoFlags = r['OtherInfoFlags'];
            expensettachments = r["Attachments"];

            if (expenseRequests.length <= 0) {
                $('#placeholder').html(data404());
                return;
            }

            var template = '';
            $.each(expenseRequests, function (i, item) {

                var dtl = requestDetail.filter(function (value) {
                    return value.TranID === item.TranID;
                })

                var rows = '';
                var table = '';
                $.each(dtl, function (j, jitem) {
                    rows += '<tr><td>ExpenseType:</td><td>' + jitem.AllowanceTitle + '</td></tr>';
                    rows += '<tr><td>Claim Date:</td><td>' + getDateWithMonthName(getDateByASPNETTimeStamp(jitem.ClaimDate)) + '</td></tr>';
                    rows += '<tr><td>Expense Date:</td><td>' + getDateWithMonthName(getDateByASPNETTimeStamp(jitem.ExpenseDate)) + '</td></tr>';
                    rows += '<tr><td>Rate:</td><td>' + jitem.Rate + '</td></tr>';
                    rows += '<tr><td>Quantity:</td><td>' + jitem.Quantity + '</td></tr>';
                    rows += '<tr><td>Amount:</td><td>' + jitem.Amount + '</td></tr>';
                    rows += '<tr><td>Remaks:</td><td>' + jitem.Remarks + '</td></tr>';
                    if (jitem.Latitude != 0 && jitem.Longitude != 0) {
                        rows += '<tr><td>Location:</td><td>' + jitem.Location + '</td></tr>';
                        rows += '<tr><td colspan="2" align="right"><a href="https://www.google.com/maps/search/?api=1&query=' + jitem.Latitude + ',' + jitem.Longitude + '">' + getIcon('map-marker') + jitem.Latitude + ' , ' + jitem.Longitude + '</a></td></tr>';
                    }

                    if (typeof expensettachments != 'undefined') {
                        rows += '<tr><td colspan="2"><a onclick="viewAttachment(' + jitem.TranDtlID + ');">' + getIcon('paperclip') + ' View Attachment(s)</a></td></tr>';
                    }

                    table += '<div style="border-botton:1px dashed #999;padding:10px;"><table class="table table-condensed"><tbody>' + rows + '</tbody></table>'
                    rows = '';

                    table += '<div class="box-header with-border header-custom"><a class="">' +
                        '<h4 class="box-title">' + getIcon('chevron-right') + ' View More Detail</h4>' +
                        '<span class="pull-right" data-toggle="collapse" data-parent="#accordion' + jitem.TranID + 'Dtl"' +
                        'href="#collapse' + jitem.TranID + 'Dtl" aria-expanded="true">' +
                        '<i onclick="viewMoreDetail(' + item.TranID + ',' + jitem.TranDtlID + ', \'' + jitem.ClaimDate + '\')"' +
                        ' class="fa fa-ellipsis-h"></i></span>' +
                        '</a></div></div>';

                })

                table += '<center><div class="input-area"><textarea id="txtRemarks' + item.TranID + '" placeholder="Enter your remarks ..." class="form-control" rows="4"></textarea></div><div class="btn-group">' +
                    '<button type="button" id="btnApprove' + item.TranID + '" onClick="processRequest(' + item.TranID + ',0,\'Approved\');" class="btn btn-success">Approve</button>' +
                    '<button type="button" id="btnReject' + item.TranID + '" onClick="processRequest(' + item.TranID + ',0,\'Reject\');" class="btn btn-danger">Reject</button>' +
                    '<button type="button" id="btnReturn' + item.TranID + '" onClick="processRequest(' + item.TranID + ',0,\'Return\');" class="btn btn-primary">Return</button>' +
                    '</div></center><br>';

                template +=
                    '<div class="col-md-6 col-sm-12"><div class="box-group" id="accordion' + item.TranID + '">' +
                    '<div class="panel box box-primary">' +
                    '<div class="box-header with-border"><a class="">' +
                    '<h4 class="box-title"><i class="fa fa-user"></i> ' + item.EmployeeName + '</h4>' +
                    '<span class="pull-right">' +
                    '<i data-toggle="collapse" data-parent="#accordion' + item.TranID + '"' +
                    'href="#collapse' + item.TranID + '" aria-expanded="true" onclick="jQuery(this).toggleClass(\'fa-chevron-down\');" class="fa fa-chevron-down fa-chevron-up"></i></span>' +
                    '</a></div>' +
                    '<div id="collapse' + item.TranID + '" class="panel-collapse collapse in" aria-expanded="true">' +
                    '<div class="box-body no-padding">' +
                    table +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';



            })

            $('#placeholder').html('<div class="row">' + template + '</div>');

        })

    } catch (error) {
        toastr.error(error.message)
    }

}


function processRequest(pTranID, pTranDtlID, pStatus) {

    if (pStatus.toLowerCase() == 'reject') {
        if (!confirm('Are you sure ?')) {
            return;
        }
    }

    var params = {
        pTranID: pTranID,
        pStatus: pStatus,
        pRemarks: $('#txtRemarks' + pTranID + '').val()
    }

    var pStatusa = pStatus.toLowerCase() == 'approved' ? 'Approving' : 'Approve';
    var pStatusr = pStatus.toLowerCase() == 'reject' ? 'Rejecting' : 'Reject';
    var pStatusrt = pStatus.toLowerCase() == 'return' ? 'Returning' : 'Return'

    if (pStatus.toLowerCase() == 'approved') {
        EnableDisableButtonSpin($('#btnApprove' + pTranID + ''), 'd', pStatusa);
        EnableDisableButtonSpin($('#btnReject' + pTranID + ''), 'd', pStatusr, true);
        EnableDisableButtonSpin($('#btnReturn' + pTranID + ''), 'd', pStatusrt, true);
    }

    if (pStatus.toLowerCase() == 'reject') {
        EnableDisableButtonSpin($('#btnApprove' + pTranID + ''), 'd', pStatusa, true);
        EnableDisableButtonSpin($('#btnReject' + pTranID + ''), 'd', pStatusr);
        EnableDisableButtonSpin($('#btnReturn' + pTranID + ''), 'd', pStatusrt, true);
    }

    if (pStatus.toLowerCase() == 'return') {
        EnableDisableButtonSpin($('#btnApprove' + pTranID + ''), 'd', pStatusa, true);
        EnableDisableButtonSpin($('#btnReject' + pTranID + ''), 'd', pStatusr, true);
        EnableDisableButtonSpin($('#btnReturn' + pTranID + ''), 'd', pStatusrt);
    }

    // EnableDisableButtonSpin($('#btnApprove' + pTranID + ''), 'd', pStatusa);
    // EnableDisableButtonSpin($('#btnReject' + pTranID + ''), 'd', pStatusr);
    // EnableDisableButtonSpin($('#btnReturn' + pTranID + ''), 'd', pStatusrt);    
    postRequest('ExpenseApprovalProcess', params, function (r) {
        var response = JSON.parse(r.d);
        if (response) {
            if (response["result"] && response['result'] === 'true') {
                toastr.success('Request ' + pStatus + ' successfully!');
                getExpenseApprovalList();
            }
        }
    })

}

function viewAttachment(id) {
    var reqAtt = expensettachments.filter(function (v) { return v.ExpenseTranID == id; })
    var attFlder = getBaseUrl() + 'Attachments/' + pincode + '/ExpenseAttachments/';
    var atttempalte = '';
    var ext;
    var fileName = '';
    var allowedext = ['png', 'jpg', 'jpeg', 'gif'];
    if (reqAtt.length > 0) {
        jQuery.each(reqAtt, function (i, item) {

            fileName = attFlder + item.Attachment;
            if (item.GUID == 'File404') {
                atttempalte += '<li class="list-group-item"><a>' + item.Attachment + '</a></li>'
            } else {
                ext = fileName.substr(fileName.lastIndexOf('.') + 1);
                if (allowedext.indexOf(ext) > -1) {
                    atttempalte += '<li class="list-group-item"><a href="' + fileName + '">' + item.Attachment + '</a></li>'
                } else {
                    atttempalte += '<li class="list-group-item"><a>' + item.Attachment + '</a></li>'
                }
                //window.open
                //atttempalte += '<li class="list-group-item"><a onclick="window.open(\'' + attFlder + item.Attachment + '\',\'_blank\');" >' + item.Attachment + '</a></li>'
                ///atttempalte += '<li class="list-group-item"><a href="' + attFlder + item.Attachment + '">' + item.Attachment + '</a><a download href="' + attFlder + item.Attachment + '" class="pull-right badge">Download</a></li>'
            }

        });
    } else {
        atttempalte = '<li class="list-group-item">No Attachment(s)</li>'
    }



    doModal('Attachment(s)', '<ul class="list-group">' + atttempalte + '</ul>');
}

function viewMoreDetail(pTranID, pTranDtlID, pClaimDate) {

    pClaimDate = getFormattedDateNew(pClaimDate);
    pClaimDate = pClaimDate.split('/')[1] + '/' + pClaimDate.split('/')[0] + '/' + pClaimDate.split('/')[2];
    var finalTemplate = '';
    var template = '';
    postRequest('getExpenseOtherInfo', { pTranID: pTranID, pTranDtlID: pTranDtlID, pClaimDate: pClaimDate }, function (r) {
        var result = JSON.parse(r.d);
        var da, dt;
        da = result.dtAtt;
        dt = result.dtTMS;
        //console.log({ result });
        var FlagData = otherInfoFlags[0];
        //FlagData.IsShowAttendanceOnExpense === true ? $('#divAtt' + d.TranDtlID).show() : $('#divAtt' + d.TranDtlID).hide();
        //FlagData.IsShowTMSOnExpense === true ? $('#divTMS' + d.TranDtlID).show() : $('#divTMS' + d.TranDtlID).hide();

        //console.log({ da, dt });

        var template = '';

        if (FlagData.IsShowAttendanceOnExpense && FlagData.IsShowAttendanceOnExpense == "True") {
            if (!isEmptyObj(da)) {
                $.each(da, function (i, item) {
                    template += '<tr><td>In Date</td><td>' + getFormattedDateNew(item.InDate) + '</td></tr>';
                    template += '<tr><td>In Time</td><td>' + item.InTime + '</td></tr>';
                    template += '<tr><td>Out Date</td><td>' + getFormattedDateNew(item.OutDate) + '</td></tr>';
                    template += '<tr><td>Out Time</td><td>' + item.OutTime + '</td></tr>';
                })

                template = '<table class="table table-bordered table-condensed"><tbody><tr><td colspan="2"><b><i class="fa fa-calendar"></i> Attendace Detail</b></td></tr>' + template + '</tbody></table>';
            } else {
                template = '<table class="table table-striped table-condensed"><tbody><tr><td colspan="2"><b><i class="fa fa-calendar"></i> Attendace Detail</b></td></tr><tr><td>No Data Found!</td></tr></tbody></table>';
            }
            finalTemplate += template;
        }


        template = '';

        if (FlagData.IsShowTMSOnExpense && FlagData.IsShowTMSOnExpense == "True") {
            if (!isEmptyObj(dt)) {
                $.each(dt, function (i, item) {
                    template += '<tr><td>Work Date</td><td>' + getFormattedDateNew(item.WorkDate) + '</td></tr>';
                    template += '<tr><td>Work Description</td><td>' + item.WorkDescription + '</td></tr>';
                    template += '<tr><td>Project</td><td>' + item.ProjectTitle + '</td></tr>';
                    template += '<tr><td>Customer</td><td>' + item.CustomerTitle + '</td></tr>';
                    template += '<tr><td>Status</td><td>' + item.TaskStatusTitle + '</td></tr>';
                    template += '<tr><td colspan="2"><center><span style="margin:0;">_________________________</span></td></tr>';
                })

                template = '<table class="table table-bordered table-condensed"><tbody><tr><td  colspan="2"><b><i class="fa fa-list"></i> Task Detail</b></td></tr>' + template + '</tbody></table>';
            } else {
                template = '<table class="table table-striped table-condensed"><tbody><tr><td colspan="2"><b><i class="fa fa-list"></i> Task Detail</b></td></tr><tr><td>No Data Found!</td></tr></tbody></table>';
            }
            finalTemplate += template;
        }

        template = '';
        if (!isEmptyObj(travelDetail)) {
            $.each(travelDetail, function (i, item) {
                template += '<tr><td>Travel Date</td><td>' + getFormattedDateNew(item.TravelDate) + '</td></tr>';
                template += '<tr><td>Ticket Class</td><td>' + item.AirTicketClassTitle + '</td></tr>';
                template += '<tr><td>From</td><td>' + item.FromAirportTitle + '</td></tr>';
                template += '<tr><td>To</td><td>' + item.ToAirportTitle + '</td></tr>';
                template += '<tr><td colspan="2"><center><span style="margin:0;">_________________________</span></td></tr>';
            })
            template = '<table class="table table-bordered table-condensed"><tbody><tr><td><b><i class="fa fa-plane"></i> Travel Detail</b></td></tr>' + template + '</tbody></table>';
        } else {
            template = '<table class="table table-striped table-condensed"><tbody><tr><td colspan="2"><b><i class="fa fa-plane"></i> Travel Detail</b></td></tr><tr><td>No Data Found!</td></tr></tbody></table>';
        }
        //alert(template);
        finalTemplate += template;

        doModal('Expense Detail', finalTemplate);

    });


}

