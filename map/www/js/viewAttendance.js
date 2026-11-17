'use strict';

var jsonDataForSeach;


//document ready
$(function () {
    var _txtFrom, _txtTo, _ddlEmployee, _status;
    var fromDatePicker, toDatePicker, dateformat, attendanceList, FType, form1, $heading;
    fromDatePicker = $('#fromDatePicker');
    toDatePicker = $('#toDatePicker');
    //tblListBody = $("#tblList tbody");
    attendanceList = $('#attendanceList');
    form1 = $('#form1');
    $heading = $('#heading');
    dateformat = getLocalStorageItem_String('dateformat').toUpperCase();
    FType = getParameterByName("FType");

    _txtFrom = jQuery('#txtFromDate');
    _txtTo = jQuery('#txtToDate');
    _ddlEmployee = jQuery('#ddlEmployee');
    //console.log('FType : ', FType);

    if (FType === null) { //no ftype
        $heading.html("View Attendance");

        $('#datetimepicker,#datetimepicker1').datetimepicker({
            format: dateformat.toUpperCase(),
            ignoreReadonly: true
        });
        _txtFrom.val(sysdate);
        _txtTo.val(sysdate);
        fillEmployee();
        form1.on('submit', function (e) {
            // form_Submit(e, tblListBody);
            form_Submit(e, attendanceList);
        });

        jQuery('#btnFilter').fadeIn();

        jQuery('#btnAll').click(function (e) {

            var q = "";
            var all, present, absent, leave;
            all = jQuery('#btnAll');
            present = jQuery('#btnPresent');
            absent = jQuery('#btnAbsent');
            leave = jQuery('#btnLeave');

            if (all.attr("data-checked") == "false") {
                q += "Present,Absent,Leave"
                present.attr("data-checked", "false");
                absent.attr("data-checked", "false");
                leave.attr("data-checked", "false");


                present.addClass('btnDisable');
                absent.addClass('btnDisable');
                leave.addClass('btnDisable');
            }

            $(this).attr('data-checked', $(this).attr('data-checked') == "false" ? "true" : "false");

            $(this).toggleClass('btnDisable');

            if ($(this).attr('data-checked') == "true") {
                searchByStatus("");
            }

        });

        jQuery('.btnPresent,.btnAbsent,.btnLeave').click(function (e) {


            var all, present, absent, leave, q;
            q = "somerandomtext";
            all = jQuery('#btnAll');
            present = jQuery('#btnPresent');
            absent = jQuery('#btnAbsent');
            leave = jQuery('#btnLeave');

            $(this).attr('data-checked', $(this).attr('data-checked') == "false" ? "true" : "false");
            $(this).toggleClass('btnDisable');

            all.addClass('btnDisable');
            all.attr("data-checked", "false");

            if (present.attr('data-checked') == "true") {
                q += ",Present";
            }

            if (absent.attr('data-checked') == "true") {
                q += ",Absent";
            }

            if (leave.attr('data-checked') == "true") {
                q += ",Leave";
            }

            searchByStatus(q);

        });

        // $("._checkboxAll").change(function (e) {
        //     var q = "";
        //     var all, present, absent, leave;
        //     all = jQuery('#chkAll');
        //     present = jQuery('#chkPresent');
        //     absent = jQuery('#chkAbsent');
        //     leave = jQuery('#chkLeave');

        //     if (all.is(':checked')) {
        //         q += "Present,Absent,Leave"
        //         present.prop("checked", false);
        //         absent.prop("checked", false);
        //         leave.prop("checked", false);
        //     }

        //     if ($(this).is(':checked')) {
        //         searchByStatus("");
        //     }
        // });

        // $("._checkbox").change(function (e) {
        //     // console.log($(this).is(':checked'));

        //     var q = "somerandomtext";
        //     var all, present, absent, leave;
        //     all = jQuery('#chkAll');
        //     present = jQuery('#chkPresent');
        //     absent = jQuery('#chkAbsent');
        //     leave = jQuery('#chkLeave');

        //     all.prop("checked", false);
        //     if (present.is(':checked')) {
        //         q += ",Present";
        //     }

        //     if (absent.is(':checked')) {
        //         q += ",Absent";
        //     }

        //     if (leave.is(':checked')) {
        //         q += ",Leave";
        //     }

        //     searchByStatus(q);

        // });

        init_GetData(attendanceList, dateformat);
    }
    else if (FType.toLowerCase() === "absent" || FType.toLowerCase() === "missing") {

        if (FType.toLowerCase() === "absent") {
            $heading.html("Absents");
            $('#searchBar').hide();
        }
        else if (FType.toLowerCase() === "missing") {
            $heading.html("Missing Entries");
            $('#searchBar').hide();
        }

        form1.css('display', 'none');
        getEmployeeAttendance(attendanceList, dateformat, FType);
    }

});

