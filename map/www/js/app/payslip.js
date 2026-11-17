'use strict';
var eid, uid, ecode, secKey, cid, lid, ename;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');

var ddlYear = $('#ddlYears');
var ddlMonth = $('#ddlMonth');
var pMonth = getParameterByName('month')
if (pMonth != null) {
    pMonth = parseInt(pMonth);
}

var grossEarnings = 0;
var grossDeductions = 0;


$(function () {
    __inti();

    $('#btnShow').click(function (e) {
        e.preventDefault();
        getPayslip();
    })

})


function __inti() {
    fillYears();
}

function getPayslip() {

    var strerror = '';

    if (ddlYear.val() == 0) {
        strerror += '• Please select year!';
    }
    if (ddlMonth.val() == 0) {
        strerror += '<br>• Please select month!';
    }
    if (strerror.length > 0) {
        toastr.error(strerror);
        return;
    }

    EnableDisableButtonSpin($('#btnShow'), 'd', 'Please wait ');
    $('#lblSummary').html('');
    $('#lblSummary').hide();

    var params = {
        pYear: ddlYear.val(),
        pMonth: ddlMonth.val()
    }
    postRequest('GetPayslip_Json', params, function (r) {
        EnableDisableButtonSpin($('#btnShow'), 'e', 'Show');
        if (r.d === "SALARY404") {
            toastr.info("Salary is in Under Process!");
            $('#lblSummary').html('Salary is in Under Process!');
            $('#lblSummary').show();
            $('#payrollPlaceholder').html('');
            //jQuery('.table').hide();
            return;
        }

        r = JSON.parse(r.d);

        var allowances = r["Allowances"];
        var deductions = r["Deductions"];
        //var grossSalary = r["GrossSalary"];

        $('#payrollPlaceholder').html('');
        generateTemplate(allowances, 'Earnings');
        generateTemplate(deductions, 'Deductions');

        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        //alert(grossEarnings - grossDeductions);
        var netAmount = grossEarnings - grossDeductions;
        var summarymsg = ' Net Earned In ' + monthNames[ddlMonth.val() - 1] + ", " + ddlYear.val() + " = " + numberWithCommas(netAmount)
        //alert(summarymsg);
        $('#lblSummary').html(summarymsg);
        //jQuery('.table').show();
        //jQuery('#GrossSalary').html(grossSalary[0].GrossSalary);
        $('#lblSummary').show();

    })
}

function generateTemplate(pData, pType) {

    var rows = '';
    var totalAmount = 0;
    $.each(pData, function (i, item) {

        if (pType.toLowerCase() === 'deductions') {
            item.Amount = ((1 - item.Amount) - 1);
        }
        rows += '<tr><td>' + item.AllowanceTitle + '</td><td>' + numberWithCommas(item.Amount) + '</td></tr>';
        totalAmount += item.Amount;

    })

    if (pType.toLowerCase() === 'deductions') {
        grossDeductions = totalAmount;
    } else {
        grossEarnings = totalAmount;
    }
    totalAmount = numberWithCommas(totalAmount);

    if (pType.toLowerCase() !== 'deductions') {

    }

    var template = '<div class="box-group" id="accordion' + pType + '">' +
        '<div class="panel box box-primary">' +
        '<div class="box-header with-border">' +
        '<a data-toggle="collapse" data-parent="#accordion' + pType + '" href="#collapse' + pType + '"' +
        'aria-expanded="true" class="">' +
        '<h4 class="box-title">' +
        pType + ' ' + totalAmount +
        '</h4>' +
        '</a>' +
        '</div>' +
        '<div id="collapse' + pType + '" class="panel-collapse collapse in" aria-expanded="true" style="">' +
        '<div class="box-body no-padding">' +
        '<table class="table table-striped">' +
        '<tbody>' + rows + '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    $('#payrollPlaceholder').append(template);
}

function fillYears() {
    var objYears = [];
    var obj;
    var date, year, month;
    date = new Date();
    month = date.getMonth();

    if (month == 0) {
        month = month + 1;
    }

    if (pMonth == 0) {
        pMonth = pMonth + 1;
    }


    year = date.getFullYear();
    for (var i = year - 10; i <= year; i++) {
        obj = {
            _text: i, _value: i
        }
        objYears.push(obj);
    }
    for (var i = year + 10; i > year; i--) {
        obj = {
            _text: i, _value: i
        }
        objYears.push(obj);
    }

    function compare(a, b) {
        if (a._value < b._value) { return -1; }
        if (a._value > b._value) { return 1; }
        return 0;
    }

    objYears.sort(compare);

    var ddlYear = document.getElementById('ddlYears');
    _fillDropDown(objYears, ddlYear, '_value', '_text');
    $('#ddlYears').val(year);
    if (pMonth == null) {
        ddlMonth.val(month);
    } else {
        ddlMonth.val(pMonth);
        getPayslip();
    }


}