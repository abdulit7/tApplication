
'use strict';
//Js file of main.html

$(function () {
    getBirthdayCard();
    GetUpdatedMenuToLocalStorage(function () {
        GenerateMenu();
        getDataMain();
        navigator.geolocation.getCurrentPosition(function (position) { }, function (error) { if (error.code == error.PERMISSION_DENIED) { } });
    });

    //setInterval(function(){getData()},5000);
});

function getDataMain(pInvokedFrom) {
    //getNoticesFlah();    
    getIntimations();
    getAbsents();
    getMissingEntries();
    getLeaveApprovals();
    getAttendanceApprovals();
    getTravelApprovals();
    getExpenseApprovals();
    //TODO: Check if there is any subordinate of the logged in Employee and make team status visible
    getTeamAttendanceStatus("Present");
    getTeamAttendanceStatus("Absent");
    getAvailableTrainngs();
    getTrainngApprovals();
    getAvailableSurvey();
    getPendingReviews();
    getObjectiveApprovals();
    getProbationReviews();
    getNotices();
    getLoanApprovals();
    if (pInvokedFrom) {
        getNoticesFlash();
    }
}

//Get Leave Approvals Count
function getLeaveApprovals() {

    var type, url, data, contentType, dataType, processdata,
        employeeID, employeeRefno, companyID, userID, secKey;

    secKey = getLocalStorageItem_String('secKey');
    employeeID = getLocalStorageItem_Int('eid');
    employeeRefno = getLocalStorageItem_String('ecode');
    userID = getLocalStorageItem_Int('uid');
    companyID = getLocalStorageItem_Int('cid');

    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetApprovalLeaveCountJson";
    data = {
        pSecKey: secKey,
        pEmployeeID: employeeID,
        pEmployeeRefNo: employeeRefno,
        pUserID: userID,
        pCompanyID: companyID
    };
    data = JSON.stringify(data);
    contentType = "application/json; charset=utf-8";
    dataType = "json";
    processdata = true;

    $('#leaveApproval').html(progress());

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: dataType,
        processdata: processdata,
        success: function (res) { GetLeaveApprovalCountSuccess(res); },
        error: OnWsError_Toaster// When Service call fails
    });
}

//Get Attendance Approvals Count
function getAttendanceApprovals() {

    var type, url, data, contentType, dataType, processdata,
        employeeID, employeeRefno, companyID, userID, secKey;

    secKey = getLocalStorageItem_String('secKey');
    employeeID = getLocalStorageItem_Int('eid');
    employeeRefno = getLocalStorageItem_String('ecode');
    userID = getLocalStorageItem_Int('uid');
    companyID = getLocalStorageItem_Int('cid');

    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetApprovalAttendanceCountJson";
    data = {
        pSecKey: secKey,
        pEmployeeID: employeeID,
        pEmployeeRefNo: employeeRefno,
        pUserID: userID,
        pCompanyID: companyID
    };
    data = JSON.stringify(data);
    contentType = "application/json; charset=utf-8";
    dataType = "json";
    processdata = true;

    $('#AttendanceApproval').html(progress());

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: dataType,
        processdata: processdata,
        success: function (res) { getAttendanceApprovalSuccess(res); },
        error: OnWsError_Toaster// When Service call fails
    });
}

//Get Travel Approvals Count
function getTravelApprovals() {
    initTilesByRights();
    var type, url, data, contentType, dataType, processdata;

    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetTravelApprovalList";
    data = {
        pSecKey: getLocalStorageItem_String('secKey'),
        pEmployeeID: getLocalStorageItem_Int('eid'),
        pEmployeeRefNo: getLocalStorageItem_String('ecode'),
        pUserID: getLocalStorageItem_Int('uid'),
        pCompanyID: getLocalStorageItem_Int('cid')
    };
    data = JSON.stringify(data);
    contentType = "application/json; charset=utf-8";
    dataType = "json";
    processdata = true;

    $('#travelApprovals').html(progress());

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: dataType,
        processdata: processdata,
        success: function (res) { getTravelApprovalsSuccess(res); },
        error: OnWsError_Toaster// When Service call fails
    });
}