function criteriaToggle() {
    jQuery('#criteria1').slideToggle();
}

function fillEmployee() {
    var eid, cid, secKey, ecode, uid;
    eid = getLocalStorageItem_Int('eid');
    cid = getLocalStorageItem_Int('cid');
    ecode = getLocalStorageItem_String('ecode');
    uid = getLocalStorageItem_Int('uid');
    secKey = getLocalStorageItem_String('secKey');

    funcFillDropDownListSelec2(10, "GetEmployeeListJson", $('#ddlEmployee'), function (params) {
        var valueToPush = {};
        valueToPush["q"] = params.term;
        valueToPush["pagesize"] = 10;
        //var PControl1 = document.getElementById(ddlEmployee);
        valueToPush["pSecKey"] = secKey;
        valueToPush["pEmployeeID"] = eid;
        valueToPush["pEmployeeRefNo"] = ecode;
        valueToPush["pUserID"] = uid;
        valueToPush["pLangID"] = 1;
        valueToPush["pCompanyID"] = cid;

        valueToPush["PID1"] = uid;
        valueToPush["PID2"] = cid;
        valueToPush["PID3"] = "False";
        valueToPush["PID4"] = "False";
        valueToPush["page"] = params.page;

        return valueToPush;
    });
}

var tblListDatatable;

function applyDataTable() {

    if (!isNull(tblListDatatable) && tblListDatatable.destroy) {
        tblListDatatable.destroy();
    }

    tblListDatatable = $('#tblList').DataTable({
        'paging': true,
        'lengthChange': false,
        'searching': true,
        'ordering': true,
        'info': true,
        'autoWidth': false
    });
}

function form_Submit(e, ptblListBody) {
    var form1, fromDate, toDate;
    e.preventDefault();

    form1 = $('#' + e.target.id);
    fromDate = form1.find('input[id="txtFromDate"]').val();
    toDate = form1.find('input[id="txtToDate"]').val();

    if (fromDate.trim() === "") {
        alert("Pleae select duration");
        return;
    }

    getViewAttendanceData(fromDate, toDate, ptblListBody);
}

function init_GetData(ptblListBody, pDateFormat) {
    var form1, fromDate, toDate;

    fromDate = DTHelper.GetFormattedDate(new Date(), pDateFormat);
    toDate = fromDate;
    //console.log('init_GetData');
    getViewAttendanceData(fromDate, toDate, ptblListBody);
}

function getViewAttendanceData(pFromDate, pToDate, ptblListBody) {


    var type, url, data, contentType, dataType, processdata,
        employeeID, companyID, attendanceType, dataViewType, secKey, employeeRefNo, userID;

    var pEmpIDs = $('#ddlEmployee').val() === null ? 0 : $('#ddlEmployee').val()

    ptblListBody.html(progress('<br>Please wait '));
    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetDailyAttendanceByEmployeeJsonNew";
    employeeID = getLocalStorageItem_Int('eid');
    companyID = getLocalStorageItem_Int('cid');
    employeeRefNo = getLocalStorageItem_String('ecode');
    userID = getLocalStorageItem_Int('uid');
    secKey = getLocalStorageItem_String('secKey');
    attendanceType = "All";
    dataViewType = "SubOrdinate";
    data = {
        pSecKey: secKey,
        pEmployeeID: employeeID,
        pEmployeeRefNo: employeeRefNo,
        pUserID: userID,
        pFromDate: pFromDate,
        pToDate: pToDate,
        pAttendanceType: attendanceType,
        pDataViewType: dataViewType,
        pCompanyID: companyID,
        pEmployeeID1: pEmpIDs,
    }
    //console.log('data : ',data);
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
        success: function (res) { getDataSuccess(res, ptblListBody, "init") },
        error: function (err) {
            postRequest('GetDailyAttendanceByEmployeeJson', JSON.parse(data), function (r) {
                getDataSuccess(r, ptblListBody, "init")
            }, function (r) {
                toastr.error('Something went wrong!');
            });
        }
    });
}

