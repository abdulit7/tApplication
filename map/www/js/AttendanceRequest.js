
'use strict';

//Document ready
$(function () {
    var dateformat, txtScheduleDate, $OutDatePicker, $InTimePicker, $OutTimePicker, scheduleDate;
    dateformat = getLocalStorageItem_String("dateformat").toUpperCase();
    txtScheduleDate = $('#txtScheduleDate');

    scheduleDate = getParameterByName('sd');

    if (!isNull(scheduleDate) && scheduleDate.trim() !== '') {
        getAttendanceDetails(scheduleDate, true);
    }

    $OutDatePicker = $('#OutDatePicker');
    $InTimePicker = $('#InTimePicker');
    $OutTimePicker = $('#OutTimePicker');
    $('#ScheduleDatePicker').datetimepicker({
        format: dateformat,
        ignoreReadonly: true
    });

    $('#InDatePicker').datetimepicker({
        format: dateformat,
        ignoreReadonly: true
    });

    $OutDatePicker.datetimepicker({
        format: dateformat,
        ignoreReadonly: true
    });

    $InTimePicker.datetimepicker({
        format: "HH:mm",
        ignoreReadonly: true
    });

    $OutTimePicker.datetimepicker({
        format: "HH:mm",
        ignoreReadonly: true
    });

    //$OutDatePicker.data('DateTimePicker').date(new Date('2018-01-01'));    

    //$('#txtOutDate').prop('readonly',true);

    //bindMask();

    $("#btnShow").click(function () {
        var date;
        date = txtScheduleDate.val();

        if (date.trim() === "") {
            toastr.error('Please pick a date');
            return;
        }

        getAttendanceDetails(date, false);
    });

    $("#form1").on('submit', form_submit);
});

function getAttendanceDetails(pDate, pFillForm) {
    var type, url, data, contentType, dataType, processdata, employeeID, companyID, ecode, uid, secKey, $btnSubmit;

    companyID = getLocalStorageItem_Int('cid');
    employeeID = getLocalStorageItem_Int('eid');
    uid = getLocalStorageItem_Int('uid');
    ecode = getLocalStorageItem_String('ecode');
    secKey = getLocalStorageItem_String('secKey');

    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetAttendanceDetailsJSON";
    data = {
        pSecKey: secKey,
        pEmployeeID: employeeID,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pDate: pDate,
        pCompanyID: companyID
    };
    data = JSON.stringify(data);
    contentType = "application/json; charset=utf-8";
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
            if (!pFillForm) {
                getAttendanceDetailsSuccess(res);
            }
            else {
                DisplayData(res);
            }
            //EnableButton($btnSubmit,'Submit');
        },
        error: function (err) {
            OnWsError(err);
            //EnableButton($btnSubmit,'Submit');
        }
    });
}

function getAttendanceDetailsSuccess(res) {
    var obj, actualAttendance;
    obj = JSON.parse(res.d);
    checkLoggedIn(obj);

    if (Object.keys(obj).length > 0) {
        obj = obj[Object.keys(obj)[0]];
        //console.log('obj : ', obj);

        actualAttendance = GetAttendanceRow(obj._InDate, obj.InTime, obj._OutDate, obj.OutTime);
        $('#divAcualAttendance').css('display', '');
        $('#lblActualAttendance').html('Actual : ' + actualAttendance);

    }
}

function DisplayData(res) {
    var obj, actualAttendance, inDate, defaultDate, scheduleInDate;
    obj = JSON.parse(res.d);
    checkLoggedIn(obj);

    if (Object.keys(obj).length > 0) {
        obj = obj[Object.keys(obj)[0]];

        defaultDate = new Date('1900-01-01 12:00:00 AM');
        inDate = new Date(obj._InDate);
        scheduleInDate = new Date(obj._ScheduleDate);

        $('#ScheduleDatePicker').data('DateTimePicker').date(scheduleInDate);
        if (inDate.toLocaleDateString() !== defaultDate.toLocaleDateString()) {
            $('#InDatePicker').data('DateTimePicker').date(inDate);
            $('#OutDatePicker').data('DateTimePicker').date(new Date(obj._OutDate));
        }
        else {
            $('#InDatePicker').data('DateTimePicker').date(scheduleInDate);
            $('#OutDatePicker').data('DateTimePicker').date(scheduleInDate);
        }
        $('#InTimePicker').data('DateTimePicker').date(new Date('1900-01-01 ' + obj.InTime));
        $('#OutTimePicker').data('DateTimePicker').date(new Date('1900-01-01 ' + obj.OutTime));
    }
}

function GetAttendanceRow(pInDate, pInTime, pOutDate, pOutTime) {
    var inDate, outDate, result, dateformat, timeFormat;
    dateformat = getLocalStorageItem_String('dateformat');

    //console.log(pInDate, pInTime, pOutDate, pOutTime);

    inDate = DTHelper.GetFormattedDate(new Date(pInDate), dateformat);
    outDate = DTHelper.GetFormattedDate(new Date(pOutDate), dateformat);

    //console.log(inDate, outDate);

    inDate = inDate + ' ' + pInTime;
    outDate = outDate + ' ' + pOutTime;
    result = inDate + ' - ' + outDate;
    //console.log(result);
    return result;
}

