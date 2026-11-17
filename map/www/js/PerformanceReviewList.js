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
var _isProbation = getParameterByName('IsProbation');
var _isAcceptance = getParameterByName('isacceptance');


jQuery(function ($) { //just like $(document).ready()
    var scheduleDate, dateformat;

    init();
    if (_showMsg === 'true') {
        var msg = _isProbation === 0 || isNull(_isProbation) ? 'Performance Review Submitted Succesfully!' : 'Probation Review Submitted Succesfully!';
        if (_isAcceptance != null) {
            msg = _isProbation === 0 || isNull(_isProbation) ? 'Performance Review ' + _isAcceptance + ' Succesfully!' : 'Probation Review ' + _isAcceptance + ' Succesfully!'
        }
        toastr.success(msg);
    }
});

function init() {
    populateAppraisalList(_isProbation);
    $('#listTitle').html(_isProbation === 0 || isNull(_isProbation) ? 'Performance Review' : 'Probation Review');
}



function populateAppraisalList(isProbation) {
    try {
        isProbation = isProbation = 0 || isNull(isProbation) ? false : true;
        postRequest('GetPerformanceReviewPendingList', { IsProbationReview: isProbation }, populateAppraisalList_Callback);
    } catch (error) {
        toastr.error('Something is wrong!' + error);
    }
}

$('#btnRefresh').click(function (e) {
    populateAppraisalList(_isProbation);
});



function populateAppraisalList_Callback(res) {
    var json = JSON.parse(res.d);
    var template = '';
    //var surveyTitle = $('#surveyTitle');
    var fromDate;
    var toDate;
    var isProbation;
    var EployeeInfoQS = '';
    var AppraisalList = $('#AppraisalList');
    var d = json;
    //console.log(d);

    if (!isEmptyObj(d)) {
        if (d.result == 'fail') {
            AppraisalList.html('<small style="font-size:14px;color:#ccc;"> Something went wrong! Contact your administrator.</small>');
            return;
        }
        jQuery.each(d, function (i, item) {

            fromDate = getFormattedDateNew(item.FromDate, false);
            toDate = getFormattedDateNew(item.ToDate, false);

            isProbation = item.IsProbation === true ? '&IsProbation=1' : ''
            EployeeInfoQS = '&empid=' + item.EmployeeRefNo + '&empname=' + item.EmployeeName + '&isacceptance=' + item.IsAcceptance + '&refno=' + item.TranRefNo;


            var btnTitle = _isProbation === 0 || isNull(_isProbation) ? 'Performance Review' : 'Probation Review';
            btnTitle += item.IsAcceptance == true ? ' Acceptance' : ' Entry';


            template +=
                '<div class="panel panelshadow">' +
                '<div class="panel-body">' +
                '<span id="surveyTitle" class="surveytitle"> <small><i class="fa fa-list-alt"></i></small> ' + item.EmployeeName + ' </span>                                ' +
                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-4"><span class="surveylbl">Department</span></div>' +
                '<div class="col-xs-8"><span id="fromDate" class="surveytxt">' + item.DepartmentTitle + '</span></div>' +
                '</div>                                                                ' +
                '</div>' +
                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-4"><span class="surveylbl">Designation</span></div>' +
                '<div class="col-xs-8"><span id="fromDate" class="surveytxt">' + item.DesignationTitle + '</span></div>' +
                '</div>                                                                ' +
                '</div>' +
                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-4"><span class="surveylbl">Review Type</span></div>' +
                '<div class="col-xs-8"><span id="fromDate" class="surveytxt">' + item.ReviewTypeTitle + '</span></div>' +
                '</div>                                                                ' +
                '</div>' +
                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-4"><span class="surveylbl">From Date</span></div>' +
                '<div class="col-xs-8"><span id="fromDate" class="surveytxt">' + fromDate + '</span></div>' +
                '</div>                                                                ' +
                '</div>' +
                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-4"><span class="surveylbl">To Date</span></div>' +
                '<div class="col-xs-8"><span id="toDate" class="surveytxt">' + toDate + '</span></div>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="col-xs-4"><span class="surveylbl">Task</span></div>' +
                '<div class="col-xs-8"><span id="toDate" class="surveytxt">' + item.TaskTitle + '</span></div>' +
                '</div>' +
                '</div>                               ' +
                '<a href="PerformanceReviewEntry.html?TranID=' + item.TranID + '&ReviewType=' + item.ReviewTypeTitle + '' + isProbation + EployeeInfoQS + '" class="btn btn-primary btn-block suverybtn">' + btnTitle + '</a>' +
                '</div>' +
                '</div>'
                ;


        });

        AppraisalList.html(template);
    } else {
        AppraisalList.html('<small style="font-size:14px;color:#ccc;"> &nbsp;&nbsp;No Review(s) Found!</small>');
    }




}

