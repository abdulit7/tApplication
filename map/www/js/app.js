
var varBaseUrl;
varBaseUrl = "https://etimetrax.com/"//"http://localhost:3560/TimeTraxWeb/"
//loadScripts();
var communicationHub;
var IsCommunication;

try {
    modulearr = JSON.parse(getLocalStorageItem_String('Modules'));
    IsCommunication = modulearr.filter(function (value) {
        return value.Module == 'IsCommunication' && value.IsAvailable == 'True';
    });

    if (IsCommunication.length > 0) {
        $(function () {
            if (window.location.href.toLowerCase().indexOf('login') == -1) {
                //$('body').append('<script src="js/jquery.signalR-1.0.0.min.js" type="text/javascript"></script>');
                //$('body').append('<script src="js/jquery.signalR-1.1.4.min.js" type="text/javascript"></script>');
                //$('body').append('<script src="js/SignalRHub.js" type="text/javascript"></script>');
                //$('body').append('<script src="' + getBaseUrl() + 'signalr/hubs"></script>');
                initSignalR();
            }
        })
    }
} catch (error) {

}

$(function () {
    //alert(window.location.href.toLowerCase());   
    $("#btnlogout").click(function () {
        logOut(true);
    });
});

function initSignalR() {

    communicationHub = $.connection.communicationHub;
    $.connection.hub.start({ jsonp: true }).done(function () { });
    registerClientMethods(communicationHub);
}

function registerClientMethods(communicationHub) {
    getNotificationUnreadMsg();
    communicationHub.client.Refresh = function () {
        getNotificationUnreadMsg();
        try {
            window.navigator.vibrate(500);
        } catch (error) {

        }
    }
}



function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function getNotificationUnreadMsg() {

    postRequest('GetUnreadMsgForNotificationPopup', {}, function (r) {
        r = JSON.parse(r.d);
        if (r.length <= 0) {
            //jQuery('#NotificationCount1').html('No unread Notifications.');
            jQuery('#NotificationList').html(center('<br>No Notifications!'));
            jQuery('#notiBell').css('color', '#fff');
            jQuery('#notiCount').html('');
            //jQuery('#NotificationCount0').hide();
            return;
        }
        var tempTemplate = '';
        jQuery.each(r, function (i, msg) {

            var msgDate = msg.LastMessage !== '' ? new Date(msg.LastMessage.split('^')[1]) : '';
            var today = new Date();
            if (msgDate !== '') {
                if (msgDate.getDay() === msgDate.getDay() && msgDate.getMonth() === today.getMonth() && msgDate.getFullYear() === today.getFullYear()) {
                    msgDate = 'Today ' + formatAMPM(msgDate);
                } else {
                    msgDate = msgDate.getDay() + '/' + msgDate.getMonth() + '/' + msgDate.getFullYear();
                }
            }
            var referenceMsg = msg.ReferenceType == 'Communication' ? msg.LastMessage.split('^')[0].length > 30 ? msg.LastMessage.split('^')[0].substr(0, 30) + ' <u>more</u>...' : msg.LastMessage.split('^')[0] : msg.ReferenceType + '#' + msg.ReferenceID;

            var urlLink = "";
            jQuery.each(msg.Params.split(','), function (p, param) {
                if (urlLink.length > 0) {
                    urlLink += '&' + param + '=' + msg.ParamsVal.split(',')[p]
                } else {
                    urlLink += '?' + param + '=' + msg.ParamsVal.split(',')[p]
                }
            });

            tempTemplate += '<li onClick="openChat(' + msg.SenderID + ',\'' + msg.ReferenceType + '\',' + msg.ReferenceID + ',' + msg.ReferenceProcessID + ',0);" class="notificationItem">' +
                '<a role="menuitem" href="#">' +
                '<div class="pull-right">' +
                '<i class="fa fa-envelope-o" style="font-size: 16px;"></i>' +
                '<span class="userwisecount">(' + msg.UnreadMsg + ')</span>' +
                '</div>' +
                '<span style="font-size: 16px;">' + msg.Sender + '</span>' +
                '<p>' + referenceMsg +
                '</p>' +
                '</a>' +
                '</li>';
        });
        //jQuery('#NotificationCount0').show().html(r.length);
        //jQuery('#NotificationCount1').html('You have ' + r.length + ' unread messages');        
        jQuery('#NotificationList').html(tempTemplate);
        jQuery('#notiBell').css('color', '#f44336');
        jQuery('#notiCount').html(r.length);
        //toastr.options = { progressBar: true }        
        toastr.info('New Message Received!');
        return;
    });
}

function openChat(SenderID, ReferenceType, ReferenceID, ReferenceProcessID, TranID) {
    var params = '?SenderID=' + SenderID + '&ReferenceType=' + ReferenceType + '&ReferenceID=' + ReferenceID + '&ReferenceProcessID=' + ReferenceProcessID + '&TranID=0';
    window.location.href = 'Chat.html' + params;
}

//loadScripts(0);

// Not In Use - 
// function loadScripts(params) {
//     // var scripts = '<script src="js/bootstrap.js"></script>' +
//     // '<script src="js/noti/toastr.js"></script>' +    
//     // '<script type="text/javascript" src="js/mainmenu.js"></script>' +
//     // '<script src="js/moment-with-locales.js"></script>' +
//     // '<script src="js/bootstrap-datetimepicker.js"></script>' +
//     // '<script src="js/jquery.slimscroll.js"></script>' +
//     // '<script src="js/fastclick.js"></script>'; 
//     var scripts = '<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.4.0/polyfill.js"></script>';
//     $('head').append(scripts);    
// }

function logOut(isConfirm, pWindow) {
    var ret, _window;
    ret = true;
    if (isConfirm) { ret = confirm("Are you sure to logoff?"); }
    _window = pWindow ? pWindow : window;
    if (ret == true) {
        localStorage.removeItem('logedin');
        localStorage.removeItem('secKey');
        localStorage.removeItem('eid');
        localStorage.removeItem('ename');
        localStorage.removeItem('ecode');
        localStorage.removeItem('cid');
        localStorage.removeItem('uid');
        localStorage.removeItem('lid');
        localStorage.removeItem('gid');
        localStorage.removeItem('dateformat');
        //localStorage.removeItem('baseurl');       //won't be removed on logout
        localStorage.removeItem('timeformat');

        // Added By Jameel
        localStorage.removeItem('Modules');
        localStorage.removeItem('ServerMenu');
        localStorage.removeItem('noticeChecker');
        localStorage.removeItem('_jobAnniversary');
        localStorage.removeItem('_birthday');
        localStorage.removeItem('isAdmin');



        _window.location = "login.html";
    }
}

function checkLoggedIn(obj) {
    if (obj.hasOwnProperty('isLoggedIn')) {
        if (obj.isLoggedIn === false) {
            logOut(false);
            return false;
        }
    }
    return true;
}

function checkLoggedIn_parent(obj) {
    var _window;
    _window = window.parent.window ? window.parent.window : undefined;
    if (obj.hasOwnProperty('isLoggedIn')) {
        if (obj.isLoggedIn === false) {
            logOut(false, _window);
            return false;
        }
    }
    return true;
}

function getBaseUrl() {
    return localStorage.getItem('baseurl');
}

function getCompanyID() {
    var result;
    result = localStorage.getItem('cid');
    result = isNull(result) ? 0 : result;
    return result;
}

function getEmployeeID() {
    var result;
    result = localStorage.getItem('eid');
    result = isNull(result) ? 0 : result;
    return result;
}

function getLanguageID() {
    var result;
    result = localStorage.getItem('lid');
    result = isNull(result) ? 0 : result;
    return result;
}

function getLocalStorageItem_Int(key) {

    var result;
    result = localStorage.getItem(key);
    result = isNull(result) ? 0 : result;
    return result;
}

function getLocalStorageItem_String(key) {
    var result;
    result = localStorage.getItem(key);
    result = isNull(result) ? '' : result;
    return result;
}

function isNull(value) {
    return typeof value === 'undefined' || value === null;
}


function isJSONString(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}

function OnWsError(result) {
    // alert('Service call failed: ' + varUrl + result.status + '' + result.statusText);
    try {
        alert(result.responseJSON.Message);
    }
    catch (e) {
        // alert('Service call failed');
        toastr.error('Unable to connect');
    }
}

function OnPostRequestError(result) {
    // alert('Service call failed: ' + varUrl + result.status + '' + result.statusText);
    try {
        toastr.error(result.responseJSON.Message);
    }
    catch (e) {
        // alert('Service call failed');
        toastr.error('Something went wrong! Please contact System Admin or Try Again.');
    }
}

function OnWsError_Toaster(result) {
    if (IsWSUpd() === false) {
        toastr.error('Unable to connect! <br> Its look like your backend service(s) is not updated.');
        return;
    }
    try {
        toastr.error(result.responseJSON.Message);
    }
    catch (e) {
        toastr.error('Unable to connect!');
    }
}

function DisableButton(pBtn, pText) {
    pBtn.html(pText);
    pBtn.prop('disabled', true);
}

function EnableButton(pBtn, pText) {
    pBtn.html(pText);
    pBtn.prop('disabled', false);
}


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function _toPrecision(n, d) {
    var whole, length = 0;
    whole = n.toString().split('.')[0];
    if (whole.length > 0) {
        length = whole.length + d; // len
        length -= 1;
    }

    return parseFloat(n).toPrecision(length);
}

// Added By Jameel on 24-JAN-2018 -  Start ------------------------

var d = new Date();
var month = d.getMonth() + 1;
var day = d.getDate();
var sysdate = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();

function fillDropDownGeneric(parametersobj, ddlControl, EmptyFirst, pselectedValue, callback) {
    //var parametersobj;
    var text = parametersobj.PID2;
    var value = parametersobj.PID3;

    varType = "POST";
    varUrl = getBaseUrl() + "wsttmapp.asmx/FillDropDownGeneric";
    parametersobj = JSON.stringify(parametersobj);
    varContentType = "application/json; charset=utf-8";
    varDataType = "json";
    varProcessData = true;

    $.ajax({
        type: varType, //GET or POST or PUT or DELETE verb
        url: varUrl, // Location of the service
        data: parametersobj, //Data sent to server
        contentType: varContentType, // content type sent to server
        dataType: varDataType, //Expected data format from server
        processdata: varProcessData, //True or False
        aysnc: false,
        success: function (result) {//On Successfull service call
            //var ddlObject = document.getElementById("ddlControl");
            //  emptyDropDown(ddlObject);
            var resultObject = null;
            if (varDataType == "json") {
                var json = JSON.parse(result.d);
                checkLoggedIn(json);
                //console.log(json);

                //  afterfillDropDownGenericSuccess();
                if (callback == null) {
                    _fillDropDown(json, ddlControl, value, text, EmptyFirst);

                    if (!isNull(pselectedValue) && pselectedValue !== 0) {
                        ddlControl.value = pselectedValue;
                    }
                } else {
                    callback(json);
                }

            }
        },
        error: OnWsError// When Service call fails
    });

}