//Executes on success of Travel Approval count request
function getTravelApprovalsSuccess(res) {
    var result, travelApprovals;
    result = JSON.parse(res.d);
    checkLoggedIn(result);

    travelApprovals = $('#travelApprovals');
    travelApprovals.html(result.TravelRequests.length);
}

//Get Expense Approvals Count
function getExpenseApprovals() {
    // if (initTilesByRights('IsExpense', 'expenseApprovals', 'ExpenseDiv') === false) { return; }
    var type, url, data, contentType, dataType, processdata;

    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetExpenseApprovalList";
    data = {
        pSecKey: getLocalStorageItem_String('secKey'),
        pEmployeeID: getLocalStorageItem_Int('eid'),
        pEmployeeRefNo: getLocalStorageItem_String('ecode'),
        pUserID: getLocalStorageItem_Int('uid'),
        pCompanyID: getLocalStorageItem_Int('cid')
    };
    data = JSON.stringify(data);
    contentType = "application/json; charset=utf-8";
    dataType = "json";
    processdata = true;

    $('#expenseApprovals').html(progress());

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: dataType,
        processdata: processdata,
        success: function (res) { getExpenseApprovalsSuccess(res); },
        error: OnWsError_Toaster// When Service call fails
    });
}

//Executes on success of Travel Approval count request
function getExpenseApprovalsSuccess(res) {
    var result, expenseApprovals;
    result = JSON.parse(res.d);
    checkLoggedIn(result);

    expenseApprovals = $('#expenseApprovals');
    expenseApprovals.html(result.ExpenseRequests.length);
}

//Get Absents Count
function getAbsents() {
    var type, url, data, contentType, dataType, processdata,
        employeeID, companyID, dataViewType, secKey, employeeRefNo, userID, fromDate, toDate, dateformat, attendanceType;

    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetEmployeeAttendanceSummaryJSON";
    employeeID = getLocalStorageItem_Int('eid');
    companyID = getLocalStorageItem_Int('cid');
    employeeRefNo = getLocalStorageItem_String('ecode');
    userID = getLocalStorageItem_Int('uid');
    secKey = getLocalStorageItem_String('secKey');
    dataViewType = "Employee";
    attendanceType = "Absent";
    dateformat = getLocalStorageItem_String('dateformat');

    fromDate = new Date();//current date    
    fromDate = new Date(fromDate.getFullYear().toString() + "/" + (fromDate.getMonth() + 1).toString() + "/1");   //get first month of the current month
    fromDate = DTHelper.GetFormattedDate(fromDate, dateformat);
    toDate = DTHelper.GetFormattedDate(new Date(), dateformat);
    //console.log({fromDate});
    data = {
        pSecKey: secKey,
        pEmployeeID: employeeID,
        pEmployeeRefNo: employeeRefNo,
        pUserID: userID,
        pFromDate: fromDate,
        pToDate: !IsWSUpd() ? toDate : '',//pToDate: '',        // PToDate : toDate - OLD
        pAttendanceType: attendanceType,
        pDataViewType: dataViewType,
        pCompanyID: companyID
    }

    data = JSON.stringify(data);
    contentType = "application/json;charset=utf-8";
    dataType = "json";
    processdata = true;

    $('#AbsentCount').html(progress());

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: dataType,
        processdata: processdata,
        success: function (res) { getAbsentsSuccess(res) },
        error: function (err) {
            $('#AbsentCount').html(getIcon('exclamation'));
            OnWsError_Toaster(err);
        }
    });
}

