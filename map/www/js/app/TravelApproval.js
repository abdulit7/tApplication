'use strict';
var eid, uid, ecode, secKey, cid, lid, ename;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');

var otherInfoFlags;
var travelDetail = [];
$(function () {
    __inti();
})



function __inti() {
    getTravelApprovalList();
}

function getTravelApprovalList() {

    try {

        $('#placeholder').html(progress(' Loading '));
        postRequest('GetTravelApprovalList', {}, function (r) {
            r = JSON.parse(r.d);

            //console.log({ r });

            var travelRequests = r["TravelRequests"];
            var travelDetail = r["RequestDetail"];


            if (travelRequests.length <= 0) {
                $('#placeholder').html(data404());
                return;
            }

            var template = '';
            $.each(travelRequests, function (i, item) {

                var dtl = travelDetail.filter(function (value) {
                    return value.TravelID === item.TravelID;
                })

                var rows = '';
                var table = '';
                $.each(dtl, function (j, jitem) {
                    rows += '<tr class="active"><td>From:</td><td>' + jitem.FromAirportTitle + '</td></tr>';
                    rows += '<tr><td>To:</td><td>' + jitem.ToAirportTitle + '</td></tr>';
                    rows += '<tr><td>Travel Date:</td><td>' + getFormattedDateNew(jitem.TravelDate) + '</td></tr>';
                    rows += '<tr><td>Ticket Class:</td><td>' + jitem.AirTicketClassTitle + '</td></tr>';
                    table += '<table class="table table-condensed"><tbody>' + rows + '</tbody></table>'
                    rows = '';

                    // table += '<div class="box-header with-border header-custom"><a class="">' +
                    //     '<h4 class="box-title">View More Detail</h4>' +
                    //     '<span class="pull-right" data-toggle="collapse" data-parent="#accordion' + jitem.TranID + 'Dtl"' +
                    //     'href="#collapse' + jitem.TranID + 'Dtl" aria-expanded="true">' +
                    //     '<i onclick="viewMoreDetail(' + item.TranID + ',' + jitem.TranDtlID + ', \'' + jitem.ClaimDate + '\')"' +
                    //     ' class="fa fa-ellipsis-h"></i></span>' +
                    //     '</a></div>';

                })

                table += '<center><div class="input-area"><textarea id="txtRemarks' + item.TravelID + '" placeholder="Enter your remarks ..." class="form-control" rows="4"></textarea></div><div class="btn-group">' +
                    '<button type="button" id="btnApprove' + item.TravelID + '" onClick="processRequest(' + item.TravelID + ',\'' + item.TravelRefNo + '\',' + item.ProcessID + ',\'Approve\');" class="btn btn-success">Approve</button>' +
                    '<button type="button" id="btnReject' + item.TravelID + '" onClick="processRequest(' + item.TravelID + ',\'' + item.TravelRefNo + '\',' + item.ProcessID + ',\'Reject\');" class="btn btn-danger">Reject</button>' +
                    '<button type="button" id="btnReturn' + item.TravelID + '" onClick="processRequest(' + item.TravelID + ',\'' + item.TravelRefNo + '\',' + item.ProcessID + ',\'Return\');" class="btn btn-primary">Return</button>' +
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
                    '<table class="table table-condensed table-bordered">' +
                    '<tr><td>Scope of Travel</td><td>' + item.PurposeofTravelTitle + '</td></tr>' +
                    '<tr><td>Purpose of Travel</td><td>' + item.TravelScopeTitle + '</td></tr>' +
                    '<tr><td colspan="2"><b>Detail(s) :</b></td></tr>' +
                    '</table>' +
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

function processRequest(pTravelID, pTravelRefNo, pProcessID, pStatus) {

    if (pStatus.toLowerCase() == 'reject') {
        if (!confirm('Are you sure ?')) {
            return;
        }
    }

    var params = {
        pTravelRefNo: pTravelRefNo,
        pProcessID: pProcessID,
        pStatus: pStatus,
        pRemarks: $('#txtRemarks' + pTravelID + '').val()
    }

    //console.log({ params });

    var pStatusa = pStatus.toLowerCase() == 'approve' ? 'Approving <i class="fa fa-spinner fa-spin"></i>' : 'Approve';
    var pStatusr = pStatus.toLowerCase() == 'reject' ? 'Rejecting <i class="fa fa-spinner fa-spin"></i>' : 'Reject';
    var pStatusrt = pStatus.toLowerCase() == 'return' ? 'Returning <i class="fa fa-spinner fa-spin"></i>' : 'Return'

    EnableDisableButtonSpin($('#btnApprove' + pTravelID + ''), 'd', pStatusa, true);
    EnableDisableButtonSpin($('#btnReject' + pTravelID + ''), 'd', pStatusr, true);
    EnableDisableButtonSpin($('#btnReturn' + pTravelID + ''), 'd', pStatusrt, true);

    postRequest('TravelApprovalProcess', params, function (r) {
        var response = JSON.parse(r.d);
        if (response) {
            if (response["result"] && response['result'] === 'true') {
                toastr.success('Request ' + pStatus + ' successfully!');
                getTravelApprovalList();
            }
        }
    })

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
                template = '<table class="table table-striped table-condensed"><tbody><tr><td colspan="2"><b><i class="fa fa-calendar"></i> Attendace Detail</b></td></tr><tr><td>No Date Found!</td></tr></tbody></table>';
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
                template = '<table class="table table-striped table-condensed"><tbody><tr><td colspan="2"><b><i class="fa fa-list"></i> Task Detail</b></td></tr><tr><td>No Date Found!</td></tr></tbody></table>';
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
            template = '<table class="table table-striped table-condensed"><tbody><tr><td colspan="2"><b><i class="fa fa-plane"></i> Travel Detail</b></td></tr><tr><td>No Date Found!</td></tr></tbody></table>';
        }
        //alert(template);
        finalTemplate += template;

        doModal('Expense Detail', finalTemplate);

    });

}