function isEmptyObj(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function emptyDropDown(ddl) {
    for (var j = ddl.options.length - 1; j >= 0; j--) { ddl.remove(j); }
}

function _fillDropDown(json, ddlObject, value, text, isClearFirst, pSelectedIndex) {

    if (pSelectedIndex == null) {
        pSelectedIndex = -1;
    }

    if (value.indexOf(' as \'') > -1) {
        value = value.slice(value.indexOf(' as \'') + 5).replace(/'\s*$/, "");
    }
    if (text.indexOf(' as \'') > -1) {
        text = text.slice(text.indexOf(' as \'') + 5).replace(/'\s*$/, "");
    }

    if (isClearFirst === true) {
        emptyDropDown(ddlObject);
        var option = document.createElement("option");
        option.value = 0;
        option.text = '- select -';
        ddlObject.options.add(option)
    }

    jQuery.each(json, function (i, record) {
        var option = document.createElement("option");
        option.value = record[value];
        option.text = record[text]; //resultObject[i];
        if (i == pSelectedIndex) {
            option.selected = true;
        }
        ddlObject.options.add(option)
    });

    // json.forEach(function (record) {
    //     var option = document.createElement("option");
    //     option.value = record[value];
    //     option.text = record[text]; //resultObject[i];
    //     ddlObject.options.add(option)
    // });
}

function postRequest(methodName, data, callback, errorcallback, isExcludeDefaultParamters) {
    var d;
    var eid, uid, ecode, secKey, cid, lid, ename, Type, Url, Data, ContentType, DataType, ProcessData;
    eid = getLocalStorageItem_Int('eid');
    ename = getLocalStorageItem_Int('ename');
    uid = getLocalStorageItem_Int('uid');
    cid = getLocalStorageItem_Int('cid');
    lid = getLocalStorageItem_Int('lid');
    ecode = getLocalStorageItem_String('ecode');
    secKey = getLocalStorageItem_String('secKey');

    Type = "POST";
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    //Url = getBaseUrl() + "wsttmapp.asmx/"+methodName;
    //Url = getBaseUrl() + "wsttmapp.asmx/" + methodName;
    Url = getBaseUrl();
    Url += methodName.indexOf('/') > -1 ? methodName : "wsttmapp.asmx/" + methodName;
    var params;
    if (isExcludeDefaultParamters != null && isExcludeDefaultParamters != undefined && isExcludeDefaultParamters == true) {
        params = {};
    } else {
        params = {
            pSecKey: secKey,
            pEmployeeID: eid,
            pEmployeeRefNo: ecode,
            pUserID: uid,
            pCompanyID: cid,
        }
    }

    var newparams = Object.assign({}, params, data)
    newparams = JSON.stringify(newparams);
    //console.log(newparams);
    $.ajax({
        //async: false,
        type: Type, //GET or POST or PUT or DELETE verb
        url: Url, // Location of the service
        data: newparams, //Data sent to server
        contentType: ContentType, // content type sent to server
        dataType: DataType, //Expected data format from server
        processdata: ProcessData, //True or False                    
        // success: function(result){
        //     d = result
        // },
        success: callback,
        error: !errorcallback ? OnWsError_Toaster : errorcallback,// When Service call fails
        failure: !errorcallback ? OnWsError_Toaster : errorcallback
    });
    //return d;
}

function postRequest2(URL_, data, callback, errorcallback) {
    var d;
    var eid, uid, ecode, secKey, cid, lid, ename, Type, Url, Data, ContentType, DataType, ProcessData;
    eid = getLocalStorageItem_Int('eid');
    ename = getLocalStorageItem_Int('ename');
    uid = getLocalStorageItem_Int('uid');
    cid = getLocalStorageItem_Int('cid');
    lid = getLocalStorageItem_Int('lid');
    ecode = getLocalStorageItem_String('ecode');
    secKey = getLocalStorageItem_String('secKey');

    Type = "POST";
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    //Url = getBaseUrl() + "wsttmapp.asmx/"+methodName;
    //Url = getBaseUrl() + "wsttmapp.asmx/" + methodName;

    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: cid,
    }

    var newparams = Object.assign({}, params, data)
    newparams = JSON.stringify(newparams);
    //console.log(newparams);
    $.ajax({
        //async: false,
        type: Type, //GET or POST or PUT or DELETE verb
        url: URL_, // Location of the service
        data: newparams, //Data sent to server
        contentType: ContentType, // content type sent to server
        dataType: DataType, //Expected data format from server
        processdata: ProcessData, //True or False                    
        // success: function(result){
        //     d = result
        // },
        success: callback,
        error: !errorcallback ? OnWsError_Toaster : errorcallback,// When Service call fails
        failure: !errorcallback ? OnWsError_Toaster : errorcallback
    });
    //return d;
}

function funcFillDropDownListSelec2(pagingSize, WSMethodName, ddlobj, pData) {
    //alert('inside');

    //var $ = jQuery.noConflict(); Change by HMN on 24-09-2018 (Remove var)
    $ = jQuery.noConflict();
    var result = ddlobj.select2({
        width: '100%',
        ajax: {
            url: getBaseUrl() + "wsttmapp.asmx/" + WSMethodName,
            type: "POST",
            dataType: 'json',
            delay: 500,
            data: pData,
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: data.items,
                    pagination:
                    {
                        more: (params.page * pagingSize) < parseInt(data.total_count)
                    }
                };
            },
            cache: true
        },
        placeholder: "Select",
        allowClear: true,
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        minimumInputLength: 1,
        templateResult: function (repo) {
            var markup;
            if (repo.loading) { return repo.text; }
            markup = "<div class='select2-result-repository__title'>" + repo.text + "</div>";
            return markup;
        }, //formatRepoddlItem omitted for brevity, see the source of this page
        templateSelection: function (repo) { return repo.text; }
        //formatRepoSelectionddlItem // omitted for brevity, see the source of this page

    });

    return result;
}

function getFileName(id) {
    var fullPath = document.getElementById(id).value;
    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        var a = filename
    }
    else {
        a = '';
    }
    return a;
}

function getDayName(strDate) {

    try {
        var arr = strDate.split("/")
        var d = new Date(arr[2], arr[1] - 1, arr[0]);
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        return weekday[d.getDay()];
    } catch (error) {
        return "";
    }


}

function getFormattedDateNew(dt, fullMonthName) {
    if (!isNull(dt)) {
        // dt = Date From Web Service which is unformatted    
        var dateformat = getLocalStorageItem_Int('dateformat') === 0 ? 'dd/mm/yyyy' : getLocalStorageItem_Int('dateformat')
        //console.log(dateformat);
        if (fullMonthName) {
            return getDateWithMonthName(DTHelper.GetFormattedDate(getDateByASPNETTimeStamp(dt), dateformat));
        }
        return DTHelper.GetFormattedDate(getDateByASPNETTimeStamp(dt), dateformat)
    }
    return ''
}

function getFormattedTimeNew(dt) {
    // dt = Date From Web Service which is unformatted    
    var dateformat = getLocalStorageItem_Int('dateformat');
    return DTHelper.GetFormattedTime(getDateByASPNETTimeStamp(dt), dateformat)
}

function getDateWithMonthName(dt) {


    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = dt.getDate();
    var monthIndex = dt.getMonth();
    var year = dt.getFullYear();
    day = day < 9 ? '0' + day : day
    return day + '-' + monthNames[monthIndex] + '-' + year;
}

if (window.location.href.indexOf('login.html') < 0) {
    getNoticesFlash();
}

function getNoticesFlash() {
    var _url = window.location.pathname;
    var pageName = _url.substring(_url.lastIndexOf('/') + 1);
    if (pageName === 'login.html' || pageName === 'index.html' || pageName === 'register.html' || pageName === 'PerformanceMatrix.html') { return; }
    initNoticedb();
    postRequest('GetNotices', { pIsGetFlashNoticesOnly: true, pIsShowTotalCountOnly: false }, function (result) {
        var dt = JSON.parse(result.d);
        checkLoggedIn(dt);
        //var spanAvailableNotice = dt;
        //console.log(dt);
        var db = localStorage.getItem('noticeChecker');
        if (db) { db = JSON.parse(db); }
        dt = dt['Notice'];
        var count2 = dt.length;
        var count = 0;
        // console.log(dt);

        if (!isEmptyObj(dt)) {
            if (!isEmptyObj(db)) {
                $.each(dt, function (i) {
                    //  console.log(dt[i].NoticeID);
                    var arr = db.filter(function (item) {
                        return parseInt(item.NoticeID) === parseInt(dt[i].NoticeID);
                    });
                    //  console.log('arr',arr);
                    if (arr.length === 0) {
                        count++;
                    }

                });
            } else {
                count = count2;
            }

        } else {

        }

        if (count > 0) {
            toastr.info('', '<span style="background:#fff;color:#333;font-size:16px;" class="badge">' + count + '</span>' + ' New Announcement(s)', {
                onclick: function () {
                    window.location.href = 'Notice.html?IsFlashOnly=true';
                }, timeOut: 10000
            });
        }

        // $.each(dt,function(i){
        //     if (!isNull(db)){
        //         var arr = db.filter(function(item){
        //             return  parseInt( item.NoticeID) === parseInt( dateformat[i].NoticeID);
        //         });
        //         if (arr.length > 0){
        //            count++;
        //         }
        //     }
        // });

    }, function () {
        //toastr.error('');
    });


}

function initNoticedb() {
    var db_ = localStorage.getItem('noticeChecker');
    if (!db_) {
        var table = [];
        var row = {
            Notice: 0,
            IsRead: true
        }
        table.push(row);
        localStorage.setItem('noticeChecker', JSON.stringify(table));
    }
}


//$('#pageHeading').append('<span id="wait" style="display: none;font-size: 18px;" class="fa fa-spinner fa-spin pull-right btn"></span>	');