//Get Missing Entries Count
function getMissingEntries() {
    var type, url, data, contentType, dataType, processdata,
        employeeID, companyID, dataViewType, secKey, employeeRefNo, userID, fromDate, toDate, dateformat, attendanceType;

    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetEmployeeAttendanceSummaryJSON";
    employeeID = getLocalStorageItem_Int('eid');
    companyID = getLocalStorageItem_Int('cid');
    employeeRefNo = getLocalStorageItem_String('ecode');
    userID = getLocalStorageItem_Int('uid');
    secKey = getLocalStorageItem_String('secKey');
    dataViewType = "Employee";
    attendanceType = "Missing";
    dateformat = getLocalStorageItem_String('dateformat');

    fromDate = new Date();//current date    
    fromDate = new Date(fromDate.getFullYear().toString() + "/" + (fromDate.getMonth() + 1).toString() + "/1");   //get first month of the current month
    fromDate = DTHelper.GetFormattedDate(fromDate, dateformat);
    toDate = DTHelper.GetFormattedDate(new Date(), dateformat);

    data = {
        pSecKey: secKey,
        pEmployeeID: employeeID,
        pEmployeeRefNo: employeeRefNo,
        pUserID: userID,
        pFromDate: fromDate,
        pToDate: !IsWSUpd() ? toDate : '', // is serivce is updated then blank else today's date //pToDate: '',        // PToDate : toDate - OLD
        pAttendanceType: attendanceType,
        pDataViewType: dataViewType,
        pCompanyID: companyID
    }

    data = JSON.stringify(data);
    contentType = "application/json;charset=utf-8";
    dataType = "json";
    processdata = true;

    $('#MissingCount').html(progress());

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: dataType,
        processdata: processdata,
        success: function (res) { getMissingEntriesSuccess(res) },
        error: function (err) {
            $('#MissingCount').html(getIcon('exclamation'));
            OnWsError_Toaster(err);
        }
    });
}

//Get Team Attendance Status
function getTeamAttendanceStatus(pAttendanceType) {
    var type, url, data, contentType, dataType, processdata, dataViewType, fromDate, toDate, dateformat, attendanceType;

    dataViewType = "SubOrdinate";
    attendanceType = pAttendanceType;
    dateformat = getLocalStorageItem_String('dateformat');
    fromDate = DTHelper.GetFormattedDate(new Date(), dateformat);
    toDate = DTHelper.GetFormattedDate(new Date(), dateformat);

    data = {
        pSecKey: getLocalStorageItem_String('secKey'),
        pEmployeeID: getLocalStorageItem_Int('eid'),
        pEmployeeRefNo: getLocalStorageItem_String('ecode'),
        pUserID: getLocalStorageItem_Int('uid'),
        pCompanyID: getLocalStorageItem_Int('cid'),
        pFromDate: fromDate,
        pToDate: toDate,
        pAttendanceType: attendanceType,
        pDataViewType: dataViewType
    }

    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetTeamStatus_Json";
    data = JSON.stringify(data);
    contentType = "application/json;charset=utf-8";
    dataType = "json";
    processdata = true;

    //$('#spanTeamPresent').html(progress());
    //$('#spanTeamAbsent').html(progress());

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: dataType,
        processdata: processdata,
        success: function (res) { getTeamStatusSuccess(res, pAttendanceType) },
        error: OnWsError_Toaster
    });
}

//Executes on success of team status request
function getTeamStatusSuccess(res, pAttendanceType) {
    var span, result;
    var _type = "";
    result = JSON.parse(res.d);

    //check if an authenticated user is logged in 
    checkLoggedIn(result);

    if (pAttendanceType === "Present") {
        span = $("#spanTeamPresent");
        _type = "P";
    }
    else if (pAttendanceType === "Absent") {
        span = $("#spanTeamAbsent");
        _type = "A";
    }

    if (typeof span !== 'undefined') { span.html(_type + result.count); }
    if (result.length > 99) { span.css('font-size', '28px'); }
}

function GetLeaveApprovalCountSuccess(res) {
    var result, leaveApprovals;
    result = JSON.parse(res.d);
    checkLoggedIn(result);

    leaveApprovals = $('#leaveApproval');
    leaveApprovals.html(result.count);
}

function getAttendanceApprovalSuccess(res) {
    var result, leaveApprovals;
    result = JSON.parse(res.d);
    checkLoggedIn(result);

    leaveApprovals = $('#AttendanceApproval');
    leaveApprovals.html(result.count);
}

