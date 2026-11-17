
var varData;
var varContentType;
var varDataType;
var varProcessData;
var dateformat;

//var varBaseUrl;
//varBaseUrl = "http://localhost:3560/TimeTraxWeb/"
//Generic function to call AXMX/WCF  Service        
jQuery(function ($) { //just like $(document).ready()

    dateFormat = getLocalStorageItem_String("dateformat");
    FillLeaveApprovalList(dateFormat);

    $("#btnRefresh").click(function () {
        FillLeaveApprovalList(dateFormat);
    });
});

function FillLeaveApprovalList(pDateFormat) {
    var approvallist, ecode, secKey;
    varType = "POST";
    varUrl = getBaseUrl() + "wsttmapp.asmx/GetApprovalLeaveListJson";
    var eid = localStorage.getItem('eid');
    var cid = localStorage.getItem('cid');
    var uid = localStorage.getItem('uid');
    ecode = getLocalStorageItem_String('ecode');
    secKey = getLocalStorageItem_String('secKey');

    approvallist = $("#approvallist");


    varData = '{"pSecKey" : "' + secKey + '","pEmployeeID": "' + eid + '", "pEmployeeRefNo" : "' + ecode + '"   , "pCompanyID": "' + cid + '" ,  "pUserID": "' + uid + '"}';

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
            var tblApprovalLeaveList, Detail;
            if (varDataType == "json") {
                var json = JSON.parse(result.d);
                //console.log('json : ', json);
                checkLoggedIn(json);
                approvallist.html('');
                tblApprovalLeaveList = json['tblApprovalLeaveList'];
                Detail = json['Detail'];
                jQuery.each(tblApprovalLeaveList, function (rec) {
                    var item;
                    item = getListItem(this, Detail, pDateFormat, tblApprovalLeaveList);
                    item.appendTo("#approvallist");
                    //var tranid = this.LeaveTranID;
                    // $("<a href='#' class='list-group-item'></a>").html("<span class='EmployeeTitle'>" + this.EmployeeName + "</span>"
                    //     + "<br />"
                    //     + "<b>" + this.LeaveTitle + "</b><br />"
                    //     + this.Period + " - " + this.TotalLeaves.toString() + " Day(s)<br />"
                    //     + "<span class='txtRemarks'>" + this.Detail + "</span><br />"
                    //     + "<textarea class='form-control' id='txtRemarks" + tranid + "' rows='2' placeholder='Remarks'></textarea>"
                    //     + "<span class='badgett'>" +
                    //     "<button type='button' id='btnapprove" + tranid + "' class='btn btn-success btn-xs' onclick = 'approveleave(event," + this.LeaveTranID + ")'>Approve</button>&nbsp;" +
                    //     "<button type='button' id='btnreject" + tranid + "' class='btn btn-danger btn-xs' onclick = 'rejectleave(event," + this.LeaveTranID + ")'>Reject</button>&nbsp;" +
                    //     "<button type='button' id='btnreturn" + tranid + "' class='btn btn-primary btn-xs' onclick = 'returnleave(event," + this.LeaveTranID + ")'>Return</button>" +
                    //     "</span>"
                    //     + "<br />"
                    // ).appendTo("#approvallist");


                });
                //$("#ddlLeaveYear").chosen();
            }
        },
        error: OnWsError// When Service call fails
    });

}