themeInit();
function themeInit() {

    var theme = localStorage.getItem('theme');
    if (theme) {
        theme = JSON.parse(theme);
        var name = theme[0].ThemeName;
        //console.log(name);
        //$('head').append('<link rel="stylesheet" href="theme/'+name+'.css" type="text/css" />');
        //var themeRules = `.skin-blue .main-header .navbar {    background-color: ${themeColor};}.skin-blue .main-header .logo {    background-color: ${themeColor};}.skin-blue .main-header .logo:hover {    background-color: ${themeColor};}.skin-blue footer {    background-color: ${themeColor};    color: #fff;}.skin-blue .main-header .navbar .sidebar-toggle:hover {    background-color: ${themeColor};}.objectivebox {      border-bottom: 2px solid ${themeColor};    }.btn-primary {    background-color: ${themeColor};}.btn-primary:hover {    background-color: ${themeColor};}.btn-primary:target {    background-color: ${themeColor};}.btn-primary:focus {    background-color: ${themeColor};}.btn-primary.active.focus, .btn-primary.active:focus, .btn-primary.active:hover, .btn-primary:active.focus, .btn-primary:active:focus, .btn-primary:active:hover, .open>.dropdown-toggle.btn-primary.focus, .open>.dropdown-toggle.btn-primary:focus, .open>.dropdown-toggle.btn-primary:hover {    color: #fff;    background-color: ${themeColor};    border-color: #122b40;}.surveytitle2 {    border-color: ${themeColor};}.performancetitle {    background-color: ${themeColor};}.questionTemplate {      border-left: 2px solid ${themeColor};}.EmployeeTitle {    color: ${themeColor};    }.skin-blue .treeview-menu > li > a {    color: #fff;    }.sidebar{    background-color: ${themeColor};   }.skin-blue .sidebar a {color: #fff;}label{color: ${themeColor};}`;
        $('head').append('<style id="themeStyle"></style>');
        ApplyTheme(name);
    } else {
        //$('head').append('<link rel="stylesheet" href="theme/Default.css" type="text/css" />');
        $('head').append('<style id="themeStyle"></style>');
        ApplyTheme(name);
    }
}

function GetThemeArray() {
    var data = {
        themes: ['Default', 'Blue', 'LightBlue', 'Green', 'Purple', 'Magenta', 'Teal', 'Brown', 'Red', 'Indigo', 'Light Green', 'Lime', 'Amber', 'Dark'],
        themesColor: ['#F5770B', '#003960', '#03A9F4', '#008746', '#5c2568', '#FF00FF', '#009688', '#795548', '#FF5722', '#3F51B5', '#4CAF50', '#CDDC39', '#FFC107', '#212121']
    }
    return data;
}

generateShortcuts();
function generateShortcuts() {

    // jQuery('body').click(function () {
    //     var isShortOpen = $('.toggleshortcutpanel .fa').hasClass('fa-times');
    //     alert(isShortOpen);
    //     if (!isShortOpen) {
    //         //alert();
    //         $('.shortcutpanel').animate({ 'right': '-58%', 'height': '100px' });
    //         $('.toggleshortcutpanel').animate({ 'left': '-2%', 'top': '50%', transform: 'translate(-50%,-50%)' });
    //         $('.toggleshortcutpanel .fa').toggleClass('fa-times');
    //     }
    // })

    jQuery('.content').prepend('<div class="shortcutpanel"> <div class="shortcutcontainer" id="shortcutcontainer"> </div> </div>');
    jQuery('#shortcutcontainer').before('<div class="toggleshortcutpanel"><i class="fa fa-chevron-left"></i></div>');
    $('.toggleshortcutpanel').click(function (e) {
        e.preventDefault();
        var isShortOpen = $('.toggleshortcutpanel .fa').hasClass('fa-chevron-left');
        if (isShortOpen) {
            $('.shortcutpanel').animate({ 'right': '0px', 'height': '280px' });
            $('.toggleshortcutpanel').animate({ 'left': '50%', 'top': '-2%', transform: 'translate(-50%,-50%)' });
            $('.toggleshortcutpanel .fa').toggleClass('fa-times fa-chevron-left');
        } else {
            $('.shortcutpanel').animate({ 'right': '-250px', 'height': '80px' });
            $('.toggleshortcutpanel').animate({ 'left': '-2%', 'top': '50%', transform: 'translate(-50%,-50%)' });
            $('.toggleshortcutpanel .fa').toggleClass('fa-times fa-chevron-left');

        }
    })

    var yesterday, tommorow;
    yesterday = new Date(Date.now() - 864e5);
    tommorow = new Date(Date.now() + 864e5);

    var ymonth = yesterday.getMonth() + 1;
    var yday = yesterday.getDate();
    yesterday = (yday < 10 ? '0' : '') + yday + '/' + (ymonth < 10 ? '0' : '') + ymonth + '/' + yesterday.getFullYear();

    ymonth = tommorow.getMonth() + 1;
    yday = tommorow.getDate();
    tommorow = (yday < 10 ? '0' : '') + yday + '/' + (ymonth < 10 ? '0' : '') + ymonth + '/' + tommorow.getFullYear();

    //console.log(yesterday, sysdate, tommorow);

    var months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var chatLink = '';
    if (IsCommunication != undefined) {
        if (IsCommunication.length > 0) {
            chatLink = 'Chat.html';
        }
    } else {
        chatLink = '';
    }

    var shortcuts = [
        {
            shortcutType: 'leave',
            shortcutTitle: 'Leave Request',
            shortcutItems: [
                {
                    itemTitle: 'Yesterday', itemIcon: 'fa-medkit', itemLink: 'Leave.html?sd=' + yesterday + ''
                },
                {
                    itemTitle: 'Today', itemIcon: 'fa-medkit', itemLink: 'Leave.html?sd=' + sysdate + ''
                },
                {
                    itemTitle: 'Tommorow', itemIcon: 'fa-medkit', itemLink: 'Leave.html?sd=' + tommorow + ''
                }
            ]
        },

        {
            shortcutType: 'attendance',
            shortcutTitle: 'Attendance Request',
            shortcutItems: [
                {
                    itemTitle: 'Yesterday', itemIcon: 'fa-calendar-o', itemLink: 'AttendanceRequest.html?sd=' + yesterday + ''
                },
                {
                    itemTitle: 'Today', itemIcon: 'fa-calendar-o', itemLink: 'AttendanceRequest.html?sd=' + sysdate + ''
                },
                {
                    itemTitle: 'Tommorow', itemIcon: 'fa-calendar-o', itemLink: 'AttendanceRequest.html?sd=' + tommorow + ''
                }
            ]
        },

        {
            shortcutType: 'other',
            shortcutTitle: 'Other Shortcuts',
            shortcutItems: [
                {
                    itemTitle: months[d.getMonth() == 0 ? d.getMonth() + 1 : d.getMonth()] + ' Payslip', itemIcon: 'fa-money', itemLink: 'Payslip.html?month=' + (d.getMonth() == 0 ? d.getMonth() + 1 : d.getMonth())
                },
                {
                    itemTitle: 'Chat', itemIcon: 'fa-comments', itemLink: chatLink
                },
                {
                    itemTitle: 'Mark Attendance', itemIcon: 'fa-map-marker', itemLink: 'markattendance.html'
                }
            ]
        }
    ]


    var template = '';
    var innertemplate = '';
    $.each(shortcuts, function (i, item) {
        innertemplate = '';
        jQuery.each(item.shortcutItems, function (j, jitem) {

            var onclick = jitem.itemLink == '' ? '' : 'onclick="window.location.href = \'' + jitem.itemLink + '\'";';

            innertemplate += '<div class="col-xs-4">'
                + '<div class="shortcutitem" ' + onclick + '>'
                + '<i class="fa ' + jitem.itemIcon + '"></i>'
                + '<div class="shortcuttext">' + jitem.itemTitle + '</div>'
                + '</div>'
                + '</div>';
        });


        template += '<div class="leaveshortcut">'
            + '<div class="col-xs-12">'
            + '<div class="shortcuttitle"> ' + item.shortcutTitle + ' </div>'
            + '</div>'
            + '<div class="container-fluid">'
            + innertemplate
            + '</div>'
            + '</div>'

    })


    jQuery('#shortcutcontainer').html(template);

}

function ApplyTheme(themeID) {
    var d = GetThemeArray();
    var color = '#F5770B';
    if (d.themes.indexOf(themeID) > -1) {
        color = d.themesColor[d.themes.indexOf(themeID)];
    }
    var style = '.skin-blue .main-header .navbar{background-color:' + color + '}.skin-blue .main-header .logo{background-color:' + color + '}.skin-blue .main-header .logo:hover{background-color:' + color + '}.skin-blue footer{background-color:' + color + ';color:#fff}.skin-blue .main-header .navbar .sidebar-toggle:hover{background-color:' + color + '}.objectivebox{border-bottom:2px solid ' + color + '}.objectiveboxapproval{border-color:' + color + '}.btn-primary{background-color:' + color + ';border-color:' + color + '}.btn-primary:hover{background-color:' + color + '}.btn-primary:target{background-color:' + color + '}.btn-primary:focus{background-color:' + color + '}.btn-primary.active.focus,.btn-primary.active:focus,.btn-primary.active:hover,.btn-primary:active.focus,.btn-primary:active:focus,.btn-primary:active:hover,.open>.dropdown-toggle.btn-primary.focus,.open>.dropdown-toggle.btn-primary:focus,.open>.dropdown-toggle.btn-primary:hover{color:#fff;background-color:' + color + ';border-color:' + color + '}.btn-primary.disabled,.btn-primary.disabled.active,.btn-primary.disabled.focus,.btn-primary.disabled:active,.btn-primary.disabled:focus,.btn-primary.disabled:hover,.btn-primary[disabled],.btn-primary[disabled].active,.btn-primary[disabled].focus,.btn-primary[disabled]:active,.btn-primary[disabled]:focus,.btn-primary[disabled]:hover,fieldset[disabled] .btn-primary,fieldset[disabled] .btn-primary.active,fieldset[disabled] .btn-primary.focus,fieldset[disabled] .btn-primary:active,fieldset[disabled] .btn-primary:focus,fieldset[disabled] .btn-primary:hover{background-color:#122b40;border-color:#122b40}.surveytitle{color: ' + color + '}.surveytitle2{border-color:' + color + '}.performancetitle{background-color:' + color + '}.questionTemplate{border-left:2px solid ' + color + '}.EmployeeTitle{color:' + color + '}.skin-blue .treeview-menu>li>a{color:#fff}.sidebar{background-color:' + color + '}.skin-blue .sidebar a{color:#fff}label{color:' + color + '}.login-page,.register-page{background:' + color + '}#wait{color:' + color + '}a{color:' + color + '}.form-control:focus{border-color:' + color + '}.addonbordertxt{color:' + color + '}.helpdeskicons{color:' + color + '}.fixedinput{background:#0039871c}.direct-chat-text{border-color:' + color + '}.btn-primary:hover{border-color:transparent;}.label-primary{background:' + color + ' !important;} a,a:hover,a:focus,a:target{color:' + color + '}input:checked+.slider { background-color: ' + color + '; }input:focus+.slider { box-shadow: 0 0 1px ' + color + '; }';
    $('#themeStyle').html(style);
}