function getAbsentsSuccess(res) {
    var result, leaveApprovals;
    result = JSON.parse(res.d);
    checkLoggedIn(result);

    leaveApprovals = $('#AbsentCount');
    leaveApprovals.html(result.count);
}

function getMissingEntriesSuccess(res) {
    var result, leaveApprovals;
    result = JSON.parse(res.d);
    checkLoggedIn(result);

    leaveApprovals = $('#MissingCount');
    leaveApprovals.html(result.count);
}



function getAvailableTrainngs() {
    if (initTilesByRights('IsTraining', 'spanAvailableTrainings', 'TrainingDiv') === false) { return; }

    $('#spanAvailableTrainings').html(progress());
    postRequest('GetAvailableTraining', { pTrainingID: 0 }, function (result) {
        var josn = JSON.parse(result.d);
        checkLoggedIn(josn);
        var availableTrainings = josn.length;
        $('#spanAvailableTrainings').html(availableTrainings);
    })

}

function getTrainngApprovals() {
    if (initTilesByRights('IsTraining', 'spanTrainingApprovals', 'TrainingDiv2') === false) { return; }

    $('#spanTrainingApprovals').html(progress());

    var ecode, secKey, varType, varUrl, varData, varContentType, varDataType, varProcessData;
    varType = "POST";
    varUrl = getBaseUrl() + "wsttmapp.asmx/GetTrainingApprovalList";
    var eid = localStorage.getItem('eid');
    var cid = localStorage.getItem('cid');
    var uid = localStorage.getItem('uid');
    ecode = getLocalStorageItem_String('ecode');
    secKey = getLocalStorageItem_String('secKey');

    varData = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: cid,
        pTranID: 0
    }
    varData = JSON.stringify(varData);

    varContentType = "application/json; charset=utf-8";
    varDataType = "json";
    varProcessData = true;
    $.ajax({
        type: varType, //GET or POST or PUT or DELETE verb
        url: varUrl, // Location of the service
        data: varData, //Data sent to server
        contentType: varContentType, // content type sent to server
        dataType: varDataType, //Expected data format from server
        processdata: varProcessData, //True or False
        success: function (result) {//On Successfull service call           
            if (varDataType == "json") {
                var josn = JSON.parse(result.d);
                checkLoggedIn(josn);
                var approvals = josn.length;
                $('#spanTrainingApprovals').html(approvals);

            }
        },
        error: OnWsError_Toaster// When Service call fails
    });

}


function getAvailableSurvey() {
    if (initTilesByRights('IsSurvey', 'spanAvailableSurvey', 'SurveyDiv') === false) { return; }
    $('#spanAvailableSurvey').html(progress());
    postRequest('GetSurveyList', {}, function (result) {
        var json = JSON.parse(result.d);
        checkLoggedIn(json);
        var availableSurveys = json.length;
        $('#spanAvailableSurvey').html(availableSurveys);
    })
}

function getPendingReviews() {
    if (initTilesByRights('IsAppraisal', 'spanPendingReviews', 'AppraisalDiv') === false) { return; }

    $('#spanPendingReviews').html(progress());
    postRequest('GetPerformanceReviewPendingList', { IsProbationReview: false }, function (result) {
        var json = JSON.parse(result.d);
        checkLoggedIn(json);
        var spanPendingReviews = json.length;
        $('#spanPendingReviews').html(spanPendingReviews);
    })
}

function getProbationReviews() {
    if (initTilesByRights('IsAppraisal', 'spanProbationReviews', 'ProbationDiv') === false) { return; }
    $('#spanProbationReviews').html(progress());
    postRequest('GetPerformanceReviewPendingList', { IsProbationReview: true }, function (result) {
        var json = JSON.parse(result.d);
        checkLoggedIn(json);
        var spanPendingReviews = json.length;
        $('#spanProbationReviews').html(spanPendingReviews);
    })
}

