
'use strict';


var eid, uid, ecode, secKey, cid, lid, ename, dateformat;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');
dateformat = getLocalStorageItem_String('dateformat');


var leaveYear = jQuery('#ddlLeaveYear');
var leaveType = jQuery('#ddlleavetype');
var txtWorkDate = jQuery('#txtWorkDate');
var txtDetail = jQuery('#txtDetail');

jQuery(function () {

    $('#datetimepicker6').datetimepicker({
        format: dateformat.toUpperCase(),
        ignoreReadonly: true
    });
    txtWorkDate.val(sysdate);

    init();

});

function init() {
    fillLeaveYear();

    jQuery('#btnSave').click(function (e) {
        e.preventDefault();

        if (validate()) {

            var _params = {
                pLeaveYear: leaveYear.val(),
                pLeaveTypeID: leaveType.val(),
                pOffDay: txtWorkDate.val(),
                pDesc: txtDetail.val(),
                pStatus: 'Submitted'
            }
            EnableDisableButtonSpin($(this), 'd', 'Submitting .. Please wait  ');
            postRequest('SaveCompensatoryLeaveRequest', _params, function (r) {
                r = JSON.parse(r.d);

                var res = r.result;
                var msg = r.msg;

                if (res === "success") {
                    toastr.success(msg);
                } else {
                    toastr.error(msg);
                }

                EnableDisableButtonSpin($('#btnSave'), 'e', 'Show');
            });
        }

    });

    leaveYear.change(function () {
        var _val = jQuery(this).val();
        if (_val != "0") {
            fillLeaveType(_val);
        }

    });

}

function fillLeaveYear() {
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        PID1: 'tblELeaveYear',
        PID2: 'LeaveYear',
        PID3: 'LeaveYear',
        pCompanyID: cid,
        PID4: 'order by tblELeaveYear.LeaveYear desc'
    }
    var _ddlLeaveYear = document.getElementById("ddlLeaveYear");
    fillDropDownGeneric(params, _ddlLeaveYear, true, 0);

}


function fillLeaveType(pYear) {
    try {
        if (typeof pYear == 'undefined') { return; }
        var _params = {
            pYear: pYear,
        }
        postRequest('GetLeaveTypeCompensatoryLeave', _params, function (r) {
            r = JSON.parse(r.d);
            var _ddlleavetype = document.getElementById("ddlleavetype");
            _fillDropDown(r, _ddlleavetype, 'LeaveID', 'LeaveTitle', true);
            if (r.length > 0) {
                _ddlleavetype.value = r[0].LeaveID;
            }
        });

    } catch (error) {
        toastr.error(error.message);
    }
}

function validate() {
    var msg = '';
    if (leaveYear.val() == "0") {
        msg += "- Select Leave Year! <br>";
    }

    if (leaveType.val() == "0") {
        msg += "- Select Leave Type! <br>";
    }

    if (txtWorkDate.val().trim() == "") {
        msg += "- Select Work  Date! <br>";
    }



    if (msg != '') {
        toastr.error(msg);
        return false;
    }

    return true;
}