if (window.location.href.toLowerCase().indexOf('login') <= -1) {
    initTopMenu();
}

$()

function initTopMenu() {

    var EditProfileLink = IsWSUpd() ? 'MyProfile.html' : 'serviceerror.html';
    var ChangePassword = IsWSUpd() ? 'ChangePassword.html' : 'serviceerror.html';

    //$('.sidebar-toggle').html('<i class="fa fa-bars"></i>');

    //$('.sidebar-toggle').html('<i class="fa fa-times"></i>').toggleClass('label sidebar-toggle');
    $('.sidebar-toggle').click(function (e) {
        //e.preventDefault();
        //$(this).removeClass('sidebar-toggle');
        $(this).toggleClass('sidebar-toggle sidebar-toggle-close');
    })



    $('#pageDropdowns').append('<li onClick="logOut(true);" class="dropdown" id="btnOut"> <a id="btnlogout0" href="" class="dropdown-toggle" data-toggle="dropdown"> <i class="fa fa-sign-out fa-fw" style="font-size: 20px;"></i> </a> </li> <li class="dropdown" id="btnSettings"> <a href="#" class="dropdown-toggle" data-toggle="dropdown"> <i class="fa fa-cog" style="font-size: 18px;"></i> </a> <ul class="dropdown-menu"> <li><a href="#" id="btnlogout"><i class="fa fa-sign-out fa-fw"></i> Logout</a> </li> </ul></li>');

    $('#pageDropdowns li:nth-child(1)').attr('id', 'btnUser');
    $('#pageDropdowns li:nth-child(2)').attr('id', 'btnOut');
    $('#pageDropdowns li:nth-child(3)').attr('id', 'btnSettings');
    $('#btnUser ul').remove();
    $('.main-header a').removeAttr('href');
    $('.main-header a img').attr('onClick', 'window.location.href = "main.html"');
    $('#pageDropdowns li#btnSettings ul').html(
        '<li><a href=' + EditProfileLink + ' id = "" > <i class="fa fa-user"></i> Edit Profile</a ></li > ' +
        '<li><a href=' + ChangePassword + ' id=""><i class="fa fa-key"></i> Change Password</a></li>' +
        '<li class="divider"></li>' +
        '<li><a href="ThemeRoller.html" id=""><i class="fa fa-paint-brush"></i> Theme Roller</a></li>' +
        '<li><a href="Feedback.html" id=""><i class="fa fa-comment-o"></i> Feedback</a></li>' +
        '<li class="divider"></li>' +
        '<li><a href="settings.html" id=""><i class="fa fa-cog"></i> Settings</a></li>'
        //'<li><a href="#" id="btnlogout"><i class="fa fa-sign-out fa-fw"></i> Logout</a></li>'
    );

    // isCommunicationRights = JSON.parse(localStorage.getItem('ServerMenu')).filter(function(value) {
    //     return value.ObjectName.toLowerCase() === 'communication.aspx';
    // });

    getStorageItem(localStorage, 'ServerMenu', function (value) {

        if (value) {
            isCommunicationRights = JSON.parse(value).filter(function (value) {
                return value.ObjectName.toLowerCase() === 'communication.aspx';
            });
        }
    });

    if (window.location.href.toLowerCase().indexOf('Chat.html') <= -1 && IsCommunication !== undefined && IsCommunication.length > 0 && isCommunicationRights !== undefined && isCommunicationRights.length > 0) {
        $('#pageDropdowns').append('<li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown"> &nbsp;<i class="fa fa-comments"  style="font-size: 18px; id="notiBell"></i> <span class="notiCount" id="notiCount"></span> </a> <ul class="dropdown-menu" id="NotificationList"> </li>');
    }


    var yesterday;
    yesterday = new Date(Date.now() - 864e5);
    var ymonth = yesterday.getMonth() + 1;
    var yday = yesterday.getDate();
    yesterday = (yday < 10 ? '0' : '') + yday + '/' + (ymonth < 10 ? '0' : '') + ymonth + '/' + yesterday.getFullYear();


    //$('#pageDropdowns').append('<li class="dropdown" id="btnShortcut"> <a href="#" class="dropdown-toggle" data-toggle="dropdown"> <i class="fa fa-link" style="font-size: 18px;"></i> </a> <ul class="dropdown-menu"> <li><a href="Leave.html?sd=' + sysdate + '" id="btnTLeave"><i class="fa fa-send fa-fw" style="color:' + getThemeColor() + '"></i> Apply Today\'s Leave</a > </li > <li><a  href="Leave.html?sd=' + yesterday + '" id="btnYLeave"><i class="fa fa-send fa-fw" style="color:' + getThemeColor() + '" ></i> Apply Yesterday Leave</a> </li> </ul ></li > ');


    // $('#pageDropdowns').append('<li class="dropdown">' +
    //     '<a href="#" class="dropdown-toggle" data-toggle="dropdown" id="menu2">' +
    //     '<i class="fa fa-bell"></i>' +
    //     '</a>' +
    //     '<ul class="dropdown-menu" id="NotificationList" role="menu2" aria-labelledby="menu2" style="width:80%;">' +
    //     '<li class="notificationItem">' +
    //     '<a role="menuitem" href="#">' +
    //     '<div class="pull-right">' +
    //     '<i class="fa fa-envelope-o" style="font-size: 16px;"></i>' +
    //     '<span class="userwisecount">(4)</span>' +
    //     '</div>' +
    //     '<span style="font-size: 16px;">Farrukh Siqqique</span>' +
    //     '<p>dgfdg' +
    //     '</p>' +
    //     '</a>' +
    //     '</li>' +
    //     '</ul>' +
    //     '</li>');

}

function getStorageItem(storage, key, callback) {

    if (typeof callback !== 'function') throw new Error('Invalid callback handler');

    var result = storage.getItem(key);

    if (result instanceof window.Promise) {
        result.then(callback);
    }
    else {
        callback(result);
    }
}

/**
 * Set a value in web storage regardless of whether it's sync or async
 */
function setStorageItem(storage, key, value, callback) {

    var result = storage.setItem(key, value);

    if (result instanceof window.Promise && callback) {
        result.then(callback);
    }
    else if (callback) {
        callback();
    }
}

function IsWSUpd() {
    serverarr = JSON.parse(localStorage.getItem('ServerMenu'));
    modulearr = JSON.parse(localStorage.getItem('Modules'));
    if (serverarr === null || modulearr === null) {
        return false;
    } else {
        return true;
    }

}

function EnableDisableButtonSpin(btn, d, txt, showSpinner) {

    function EnableButton(pBtn, pText) {
        pBtn.html(pText);
        pBtn.prop('disabled', false);
    }

    if (!showSpinner) {
        showSpinner = '&nbsp;<span class="fa fa-spinner fa-spin"> <span>';
    } else {
        showSpinner = '';
    }
    if (d.toLowerCase() === 'd') {
        if (!txt || txt === '') { txt = '' }
        DisableButton(btn, '' + txt + showSpinner);
    } else {
        if (!txt) {
            txt = 'Submit';
        }
        EnableButton(btn, txt);
    }
}

//GetUpdatedMenuToLocalStorage();
function GetUpdatedMenuToLocalStorage(callback) {

    try {

        var arr = GetAllMenuArray();
        localStorage.setItem('ClientMenu', JSON.stringify(arr));
        var pages = '';
        var modules = '';

        $.each(arr, function (i) {
            modules += ',\'' + arr[i].flagName + '\'';
            var child_ = arr[i]['children'];
            $.each(child_, function (j) {
                var delim = ',\'';
                var delim2 = '\'';
                if (pages !== '') {
                    pages += delim + child_[j].formName + delim2
                } else {
                    pages += '\"' + child_[j].formName + delim2
                }

            });
        });
        pages = pages.substring(0, pages.length - 1) + '';
        modules = modules.substring(1);
        pages = pages.slice(1);

        postRequest('GetMenuRights', { pPages: pages, pModules: modules }, function (response) {
            var result = JSON.parse(response.d);
            serverarr = result['Menu'];
            modulearr = result['Module'];
            localStorage.setItem('Modules', JSON.stringify(modulearr));
            localStorage.setItem('ServerMenu', JSON.stringify(serverarr));
            //console.log({ result });
            callback();
        }, function () {

        });
    } catch (error) {
        toastr.error('Something is wrong! Contact Administrator.');
    }
}

