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
var FType = '';

var ddlYear = $('#ddlPayrollYear');

var _populateList = getParameterByName('populateList');
var _showMsg = getParameterByName('showMsg');

$(function ($) {
    FType = getParameterByName('FType');
    $('#lblPageTitle').html(FType + ' Request List');
    init(FType);
});

function init(pftype) {

    if (_showMsg === 'true') {
        toastr.success('Request Submitted Successfully!');
    }
    if (_populateList === 'true') {
        // populateList();
    }

    FillPayrollYear();
    var dt = new Date();
    var selectedOption = dt.getFullYear() - 1 + '-' + dt.getFullYear();


    //ddlYear.text(selectedOption);


}

$('#btnShow').click(function (e) {
    populateList();
});



function showLoanDetail(pTranID, pProcessID, pInstallmentDate, pValueDate, pAllowanceID, pLoanAmount, pNoOfInstallment, pInstallmentAmount, e) {
    EnableDisableButtonSpin($('#btnp' + pTranID), 'd', 'Please wait ');

    try {

        var _parms = {
            pLoanID: pTranID,
            pLoanTypeID: pAllowanceID,
            pLoanDate: pValueDate,
            pLoanAmount: parseFloat(pLoanAmount),
            pInstallmentDate: pInstallmentDate,
            pInstallmentAmount: parseFloat(pInstallmentAmount),
            pNoOfInstallment: pNoOfInstallment,
            pOperationType: 'view'
        }

        var template = '';
        var template2 = '';
        postRequest('GetLoanScheduleDetails', _parms, function (r) {
            var res = JSON.parse(r.d);
            var totalInstl = -1;
            //console.log({ res });
            $.each(res, function (i, item) {
                var IsExempted = '';
                var IsPending = '';
                var IsPaid = '';
                var IsShowLabel = '';
                var InstallemntNo = i + 1;
                if (item.Process.toLowerCase() === 'exempted') {
                    IsExempted = 'exempted';
                    IsShowLabel = 'hide';
                }
                if (item.Process.toLowerCase() === 'pending') {
                    IsPending = 'pending';
                }
                if (item.Process.toLowerCase() === 'paid') {
                    IsPaid = 'paid';
                }
                totalInstl++;
                if (item.InstallmentNo !== 0) {

                    template += '<div><span class="label label-primary ' + IsShowLabel + '">Installment #' + InstallemntNo + '</span><span class="label label-default pull-right ' + IsPaid + IsExempted + IsPending + '">' + item.Process + '</span></div>' +
                        '<div class="panelshadow panelshadow2">' +
                        '<div class="table-responsive ' + IsExempted + IsPending + IsPaid + '"><table class="table table-condensed" style="margin-bottom:0px;">' +
                        '<tr><th>Date</th><td>' + item.LoanDate + '</td><th>Loan Amount</th><td>' + numberWithCommas(item.LoanRem) + '</td></tr >' +
                        '<tr><th>Instl Amt</td><td>' + numberWithCommas(item.LoanDeduction) + '</td><th>Instl + Markup</th><td>' + numberWithCommas(item.InstallmentAmount) + '</td></tr >' +
                        //                        '<tr><th>Markup %</th><td>' + item.MarkupRate + '</td><th>Status</td><td>' + item.Process + '</td></tr >' +
                        '</table></div>' +
                        '</div><br>';
                } else {
                    template2 += '<div class="panelshadow panelshadow2">' +
                        '<table class="table" style="margin-bottom:0px;">' +
                        '<tr><th>Total Installemnt(s)</th><td>' + totalInstl + '</td></tr >' +
                        '<tr><th>Total Installemnt Amount</th><td>' + numberWithCommas(item.LoanDeduction) + '</td></tr >' +
                        '<tr><th>Total Instl+Markup Amount </th><td>' + numberWithCommas(item.InstallmentAmount) + '</td></tr >' +
                        '</table>' +
                        '</div><hr>';

                }
            });
            //template = '';
            $('#modalLoanPlanner .modal-body').html(template2 + template);
            EnableButton($('#btnp' + pTranID), 'View Detail');

            $("#modalLoanPlanner").modal({ show: true });
        });

    } catch (error) {
        alert();
        EnableDisableButtonSpin($('#btnp' + pTranID), 'e', 'View Detail');
    }

}

function DeleteRequest(pTranID, pProcessID, pReferenceNo, pEmployeeRefNoReq, pAllowanceTitle, pLoanAmount, e) {

    if (confirm('Are you sure to delete this request ? ')) {
        EnableDisableButtonSpin($('#btn' + pTranID), 'd', 'Deleting Request ');
        var deletePara = {
            pTranID: pTranID,
            pProcessID: pProcessID,
            pReferenceNo: pReferenceNo,
            pEmployeeRefNoReq: pEmployeeRefNoReq,
            pAllowanceTitle: pAllowanceTitle,
            pLoanAmount: pLoanAmount
        }
        postRequest('DelteLoanRequest', deletePara, function (r) {
            var res = JSON.parse(r.d);
            var status = res['result'];
            var msg = res['msg'];
            if (status === 'error') {
                toastr.error('You can\'t delete this request as if is may be in use by other process(s)!');
                EnableDisableButtonSpin($('#btn' + pTranID), 'e', 'Delete Request &nbsp;&nbsp; <i class="fa fa-trash"></i>');
            } else {
                toastr.success('Request Deleted Successfully!');
                populateList();
            }
        });
    }
    //console.log($(''));


}
function FillPayrollYear() {
    //var _PID4 = pFType.toLowerCase() === 'loan' ? "And BaseEntry IN ('Loan','GLoan','CTFLoan','PFLoan','GTLoan','GLoanAmortization')" : "And BaseEntry IN ('Advance')";
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        PID1: 'tblPayrollYear',
        PID2: "PayrollYear as 'PayrollYear2'",
        PID3: "LEFT(CONVERT(VARCHAR, PayrollYearStart, 120), 10) + '|' + LEFT(CONVERT(VARCHAR, PayrollYearEnd, 120), 10) as 'PayrollYear'",
        pCompanyID: cid,
        PID4: ""
    }
    var ddlPayrollYear = document.getElementById("ddlPayrollYear");
    fillDropDownGeneric(params, ddlPayrollYear, false, 0);
}

