'use strict';

var eid, uid, ecode, secKey, cid, lid, ename;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');

var txtEmpNo = $('#txtEmpNo');
var txtName = $('#txtName');
var txtDesignation = $('#txtDesignation');
var txtBranch = $('#txtBranch');
var txtDepartment = $('#txtDepartment');
var txtManagementLevel = $('#txtManagementLevel');
var txtGroup = $('#txtGroup');
var txtEmployeeCategory = $('#txtEmployeeCategory');
var txtSubDepartment = $('#txtSubDepartment');
var txtDivision = $('#txtDivision');
var txtFunction = $('#txtFunction');
var txtEmployeeGrade = $('#txtEmployeeGrade');
var txtAppointmentDate = $('#txtAppointmentDate');
var txtServicePeriod = $('#txtServicePeriod');
var txtConfirmationDate = $('#txtConfirmationDate');
var txtResignationDate = $('#txtResignationDate');
var txtStatus = $('#txtStatus');
var txtLeavingDate = $('#txtLeavingDate');
var txtRemainingService = $('#txtRemainingService');
var txtApprover = $('#txtApprover');
var backto = '';


var _EmployeeID = 0;

jQuery(function ($) {
    init();
});


function init() {
    _EmployeeID = getParameterByName('eid');
    backto = getParameterByName('source');
    $('#btnBack').attr('href', backto);
    getPersonalInfo(_EmployeeID);
}

function getPersonalInfo(eid) {
    postRequest('getEmployeeProfileInfo', { pEid: eid }, function (res) {


        var data = JSON.parse(res.d);
        // console.log(data);
        var html = '';

        $.each(data, function (i, item) {

            $('#pimg').attr('src', getBaseUrl() + data[i].EmployeeImage);
            $('#pimg').on('load', function (e) {
            }).on('error', function (e) {
                $('#pimg').attr('src', 'img/avatar.png');
            });

            txtEmpNo.html(data[i].EmployeeID);
            txtName.html(data[i].EmployeeName);
            txtDesignation.html(data[i].Designation);

            txtBranch.val(item.Branch);
            txtDepartment.val(item.Department);
            txtManagementLevel.val(item.ManagementLevel);
            txtGroup.val(item.Group);
            txtEmployeeCategory.val(item.Category);
            txtSubDepartment.val(item.SubDepartment);
            txtDivision.val(item.Division);
            txtFunction.val(item.Function);
            txtEmployeeGrade.val(item.Grade);
            var apdate = item.AppointmentDate.split('/');
            item.AppointmentDate.split('/')[2] !== '1900' ? txtAppointmentDate.val(item.AppointmentDate) : txtAppointmentDate.val('N/A');
            txtServicePeriod.val(getFillDateDifference(moment([apdate[2], apdate[1], apdate[0]]), moment()));
            item.ConfirmationDate.split('/')[2] !== '1900' ? txtConfirmationDate.val(item.ConfirmationDate) : txtConfirmationDate.val('N/A');
            item.ResignDate.split('/')[2] !== '1900' ? txtResignationDate.val(getFormattedDateNew(item.ResignDate)) : txtResignationDate.val('N/A');
            txtStatus.val(item.EmployeeStatus);
            item.LeavingDate.split('/')[2] !== '1900' ? txtLeavingDate.val(item.LeavingDate) : txtLeavingDate.val('N/A');
            var dd = getFormattedDateNew(item.RetirementDate)
            var resdate = dd.split('/');
            txtRemainingService.val(getFillDateDifference(moment([apdate[2], apdate[1], apdate[0]]),
                moment([resdate[2], resdate[1], resdate[0]])));
            txtApprover.val(item.ApproverData);
            populateLeaveList(_EmployeeID);

        });

    });
}

function populateLeaveList(empID) {
    try {
        var balanceList = $('#balanceList');
        balanceList.html('<center class="lightgrey">Loading <i class="fa fa-spinner fa-spin"></i></center>');
        var ld = $('#ddlLeaveYear').val();
        var data_ = { pEmployeeID1: empID, pLeaveYear: -1 }
        postRequest('GetLeaveBalancebyLeaveYearAll', data_, function (response_) {
            var resdata = JSON.parse(response_.d);

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
        balanceList.html('');
        toastr.error('Something is wrong! ');
    }


}


function toggleDesc(id) {
    $('#p' + id).slideToggle();
    $('#icon' + id).toggleClass('fa-chevron-up fa-chevron-down');
}


function getFillDateDifference(d1, d2) {

    var date1 = d1; //moment([dd[2], dd[1], dd[0]]);
    var date2 = d2; //moment();

    var years = date2.diff(date1, 'year');
    date1.add(years, 'years');

    var months = date2.diff(date1, 'months');
    date1.add(months, 'months');

    var days = date2.diff(date1, 'days');

    return years + ' year(s) ' + months + ' month(s) ' + days + ' day(s)';

}