function GetAllMenuArray() {
    return [
        {
            parentObjectName: "Attendance",
            flagName: "none",
            icon: "fa fa-clock-o fa-fw",
            children: [
                {
                    formName: "",
                    htmlFormName: "markattendance.html",
                    menuCaption: "Mark Attendance",
                    IsDefault: true
                },
                {
                    formName: "",
                    htmlFormName: "viewattendance.html",
                    menuCaption: "View Attendance",
                    IsDefault: true
                },
                {
                    formName: "",
                    htmlFormName: "AttendanceRequest.html",
                    menuCaption: "Attendance Request",
                    IsDefault: true
                },
                {
                    formName: "",
                    htmlFormName: "AttendanceApproval.html",
                    menuCaption: "Attendance Approval",
                    IsDefault: true
                },
                // {
                //     formName: "",
                //     htmlFormName: "ViewEditSchedule.html",
                //     menuCaption: "View Schedule",
                //     IsDefault: true
                // }
            ]
        },
        {
            parentObjectName: "Leave",
            flagName: "none",
            icon: "fa fa-edit fa-fw",
            children: [
                {
                    formName: "",
                    htmlFormName: "LeaveApproval.html",
                    menuCaption: "Leave Approval",
                    IsDefault: true
                },
                {
                    formName: "",
                    htmlFormName: "Leave.html",
                    menuCaption: "Leave Request",
                    IsDefault: true
                },
                {
                    formName: "",
                    htmlFormName: "LeaveRequestList.html",
                    menuCaption: "Leave Request List",
                    IsDefault: true
                },
                // {
                //     formName: "CompensatoryLeaveEntitlementRequest.aspx",
                //     htmlFormName: "CompensatoryLeaveClaimRequest.html",
                //     menuCaption: "Compensatory Leave Request",
                //     IsDefault: false
                // },
                // {
                //     formName: "CompensatoryLeaveEntitlementRequestApproval.aspx",
                //     htmlFormName: "CompensatoryLeaveApproval.html",
                //     menuCaption: "Compensatory Leave Approval",
                //     IsDefault: false
                // },
                {
                    formName: "",
                    htmlFormName: "LeaveBalance.html",
                    menuCaption: "Leave Balance(s)",
                    IsDefault: true
                }
            ]
        },

        {
            parentObjectName: "Payroll",
            flagName: "none",
            icon: "fa fa-money fa-fw",
            children: [
                {
                    formName: "",
                    htmlFormName: "Payslip.html",
                    menuCaption: "View Payslip",
                    IsDefault: true
                },
                {
                    formName: "rptGroup1_FrTo_Payroll.aspx?rt=80",
                    htmlFormName: "TaxDeduction.html",
                    menuCaption: "Tax Deductions",

                }
            ]
        },

        {
            parentObjectName: "Messenger",
            flagName: "IsCommunication",
            icon: "fa fa-comments-o fa-fw",
            children: [
                {
                    formName: "Communication.aspx",
                    htmlFormName: "Chat.html",
                    menuCaption: "Chat Room"
                }
            ]
        },
        {
            parentObjectName: "Loan",
            flagName: "IsLoan",
            icon: "fa fa-usd fa-fw",
            children: [
                {
                    formName: "LoanRequest.aspx?FType=Advance",
                    htmlFormName: "LoanRequest.html?FType=Advance",
                    menuCaption: "Advance Salary Request"
                },
                {
                    formName: "LoanList.aspx?FType=Advance",
                    htmlFormName: "LoanRequestList.html?FType=Advance",
                    menuCaption: "Advance Salary Request List"
                },
                // {
                //     formName: "LoanRequest.aspx?FType=Loan",
                //     htmlFormName: "LoanRequest.html?FType=Loan",
                //     menuCaption: "Loan Request"
                // },
                // {
                //     formName: "LoanList.aspx?FType=Loan",
                //     htmlFormName: "LoanRequestList.html?FType=Loan",
                //     menuCaption: "Loan Request List"
                // },
                {
                    formName: "LoanRequestApproval.aspx",
                    htmlFormName: "LoanRequestApproval.html",
                    menuCaption: "Advance Request Approval" //Loan Request Approval 'Both for advance/loan request
                },
                {
                    formName: "rptGroup1_FrTo_Payroll.aspx?rt=86",
                    htmlFormName: "LoanSummary.html",
                    menuCaption: "Loan Summary",
                },
            ]
        }
        , {
            parentObjectName: "Expense",
            flagName: "IsExpense",
            icon: "fa fa-money fa-fw",
            children: [
                {
                    formName: "ExpenseRequestList.aspx",
                    htmlFormName: "ExpenseRequestList.html",
                    menuCaption: "Expense Request List"
                },
                {
                    formName: "ExpenseRequest.aspx",
                    htmlFormName: "ExpenseClaimRequest.html",
                    menuCaption: "Expense Claim Request"
                },
                {
                    formName: "ExpenseRequest.aspx",
                    htmlFormName: "ExpenseClaimRequest.html?FType=MileageExpense",
                    menuCaption: "Expense Claim (Milage)",
                    IsDefault: true
                },
                {
                    formName: "ExpenseRequest.aspx",
                    htmlFormName: "ExpenseClaimRequest.html?FType=NightStayExpense",
                    menuCaption: "Expense Claim (NightStay)",
                    IsDefault: true
                },
                {
                    formName: "ExpenseRequestApproval.aspx",
                    htmlFormName: "ExpenseApprovalList.html",
                    menuCaption: "Expense Approval",
                    IsDefault: true
                }
            ]
        },
        {
            parentObjectName: "Appraisal",
            flagName: "IsAppraisal",
            icon: "fa fa-bar-chart-o fa-fw",
            children: [
                {
                    formName: "PerformanceReviewRequestApprovalList.aspx",
                    htmlFormName: "PerformanceReviewList.html",
                    menuCaption: "Available Performance Review(s)"
                },
                {
                    formName: "PerformanceReviewRequestApprovalList.aspx?FType=probation",
                    htmlFormName: "PerformanceReviewList.html?IsProbation=1",
                    menuCaption: "Available Probation Review(s)"
                },
                {
                    formName: "PerformanceObjectivesRequestApproval.aspx",
                    htmlFormName: "ObjectiveApproval.html",
                    menuCaption: "Objective Approval(s)"
                },
                // {
                //     formName: "PerformanceMatrix.html",
                //     htmlFormName: "PerformanceMatrix.html",
                //     menuCaption: "Performance Potential Matrix"
                // }
            ]
        },
        {
            parentObjectName: "Travel",
            flagName: "IsTravel",
            icon: "fa fa-plane fa-fw",
            children: [
                {
                    formName: "TravelApprove.aspx",
                    htmlFormName: "TravelApproval.html",
                    menuCaption: "Travel Approval",
                    IsDefault: true
                }
            ]
        },
        {
            parentObjectName: "Helpdesk",
            flagName: "IsHelpdesk",
            icon: "fa fa-question-circle fa-fw",
            children: [
                {
                    formName: "Complainlist.aspx",
                    htmlFormName: "HelpdeskList.html",
                    menuCaption: "Request List"
                },
                {
                    formName: "Complain.aspx",
                    htmlFormName: "HelpdeskResquest.html",
                    menuCaption: "New Request"
                },
                {
                    formName: "DashboardNew.html?FType=helpdeskdashboard",
                    htmlFormName: "ViewCMSSummary.html",
                    menuCaption: "Helpdesk Dashboard",
                }
            ]
        },
        {
            parentObjectName: "Task",
            flagName: "IsTMS",
            icon: "fa fa-tasks fa-fw",
            children: [
                {
                    formName: "TaskAssignmentList.aspx",
                    htmlFormName: "TaskAssignemntList.html",
                    menuCaption: "Task Assignemnt List"
                },
                {
                    formName: "TaskAssignment.aspx",
                    htmlFormName: "TaskTransaction.html",
                    menuCaption: "Task Transaction"
                },
                {
                    formName: "TaskTransactionsList.aspx",
                    htmlFormName: "TaskTransactionList.html",
                    menuCaption: "Task Transaction List"
                },
            ]
        },
        {
            parentObjectName: "Incident",
            flagName: "IsIncident",
            icon: "fa fa-tasks fa-fw",
            children: [
                {
                    formName: "IncidentAssignment.aspx",
                    htmlFormName: "EmployeeIncident.html",
                    menuCaption: "Incident Assignment"
                }
            ]
        },
        {
            parentObjectName: "Training",
            flagName: "IsTraining",
            icon: "fa fa-laptop fa-fw",
            children: [
                {
                    formName: "TrainingOpportunities.aspx",
                    htmlFormName: "TrainingList.html",
                    menuCaption: "Available Trainings"
                },
                {
                    formName: "TrainingApprove.aspx",
                    htmlFormName: "TrainingApproval.html",
                    menuCaption: "Training Approval"
                }
            ]
        },
        {
            parentObjectName: "Survey",
            flagName: "IsSurvey",
            icon: "fa fa-laptop fa-fw",
            children: [
                {
                    formName: "SurveyList.aspx?FType=Employee|View",
                    htmlFormName: "SurveyList.html",
                    menuCaption: "Available Survey(s)"
                }
            ]
        },
    ];

}

function renderHTML(arr, serverarr, modulearr) {
    var htmlString = '';
    //console.log({ arr, serverarr, modulearr });
    arr.forEach(function (parentItem) {
        var strMenus = '', IsModuleAvailable = false;

        var flagFilter = modulearr.filter(function (mod) {
            return (parentItem.flagName === mod.Module);
        });

        //console.log({ flagFilter });
        //  console.log(flagFilter);
        if (flagFilter.length > 0 && flagFilter[0].IsAvailable === 'True') {
            IsModuleAvailable = true;
        }

        if (parentItem.flagName == "none") { IsModuleAvailable = true; }

        //console.log({ flagFilter });

        //console.log({IsModuleAvailable});

        parentItem.children.forEach(function (childItem) {

            var hreflink = childItem.htmlFormName;

            // console.log('Pakistan' , parentItem.parentObjectName);

            hreflink = IsModuleAvailable === true ? hreflink : 'ModuleNotAvailable.html?modulename=' + parentItem.parentObjectName;
            //hreflink = IsModuleAvailable === true ? hreflink : 'paitan';
            //  console.log(hreflink);
            var arrRights = serverarr.filter(function (item) {
                //console.log('item.ObjectName : ', item.ObjectName, ' , childItem.formName : ', childItem.formName);
                return item.ObjectName === childItem.formName;
            });

            //console.log(arrRights);
            if (IsModuleAvailable === true) {

                if (childItem.IsDefault) {
                    hreflink = hreflink;
                } else {
                    hreflink = arrRights.length > 0 ? hreflink : 'RequestActivation.html';
                }
                //childItem.htmlFormName : hreflink


                // console.log(hreflink);
            }
            // console.log('before' , hreflink);
            strMenus += '<li><a href="' + hreflink + '"><i class="fa fa-circle-o"></i>' + childItem.menuCaption + '</a></li>';
            // console.log('After' , hreflink);
        });

        htmlString += '<li  class="treeview" id="mnu' + parentItem.parentObjectName + '"><a href="#"><i class="' + parentItem.icon + '"></i>' +
            '<span> ' + parentItem.parentObjectName + '</span><i class="fa fa-angle-left pull-right"></i></a>' +
            '<ul class="treeview-menu">' + strMenus + '</ul></li>'
    });
    //alert(defaultMenu);
    htmlString = defaultMenu + htmlString + '</ul>';
    $('section.sidebar').html(htmlString);
}