function getEmployeeAttendance(ptblListBody, pDateFormat, pAttendanceType) {
    var type, url, data, contentType, dataType, processdata,
        companyID, attendanceType, dataViewType, fromDate, toDate, employeeID, employeeRefNo, userID, secKey;

    //ptblListBody.html("");
    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetDailyAttendanceByEmployeeJsonNew";


    employeeID = getLocalStorageItem_Int('eid');
    companyID = getLocalStorageItem_Int('cid');
    employeeRefNo = getLocalStorageItem_String('ecode');
    userID = getLocalStorageItem_Int('uid');
    secKey = getLocalStorageItem_String('secKey');
    //attendanceType = "Absent";
    dataViewType = "Employee";

    fromDate = new Date();//current date    
    fromDate = new Date(fromDate.getFullYear().toString() + "/" + (fromDate.getMonth() + 1).toString() + "/1");   //get first month of the current month
    fromDate = DTHelper.GetFormattedDate(fromDate, pDateFormat);
    toDate = DTHelper.GetFormattedDate(new Date(), pDateFormat);

    data = {
        pSecKey: secKey,
        pEmployeeID: employeeID,
        pEmployeeRefNo: employeeRefNo,
        pUserID: userID,
        pFromDate: fromDate,
        pToDate: !IsWSUpd() ? toDate : '',
        pAttendanceType: pAttendanceType,
        pDataViewType: dataViewType,
        pCompanyID: companyID,
        pEmployeeID1: 0,
    }
    //console.log('data : ',data);
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
            getDataSuccess(res, ptblListBody, "init");
        },
        error: function (err) {
            postRequest('GetDailyAttendanceByEmployeeJson', JSON.parse(data), function (r) {
                getDataSuccess(r, ptblListBody, "init")
            }, function (r) {
                toastr.error('Something went wrong!');
            });
        }
    });
}

