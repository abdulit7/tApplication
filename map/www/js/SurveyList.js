'use strict';


var eid, uid, ecode, secKey, cid, lid, ename;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');

var _populateList = getParameterByName('populateList');
var _showMsg = getParameterByName('showMsg');


jQuery(function ($) { //just like $(document).ready()
    var scheduleDate, dateformat;

    init();
    if (_showMsg === 'true') {
        toastr.success('Survey Submitted Succesfully!');
    }
});

function init() {
    populateSurveyList();
}

function populateSurveyList() {
    try {
        postRequest('GetSurveyList', {}, populateSurveyList_Callback);
    } catch (error) {
        toastr.error('Something is wrong! ');
    }
}




function populateSurveyList_Callback(res) {
    var json = JSON.parse(res.d);

    var template = '';
    //var surveyTitle = $('#surveyTitle');
    var fromDate;
    var toDate;
    var SurveyList = $('#SurveyList');
    var d = json;
    //console.log(d);
    if (!isEmptyObj(d)) {
        $.each(d, function (i) {

            fromDate = getFormattedDateNew(d[i].FromDate, false);
            toDate = getFormattedDateNew(d[i].ToDate, false);

            template +=
                '<div class="panel panelshadow">' +
                '<div class="panel-body">' +
                '<span id="surveyTitle" class="surveytitle"> <small><i class="fa fa-list-alt"></i></small> ' + d[i].SurveyInfo + ' </span>                                ' +
                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-4"><span class="surveylbl">From Date</span></div>' +
                '<div class="col-xs-8"><span id="fromDate" class="surveytxt">' + fromDate + '</span></div>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-4"><span class="surveylbl">To Date</span></div>' +
                '<div class="col-xs-8"><span id="toDate" class="surveytxt">' + toDate + '</span></div>' +
                '</div>' +
                '</div>' +
                '<a href="SurveyEntry.html?SurveyID=' + d[i].SurveyID + '" class="btn btn-primary btn-block suverybtn">Submit</a>                              ' +
                '</div>' +
                '</div>'
                ;

        });
        SurveyList.html(template);
    } else {
        SurveyList.html('<small style="font-size:11px;"> &nbsp;&nbsp;No Survey Found!</small>');
    }




}