//GenerateMenuIfBackendNotUpdated();
function GenerateMenuIfBackendNotUpdated(defaultMenu_) {
    var arr = GetAllMenuArray();
    var mainmenu = '';

    var hreflink = 'serviceerror.html';
    var htmlString = '';


    $.each(arr, function (i, parentItem) {
        var strMenus = '';
        var childrens = parentItem.children;
        $.each(childrens, function (j, childItem) {
            var lnk = childItem.IsDefault === true ? childItem.htmlFormName : hreflink;
            strMenus += '<li><a href="' + lnk + '"><i class="fa fa-circle-o"></i>' + childItem.menuCaption + '</a></li>';
        });

        htmlString += '<li  class="treeview" id="mnu' + parentItem.parentObjectName + '"><a href="#"><i class="' + parentItem.icon + '"></i>' +
            '<span> ' + parentItem.parentObjectName + '</span><i class="fa fa-angle-left pull-right"></i></a>' +
            '<ul class="treeview-menu">' + strMenus + '</ul></li>'
    });

    mainmenu = defaultMenu_ + htmlString + '</ul>';
    $('section.sidebar').html(mainmenu);
}


function GenerateMenu() {
    var arr = GetAllMenuArray();
    var serverarr;
    var modulearr;
    serverarr = JSON.parse(localStorage.getItem('ServerMenu'));
    modulearr = JSON.parse(localStorage.getItem('Modules'));
    //console.log({ arr, serverarr, modulearr });
    if (serverarr !== null || modulearr !== null) {
        renderHTML(arr, serverarr, modulearr);
    } else {
        GenerateMenuIfBackendNotUpdated(defaultMenu);
    }
}

function stringToBoolean(string) {
    switch (string.toLowerCase().trim()) {
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(string);
    }
}



function data404() {
    return '<div class="text-center"><small>No Data to Display!</small></div>';
}

function getIcon(pIconName, pColor) {
    pColor = !pColor ? 'inherit' : pColor;
    return '<i class="fa fa-' + pIconName + '" style="color:' + pColor + '" ></i>&nbsp;';
}

function center(pText) {
    return '<center style="color:#777;">' + pText + '</center>';
}

function progress(optinalText) {
    if (!optinalText) { optinalText = ''; }
    return '<div class="text-center">' + optinalText + '<i class="fa fa-spinner fa-spin"></i></div>';
}

function progresscircle(optinalText) {
    if (!optinalText) { optinalText = ''; }
    return '<div class="text-center">' + optinalText + '<i class="fa fa-circle-o-notch fa-spin"></i></div>';
}

function getSum(obj, item) {
    var total = 0;
    $.each(obj, function (i, value) {
        total += value[item];
    });
    return total;
}

function getThemeColor() {
    var color = '#F5770B';
    var theme = getLocalStorageItem_String('theme');
    //console.log(theme);
    if (theme !== null && theme !== '') {
        theme = JSON.parse(theme);
        theme = theme[0].ThemeName;
        theme = theme == 'default' ? 'Default' : theme;
        var d = GetThemeArray();
        if (d.themes.indexOf(theme) > -1) {
            color = d.themesColor[d.themes.indexOf(theme)];
        }
    }

    return color;
}

function doModal(heading, formContent) {
    html = '<div id="dynamicModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
    html += '<div class="modal-dialog" style="width:90%;">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header" style="padding: 2px 15px 2px 15px;">';
    html += '<a class="close" data-dismiss="modal">×</a>';
    html += '<h4>' + heading + '</h4>'
    html += '</div>';
    html += '<div class="modal-body" style="overflow:auto;">';
    html += formContent;
    html += '</div>';
    //html += '<div class="modal-footer">';
    //html += '<span class="btn btn-primary" data-dismiss="modal">Close</span>';
    //html += '</div>';  // content
    html += '</div>';  // dialog
    html += '</div>';  // footer
    html += '</div>';  // modalWindow
    $('body').append(html);
    $("#dynamicModal .close").css('line-height', 2);
    $("#dynamicModal").modal();
    $("#dynamicModal").modal('show');


    $('#dynamicModal').on('hidden.bs.modal', function (e) {
        $(this).remove();
    });

}

function doModalIframe(heading, url) {
    html = '<div id="dynamicModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
    html += '<div class="modal-dialog" style="width:90%;">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header" style="padding: 2px 15px 2px 15px;">';
    html += '<a class="close" data-dismiss="modal">×</a>';
    html += '<h4>' + heading + '</h4>'
    html += '</div>';
    html += '<div class="modal-body" style="overflow:auto;">';
    html += '<iframe src="' + url + '"></iframe>';
    html += '</div>';
    //html += '<div class="modal-footer">';
    //html += '<span class="btn btn-primary" data-dismiss="modal">Close</span>';
    //html += '</div>';  // content
    html += '</div>';  // dialog
    html += '</div>';  // footer
    html += '</div>';  // modalWindow
    $('body').append(html);
    $("#dynamicModal .close").css('line-height', 2);
    $("#dynamicModal").modal();
    $("#dynamicModal").modal('show');


    $('#dynamicModal').on('hidden.bs.modal', function (e) {
        $(this).remove();
    });

}



///

$(document).ajaxStart(function () {
    $("#wait").css("display", "block");
});

$(document).ajaxComplete(function () {
    $("#wait").css("display", "none");
});



// Added By Jameel on 24-JAN-2018 -  End ---------------


// function getParameterByName(name) {
//     name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
//     var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
//         results = regex.exec(location.search);
//     return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
// }

var DTHelper = {};

DTHelper.GetFormattedDate = function (date, format) {

    var dd, mm, yyyy, result = date;
    dd = date.getDate();
    mm = date.getMonth() + 1;   //January is 0
    yyyy = date.getFullYear();

    dd = dd < 10 ? '0' + dd.toString() : dd.toString();
    mm = mm < 10 ? '0' + mm.toString() : mm.toString();

    if (format.toLowerCase() == 'dd/mm/yyyy') {
        result = dd + '/' + mm + '/' + yyyy;
    }
    else if (format.toLowerCase() == 'mm/dd/yyyy') {
        result = mm + '/' + dd + '/' + yyyy;
    }

    return result;
}

DTHelper.GetNativeDate = function (date, format) {

    var dd, mm, yyyy, result = new Date();
    var datearr = date.split('/');
    var date, month, year;


    if (format.toLowerCase() == 'yyyy/mm/dd') {
        year = datearr[0];
        month = datearr[1];
        date = datearr[2];
        result = new Date(year + '/' + month + '/' + date);
    }

    else if (format.toLowerCase() == 'dd/mm/yyyy') {
        date = datearr[0];
        month = datearr[1];
        year = datearr[2];
        result = new Date(year + '/' + month + '/' + date);
    }
    else if (format.toLowerCase() == 'mm/dd/yyyy') {
        month = datearr[0];
        date = datearr[1];
        year = datearr[2];
        result = new Date(year + '/' + month + '/' + date);
    }


    return result;
}

DTHelper.GetFormattedTime = function (date, format) {
    var hours, mins, secs, result = date;
    hours = date.getHours();
    mins = date.getMinutes();
    secs = date.getSeconds();

    hours = hours < 10 ? "0" + hours.toString() : hours.toString();
    mins = mins < 10 ? "0" + mins.toString() : mins.toString();
    secs = secs < 10 ? "0" + secs.toString() : secs.toString();

    if (format.toLowerCase() === "hh:mm:ss") {
        result = hours + ":" + mins + ":" + secs;
    }
    else if (format.toLowerCase() === "hh:mm") {
        result = hours + ":" + mins;
    }

    return result;
}

function getDateByASPNETTimeStamp(pASPNETDate) {
    return new Date(parseInt(/\d+/.exec(pASPNETDate)[0]));
}

function getMonthName(date) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[date.getMonth()];
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

// PolyFills - Start
// Source : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function (func, thisArg) {
        'use strict';
        if (!((typeof func === 'Function' || typeof func === 'function') && this))
            throw new TypeError();

        var len = this.length >>> 0,
            res = new Array(len), // preallocate array
            t = this, c = 0, i = -1;
        if (thisArg === undefined) {
            while (++i !== len) {
                // checks to see if the key was set
                if (i in this) {
                    if (func(t[i], i, t)) {
                        res[c++] = t[i];
                    }
                }
            }
        }
        else {
            while (++i !== len) {
                // checks to see if the key was set
                if (i in this) {
                    if (func.call(thisArg, t[i], i, t)) {
                        res[c++] = t[i];
                    }
                }
            }
        }

        res.length = c; // shrink down array to proper size
        return res;
    };
}

function getHighlighted(pData, q) {
    if (q) {
        var highlighted = pData.toLowerCase().indexOf(q.toLowerCase()) > -1 ? '<span style="background:yellow;">' + pData.substring(pData.toLowerCase().indexOf(q.toLowerCase()), pData.toLowerCase().indexOf(q.toLowerCase()) + q.length) + '</span>' : pData;
        var otxt = pData;
        var regex = new RegExp(q, 'gi')
        return otxt.replace(regex, highlighted);
    } else {
        return pData;
    }

}

// FOr Each
//source : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function (callback/*, thisArg*/) {

        var T, k;

        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        // 1. Let O be the result of calling toObject() passing the
        // |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get() internal
        // method of O with the argument "length".
        // 3. Let len be toUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If isCallable(callback) is false, throw a TypeError exception. 
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let
        // T be undefined.
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // 6. Let k be 0.
        k = 0;

        // 7. Repeat while k < len.
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //    This is implicit for LHS operands of the in operator.
            // b. Let kPresent be the result of calling the HasProperty
            //    internal method of O with argument Pk.
            //    This step can be combined with c.
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal
                // method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as
                // the this value and argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined.
    };
}


// PolyFills - End

/*! AdminLTE app.js
* ================
* Main JS application file for AdminLTE v2. This file
* should be included in all pages. It controls some layout
* options and implements exclusive AdminLTE plugins.
*
* @Author  Almsaeed Studio
* @Support <http://www.almsaeedstudio.com>
* @Email   <support@almsaeedstudio.com>
* @version 2.3.0
* @license MIT <http://opensource.org/licenses/MIT>
*/

//Make sure jQuery has been loaded before app.js
if (typeof jQuery === "undefined") {
    throw new Error("AdminLTE requires jQuery");
}

