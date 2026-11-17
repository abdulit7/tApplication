'use strict';

//document ready
$(function () {
    var toDatePicker, dateformat, loanSummaryList, FType, form1, $heading;

    toDatePicker = $('#toDatePicker');
    loanSummaryList = $('#loanSummaryList');
    form1 = $('#form1');
    $heading = $('#heading');
    dateformat = getLocalStorageItem_String('dateformat').toUpperCase();

    $heading.html("Loan Summary");
    
    toDatePicker.datetimepicker({
        format: dateformat,
        ignoreReadonly: true
    });

    toDatePicker.data("DateTimePicker").date(new Date());

    form1.on('submit', function (e) {
        form_Submit(e, loanSummaryList);
    });
});

function form_Submit(e, ptblListBody) {
    var form1, toDate, toDate;
    e.preventDefault();

    form1 = $('#' + e.target.id);
    toDate = form1.find('input[id="txttoDate"]').val();    

    if (toDate.trim() === "") {
        alert("Pleae select to Date");
        return;
    }

    getViewAttendanceData(toDate, ptblListBody);
}

function getViewAttendanceData(pToDate, ptblListBody) {
    var type, url, data, contentType, dataType, processdata,
        employeeID, companyID, attendanceType, secKey, employeeRefNo, userID;

    ptblListBody.html("");
    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetLoanSummary_Json";
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
        pToDate: pToDate,
        pAttendanceType: attendanceType,
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
        success: function (res) { getDataSuccess(res, ptblListBody) },
        error: OnWsError
    });
}

function getDataSuccess(res, ptblListBody) {
    var result, obj,  dateformat, timeFormat, FType, dateformat;
    result = res.d;

    if (result.trim().indexOf("False") === 0) {
        alert(result);
        return;
    }
    obj = JSON.parse(result);
    checkLoggedIn(obj);
    ptblListBody.html('');
    FType = getParameterByName("FType");    

    dateformat = getLocalStorageItem_String("dateformat");
    timeFormat = getLocalStorageItem_String("timeformat");
    
    //console.log({obj});

    for(var index in obj) {
        var balance,status,loanDate;
        var item = obj[index];

        balance = item.LoanAmount - item.RecoveredAmount;
        loanDate = getDateByASPNETTimeStamp(item.LoanTranDate);
        loanDate = DTHelper.GetFormattedDate(loanDate,dateformat);

        $("<a href='#' class='list-group-item'></a>").html("<span class='EmployeeTitle'>" + item.AllowanceTitle + "</span>"
            + "<br />"
            + "<p><b>Loan ID</b> : <span class='pull-right'>"+ item.LoanTranRefNo +"</span></p>" 
            + "<p><b>Loan Date</b> <span class='pull-right'>"+ loanDate +"</span></p>" 
            + "<p><b>Loan Amount</b> <span class='pull-right'>"+ item.LoanAmount +"</span></p>" 
            + "<p><b>Installment Amount</b> <span class='pull-right'>"+ item.InstallmentAmount +"</span></p>" 
            + "<p><b>Balance</b> <span class='pull-right'>"+ balance +"</span></p>" 
            + "<p><b>Non-Returnable</b> <span class='pull-right'>"+ item.IsNonReturnable +"</span></p>"

        ).appendTo(ptblListBody);
    };
}