function form_submit(e) {
    var type, url, data, contentType, dataType, processdata, employeeID, companyID,
        form, requesterID, requestDate, employeeID, companyID, scheduleDate, attendanceType, inDate, inTime, outDate,
        outTime, remarks, ecode, secKey, uid, $btnSubmit;
    e.preventDefault();

    $btnSubmit = $('#btnSubmit');

    form = $('#' + e.target.id);
    scheduleDate = form.find('input[id="txtScheduleDate"]').val();
    attendanceType = form.find('select[id="ddlAttendancetype"]').val();
    inDate = form.find('input[id="txtInDate"]').val();
    inTime = form.find('input[id="txtInTime"]').val();
    outDate = form.find('input[id="txtOutDate"]').val();
    outTime = form.find('input[id="txtOutTime"]').val();
    remarks = form.find('textarea[id="txtRemarks"]').val();

    employeeID = getLocalStorageItem_Int("eid");
    requesterID = getLocalStorageItem_Int("eid");
    companyID = getLocalStorageItem_Int("cid");
    uid = getLocalStorageItem_Int('uid');
    ecode = getLocalStorageItem_String('ecode');
    secKey = getLocalStorageItem_String('secKey');
    requestDate = DTHelper.GetFormattedDate(new Date(), getLocalStorageItem_String("dateformat"));

    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/SaveAttendanceRequestJSON";

    if (!validateFields(scheduleDate, attendanceType, inDate, inTime, outDate, outTime, remarks)) { return; }

    DisableButton($btnSubmit, 'Submitting...');

    data = {
        pSecKey: secKey,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pRequesterID: requesterID,
        pScheduleDate: scheduleDate,
        pRequestDate: requestDate,
        pAttendanceType: attendanceType,
        pInDate: inDate,
        pInTime: inTime,
        pOutDate: outDate,
        pOutTime: outTime,
        pRemarks: remarks,
        pEmployeeID: employeeID,
        pCompanyID: companyID
    };

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
        success: function (res) { SaveAttendanceSuccess(res); EnableButton($btnSubmit, 'Submit'); },
        error: function (err) { OnWsError_Toaster(err); EnableButton($btnSubmit, 'Submit'); }
    });
}

function validateFields(pScheduleDate, pAttendancetype, pInDate, pInTime, pOutDate, pOutTime, pRemarks) {
    var msg = "";

    msg += pScheduleDate.trim() === "" ? "-Date <br>" : "";
    msg += pAttendancetype.trim() === "0" ? "-Attendance type <br>" : "";
    msg += pInDate.trim() === "" ? "-In Date <br>" : "";
    msg += pInTime.trim() === "" ? "-In Time <br>" : "";
    msg += pOutDate.trim() === "" ? "-Out Date <br>" : "";
    msg += pOutTime.trim() === "" ? "-Out Time <br>" : "";
    msg += pRemarks.trim() === "" ? "-Remarks <br>" : "";

    if (msg.trim() !== "") {
        msg = "Please fill the following fields \n" + msg;
        toastr.error(msg);
    }

    return msg.trim() === "";
}

function SaveAttendanceSuccess(res) {
    var isObj = false;

    if (isJSONString(res.d)) {
        checkLoggedIn(JSON.parse(res.d));
        isObj = true;
    }


    $('#ddlAttendancetype').val('0');
    // $('#txtInTime').val('');
    $('#ScheduleDatePicker').data('DateTimePicker').date(null);
    $('#InDatePicker').data("DateTimePicker").date(null);
    $('#OutDatePicker').data("DateTimePicker").date(null);
    $('#InTimePicker').data("DateTimePicker").date(null);
    $('#OutTimePicker').data("DateTimePicker").date(null);
    $('#txtOutTime').val('');
    $('#txtRemarks').val('');

    if (!isObj) { toastr.success(res.d); }
}

function bindMask() {
    var txtTimes = $('.txtTime');

    //console.log('txtTimes : ',txtTimes);

    if (isNull(txtTimes) || txtTimes.length === 0) { return; }

    txtTimes.mask('00:00');

    // $.mask.definitions['H'] = '[0-2]';
    // $.mask.definitions['h'] = '[0-9]';    
    // $.mask.definitions['M'] = '[0-5]';
    // $.mask.definitions['m'] = '[0-9]';

    // txtTimes.mask('Hh:Mm');
    // txtTimes.on('blur', function () {
    //     var value = $(this).val();
    //     if (value.length > 0) {
    //         value = value.split(":");
    //         if (value[0] !== "" && parseInt(value[0]) > 23) {
    //             value[0] = "23";
    //         }
    //         $(this).val(value.join(":"));
    //     }
    // });
}



