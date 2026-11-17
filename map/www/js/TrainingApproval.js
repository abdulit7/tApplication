var varData;
var varContentType;
var varDataType;
var varProcessData;

//var varBaseUrl;
//varBaseUrl = "http://localhost:3560/TimeTraxWeb/"
//Generic function to call AXMX/WCF  Service        
jQuery(function ($) { //just like $(document).ready()
    var dateformat;
    dateFormat = getLocalStorageItem_String("dateformat");
    FillTrainingApprovalList(dateFormat);

    $("#btnRefresh").click(function () {
        FillTrainingApprovalList(dateFormat);
    });
});

function FillTrainingApprovalList(pDateFormat) {
    var approvallist, ecode, secKey;
    varType = "POST";
    varUrl = getBaseUrl() + "wsttmapp.asmx/GetTrainingApprovalList";
    var eid = localStorage.getItem('eid');
    var cid = localStorage.getItem('cid');
    var uid = localStorage.getItem('uid');
    ecode = getLocalStorageItem_String('ecode');
    secKey = getLocalStorageItem_String('secKey');

    approvallist = $("#approvallist");

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
            var tblApprovalTrainingList
            if (varDataType == "json") {
                tblApprovalTrainingList = JSON.parse(result.d);
                //console.log(tblApprovalTrainingList);
                //console.log('json : ', json);
                checkLoggedIn(tblApprovalTrainingList);
                approvallist.html('');
                if (!isEmptyObj(tblApprovalTrainingList)) {
                    jQuery.each(tblApprovalTrainingList, function (rec) {
                        var item;
                        item = getListItem(this, pDateFormat);
                        item.appendTo("#approvallist");
                    });
                } else {
                    $('#approvallist').html('No Data Found!');
                }


            }
        },
        error: OnWsError// When Service call fails
    });

}

function getListItem(pTraining, pDateFormat) {
    var tranid, result = "", fromDate, toDate;
    pDateFormat = getLocalStorageItem_String("dateformat");
    fromDate = new Date(parseInt(pTraining.FromDate.substr(6)));
    toDate = new Date(parseInt(pTraining.ToDate.substr(6)));

    fromDate = DTHelper.GetFormattedDate(fromDate, pDateFormat);
    toDate = DTHelper.GetFormattedDate(toDate, pDateFormat);

    tranid = pTraining.RequestID;

    result = "<span class='EmployeeTitle'>" + pTraining.EmployeeName + "</span>"
        + "<br />";

    result += "<b>" + pTraining.TrainingTitle + "</b><br />"
        + fromDate + " - " + toDate + "<br />"
        + "<span class='txtRemarks'>" + pTraining.RequesterRemarks + "</span><hr />";

    result += "<textarea class='form-control' id='txtRemarks" + tranid + "' rows='2' placeholder='Remarks'></textarea>"
        + "<span class='badgett'>" +
        "<button type='button' id='btnapprove" + tranid + "' class='btn btn-success btn-xs' onclick = 'approveTraining(event," + pTraining.RequestID + ")'>Approve</button>&nbsp;" +
        "<button type='button' id='btnreject" + tranid + "' class='btn btn-danger btn-xs' onclick = 'rejectTraining(event," + pTraining.RequestID + ")'>Reject</button>&nbsp;" +
        "<button type='button' id='btnreturn" + tranid + "' class='btn btn-primary btn-xs' onclick = 'returnTraining(event," + pTraining.RequestID + ")'>Return</button>" +
        "</span>"
        + "<br />";
    result = $("<a href='#' class='list-group-item'></a>").html(result);
    return result;
}


//Click Event for btnSave------------------
function ApproveRejectTraining(sender, pstatus, Trainingtranid, pRemarks) {

    if (1 == 2) {
        alert("No items selected...");
    }
    else {
        DisableButton_Bulk(sender, pstatus, Trainingtranid);
        var approvallist, ecode, secKey;
        varType = "POST";
        varUrl = getBaseUrl() + "wsttmapp.asmx/GetTrainingApprovalList";
        var eid = localStorage.getItem('eid');
        var cid = localStorage.getItem('cid');
        var uid = localStorage.getItem('uid');
        ecode = getLocalStorageItem_String('ecode');
        secKey = getLocalStorageItem_String('secKey');

        Type = "POST";
        ContentType = "application/json; charset=utf-8";
        DataType = "json";
        ProcessData = true;
        Url = getBaseUrl() + "wsttmapp.asmx/SaveTRainingApproval";
        Data = {
            pSecKey: secKey,
            pEmployeeID: eid,
            pEmployeeRefNo: ecode,
            pUserID: uid,
            pCompanyID: cid,
            pTranID: Trainingtranid,
            pRemarks: pRemarks,
            pStatus: pstatus
        }
        Data = JSON.stringify(Data);

        $.ajax({
            type: Type, //GET or POST or PUT or DELETE verb
            url: Url, // Location of the service
            data: Data, //Data sent to server
            contentType: ContentType, // content type sent to server
            dataType: DataType, //Expected data format from server
            processdata: ProcessData, //True or False           
            success: function (result) {//On Successfull service call

                //console.log(result);
                var json = JSON.parse(result.d);
                var res = json.result;
                var msg = json.msg;
                //console.log(json);

                if (res === "success") {
                    toastr.success(msg);
                }
                if (res === "fail") {
                    toastr.error(msg);
                }


                EnableButton_Bulk(sender, pstatus, Trainingtranid);
                FillTrainingApprovalList();




            },
            error: OnWsError_Toaster,// When Service call fails            
        });

    }
}


function getButtonsInRow(sender, pstatus, isDisable, pTranID) {

    var approveText, returnText, rejectText, btnApprove, btnReturn, btnReject, resultObj = {};

    approveText = "Approved";
    returnText = "Return";
    rejectText = "Reject";

    switch (pstatus.toLowerCase()) {
        case "approved":
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

function approveTraining(e, tranid) {
    var remarks, txtRemarks;
    remarks = document.getElementById('txtRemarks' + tranid).value;
    ApproveRejectTraining(e.target, 'Approved', tranid, remarks);
}

function rejectTraining(e, tranid) {
    var remarks, txtRemarks;
    remarks = document.getElementById('txtRemarks' + tranid).value;

    if (remarks.trim() === '') { alert("Remarks required"); return; }
    ApproveRejectTraining(e.target, 'Reject', tranid, remarks);
}

function returnTraining(e, tranid) {
    var remarks, txtRemarks;
    remarks = document.getElementById('txtRemarks' + tranid).value;

    if (remarks.trim() === '') { alert("Remarks required"); return; }
    ApproveRejectTraining(e.target, 'Return', tranid, remarks);
}