function getDataSuccess(res, ptblListBody, initBy, q) {

    var result, obj, row, dateformat, timeFormat, dateTimeFormat, FType, dateformat;



    result = res.d;

    //console.log(JSON.parse(result));

    //if (!isNull(result) && result.trim().indexOf("False") === 0) {
    if (!isNull(result) && result.indexOf("False") === 0) {
        alert(result);
        return;
    }

    obj = JSON.parse(result);
    // console.log(obj);
    function compare(a, b, sortColumn, sortBy) {
        if (a.Remarks < b.Remarks)
            return -1;
        if (a.Remarks > b.Remarks)
            return 1;
        return 0;
    }

    obj.sort(compare);

    //Added By Jammel on 30/1/29 Start - For Search Functionality
    if (initBy === "init" || initBy === "btn") {
        jsonDataForSeach = JSON.parse(result);
        //if (isNull(jsonDataForSeach)) { jsonDataForSeach = JSON.parse(result); }
    }
    //Added By Jammel on 30/1/29 End

    checkLoggedIn(obj);

    ptblListBody.html('');

    FType = getParameterByName("FType");
    //dateformat = getLocalStorageItem_String("dateformat");
    //console.log(obj);

    //console.log('ptblListBody : ',ptblListBody,ptblListBody.html());
    dateformat = getLocalStorageItem_String("dateformat");
    timeFormat = getLocalStorageItem_String("timeformat");
    dateTimeFormat = dateformat + ' ' + timeFormat;
    $.each(obj, function (rec) {

        var url = 'https://www.google.com/maps/search/?api=1&query=';
        var urlIn = '';
        var urlOut = '';

        var InLatitude = this.InLatitude;
        var InLongitude = this.InLongitude;
        var OutLatitude = this.OutLatitude;
        var OutLongitude = this.OutLongitude;

        // console.log(InLatitude);
        // console.log(InLongitude);
        // console.log(OutLatitude);
        // console.log(OutLongitude);

        var inDateTime, outDateTime, inDate, outDate, inTime, outTime, html, actionButtons = "";
        inDateTime = new Date(this.InDateTime);
        outDateTime = new Date(this.OutDateTime);
        if (inDateTime.toLocaleDateString() !== new Date('1900/01/01').toLocaleDateString()) {
            inDate = DTHelper.GetFormattedDate(inDateTime, dateformat);
            inDate += " " + DTHelper.GetFormattedTime(inDateTime, timeFormat);
            if (!isNull(InLatitude) && !isNull(InLongitude) && InLatitude !== '0' && InLongitude !== '0') {
                //var inurl = 'https://www.google.com/maps/@' + InLatitude + ',' + InLongitude + ',12z';
                //url = 'https://www.google.com/maps/search/?api=1&&query=' + InLatitude + ',' + InLongitude + '';
                urlIn = url + InLatitude + ',' + InLongitude + '';
                inDate = '<span class="label label-default"><a href="' + encodeURI(urlIn) + '">' + inDate + '</a></span>';
            }
        }
        else {
            inDate = "00/00/0000";
        }

        if (outDateTime.toLocaleDateString() !== new Date('1900/01/01').toLocaleDateString()) {
            outDate = DTHelper.GetFormattedDate(outDateTime, dateformat);
            outDate += " " + DTHelper.GetFormattedTime(outDateTime, timeFormat);
            if (!isNull(OutLatitude) && !isNull(OutLongitude) && OutLatitude !== '0' && OutLongitude !== '0') {
                //var outurl = 'https://www.google.com/maps/@' + OutLatitude + ',' + OutLongitude + ',12z';
                //url = 'https://www.google.com/maps/search/?api=1&query=' + OutLatitude + ',' + OutLongitude + '';
                urlOut = url + OutLatitude + ',' + OutLongitude + '';
                outDate = '<span class="label label-default"><a href="' + encodeURI(urlOut) + '">' + outDate + '</a></span>';
            }
        }
        else {
            //outDate = "Not Available";
            outDate = "00/00/0000";
        }

        //console.log('FType : ', FType);
        var firstItem;
        if (FType === null) {     //normal mode
            firstItem = this.EmployeeName;
        }
        else if (FType.toLowerCase() === "absent" || FType.toLowerCase() === "missing") {
            firstItem = DTHelper.GetFormattedDate(new Date(this._ScheduleInDate), dateformat);

            var tranid = 0;

            if (FType.toLowerCase() === "missing") {
                actionButtons =
                    "<span class='badgett'>" +
                    "<a class='btn btn-success btn-xs' href='AttendanceRequest.html?sd=" + firstItem + "'>Attendance Request</a>&nbsp;" +
                    "</span>" +
                    "<br/>";
            }
            else if (FType.toLowerCase() === 'absent') {
                actionButtons = actionButtons =
                    "<span class='badgett'>" +
                    "<a class='btn btn-success btn-xs' href='AttendanceRequest.html?sd=" + firstItem + "'>Attendance Request</a>&nbsp;" +
                    "<a class='btn btn-danger btn-xs' href='Leave.html?sd=" + firstItem + "'>Leave Reqeust</a>&nbsp;" +
                    "</span>" +
                    "<br/>";
            }

        }
        var statuscolor = 'black';
        if (this.Remarks.indexOf('Absent') > -1) {
            statuscolor = '#f44336';
        }
        if (this.Remarks.indexOf('Present') > -1) {
            statuscolor = '#4caf50';
        }
        // console.log(statuscolor);
        //console.log(this);

        var strTemp = '';

        if (typeof (this.BranchTitle) != 'undefined') {
            strTemp = "<br><span>Branch : " + getHighlighted(this.BranchTitle, q) + "</span>"
                + "<br><span>Department : " + getHighlighted(this.DepartmentTitle, q) + "</span>"
                + "<br><span>Designation : " + getHighlighted(this.DesignationTitle, q) + "</span>";
        }

        strTemp += "<br><span class='label label-default'>Date : " + getFormattedDateNew(this.ScheduleInDate) + " (" + getDayName(getFormattedDateNew(this.ScheduleInDate)) + ")</span > ";

        var sourcepage = location.href.split("/").slice(-1);
        html = "<i class='fa fa-caret-right'></i> <a href='ViewProfileCompany.html?eid=" + this.EmployeeID + "&source=" + sourcepage + "'><span class='EmployeeTitle'>" + getHighlighted(firstItem, q) + " - " + getHighlighted(this.EmployeeRefNo, q) + "</span></a>"
            + "<br />"
            + "<span>" + inDate + ' - ' + outDate + "</span><br />"
            + "<span style='color:" + statuscolor + ";font-weight:bold;' class='txtRemarks'>" + getIcon("flag") + " " + getHighlighted(this.Remarks, q) + "</span><br />"
            + "<span class='txtRemarks'><a href='tel:" + this.MobileNumber + "'>" + getIcon("phone") + " " + this.MobileNumber + "</a></span>"
            + strTemp
            + "<br />" +
            actionButtons;

        // $('<a class="list-group-item" href="#"></a>').html(html).appendTo(ptblListBody);
        $('<li class="list-group-item"></li>').html(html).appendTo(ptblListBody);

    });
    //console.log(ptblListBody.html());

    // if (Object.keys(obj).length > 0) { applyDataTable(); }
}