function populateList() {
    postRequest('GetLoanORAdvanceListByPayrollYear', { pFromToDate: ddlYear.val(), pType: FType }, function (r) {
        var res = JSON.parse(r.d);
        if (isEmptyObj(res)) {
            $('#list').html('<center>No Data Found!</center>');
            return;
        }
        //console.log(res);
        var template = '';
        var statusClass = '';
        var statusIcon = '';
        var IsShowDetialBtn = 'show';
        var hideDetailBtnIfNoReturnableorAdvanceSalary = 'show';
        if (FType.toLowerCase() !== 'loan') {
            hideDetailBtnIfNoReturnableorAdvanceSalary = 'hide';
        }

        $.each(res, function (i, item) {
            var _NoReturnable = item.IsNonReturnable === true ? "checked" : "unchecked";
            //console.log(_NoReturnable);
            if (item.IsNonReturnable === true || FType.toLowerCase() !== 'loan') {
                IsShowDetialBtn = 'hide';
            } else {
                IsShowDetialBtn = 'show';
            }
            template +=

                '<div class="col-md-6 panel panelshadow">' +
                '<span id="surveyTitle" class="surveytitle EmployeeTitle"> <small><i class="fa fa-money"></i></small><span style="color:#999;"> Req ID. </span> ' + item.ReferenceNo + ' <div onClick="toggleDesc(' + parseInt(item.ReferenceNo) + ');" class="hide pull-right toggleDesc"><i id="icon' + parseInt(item.LeaveTranRefNo) + '" class="fa fa-chevron-down" aria-hidden="true"></i></div></span>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-6"><span class="surveylbl">Employee</span></div>' +
                '<div class="col-xs-6"><span id="" class="surveytxt">' + item.EmployeeName + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-6"><span class="surveylbl">Loan Date</span></div>' +
                '<div class="col-xs-6"><span id="" class="surveytxt">' + getFormattedDateNew(item.ValueDate) + '</span></div>' +
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
                '<div class="col-xs-6"><span id="" class="surveytxt">' + numberWithCommas(item.LoanAmount) + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-6"><span class="surveylbl">Installment Amount</span></div>' +
                '<div class="col-xs-6"><span id="" class="surveytxt">' + numberWithCommas(item.InstallmentAmount) + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row ' + hideDetailBtnIfNoReturnableorAdvanceSalary + '">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-6"><span class="surveylbl">Installment Date</span></div>' +
                '<div class="col-xs-6"><span id="" class="surveytxt">' + getFormattedDateNew(item.InstallmentStartDate) + '</span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row ' + hideDetailBtnIfNoReturnableorAdvanceSalary + '">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-6"><span class="surveylbl">Non-Returnable</span></div>' +
                '<div class="col-xs-6"><span id="" class="surveytxt"><input disabled type="checkbox" ' + _NoReturnable + ' ></span></div>' +
                '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-6"><span class="surveylbl">Status</span></div>' +
                '<div class="col-xs-6"><span id="" class="surveytxt">' + item.Status + '</span></div>' +
                '</div>' +
                '</div>' +
                '<br class="' + IsShowDetialBtn + '"><button id="btnp' + item.TranID + '" onClick="showLoanDetail(' + item.TranID + ' , ' + item.ProcessID + ', \'' + getFormattedDateNew(item.InstallmentStartDate) + '\', \'' + getFormattedDateNew(item.ValueDate) + '\',' + item.AllowanceID + ',' + item.LoanAmount + ',' + item.NoOfInstallment + ' ,' + item.InstallmentAmount + ')" type="button" class="btn btn-block btn-primary btn-xs ' + hideDetailBtnIfNoReturnableorAdvanceSalary + ' ' + IsShowDetialBtn + '">View Details &nbsp;&nbsp; <i class="fa fa-long-arrow-right"></i></button>' +
                '<button  id="btn' + item.TranID + '" onClick="DeleteRequest(' + item.TranID + ' , ' + item.ProcessID + ', \'' + item.ReferenceNo + '\',\'' + item.EmployeeRefNo + '\',\'' + item.AllowanceTitle + '\', ' + item.LoanAmount + ')" type="button" class="btn btn-block btn-danger btn-xs hide">Delete Request &nbsp;&nbsp; <i class="fa fa-trash"></i></button>' +

                '</div>'

                ;
        });
        $('#list').html(template);

    });
}