/* AdminLTE
*
* @type Object
* @description $.AdminLTE is the main object for the template's app.
*              It's used for implementing functions and options related
*              to the template. Keeping everything wrapped in an object
*              prevents conflict with other plugins and is a better
*              way to organize our code.
*/
$.AdminLTE = {};

/* --------------------
* - AdminLTE Options -
* --------------------
* Modify these options to suit your implementation
*/
$.AdminLTE.options = {
    //Add slimscroll to navbar menus
    //This requires you to load the slimscroll plugin
    //in every page before app.js
    navbarMenuSlimscroll: true,
    navbarMenuSlimscrollWidth: "3px", //The width of the scroll bar
    navbarMenuHeight: "200px", //The height of the inner menu
    //General animation speed for JS animated elements such as box collapse/expand and
    //sidebar treeview slide up/down. This options accepts an integer as milliseconds,
    //'fast', 'normal', or 'slow'
    animationSpeed: 500,
    //Sidebar push menu toggle button selector
    sidebarToggleSelector: "[data-toggle='offcanvas']",
    //Activate sidebar push menu
    sidebarPushMenu: true,
    //Activate sidebar slimscroll if the fixed layout is set (requires SlimScroll Plugin)
    sidebarSlimScroll: true,
    //Enable sidebar expand on hover effect for sidebar mini
    //This option is forced to true if both the fixed layout and sidebar mini
    //are used together
    sidebarExpandOnHover: false,
    //BoxRefresh Plugin
    enableBoxRefresh: true,
    //Bootstrap.js tooltip
    enableBSToppltip: true,
    BSTooltipSelector: "[data-toggle='tooltip']",
    //Enable Fast Click. Fastclick.js creates a more
    //native touch experience with touch devices. If you
    //choose to enable the plugin, make sure you load the script
    //before AdminLTE's app.js
    enableFastclick: true,
    //Control Sidebar Options
    enableControlSidebar: true,
    controlSidebarOptions: {
        //Which button should trigger the open/close event
        toggleBtnSelector: "[data-toggle='control-sidebar']",
        //The sidebar selector
        selector: ".control-sidebar",
        //Enable slide over content
        slide: true
    },
    //Box Widget Plugin. Enable this plugin
    //to allow boxes to be collapsed and/or removed
    enableBoxWidget: true,
    //Box Widget plugin options
    boxWidgetOptions: {
        boxWidgetIcons: {
            //Collapse icon
            collapse: 'fa-minus',
            //Open icon
            open: 'fa-plus',
            //Remove icon
            remove: 'fa-times'
        },
        boxWidgetSelectors: {
            //Remove button selector
            remove: '[data-widget="remove"]',
            //Collapse button selector
            collapse: '[data-widget="collapse"]'
        }
    },
    //Direct Chat plugin options
    directChat: {
        //Enable direct chat by default
        enable: true,
        //The button to open and close the chat contacts pane
        contactToggleSelector: '[data-widget="chat-pane-toggle"]'
    },
    //Define the set of colors to use globally around the website
    colors: {
        lightBlue: "#3c8dbc",
        red: "#f56954",
        green: "#00a65a",
        aqua: "#00c0ef",
        yellow: "#f39c12",
        blue: "#0073b7",
        navy: "#001F3F",
        teal: "#39CCCC",
        olive: "#3D9970",
        lime: "#01FF70",
        orange: "#FF851B",
        fuchsia: "#F012BE",
        purple: "#8E24AA",
        maroon: "#D81B60",
        black: "#222222",
        gray: "#d2d6de"
    },
    //The standard screen sizes that bootstrap uses.
    //If you change these in the variables.less file, change
    //them here too.
    screenSizes: {
        xs: 480,
        sm: 768,
        md: 992,
        lg: 1200
    }
};

/* ------------------
* - Implementation -
* ------------------
* The next block of code implements AdminLTE's
* functions and plugins as specified by the
* options above.
*/
$(function () {
    "use strict";

    //Fix for IE page transitions
    $("body").removeClass("hold-transition");

    //Extend options if external options exist
    if (typeof AdminLTEOptions !== "undefined") {
        $.extend(true,
            $.AdminLTE.options,
            AdminLTEOptions);
    }

    //Easy access to options
    var o = $.AdminLTE.options;

    //Set up the object
    _init();

    //Activate the layout maker
    $.AdminLTE.layout.activate();

    //Enable sidebar tree view controls
    $.AdminLTE.tree('.sidebar');

    //Enable control sidebar
    if (o.enableControlSidebar) {
        $.AdminLTE.controlSidebar.activate();
    }

    //Add slimscroll to navbar dropdown
    if (o.navbarMenuSlimscroll && typeof $.fn.slimscroll != 'undefined') {
        $(".navbar .menu").slimscroll({
            height: o.navbarMenuHeight,
            alwaysVisible: false,
            size: o.navbarMenuSlimscrollWidth
        }).css("width", "100%");
    }

    //Activate sidebar push menu
    if (o.sidebarPushMenu) {
        $.AdminLTE.pushMenu.activate(o.sidebarToggleSelector);
    }

    //Activate Bootstrap tooltip
    if (o.enableBSToppltip) {
        $('body').tooltip({
            selector: o.BSTooltipSelector
        });
    }

    //Activate box widget
    if (o.enableBoxWidget) {
        $.AdminLTE.boxWidget.activate();
    }

    //Activate fast click
    if (o.enableFastclick && typeof FastClick != 'undefined') {
        FastClick.attach(document.body);
    }

    //Activate direct chat widget
    if (o.directChat.enable) {
        $(document).on('click', o.directChat.contactToggleSelector, function () {
            var box = $(this).parents('.direct-chat').first();
            box.toggleClass('direct-chat-contacts-open');
        });
    }

    /*
    * INITIALIZE BUTTON TOGGLE
    * ------------------------
    */
    $('.btn-group[data-toggle="btn-toggle"]').each(function () {
        var group = $(this);
        $(this).find(".btn").on('click', function (e) {
            group.find(".btn.active").removeClass("active");
            $(this).addClass("active");
            e.preventDefault();
        });

    });
});

