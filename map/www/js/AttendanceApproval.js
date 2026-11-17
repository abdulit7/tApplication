
'use strict';

//document ready
jQuery(function ($) {
    FillAttendanceApprovalList();

    $("#btnRefresh").click(function () { FillAttendanceApprovalList(); });
});

//function to get approval data
function FillAttendanceApprovalList() {
    var type, url, data, contentType, dataType, processdata,
        companyID, employeeid, employeeRefNo, userid, secKey, approvallist;

    approvallist = $('#approvallist');
    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/GetApprovalAttendanceListJson";
    contentType = "application/json;charset=utf-8";
    dataType = "json";
    processdata = true;
    employeeid = getLocalStorageItem_Int('eid');
    employeeRefNo = getLocalStorageItem_String('ecode');
    companyID = getLocalStorageItem_Int('cid');
    userid = getLocalStorageItem_Int('uid');
    secKey = getLocalStorageItem_String('secKey');

    data = {
        pSecKey: secKey,
        pEmployeeID: employeeid,
        pEmployeeRefNo: employeeRefNo,
        pCompanyID: companyID,
        pUserID: userid
    };
    data = JSON.stringify(data);

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: dataType,
        processdata: processdata,
        success: function (res) { GetApprovalDataSuccess(res, approvallist) },
        error: OnWsError
    });
}

//sucess handler for get data request
function GetApprovalDataSuccess(res, approvallist) {
    var dateformat, obj, arrRequestIDs = [];
    obj = JSON.parse(res.d);
    checkLoggedIn(obj);
    dateformat = getLocalStorageItem_String('dateformat');

    approvallist.html('');  //making the list empty

    //take unique RequestIDs
    Object.keys(obj).map(function (key) {
        var id = obj[key].RequestID;
        if (arrRequestIDs.indexOf(id) === -1) {
            arrRequestIDs.push(id);
        }
    });

    //loop over requesIDs
    arrRequestIDs.map(function (requestID) {
        var records = [], rec, dates, tranid;

        tranid = requestID;
        //take all the matching objects
        Object.keys(obj).map(function (key) {
            var id = obj[key].RequestID;
            if (id === requestID) {
                rec = obj[key];
                records.push(obj[key]);
            }
        });

        //take the date string
        dates = '';
        records.map(function (item) {
            var requestedDate, actualDate, arrHistory;
            arrHistory = item.History.trim().split('|');

            requestedDate = GetAttendanceRow(item.InDate, item.InTime, item.OutDate, item.OutTime);
            actualDate = GetAttendanceRow(arrHistory[0], arrHistory[1], arrHistory[2], arrHistory[3]);
            dates +=
                "<span>Act : " + actualDate + "</span><br />" +
                "<span>Req : " + requestedDate + "</span><br />" +
                "<span class='txtRemarks'>" + item.Remarks + "</span>" +
                "<br />" +
                "<hr/>";

        });

        //console.log({ rec });
        var chatUrl = '';
        var chatTemplate = '';
        if (IsCommunication.length > 0) {
            chatUrl = 'Chat.html?SenderID=' + rec.EmployeeID + '&ReferenceType=Attendance&ReferenceID=' + rec.RequestNo + '&ReferenceProcessID=0&TranID=0';
            chatTemplate = "<a href='" + chatUrl + "'><i style='font-size:16px;' class='fa fa-comments-o pull-right'></i></a>";
        }

        //+ "<span class='txtRemarks'>" + rec.Remarks + "</span><br />"
        $("<a href='#' class='list-group-item'></a>").html("<span class='EmployeeTitle'>" + rec.EmployeeName + "</span>" + chatTemplate
            + "<br />"
            + dates
            + "<textarea class='form-control' id='txtRemarks" + tranid + "' rows='2' placeholder='Remarks'></textarea>"
            + "<span class='badgett'>" +
            "<button type='button' id='btnapprove" + tranid + "' class='btn btn-success btn-xs' onclick = 'approveRecord(event," +
            tranid + ")'>Approve</button>&nbsp;" +
            "<button type='button' id='btnreject" + tranid + "' class='btn btn-danger btn-xs' onclick = 'rejectRecord(event," +
            tranid + ")'>Reject</button>&nbsp;" +
            "<button type='button' id='btnreturn" + tranid + "' class='btn btn-primary btn-xs' onclick = 'returnRecord(event," +
            tranid + ")'>Return</button>" +
            "</span>"
            + "<br/><br/>"
        ).appendTo(approvallist);
    });
}

function GetAttendanceRow(pInDate, pInTime, pOutDate, pOutTime) {
    var inDate, outDate, result, dateformat, timeFormat;
    dateformat = getLocalStorageItem_String('dateformat');

    inDate = DTHelper.GetFormattedDate(new Date(pInDate), dateformat);
    outDate = DTHelper.GetFormattedDate(new Date(pOutDate), dateformat);

    inDate = inDate + ' ' + pInTime;
    outDate = outDate + ' ' + pOutTime;
    result = inDate + ' - ' + outDate;
    return result;
}