function getListItem(pLeave, objDetail, pDateFormat, objMaster) {
    var tranid, result = "", fromDate, toDate;

    tranid = pLeave.LeaveTranID;

    var chatUrl = 'Chat.html?SenderID=' + objMaster[0].EmployeeID + '&ReferenceType=Leave&ReferenceID=' + objMaster[0].LeaveTranRefNo + '&ReferenceProcessID=0&TranID=0';

    var chatUrl = '';
    var chatTemplate = '';
    if (IsCommunication.length > 0) {
        chatUrl = 'Chat.html?SenderID=' + objMaster[0].EmployeeID + '&ReferenceType=Leave&ReferenceID=' + objMaster[0].LeaveTranRefNo + '&ReferenceProcessID=0&TranID=0';
        chatTemplate = "<a href='" + chatUrl + "'><i style='font-size:16px;' class='fa fa-comments-o pull-right'></i></a>";
    }


    result = "<span class='EmployeeTitle'>" + getIcon('user') + " " + pLeave.EmployeeName + "</span>" +
        chatTemplate
        + "<br />";

    var leaveBalancatEntryTimeColor = 'inherit';
    var strleaveBalancatEntryTimehtml = '';
    var strLeaveDayshtml = '';
    for (var key in objDetail) {
        let item;
        item = objDetail[key];
        if (item.LeaveTranID !== pLeave.LeaveTranID) { continue; }

        fromDate = new Date(parseInt(item.FromDate.substr(6)));
        toDate = new Date(parseInt(item.ToDate.substr(6)));
        fromDate = DTHelper.GetFormattedDate(fromDate, pDateFormat);
        toDate = DTHelper.GetFormattedDate(toDate, pDateFormat);



        //console.log(item);

        if (typeof (item.LeaveValue) != 'undefined') {
            strleaveBalancatEntryTimehtml = "<span>Leave Balance at Entry Time : <span style='color:" + leaveBalancatEntryTimeColor + "' >" + item.RemainingLeave + " Day(s)</span></span><br/>"
            strLeaveDayshtml = " - " + item.LeaveValue.toString() + " Day(s)<br />";
        }
        if (item.RemainingLeave <= 0) { leaveBalancatEntryTimeColor = 'red' }
        result += "<b>" + item.LeaveTitle + "</b><br />"
            + fromDate + " - " + toDate + strLeaveDayshtml
            + strleaveBalancatEntryTimehtml
            + "<br>"
            + "<span class='txtRemarks'>" + item.Detail + "</span>"
            + "<hr>"



        // result += '<tr><td style="width:150px;">Leave Type</td><td><b>' + item.LeaveTitle + '</b></td></tr>';
        // result += '<tr><td>From</td><td>' + fromDate + " " + getIcon('calendar-o') + '</td></tr>';
        // result += '<tr><td>To</td><td>' + toDate + " " + getIcon('calendar-o') + '</td></tr>';
        // result += '<tr><td>Days</td><td><b>' + item.LeaveValue.toString() + ' Day(s)</b></td></tr>';
        // result += '<tr><td>Balance at Entry Time</td><td><span style="color:' + leaveBalancatEntryTimeColor + '">' + item.RemainingLeave + '<span></td></tr> ';
        // result += '<tr><td>Remarks</td><td><span class="">' + item.Detail + '</span></td></tr>';
        //result += '<tr><td style="text-align:center;" colspan="2"><span class="text-center">' + getIcon('ellipsis-h') + '<span><td></tr>';

    }

    //result = '<table class="table table-bordered table-condensed detail-table">' + result + '</table>';
    result += '<div style="margin-top:10px;"></div>'

    result += "<textarea class='form-control' id='txtRemarks" + tranid + "' rows='2' placeholder='Remarks'></textarea>"
        + "<center style='margin-top:4px;'><span class='badgett'>" +
        "<button type='button' id='btnapprove" + tranid + "' class='btn btn-success btn-xs' onclick = 'approveleave(event," + pLeave.LeaveTranID + ")'>Approve</button>&nbsp;" +
        "<button type='button' id='btnreject" + tranid + "' class='btn btn-danger btn-xs' onclick = 'rejectleave(event," + pLeave.LeaveTranID + ")'>Reject</button>&nbsp;" +
        "<button type='button' id='btnreturn" + tranid + "' class='btn btn-primary btn-xs' onclick = 'returnleave(event," + pLeave.LeaveTranID + ")'>Return</button>" +
        "</span></center>"
        + "<br />";
    result = $("<a href='#' class='list-group-item'></a>").html(result);
    return result;
}

// function OnWsError(result) {
//     alert('Service call failed: ' + varUrl + result.status + '' + result.statusText);
//     varType = null; varUrl = null; varData = null; varContentType = null; varDataType = null; varProcessData = null;
// }

//Populate drop-down box with XML contents
var fWriteXML = function writeXML() {
    var id = $(this).attr("Tranid");
    var LeaveTypeTitle = $(this).attr("LeaveTypeTitle");
    var LeaveRemarks = $(this).attr("LeaveRemarks");
    var LeaveDateRange = $(this).attr("LeaveDateRange");
    var item = $(this).text();
    // toastr.info("before");
    $("<a href='#' class='list-group-item'></a>").html("<span class='badgett'>" + "<button type='button' class='btn btn-success btn-xs' onclick = 'approveleave(" + id + ")'>Approve</button>&nbsp;<button type='button' class='btn btn-danger btn-xs' onclick = 'rejectleave(" + id + ")'>Reject</button></span>"
        + "<h4 class='text-orange'>" + item + "</h4>"
        + "<b>" + LeaveTypeTitle + "</b><br />"
        + LeaveDateRange + "<br />"
        + LeaveRemarks).appendTo("#approvallist");

};