// function showMAP(lat, long) {
//     $('#mapsrc').prop("src", "https://www.google.com/maps/@" + lat + "," + long + ",12z");
//     $("#modalMap").modal({ show: true });
// }

function goToAttendanceRequest(date) {
    //console.log('date : ',date);
    window.location = "AttendanceRequest.html?sd=" + date;
}

function goToLeaveRequest(date) {
    window.location = "Leave.html?sd=" + date;
}

//Added By Jammel on 30/1/29 Start - For Search Functionality


function searchByStatus(q) {
    var attendanceList = $('#attendanceList');
    attendanceList.html(progress('<br>Please wait '));
    setTimeout(function () {



        var final = [];
        var data;
        var arrq = q.split(",");
        //console.log(arrq);
        jQuery.each(arrq, function (i, item) {
            data = jsonDataForSeach;
            data = data.filter(function (entry) {
                return entry.Remarks.toLowerCase().indexOf(item.toLowerCase()) > -1;
            });
            jQuery.each(data, function (j, employee) {
                final.push(employee);
            });
        });


        final = JSON.stringify(final);
        var obj = { "d": final };
        //console.log(JSON.stringify(obj.d));
        if (obj.d === null || obj.d === "" || obj.d === "[]") {
            attendanceList.html('<div class="text-center"><br><small>No Data Found!</small></div>');
            return;
        }

        getDataSuccess(obj, attendanceList, "search", "");
    }, 10);

}

function searchList(q) {
    var attendanceList = $('#attendanceList');
    var attdata = JSON.stringify(jsonDataForSeach);

    if (jsonDataForSeach.length > 0) {
        if (typeof (jsonDataForSeach[0]['BranchTitle']) != 'undefined') {
            attdata = JSON.parse(attdata).filter(function (entry) {
                return entry.EmployeeName.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
                    entry.Remarks.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
                    entry.EmployeeRefNo.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
                    entry.BranchTitle.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
                    entry.DepartmentTitle.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
                    entry.DesignationTitle.toLowerCase().indexOf(q.toLowerCase()) > -1;
            });
        } else {
            attdata = JSON.parse(attdata).filter(function (entry) {
                return entry.EmployeeName.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
                    entry.Remarks.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
                    entry.EmployeeRefNo.toLowerCase().indexOf(q.toLowerCase()) > -1;
            });
        }
    }


    attdata = JSON.stringify(attdata);
    var obj = { "d": attdata };
    //console.log(JSON.stringify(obj.d));
    if (obj.d === null || obj.d === "" || obj.d === "[]") {
        attendanceList.html('<div class="text-center"><br><small>No Data Found!</small></div>');
        return;
    }
    getDataSuccess(obj, attendanceList, "search", q);
}