//Click Event for btnSave------------------
function ApproveRejectReturn(sender, pStatus, pTranid, pRemarks) {

    var type, url, data, contentType, dataType, processdata, eid, cid, uid, employeeRefNo, secKey;

    DisableButton_Bulk(sender, pStatus, pTranid);

    type = "POST";
    url = getBaseUrl() + "wsttmapp.asmx/AttendanceApproveReject";
    contentType = "application/json; charset=utf-8";
    dataType = "json";
    processdata = true;
    eid = getLocalStorageItem_Int('eid');
    cid = getLocalStorageItem_Int('cid');
    uid = getLocalStorageItem_Int('uid');
    employeeRefNo = getLocalStorageItem_String('ecode');
    secKey = getLocalStorageItem_String('secKey');

    data = {
        pSecKey: secKey,
        pEmployeeID: + eid,
        pEmployeeRefNo: employeeRefNo,
        pCompanyID: cid,
        pUserID: uid,
        pRequestID: pTranid,
        pApprovalStatus: pStatus,
        pRemarks: pRemarks
    };
    data = JSON.stringify(data);

    //Added temp
    //approvalSuccess(sender, ({d: ""}), pStatus, pTranid);
    //Commented temp
    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: dataType,
        processdata: processdata,
        success: function (res) { approvalSuccess(sender, res, pStatus, pTranid); EnableButton_Bulk(sender, pStatus, pTranid); },
        error: function (err) { OnWsError(err); EnableButton_Bulk(sender, pStatus, pTranid); }
    });
}

//sucess handler for approve,reject and return
function approvalSuccess(sender, res, pstatus, pTranID) {
    var value = "", message, success, secondButton, thirdButton, isObj = false;

    message = res.d.toString().trim();
    if (isJSONString(message)) {
        checkLoggedIn(JSON.parse(message))
        isObj = true;
    }
    //console.log('below check');

    switch (pstatus.toLowerCase()) {
        case "approved":
            // value = "Approved";
            // secondButton = document.getElementById('btnreject' + pTranID);
            // thirdButton = document.getElementById('btnreturn' + pTranID);
            success = message.indexOf('Approved successfully') > -1;
            if (success) {
                message = 'Approved successfully';
            }
            break;
        case "reject":
            // value = "Rejected";
            // secondButton = document.getElementById('btnapprove' + pTranID);
            // thirdButton = document.getElementById('btnreturn' + pTranID);
            success = message.indexOf('Rejected successfully') > -1;
            if (success) {
                message = 'Rejected successfully';
            }
            break;
        case "return":
            //value = "Returned";
            // secondButton = document.getElementById('btnapprove' + pTranID);
            // thirdButton = document.getElementById('btnreject' + pTranID);
            success = message.indexOf('Returned successfully') > -1;
            if (success) {
                message = 'Returned successfully';
            }
            break;
    }

    // console.log('sender : ', sender, '| secondButton : ', secondButton, '| thirdButton : ', thirdButton);

    // sender.innerHTML = success ? value : sender.innerHTML;
    // sender.onclick = "";
    // sender.style.opacity = "0.5";
    // secondButton.onclick = "";
    // secondButton.style.opacity = "0.5";
    // thirdButton.onclick = "";
    // thirdButton.style.opacity = "0.5";

    if (success) {
        $('#' + sender.id).parent().parent().remove();
    }

    if (!isObj) { toastr.info(message); }
    //FillLeaveApprovalList();
}

function getButtonsInRow(sender, pstatus, isDisable, pTranID) {
    var approveText, returnText, rejectText, btnApprove, btnReturn, btnReject, resultObj = {};

    approveText = "Approve";
    returnText = "Return";
    rejectText = "Reject";

    switch (pstatus.toLowerCase()) {
        case "approved":
            approveText = isDisable ? "Approving..." : approveText;
            resultObj['btnApprove'] = $('#' + sender.id);
            resultObj['btnReject'] = $('#' + 'btnreject' + pTranID); //document.getElementById('btnreject' + pTranID);
            resultObj['btnReturn'] = $('#' + 'btnreturn' + pTranID);// document.getElementById('btnreturn' + pTranID);            
            break;

        case "reject":
            rejectText = isDisable ? "Rejecting..." : rejectText;
            resultObj['btnReject'] = $('#' + sender.id);
            resultObj['btnApprove'] = $('#' + 'btnapprove' + pTranID);//document.getElementById('btnapprove' + pTranID);
            resultObj['btnReturn'] = $('#' + 'btnreturn' + pTranID);//document.getElementById('btnreturn' + pTranID);                       
            break;

        case "return":
            returnText = isDisable ? "Returning..." : returnText;
            resultObj['btnReturn'] = $('#' + sender.id);
            resultObj['btnApprove'] = $('#' + 'btnapprove' + pTranID);//document.getElementById('btnapprove' + pTranID);
            resultObj['btnReject'] = $('#' + 'btnreject' + pTranID);//document.getElementById('btnReject' + pTranID);                       
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


//Click Event for Approve Buttons in list-------------
function approveRecord(e, tranid) {
    var remarks, txtRemarks;
    remarks = document.getElementById('txtRemarks' + tranid).value;
    ApproveRejectReturn(e.target, 'Approved', tranid, remarks);
}

//Click Event for Reject Buttons in list--
function rejectRecord(e, tranid) {
    var remarks, txtRemarks;
    remarks = document.getElementById('txtRemarks' + tranid).value;

    if (remarks.trim() === '') { alert("Remarks required"); return; }
    //if (!confirmApproval("Reject")) { return; }
    ApproveRejectReturn(e.target, 'Reject', tranid, remarks);
}

//Click Event for Return Buttons in list-------------
function returnRecord(e, tranid) {
    var remarks, txtRemarks;
    remarks = document.getElementById('txtRemarks' + tranid).value;

    if (remarks.trim() === '') { alert("Remarks required"); return; }
    //if (!confirmApproval("Return")) { return; }
    ApproveRejectReturn(e.target, 'Return', tranid, remarks);
}

function confirmApproval(action) {
    return window.confirm("Are you sure you want to " + action + " this request ?");
}