//Click Event for btnSave------------------
function ApproveRejectLeave(sender, pstatus, leavetranid, pRemarks) {
    if (1 == 2) {
        //toastr.error("No items selected...");
    }
    else {

        var eid, cid, uid, ecode, secKey;

        DisableButton_Bulk(sender, pstatus, leavetranid);
        varType = "POST";
        varUrl = getBaseUrl() + "wsttmapp.asmx/LeaveApproveReject";
        eid = localStorage.getItem('eid');
        cid = localStorage.getItem('cid');
        uid = localStorage.getItem('uid');
        ecode = getLocalStorageItem_String('ecode');
        secKey = getLocalStorageItem_String('secKey');

        //varData = '{"pEmployeeID": "' + eid + '" , "pCompanyID": "' + cid + '", "pUserID": "' + uid + '", "pLeaveTranID": "' + leavetranid + '" , "pApprovalStatus": "' + pstatus + '"}';        
        varData = {
            pSecKey: secKey,
            pEmployeeID: eid,
            pEmployeeRefNo: ecode,
            pCompanyID: cid,
            pUserID: uid,
            pLeaveTranID: leavetranid,
            pApprovalStatus: pstatus,
            pRemarks: pRemarks
        };
        varData = JSON.stringify(varData);

        varContentType = "application/json; charset=utf-8";
        varDataType = "json";
        varProcessData = true;
        //alert(varData);

        $.ajax({
            type: varType, //GET or POST or PUT or DELETE verb
            url: varUrl, // Location of the service
            data: varData, //Data sent to server
            contentType: varContentType, // content type sent to server
            dataType: varDataType, //Expected data format from server
            processdata: varProcessData, //True or False
            success: function (res) {
                approvalSuccess(sender, res, pstatus, leavetranid);
                EnableButton_Bulk(sender, pstatus, leavetranid);
            }, //when service call gets successful
            error: function (err) { OnWsError(err); EnableButton_Bulk(sender, pstatus, leavetranid); }// When Service call fails
        });

    }
}

function approvalSuccess(sender, res, pstatus, leavetranid) {
    var value = "", message, success, secondButton, thirdButton, $sender, isObj = false;

    if (isJSONString(res.d)) {
        checkLoggedIn(JSON.parse(res.d));
        isObj = true;
    }

    message = res.d.split("|")[1];
    success = res.d.split("|")[0].trim().toLowerCase() === "true";

    if (success) {
        //$sender = $('#' + sender.id);
        //$sender.parent().parent().remove();
        FillLeaveApprovalList(dateFormat);
    }

    if (!isObj) { toastr.info(message); }
}

function getButtonsInRow(sender, pstatus, isDisable, pTranID) {
    var approveText, returnText, rejectText, btnApprove, btnReturn, btnReject, resultObj = {};

    approveText = "Approve";
    returnText = "Return";
    rejectText = "Reject";

    switch (pstatus.toLowerCase()) {
        case "approve":
            approveText = isDisable ? "Approving..." : approveText;
            resultObj['btnApprove'] = $('#' + sender.id);
            resultObj['btnReject'] = $('#' + 'btnreject' + pTranID);
            resultObj['btnReturn'] = $('#' + 'btnreturn' + pTranID);
            break;

        case "reject":
            rejectText = isDisable ? "Rejecting..." : rejectText;
            resultObj['btnReject'] = $('#' + sender.id);
            resultObj['btnApprove'] = $('#' + 'btnapprove' + pTranID);
            resultObj['btnReturn'] = $('#' + 'btnreturn' + pTranID);
            break;

        case "return":
            returnText = isDisable ? "Returning..." : returnText;
            resultObj['btnReturn'] = $('#' + sender.id);
            resultObj['btnApprove'] = $('#' + 'btnapprove' + pTranID);
            resultObj['btnReject'] = $('#' + 'btnreject' + pTranID);
            break;
    }
    resultObj['returnText'] = returnText;
    resultObj['rejectText'] = rejectText;
    resultObj['approveText'] = approveText;

    return resultObj;
}

function DisableButton_Bulk(sender, status, pTranID) {
    var objButtons;

    objButtons = getButtonsInRow(sender, status, true, pTranID);

    //console.log('objButtons : ', objButtons);

    DisableButton(objButtons['btnApprove'], objButtons['approveText']);
    DisableButton(objButtons['btnReturn'], objButtons['returnText']);
    DisableButton(objButtons['btnReject'], objButtons['rejectText']);
}

function EnableButton_Bulk(sender, status, pTranID) {
    var objButtons;

    objButtons = getButtonsInRow(sender, status, false, pTranID);
    EnableButton(objButtons['btnApprove'], objButtons['approveText']);
    EnableButton(objButtons['btnReturn'], objButtons['returnText']);
    EnableButton(objButtons['btnReject'], objButtons['rejectText']);
}

function approveleave(e, tranid) {
    var remarks, txtRemarks;
    remarks = document.getElementById('txtRemarks' + tranid).value;
    ApproveRejectLeave(e.target, 'approve', tranid, remarks);
}

function rejectleave(e, tranid) {
    var remarks, txtRemarks;
    remarks = document.getElementById('txtRemarks' + tranid).value;

    if (remarks.trim() === '') { toastr.error("Remarks required"); return; }
    ApproveRejectLeave(e.target, 'reject', tranid, remarks);
}

function returnleave(e, tranid) {
    var remarks, txtRemarks;
    remarks = document.getElementById('txtRemarks' + tranid).value;

    if (remarks.trim() === '') { toastr.error("Remarks required"); return; }
    ApproveRejectLeave(e.target, 'return', tranid, remarks);
}

//$(".chosen-selectdesig").chosen();