function getLoanApprovals() {
    if (initTilesByRights('IsLoan', 'spanexpenseApprovals', 'LoanDiv') === false) { return; }
    $('#spanexpenseApprovals').html(progress());
    postRequest('GetLoanApprovals', {}, function (result) {
        var json = JSON.parse(result.d);
        checkLoggedIn(json);
        var spanexpenseApprovals = json.length;
        $('#spanexpenseApprovals').html(spanexpenseApprovals);
    })
}


function getObjectiveApprovals() {
    if (initTilesByRights('IsAppraisal', 'spanObjectiveApproval', 'AppraisalDiv2') === false) { return; }
    $('#spanObjectiveApproval').html(progress());
    postRequest('GetObjectiveApprovalList', { pStatus: 'Pending' }, function (result) {
        var json = JSON.parse(result.d);
        json = json['Request'];
        checkLoggedIn(json);
        var spanObjectiveApproval = json.length;
        $('#spanObjectiveApproval').html(spanObjectiveApproval);
    })
}

function getNotices() {
    //initTilesByRights();
    if (!IsWSUpd()) {
        $('#NoticeDiv').addClass('bg-faded');
        $('#NoticeDiv a').attr('href', 'serviceerror.html');
        return;
    }
    $('#spanAvailableNotice').html(progress());
    postRequest('GetNotices', { pIsGetFlashNoticesOnly: false, pIsShowTotalCountOnly: true }, function (result) {
        var json = JSON.parse(result.d);
        checkLoggedIn(json);
        var spanAvailableNotice = json;
        $('#spanAvailableNotice').html(spanAvailableNotice);
    }, function () {

    })
}

function getIntimations() {
    //initTilesByRights();
    if (!IsWSUpd()) {
        $('#intimationDiv').addClass('bg-faded');
        $('#intimationDiv a').attr('href', 'serviceerror.html');
        return;
    }
    $('#IntimationCount').html(progress());
    postRequest('GetIntimation', { pIntimationType: 'all' }, function (result) {
        result = result.d;
        //checkLoggedIn(json);
        var IntimationCount = result.split('^')[0];
        $('#IntimationCount').html(IntimationCount);
        $('#intimationDiv a').attr('href', 'IntimationDetail.html?intimationDays=' + result.split('^')[1] + '');
    }, function () {

    })
}

