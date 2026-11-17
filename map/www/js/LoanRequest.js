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

var txtRequester = $('#txtRequester');
var ddlLoanType = $('#ddlLoanType');
var txtLoanDate = $('#txtLoanDate');
var txtLoamAmount = $('#txtLoamAmount');
var ddlLoanType = $('#ddlLoanType');
var txtNoOfInstallment = $('#txtNoOfInstallment');
var txtInstallmentAmount = $('#txtInstallmentAmount');
var txtInstallmentDate = $('#txtInstallmentDate');
var btnPlanner = $('#btnPlanner');
var chkReturnable = $('#chkReturnable');
var txtOpeningAdjustment = $('#txtOpeningAdjustment');
var txtRemarks = $('#txtRemarks');
var FType = '';

$(function($) {
    FType = getParameterByName('FType');
    $('#lblPageTitle').html(FType + ' Request');
    init(FType);

    // Loan Type Change
    $('#ddlLoanType').change(function(e) {
        var template = '';
        try {



            var allowanceTypeAndbaseType = $(this).val();
            if (allowanceTypeAndbaseType === '0') {
                template = '';
                $('#divLoanType').append(template);
                $('#pfTemplate').remove();
                return;
            }
            var allowanceType = allowanceTypeAndbaseType.split('$')[0];
            var baseType = allowanceTypeAndbaseType.split('$')[1];

            if (baseType.toLowerCase() === 'pfloan') {

                template =
                    '<div id="pfTemplate">' +
                    '<button class="btn btn-primary btn-xs btn-block" type="button" onCLick="viewPFBalance();"> View PF Balance  &nbsp;&nbsp;&nbsp; <i class="fa fa-angle-down"></i></button>' +
                    '<div id="pfBalance" class="panel panelshadow" style="display:none;">' +
                    '</div>' +
                    '</div> ';
                $('#divLoanType').append(template);
            } else {
                template = '';
                $('#pfTemplate').html(template);
            }

            if (FType.toLowerCase() === 'advance') {
                postRequest('GetAdvanceLoanLimit', { pLoanDate: txtLoanDate.val() }, function(r) {
                    txtLoamAmount.val(parseFloat(r.d));
                });
            }
            if (IsPrincipleAmountDerivedFromInstallmentAmount.toLowerCase() == 'true') {
                getMarkupRate();
            }





        } catch (error) {
            $('#pfTemplate').html('');
            toastr.error(error);
        }

    });

    btnPlanner.click(function(e) {

        if (validate(FType)) {
            EnableDisableButtonSpin($(this), 'd');
            var _parms = {
                pLoanID: -1000,
                pLoanTypeID: ddlLoanType.val().split('$')[0],
                pLoanDate: txtLoanDate.val(),
                pLoanAmount: parseFloat(txtLoamAmount.val()),
                pInstallmentDate: (txtInstallmentDate.val()),
                pInstallmentAmount: parseFloat(txtInstallmentAmount.val()),
                pNoOfInstallment: txtNoOfInstallment.val(),
                pOperationType: 'insert'
            }

            var template = '';
            var template2 = '';
            postRequest('GetLoanScheduleDetails', _parms, function(r) {
                var res = JSON.parse(r.d);
                var totalInstl = -1;
                $.each(res, function(i, item) {
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
                EnableButton(btnPlanner, 'View Loan Planner');
                $("#modalLoanPlanner").modal({ show: true });
            });

            //modalLoanPlanner

        }

    });

    $('#txtLoamAmount').on('keyup', function() {
        calcInstallmentAmount(txtLoamAmount.val(), txtNoOfInstallment.val());
    });

    $('#txtInstallmentAmount').on('keyup', function() {
        // if (IsPrincipleAmountDerivedFromInstallmentAmount.toLocaleLowerCase() == 'true') {
        //     getMarkupRate();
        // }
        calcNoOfInstallment(txtLoamAmount.val(), txtInstallmentAmount.val());
    });

    $('#txtNoOfInstallment').on('keyup', function() {
        // if (IsPrincipleAmountDerivedFromInstallmentAmount.toLocaleLowerCase() == 'true') {
        //     getMarkupRate();
        // }
        calcInstallmentAmount(txtLoamAmount.val(), txtNoOfInstallment.val());
    });
});

var IsPrincipleAmountDerivedFromInstallmentAmount = 'false';
function init(pFtype) {

    postRequest('GetFlagValueGeneric', { pFlagName: 'IsPrincipleAmountDerivedFromInstallmentAmount^False' }, function(mres) {

        postRequest('GetFlagValueGeneric', { pFlagName: 'IsOpeningAdjustmentOnLoan' }, function(res) {
            if (res.d === 'True' && FType.toLowerCase() === 'loan') {
                $('#divOpeningAdjustment').show();
                txtOpeningAdjustment.val(0);
            } else {
                $('#divOpeningAdjustment').hide();
                txtOpeningAdjustment.val(0);
            }
        });

        if (mres.d === 'True' && FType.toLowerCase() === 'loan') {
            IsPrincipleAmountDerivedFromInstallmentAmount = 'true'
            txtInstallmentAmount.attr('disabled', true);
            //getMarkupRate();
        }

        txtRequester.html(ename);
        txtLoanDate.val(sysdate);
        txtInstallmentDate.val(sysdate);

        $("#datetimepicker0").datetimepicker({
            format: dateformat.toUpperCase(),
            ignoreReadonly: true
        });


        $("#datetimepicker1").datetimepicker({
            format: dateformat.toUpperCase(),
            ignoreReadonly: true
        }).on('dp.change', function(e) {
            e.preventDefault();
            getMarkupRate();
        });


        if (pFtype.toLowerCase() === 'advance') {
            txtNoOfInstallment.val(0);
            FillLoanType(FType);
        } else {
            FillLoanType(FType);
            $('#divNotAdvanceLoanThings').show();
        }




    });

}

var markupRate = 0;
function getMarkupRate() {
    var params;
    params = {
        pAllowanceID: ddlLoanType.val().split('$')[0],
        pEmployeeID: eid,
        pInstallmentStartingDate: txtInstallmentDate.val(),
        pCompanyID: cid
    };
    postRequest('GetMarkupRateByAllowance', params, function(res) {

        markupRate = res.d;
        calcInstallmentAmount(txtLoamAmount.val(), txtNoOfInstallment.val());
        //alert(markupRate);
    }, null, true);
}

function FillLoanType(pFType) {
    var _PID4 = pFType.toLowerCase() === 'loan' ? "And BaseEntry IN ('Loan','GLoan','CTFLoan','PFLoan','GTLoan','GLoanAmortization')" : "And BaseEntry IN ('Advance')";
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        PID1: 'tblAllowance',
        PID2: 'AllowanceTitle',
        PID3: "cast(AllowanceID as varchar) + '$' + BaseEntry as 'AllowanceID'",
        pCompanyID: cid,
        PID4: _PID4
    }
    var ddlLoanType = document.getElementById("ddlLoanType");
    fillDropDownGeneric(params, ddlLoanType, true, 0);
}


function returnableChecked(e) {
    var isChecked = event.target.checked;
    if (isChecked) {
        $('#divNonReturnable').slideToggle();
        txtNoOfInstallment.val(0);
        txtInstallmentAmount.val(0);
        // txtNoOfInstallment.prop("disabled", true);
        // txtInstallmentAmount.prop("disabled", true);
        // btnPlanner.prop("disabled", true);
    } else {
        $('#divNonReturnable').slideToggle();
        // txtNoOfInstallment.prop("disabled", false);
        // txtInstallmentAmount.prop("disabled", false);
        // btnPlanner.prop("disabled", false);
    }

}

function viewPFBalance() {
    $('#pfTemplate button').prop("disabled", true);
    $('#pfBalance').fadeIn();
    $('#pfBalance').html('<center>loading &nbsp;<i class="fa fa-spinner fa-spin"></i></center>');
    var template = '';
    postRequest('GETPFBalance', {}, function(res) {
        var data = res.d;
        var data = data.split('^');
        var PFDate = [
            {
                Particular: 'Contribution',
                Employee: data[16],
                Employeer: data[17]
            },
            {
                Particular: 'Profit',
                Employee: data[20],
                Employeer: data[21]
            },
            {
                Particular: 'Withdrawl',
                Employee: data[18],
                Employeer: data[19]
            },
            {
                Particular: 'Total',
                Employee: data[22],
                Employeer: data[23]
            },
            {
                Particular: 'Balance',
                Employee: '',
                Employeer: data[24]
            }
        ];
        template = obj2htmltable(PFDate);
        $('#pfBalance').html(template);
        $('#pfTemplate button').prop("disabled", false);

    });

}

$('#frmLoanRequest').submit(function(e) {
    e.preventDefault();

    if (validate(FType) === false) return;
    EnableDisableButtonSpin($('#btnSave'), 'd');
    var _InstallmentAmt = FType.toLowerCase() === 'advance' ? txtLoamAmount.val() : txtInstallmentAmount.val();
    var _NoOfInstallment = FType.toLowerCase() === 'advance' ? 1 : txtNoOfInstallment.val();

    var para_ = {
        pLoanDate: txtLoanDate.val(),
        pAllowanceID: ddlLoanType.val().split('$')[0],
        pLoanAmount: txtLoamAmount.val(),
        pIsNonReturnAble: chkReturnable.is(":checked"),
        pInstallmentDate: txtInstallmentDate.val(),
        pInstallmentCount: _NoOfInstallment,
        pInstallmentAmount: _InstallmentAmt,
        pOpenAbj: txtOpeningAdjustment.val(),
        pRemakrs: txtRemarks.val(),
        pType: FType.toLowerCase(),
    }
    postRequest('SaveLoanORAdvanceRequest', para_, function(r) {
        var res = JSON.parse(r.d);
        var status = res['result'];
        var msg = res['msg'];
        if (status === 'error') {
            toastr.error(msg);
            EnableDisableButtonSpin($('#btnSave'), 'e', 'Save');
        } else {
            window.location.replace('LoanRequestList.html?FType=' + FType + '&showMsg=true');
            //toastr.success(msg);
        }
        EnableDisableButtonSpin($('#btnSave'), 'e', 'Save');
    });

});


function calcNoOfInstallment(ploanAmt, pInstallmentAmt) {
    try {
        var _value = parseFloat(ploanAmt) / parseFloat(pInstallmentAmt);
        txtNoOfInstallment.val(_value.toFixed());
    } catch (error) {
        txtNoOfInstallment.val(0);
    }

}

function calcInstallmentAmount(ploanAmt, pNoOfInstallment) {

    try {
        //alert(ploanAmt);
        if (IsPrincipleAmountDerivedFromInstallmentAmount.toLocaleLowerCase() == 'true') {

            var noOfInstallments, loanAmount, _markupRate, installmentAmount;
            _markupRate = parseFloat(markupRate);
            _markupRate = (_markupRate / 100) / 12;
            noOfInstallments = parseInt(pNoOfInstallment);
            loanAmount = parseFloat(ploanAmt);
            installmentAmount = 0;

            if (markupRate > 0 && noOfInstallments > 0 && loanAmount > 0) {
                installmentAmount = -pmt(_markupRate, pNoOfInstallment, loanAmount, 0, 0);
            }
            txtInstallmentAmount.val(Efro.Round(installmentAmount, 0));


        } else {
            var _value = parseFloat(ploanAmt) / parseFloat(pNoOfInstallment);
            txtInstallmentAmount.val(Efro.Round(_value, 0));
        }


    } catch (error) {
        txtInstallmentAmount.val(0);
    }

}

function validate(vFtype) {
    var result = false;
    var msg = '';
    msg += ddlLoanType.val() === '0' ? '• Loan type! <br>' : '';
    msg += txtLoamAmount.val() <= 0 || txtLoamAmount.val() === '' ? '• Loan amount!  <br>' : '';
    if (vFtype.toLowerCase() === 'loan') {
        if (chkReturnable.is(':checked') === false) {
            msg += txtNoOfInstallment.val() <= 0 || txtNoOfInstallment.val() === '' ? '•  No of installments! <br>' : '';
            msg += txtInstallmentAmount.val() <= 0 || txtInstallmentAmount.val() === '' ? '• Installment amount! <br>' : '';
        }
    }

    if (msg.trim().length > 0) {
        result = false;
        toastr.error("Plese fill in all required fileds! <br>" + msg);
    } else {
        result = true;
    }



    return result;
}

function obj2htmltable(obj) {

    var thead = '';
    var key = Object.keys(obj[0]);
    $.each(key, function(i, item) {
        thead += '<th>' + item + '</th>';
    });
    var tbody = '';
    $.each(obj, function(i, item) {
        tbody += '<tr><td>' + item.Particular + '</td><td align="right">' + numberWithCommas(item.Employee) + '</td><td align="right">' + numberWithCommas(item.Employeer) + '</td></tr>';
    });

    var table = '<table class="table table-condensed"><tr>' + thead + '</tr>' + tbody + '</talbe>'
    return table;


}

// Copied From TimeTrax WEB

var Efro = {};
Efro.Round = function(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};

function pmt(rate_per_period, number_of_payments, present_value, future_value, type) {
    if (rate_per_period != 0.0) {
        // Interest rate exists
        var q = Math.pow(1 + rate_per_period, number_of_payments);
        return -(rate_per_period * (future_value + (q * present_value))) / ((-1 + q) * (1 + rate_per_period * (type)));

    } else if (number_of_payments != 0.0) {
        // No interest rate, but number of payments exists
        return -(future_value + present_value) / number_of_payments;
    }

    return 0;
}