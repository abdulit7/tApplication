'use strict';

//document ready
$(function () {
    var toDatePicker, dateformat, taxDeductionList, FType, form1, $heading;

    getPayrollYear();
    taxDeductionList = $('#taxDeductionList');
    form1 = $('#form1');
    $heading = $('#heading');

    $heading.html("Tax Deductions");

    form1.on('submit', function (e) {
        form_Submit(e, taxDeductionList);
    });
});

function getPayrollYear() {
    var type, url, data, contentType, dataType, processdata, attendanceType;

    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetPayrollYear_Json";

    data = {
        pSecKey: getLocalStorageItem_String('secKey'),
        pEmployeeID: getLocalStorageItem_Int('eid'),
        pEmployeeRefNo: getLocalStorageItem_String('ecode'),
        pUserID: getLocalStorageItem_Int('uid'),
        pCompanyID: getLocalStorageItem_Int('cid')
    }

    data = JSON.stringify(data);
    contentType = "application/json;charset=utf-8";
    dataType = "json";
    processdata = true;

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: dataType,
        processdata: processdata,
        success: function (res) {
            var result, ddlPayrollYear, currentPayrollYear = "";
            result = JSON.parse(res.d);
            checkLoggedIn(result);

            ddlPayrollYear = $('#ddlPayrollYear');

            result.forEach(function (item) {
                if (item.IsCurrentPayrollYear) {
                    currentPayrollYear = item.PayrollYear;
                }
                ddlPayrollYear.append($("<option></option>").val(item.PayrollYear).text(item.PayrollYear));
            });


            if (currentPayrollYear !== "") { ddlPayrollYear.val(currentPayrollYear); }
        },
        error: OnWsError
    });
}

function form_Submit(e, ptblListBody) {
    var form1, PayrollYear, toDate;
    e.preventDefault();

    PayrollYear = $('#ddlPayrollYear').val();

    if (typeof PayrollYear === 'undefined' || PayrollYear === null || PayrollYear.trim() === "") {
        alert("Pleae select to PayrollYear");
        return;
    }

    getTaxDeductions(PayrollYear, ptblListBody);
}

function getTaxDeductions(pPayrollYear, ptblListBody) {
    var type, url, data, contentType, dataType, processdata,
        employeeID, companyID, attendanceType, secKey, employeeRefNo, userID;

    ptblListBody.html("");
    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetTaxDeduction_Json";
    employeeID = getLocalStorageItem_Int('eid');
    companyID = getLocalStorageItem_Int('cid');
    employeeRefNo = getLocalStorageItem_String('ecode');
    userID = getLocalStorageItem_Int('uid');
    secKey = getLocalStorageItem_String('secKey');

    data = {
        pSecKey: secKey,
        pEmployeeID: employeeID,
        pEmployeeRefNo: employeeRefNo,
        pUserID: userID,
        pPayrollYear: pPayrollYear,
        pCompanyID: companyID
    }

    data = JSON.stringify(data);
    contentType = "application/json;charset=utf-8";
    dataType = "json";
    processdata = true;

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: dataType,
        processdata: processdata,
        success: function (res) { getDataSuccess(res, pPayrollYear, ptblListBody) },
        error: OnWsError
    });
}

function getDataSuccess(res, pPayrollYear, ptblListBody) {
    var result, obj, anchor, childItems, TaxSummary, TaxDetail,
        totalTaxRebate;
    result = res.d;

    if (result.trim().indexOf("False") === 0) {
        alert(result);
        return;
    }

    obj = JSON.parse(result);
    checkLoggedIn(obj);
    ptblListBody.html('');
    anchor = $("<a href='#' class='list-group-item'></a>");
    childItems = "<span class='EmployeeTitle'>Tax Deductions for the Year " + pPayrollYear + "</span><br/><br/>";
    childItems += "<h4><b>Summary</b></h4>";

    TaxSummary = obj.TaxSummary[0];
    TaxDetail = obj.TaxDetail;

    totalTaxRebate = TaxSummary.AdjustmentAmount + TaxSummary.TaxAdjustment;
    totalTaxRebate = _toPrecision(totalTaxRebate, 2);

    childItems += "<p><b>Gross Taxable Income</b> <span class='pull-right'>" + numberWithCommas(TaxSummary.GrossTaxableIncome.toString()) + "</span></p>";
    childItems += "<p><b>Total Tax Payable</b> <span class='pull-right'>" + numberWithCommas(TaxSummary.TaxAmount.toString()) + "</span></p>";
    childItems += "<p><b>Total Tax Rebate‎</b> <span class='pull-right'>" + numberWithCommas(totalTaxRebate.toString()) + "</span></p>";
    childItems += "<p><b>Net Tax Payable</b> <span class='pull-right'>" + numberWithCommas(TaxSummary.TotalTaxPayable.toString()) + "</span></p>";
    childItems += "<p><b>Tax Paid to Date</b> <span class='pull-right'>" + numberWithCommas(TaxSummary.TaxPaidToDate.toString()) + "</span></p>";
    childItems += "<p><b>Remaining Tax</b> <span class='pull-right'>" + numberWithCommas((TaxSummary.TaxAmount - TaxSummary.TaxPaidToDate).toString()) + "</span></p>";

    childItems += "<h4><b>Detail</b></h4>";

    for (var index in TaxDetail) {
        var date, monthYear;
        var item = TaxDetail[index];
        date = new Date(item.Year1.toString() + '/' + item.Month1.toString() + '/1');
        monthYear = getMonthName(date) + ', ' + item.Year1.toString();
        childItems += "<p><b>" + monthYear + "</b> <span class='pull-right'>" + numberWithCommas(item.Amount1.toString()) + "</span></p>";
    };

    for (var index in TaxDetail) {
        var date, monthYear;
        var item = TaxDetail[index];
        date = new Date(item.Year2.toString() + '/' + item.Month2.toString() + '/1');
        monthYear = getMonthName(date) + ', ' + item.Year2.toString();
        childItems += "<p><b>" + monthYear + "</b> <span class='pull-right'>" + numberWithCommas(item.Amount2.toString()) + "</span></p>";
    };

    anchor.html(childItems);
    ptblListBody.append(anchor);

}