function getBirthdayCard() {
    postRequest('IsMyBirthdayToday', {}, function (r) {
        var res = JSON.parse(r.d);
        //console.log({ res });
        if (res.length > 0) {
            var IsMyBirthday = res[0].IsBirthday;
            var BirthdayCard = res[0].BirthdayCard;
            var IsMyJobAnn = res[0].IsJobAnniversary;
            var JobAnnCard = res[0].JobAnniversayCard;
            var birthdayTemplate = '';
            var dt = localStorage.getItem('_birthday');
            var _birthday = JSON.parse(dt);
            var IsViewedDB = [];
            if (dt != null) {
                if (_birthday) {
                    var IsViewedDB = _birthday.filter(function (value) {
                        return value.viewDate == sysdate.split('/')[2] && value.id == localStorage.getItem('uid');
                    })
                }
            }

            var dt2 = localStorage.getItem('_jobAnniversary');
            var _jobAnniversary = JSON.parse(dt2);
            var IsViewedJA = [];
            if (dt2 != null) {
                if (_jobAnniversary) {
                    var IsViewedJA = _jobAnniversary.filter(function (value) {
                        return value.viewDate == sysdate.split('/')[2] && value.id == localStorage.getItem('uid');
                    })
                }
            }


            if (IsViewedDB.length === 0) {
                if (IsMyBirthday != '') {
                    if (BirthdayCard != '') {
                        birthdayTemplate = '<div class="bdclose" onClick="closeBirthdayCard(\'' + IsMyBirthday + '\',\'bdcard\');">&times;</div><br><img src="' + getBaseUrl() + BirthdayCard + '"  class="img img-thumbnail mybdimg">';
                        jQuery('section.content').append('<div class="eoverlay"></div>');
                        jQuery('#bdintim').html(birthdayTemplate);
                    } else {
                        jQuery('#bdintim').css({ width: '100%', left: 0 });
                        birthdayTemplate = '<div class="bdclose" onClick="closeBirthdayCard(\'' + IsMyBirthday + '\',\'bdcard\');">&times;</div><div class="balloon balloon1"><span class="bletter">H</span></div> <div class="balloon balloon2"><span class="bletter">A</span></div> <div class="balloon balloon3"><span class="bletter">P</span></div> <div class="balloon balloon4"><span class="bletter">P</span></div> <div class="balloon balloon5"><span class="bletter">Y</span></div> <br> <div class="balloon balloon6"><span class="bletter">B</span></div> <div class="balloon balloon7"><span class="bletter">I</span></div> <div class="balloon balloon8"><span class="bletter">R</span></div> <div class="balloon balloon9"><span class="bletter">T</span></div> <div class="balloon balloon10"><span class="bletter">H</span></div> <div class="balloon balloon11"><span class="bletter">D</span></div> <div class="balloon balloon12"><span class="bletter">A</span></div> <div class="balloon balloon13"><span class="bletter">Y</span></div>';
                        jQuery('#bdintim').html(birthdayTemplate);
                        jQuery('section.content').append('<div class="eoverlay"></div>');
                        jQuery('.bdclose').css('right', '10%');
                    }
                } else {
                    jQuery('#bdintim').remove();
                }
            } else {

                jQuery('#bdintim').remove();
            }

            // Job Anniversary
            if (IsViewedJA.length <= 0) {
                if (IsMyJobAnn != '') {
                    if (JobAnnCard != '') {
                        birthdayTemplate = '<div class="bdclose" onClick="closeBirthdayCard(\'' + IsMyJobAnn + '\',\'jobcard\');">&times;</div><br><img src="' + getBaseUrl() + JobAnnCard + '"  class="img img-thumbnail mybdimg">';
                        jQuery('section.content').append('<div class="eoverlay"></div>');
                        jQuery('#jaintim').html(birthdayTemplate);
                    } else {
                        var serviceYears = sysdate.split('/')[2] - IsMyJobAnn.split('/')[2];
                        var suffix = ordinal_suffix_of(serviceYears);
                        jQuery('.balloon').css({ 'height': '75px !important', width: '75px !important' });
                        jQuery('#jaintim').css({ width: '100%', left: 0 });
                        birthdayTemplate = '<div class="jobanniversarybox">Happy ' + serviceYears + '<sup>' + suffix + '</sup> Work Anniversary! :)<br> <span class="jobwishename" style="font-size:30px;">Congratulations ' + ename + '!</span> <span  onClick="closeBirthdayCard(\'' + IsMyJobAnn + '\',\'jobcard\');" class="closeJobCard"><i class="fa fa-times"></i></span></div>'
                        jQuery('#jaintim').html(birthdayTemplate);
                        jQuery('section.content').append('<div class="eoverlay"></div>');
                        jQuery('.jaclose').css('right', '10%');
                    }
                } else {
                    jQuery('#jaintim').remove();
                }
            } else {
                jQuery('#jaintim').remove();
            }
        }

    })
}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
}


function closeBirthdayCard(pDate, type) {
    if (type == 'bdcard') {

        var _birthday = JSON.parse(localStorage.getItem('_birthday'));
        if (!_birthday) {
            _birthday = [];
        }
        var _ddate = pDate; //pDate.split('/')[0] + '/' + pDate.split('/')[1]
        _birthday.push({ _BDate: '' + _ddate + '', viewDate: sysdate.split('/')[2], id: localStorage.getItem('uid') });
        localStorage.setItem('_birthday', JSON.stringify(_birthday));
        jQuery('#bdintim').remove();
        if (jQuery('#jaintim').length == 0) {
            jQuery('.eoverlay').remove();
        }

    } else if (type = 'jobcard') {
        var _jobAnniversary = JSON.parse(localStorage.getItem('_jobAnniversary'));
        if (!_jobAnniversary) {
            _jobAnniversary = [];
        }
        var _ddate = pDate; //pDate.split('/')[0] + '/' + pDate.split('/')[1]
        _jobAnniversary.push({ _JADate: '' + _ddate + '', viewDate: sysdate.split('/')[2], id: localStorage.getItem('uid') });
        localStorage.setItem('_jobAnniversary', JSON.stringify(_jobAnniversary));
        jQuery('#jaintim').remove();
        if (jQuery('#bdintim').length == 0) {
            jQuery('.eoverlay').remove();
        }
    }

}

