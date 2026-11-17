'use strict';

var varType;
var varUrl;
var varData;
var varContentType;
var varDataType;
var varProcessData;

var eid, uid, ecode, secKey, cid, lid, ename;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');

jQuery(function ($) { //just like $(document).ready()   
    init();
});

function init() {
    //$('#ddlLeaveYear').val('2019');
    fillLeaveYear();
    //populateList();

}

function fillLeaveYear() {

    postRequest('GetLeaveYearJson', {}, function (r) {
        r = JSON.parse(r.d);
        var ddlLeaveYear = document.getElementById("ddlLeaveYear");
        _fillDropDown(r, ddlLeaveYear, 'LeaveYear', 'LeaveYear', false);
        try {
            ddlLeaveYear.value = r.filter(function (item) { return item.IsCurrentLeaveYear == true; })[0].LeaveYear;
        } catch (error) { }
    });

}

$("#btnShow").click(function (e) {
    populateList();
});


function populateList() {
    try {
        var ld = $('#ddlLeaveYear').val();
        var data_ = { pEmployeeID1: 0, pLeaveYear: parseInt(ld) }
        var balanceList = $('#balanceList');
        postRequest('GetLeaveBalancebyLeaveYearAll', data_, function (response_) {
            var resdata = JSON.parse(response_.d);
            if (resdata.result) {
                if (resdata.result == 'Error') {
                    balanceList.html('<div class="text-center"><small>Error in getting leave balance!</small></div>');
                    return;
                }
            }

            //console.log(resdata);    
            if (!isEmptyObj(resdata)) {
                var template = '';
                var hiddenDiv = '';
                var chevron = 'fa-chevron-down';
                $.each(resdata, function (i, item) {

                    var template2 = '';
                    var template3 = '';
                    var leaveKeys = Object.keys(item);
                    var leaveValues = Object.values(item);


                    var boldLabel = '';



                    $.each(leaveKeys, function (j, item_) {

                        if (item_ === 'Leave Type' || item_ === 'LeaveID' || item_ === 'LeaveRefNo' || item_ === 'LeaveTitle' || item_ === 'Advance') { return; }
                        {

                            boldLabel = leaveKeys[j].toLowerCase().indexOf('balance') > -1 ? 'boldLabel' : '';
                            template3 += '<div class="col-xs-3"><span class="surveylbl ' + boldLabel + '">' + leaveKeys[j] + '</span></div>' +
                                '<div class="col-xs-3" style="text-align:right;"><span id="fromDate" class="surveytxt">' + leaveValues[j] + '</span></div>';

                        }
                    });

                    template2 = '<div class="row">' +
                        '<div class="surveyinfo">' +
                        template3 +
                        '</div>' +
                        '</div>';

                    template +=

                        '<div class="panel panelshadow">' +
                        '<div class="panel-body">' +
                        '<span id="surveyTitle" class="surveytitle EmployeeTitle"> <small><i class="fa fa-caret-right"></i></small> ' + item.LeaveTitle + '<small style="font-weight:normal;color:#999;"> ( ' + item.Balance + ' remaining ) </small> <div onClick="toggleDesc(' + item.LeaveID + ');" class="pull-right toggleDesc"><i id="icon' + item.LeaveID + '" class="fa ' + chevron + '" aria-hidden="true"></i></div></span>' +
                        '<div ' + hiddenDiv + ' id="p' + item.LeaveID + '" >' + template2 + '</div>' +
                        '</div>' +
                        '</div>'
                        ;
                    hiddenDiv = 'style="display:none;"';
                    chevron = 'fa-chevron-up'
                });

                balanceList.html(template);
            } else {
                balanceList.html('<div class="text-center"><small>No Data Found!</small></div>');
            }
        });
    } catch (error) {
        toastr.error('Something is wrong! ');
    }


}


function toggleDesc(id) {
    $('#p' + id).slideToggle();
    $('#icon' + id).toggleClass('fa-chevron-up fa-chevron-down');
}