/* ----------------------------------
* - Initialize the AdminLTE Object -
* ----------------------------------
* All AdminLTE functions are implemented below.
*/
function _init() {
    'use strict';
    /* Layout
    * ======
    * Fixes the layout height in case min-height fails.
    *
    * @type Object
    * @usage $.AdminLTE.layout.activate()
    *        $.AdminLTE.layout.fix()
    *        $.AdminLTE.layout.fixSidebar()
    */
    $.AdminLTE.layout = {
        activate: function () {
            var _this = this;
            _this.fix();
            _this.fixSidebar();
            $(window, ".wrapper").resize(function () {
                _this.fix();
                _this.fixSidebar();
            });
        },
        fix: function () {
            //Get window height and the wrapper height
            var neg = $('.main-header').outerHeight() + $('.main-footer').outerHeight();
            var window_height = $(window).height();
            var sidebar_height = $(".sidebar").height();
            //Set the min-height of the content and sidebar based on the
            //the height of the document.
            if ($("body").hasClass("fixed")) {
                $(".content-wrapper, .right-side").css('min-height', window_height - $('.main-footer').outerHeight());
            } else {
                var postSetWidth;
                if (window_height >= sidebar_height) {
                    $(".content-wrapper, .right-side").css('min-height', window_height - neg);
                    postSetWidth = window_height - neg;
                } else {
                    $(".content-wrapper, .right-side").css('min-height', sidebar_height);
                    postSetWidth = sidebar_height;
                }

                //Fix for the control sidebar height
                var controlSidebar = $($.AdminLTE.options.controlSidebarOptions.selector);
                if (typeof controlSidebar !== "undefined") {
                    if (controlSidebar.height() > postSetWidth)
                        $(".content-wrapper, .right-side").css('min-height', controlSidebar.height());
                }

            }
        },
        fixSidebar: function () {
            //Make sure the body tag has the .fixed class
            if (!$("body").hasClass("fixed")) {
                if (typeof $.fn.slimScroll != 'undefined') {
                    $(".sidebar").slimScroll({ destroy: true }).height("auto");
                }
                return;
            } else if (typeof $.fn.slimScroll == 'undefined' && window.console) {
                window.console.error("Error: the fixed layout requires the slimscroll plugin!");
            }
            //Enable slimscroll for fixed layout
            if ($.AdminLTE.options.sidebarSlimScroll) {
                if (typeof $.fn.slimScroll != 'undefined') {
                    //Destroy if it exists
                    $(".sidebar").slimScroll({ destroy: true }).height("auto");
                    //Add slimscroll
                    $(".sidebar").slimscroll({
                        height: ($(window).height() - $(".main-header").height()) + "px",
                        color: "rgba(0,0,0,0.2)",
                        size: "3px"
                    });
                }
            }
        }
    };

    /* PushMenu()
    * ==========
    * Adds the push menu functionality to the sidebar.
    *
    * @type Function
    * @usage: $.AdminLTE.pushMenu("[data-toggle='offcanvas']")
    */
    $.AdminLTE.pushMenu = {
        activate: function (toggleBtn) {
            //Get the screen sizes
            var screenSizes = $.AdminLTE.options.screenSizes;

            //Enable sidebar toggle
            $(toggleBtn).on('click', function (e) {
                e.preventDefault();

                //Enable sidebar push menu
                if ($(window).width() > (screenSizes.sm - 1)) {
                    if ($("body").hasClass('sidebar-collapse')) {
                        $("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
                    } else {
                        $("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
                    }
                }
                //Handle sidebar push menu for small screens
                else {
                    if ($("body").hasClass('sidebar-open')) {
                        $("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
                    } else {
                        $("body").addClass('sidebar-open').trigger('expanded.pushMenu');
                    }
                }
            });

            $(".content-wrapper").click(function () {
                //Enable hide menu when clicking on the content-wrapper on small screens
                if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
                    $("body").removeClass('sidebar-open');
                }
            });

            //Enable expand on hover for sidebar mini
            if ($.AdminLTE.options.sidebarExpandOnHover
                || ($('body').hasClass('fixed')
                    && $('body').hasClass('sidebar-mini'))) {
                this.expandOnHover();
            }
        },
        expandOnHover: function () {
            var _this = this;
            var screenWidth = $.AdminLTE.options.screenSizes.sm - 1;
            //Expand sidebar on hover
            $('.main-sidebar').hover(function () {
                if ($('body').hasClass('sidebar-mini')
                    && $("body").hasClass('sidebar-collapse')
                    && $(window).width() > screenWidth) {
                    _this.expand();
                }
            }, function () {
                if ($('body').hasClass('sidebar-mini')
                    && $('body').hasClass('sidebar-expanded-on-hover')
                    && $(window).width() > screenWidth) {
                    _this.collapse();
                }
            });
        },
        expand: function () {
            $("body").removeClass('sidebar-collapse').addClass('sidebar-expanded-on-hover');
        },
        collapse: function () {
            if ($('body').hasClass('sidebar-expanded-on-hover')) {
                $('body').removeClass('sidebar-expanded-on-hover').addClass('sidebar-collapse');
            }
        }
    };

    /* Tree()
    * ======
    * Converts the sidebar into a multilevel
    * tree view menu.
    *
    * @type Function
    * @Usage: $.AdminLTE.tree('.sidebar')
    */
    $.AdminLTE.tree = function (menu) {
        var _this = this;
        var animationSpeed = $.AdminLTE.options.animationSpeed;
        $(document).on('click', menu + ' li a', function (e) {
            //Get the clicked link and the next element
            var $this = $(this);
            var checkElement = $this.next();

            //Check if the next element is a menu and is visible
            if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
                //Close the menu
                checkElement.slideUp(animationSpeed, function () {
                    checkElement.removeClass('menu-open');
                    //Fix the layout in case the sidebar stretches over the height of the window
                    //_this.layout.fix();
                });
                checkElement.parent("li").removeClass("active");
            }
            //If the menu is not visible
            else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
                //Get the parent menu
                var parent = $this.parents('ul').first();
                //Close all open menus within the parent
                var ul = parent.find('ul:visible').slideUp(animationSpeed);
                //Remove the menu-open class from the parent
                ul.removeClass('menu-open');
                //Get the parent li
                var parent_li = $this.parent("li");

                //Open the target menu and add the menu-open class
                checkElement.slideDown(animationSpeed, function () {
                    //Add the class active to the parent li
                    checkElement.addClass('menu-open');
                    parent.find('li.active').removeClass('active');
                    parent_li.addClass('active');
                    //Fix the layout in case the sidebar stretches over the height of the window
                    _this.layout.fix();
                });
            }
            //if this isn't a link, prevent the page from being redirected
            if (checkElement.is('.treeview-menu')) {
                e.preventDefault();
            }
        });
    };

    /* ControlSidebar
    * ==============
    * Adds functionality to the right sidebar
    *
    * @type Object
    * @usage $.AdminLTE.controlSidebar.activate(options)
    */
    $.AdminLTE.controlSidebar = {
        //instantiate the object
        activate: function () {
            //Get the object
            var _this = this;
            //Update options
            var o = $.AdminLTE.options.controlSidebarOptions;
            //Get the sidebar
            var sidebar = $(o.selector);
            //The toggle button
            var btn = $(o.toggleBtnSelector);

            //Listen to the click event
            btn.on('click', function (e) {
                e.preventDefault();
                //If the sidebar is not open
                if (!sidebar.hasClass('control-sidebar-open')
                    && !$('body').hasClass('control-sidebar-open')) {
                    //Open the sidebar
                    _this.open(sidebar, o.slide);
                } else {
                    _this.close(sidebar, o.slide);
                }
            });

            //If the body has a boxed layout, fix the sidebar bg position
            var bg = $(".control-sidebar-bg");
            _this._fix(bg);

            //If the body has a fixed layout, make the control sidebar fixed
            if ($('body').hasClass('fixed')) {
                _this._fixForFixed(sidebar);
            } else {
                //If the content height is less than the sidebar's height, force max height
                if ($('.content-wrapper, .right-side').height() < sidebar.height()) {
                    _this._fixForContent(sidebar);
                }
            }
        },
        //Open the control sidebar
        open: function (sidebar, slide) {
            //Slide over content
            if (slide) {
                sidebar.addClass('control-sidebar-open');
            } else {
                //Push the content by adding the open class to the body instead
                //of the sidebar itself
                $('body').addClass('control-sidebar-open');
            }
        },
        //Close the control sidebar
        close: function (sidebar, slide) {
            if (slide) {
                sidebar.removeClass('control-sidebar-open');
            } else {
                $('body').removeClass('control-sidebar-open');
            }
        },
        _fix: function (sidebar) {
            var _this = this;
            if ($("body").hasClass('layout-boxed')) {
                sidebar.css('position', 'absolute');
                sidebar.height($(".wrapper").height());
                $(window).resize(function () {
                    _this._fix(sidebar);
                });
            } else {
                sidebar.css({
                    'position': 'fixed',
                    'height': 'auto'
                });
            }
        },
        _fixForFixed: function (sidebar) {
            sidebar.css({
                'position': 'fixed',
                'max-height': '100%',
                'overflow': 'auto',
                'padding-bottom': '50px'
            });
        },
        _fixForContent: function (sidebar) {
            $(".content-wrapper, .right-side").css('min-height', sidebar.height());
        }
    };

    /* BoxWidget
    * =========
    * BoxWidget is a plugin to handle collapsing and
    * removing boxes from the screen.
    *
    * @type Object
    * @usage $.AdminLTE.boxWidget.activate()
    *        Set all your options in the main $.AdminLTE.options object
    */
    $.AdminLTE.boxWidget = {
        selectors: $.AdminLTE.options.boxWidgetOptions.boxWidgetSelectors,
        icons: $.AdminLTE.options.boxWidgetOptions.boxWidgetIcons,
        animationSpeed: $.AdminLTE.options.animationSpeed,
        activate: function (_box) {
            var _this = this;
            if (!_box) {
                _box = document; // activate all boxes per default
            }
            //Listen for collapse event triggers
            $(_box).on('click', _this.selectors.collapse, function (e) {
                e.preventDefault();
                _this.collapse($(this));
            });

            //Listen for remove event triggers
            $(_box).on('click', _this.selectors.remove, function (e) {
                e.preventDefault();
                _this.remove($(this));
            });
        },
        collapse: function (element) {
            var _this = this;
            //Find the box parent
            var box = element.parents(".box").first();
            //Find the body and the footer
            var box_content = box.find("> .box-body, > .box-footer, > form  >.box-body, > form > .box-footer");
            if (!box.hasClass("collapsed-box")) {
                //Convert minus into plus
                element.children(":first")
                    .removeClass(_this.icons.collapse)
                    .addClass(_this.icons.open);
                //Hide the content
                box_content.slideUp(_this.animationSpeed, function () {
                    box.addClass("collapsed-box");
                });
            } else {
                //Convert plus into minus
                element.children(":first")
                    .removeClass(_this.icons.open)
                    .addClass(_this.icons.collapse);
                //Show the content
                box_content.slideDown(_this.animationSpeed, function () {
                    box.removeClass("collapsed-box");
                });
            }
        },
        remove: function (element) {
            //Find the box parent
            var box = element.parents(".box").first();
            box.slideUp(this.animationSpeed);
        }
    };
}

/* ------------------
* - Custom Plugins -
* ------------------
* All custom plugins are defined below.
*/

/*
* BOX REFRESH BUTTON
* ------------------
* This is a custom plugin to use with the component BOX. It allows you to add
* a refresh button to the box. It converts the box's state to a loading state.
*
* @type plugin
* @usage $("#box-widget").boxRefresh( options );
*/
(function ($) {

    "use strict";

    $.fn.boxRefresh = function (options) {

        // Render options
        var settings = $.extend({
            //Refresh button selector
            trigger: ".refresh-btn",
            //File source to be loaded (e.g: ajax/src.php)
            source: "",
            //Callbacks
            onLoadStart: function (box) {
                return box;
            }, //Right after the button has been clicked
            onLoadDone: function (box) {
                return box;
            } //When the source has been loaded

        }, options);

        //The overlay
        var overlay = $('<div class="overlay"><div class="fa fa-refresh fa-spin"></div></div>');

        return this.each(function () {
            //if a source is specified
            if (settings.source === "") {
                if (window.console) {
                    window.console.log("Please specify a source first - boxRefresh()");
                }
                return;
            }
            //the box
            var box = $(this);
            //the button
            var rBtn = box.find(settings.trigger).first();

            //On trigger click
            rBtn.on('click', function (e) {
                e.preventDefault();
                //Add loading overlay
                start(box);

                //Perform ajax call
                box.find(".box-body").load(settings.source, function () {
                    done(box);
                });
            });
        });

        function start(box) {
            //Add overlay and loading img
            box.append(overlay);

            settings.onLoadStart.call(box);
        }

        function done(box) {
            //Remove overlay and loading img
            box.find(overlay).remove();

            settings.onLoadDone.call(box);
        }

    };

})(jQuery);

/*
* EXPLICIT BOX ACTIVATION
* -----------------------
* This is a custom plugin to use with the component BOX. It allows you to activate
* a box inserted in the DOM after the app.js was loaded.
*
* @type plugin
* @usage $("#box-widget").activateBox();
*/
(function ($) {

    'use strict';

    $.fn.activateBox = function () {
        $.AdminLTE.boxWidget.activate(this);
    };

})(jQuery);

/*
* TODO LIST CUSTOM PLUGIN
* -----------------------
* This plugin depends on iCheck plugin for checkbox and radio inputs
*
* @type plugin
* @usage $("#todo-widget").todolist( options );
*/
(function ($) {

    'use strict';

    $.fn.todolist = function (options) {
        // Render options
        var settings = $.extend({
            //When the user checks the input
            onCheck: function (ele) {
                return ele;
            },
            //When the user unchecks the input
            onUncheck: function (ele) {
                return ele;
            }
        }, options);

        return this.each(function () {

            if (typeof $.fn.iCheck != 'undefined') {
                $('input', this).on('ifChecked', function () {
                    var ele = $(this).parents("li").first();
                    ele.toggleClass("done");
                    settings.onCheck.call(ele);
                });

                $('input', this).on('ifUnchecked', function () {
                    var ele = $(this).parents("li").first();
                    ele.toggleClass("done");
                    settings.onUncheck.call(ele);
                });
            } else {
                $('input', this).on('change', function () {
                    var ele = $(this).parents("li").first();
                    ele.toggleClass("done");
                    if ($('input', ele).is(":checked")) {
                        settings.onCheck.call(ele);
                    } else {
                        settings.onUncheck.call(ele);
                    }
                });
            }
        });
    };
}(jQuery));