function initTilesByRights(pModuleName, pResultPlaceholderID, pDiv) {
    if (!pModuleName || !pResultPlaceholderID) { return false; }
    var result = false;

    var modules = localStorage.getItem('Modules');
    var clientMenu = localStorage.getItem('ClientMenu');
    var serverMenu = localStorage.getItem('ServerMenu');

    if (!IsWSUpd()) {
        $('#' + pDiv).addClass('bg-faded');
        $('#' + pResultPlaceholderID).html('0');
        $('#' + pDiv + ' a').attr('href', 'serviceerror.html');
        result = false;
    }

    if (!modules || !clientMenu || !serverMenu) { return false; }
    //console.log(pModuleName);
    var parsedmodules = JSON.parse(modules);
    clientMenu = JSON.parse(clientMenu);
    serverMenu = JSON.parse(serverMenu);
    // console.log('main',modules);
    var filterModule = parsedmodules.filter(function (item_) {
        return item_.Module === pModuleName && item_.IsAvailable === 'True';
    });
    //console.log(filterModule);
    if (filterModule.length > 0) {

        var htmlLink = $('#' + pDiv + ' a').attr('href');
        //console.log(htmlLink);
        var filterClientMenu = clientMenu.filter(function (items) {
            return items.flagName === pModuleName;
        });
        //console.log('ca' , filterClientMenu);
        if (filterClientMenu.length > 0) {

            var filterChild = filterClientMenu[0]['children'].filter(function (childitem) {
                //  console.log(childitem.htmlFormName , htmlLink);
                return childitem.htmlFormName === htmlLink;
            });

            // console.log(pModuleName, filterChild);
            //var finalmenu;

            $.each(filterChild, function (i, element) {
                var finalmenu = serverMenu.filter(function (item) {
                    return item.ObjectName === element.formName;
                });
                // console.log('final' , finalmenu);
                if (finalmenu.length > 0) {
                    $('#' + pDiv).removeClass('bg-faded');
                    result = true;
                } else {
                    $('#' + pDiv).addClass('bg-faded');
                    $('#' + pResultPlaceholderID).html('0');
                    $('#' + pDiv + ' a').attr('href', 'RequestActivation.html');
                    result = false;
                }

            });

        }

    } else {
        $('#' + pDiv).addClass('bg-faded');
        $('#' + pResultPlaceholderID).html('0');
        $('#' + pDiv + ' a').attr('href', 'ModuleNotAvailable.html?modulename=' + remove_character('Is', pModuleName));
        result = false;
    }

    $('#' + pDiv + ' a').attr('onClick', 'return true;');


    return result;

}

function remove_character(str_to_remove, str) {
    let reg = new RegExp(str_to_remove)
    return str.replace(reg, '')
}

// function getNoticesFlash(){
//     postRequest('GetNotices',{pIsGetFlashNoticesOnly:false,pIsShowTotalCountOnly : true},function(result){
//         var count = JSON.parse(result.d);
//         checkLoggedIn(count);
//         var spanAvailableNotice = count;
//         //$('#spanAvailableNotice').html(spanAvailableNotice);
//         toastr.options = {            
//             "onclick": function(e){
//                 alert();
//                 return;
//             },            
//           }

//         toastr.info(`<span class="badge" style="background:#fff;color:#000;">${count}</span> 
//                     important Notice(s)`);
//     })
// }