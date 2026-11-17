function callStatus(requestid, processid, companyid, url) {
    window.showModalDialog(url + '?requestid=' + requestid + "&processid=" + processid + "&companyid=" + companyid, window, 'dialogHeight:450px;dialogWidth:880px;center:yes;help:no;resizable:no;status:no');
    return false;
}
function callView(requestid, companyid, url) {
    window.showModalDialog(url + '?id=' + requestid + "&cid=" + companyid, window, 'dialogHeight:450px;dialogWidth:1000px;center:yes;help:no;resizable:no;status:no');
    return false;
}

function getGridViewSelectedRows(GridViewID, ColIndex) {
    var tbl = document.getElementById(GridViewID);
    var validator; var checkbox; var count = 0;

    for (var i = 1; i < tbl.rows.length; i++) {
        checkbox = tbl.rows[i].cells[ColIndex].getElementsByTagName("input")[0];        
        if (typeof checkbox !== 'undefined') {
            if (checkbox.checked) {
                count++;
                validator = tbl.rows[i].cells[ColIndex + 1].getElementsByTagName('span')[0];
                validator.errormessage = 'Remarks is required at row # ' + i;
                ValidatorEnable(validator, checkbox.checked);
            }
            else {
                validator = tbl.rows[i].cells[ColIndex + 1].getElementsByTagName('span')[0];
                ValidatorEnable(validator, false);
            }
        }
    }
    return count;
}

function SelectionValidationApproval(GridViewID, ColIndex) {
    var result = false; var confirmationMessage; var SelectedCount = 0;
    confirmationMessage = "Are you sure you want to Approve ?"
    SelectedCount = getGridViewSelectedRows(GridViewID, ColIndex);
    
    if (SelectedCount == 0) {
        result = false;
        alert("Select at least one Line")
    }
    else {
        result = confirm(confirmationMessage);
    }

    return result;
}



function SelectionValidation(GridViewID, ColIndex, BType) {
    var refcheck;
    var tbl = document.getElementById(GridViewID);
    var hidIsRejectValidate = "Are you sure you want to Reject ?"
    var hidIsReturnValidate = "Are you sure you want to Return ?"
    var SelectedCount = 0;
    SelectedCount = getGridViewSelectedRows(GridViewID, ColIndex);

    if (SelectedCount == 0) {
        alert("Select at least one Line")
        return false;
    }
    else {
        var msg;
        if (BType == "R") {
            msg = hidIsRejectValidate;
        }
        else {
            msg = hidIsReturnValidate;
        }

        var answer = confirm(msg);
        if (answer == false) {
            return answer;
        }
        else {
            Page_ClientValidate("valTACApproval")
            if (Page_IsValid) {
                return true;
            }
        }
    }
}


function SelectionValidationRejection(GridViewID, ColIndex) {
    var refcheck;
    var tbl = document.getElementById(GridViewID);
    var hidIsRejectValidate = "Are you sure you want to Reject ?"
    var SelectedCount = 0;

    SelectedCount = getGridViewSelectedRows(GridViewID, ColIndex);
    if (SelectedCount == 0) {
        alert("Select at least one Line")
        return false;
    }
    else {
        var answer = confirm(hidIsRejectValidate);
        if (answer == false) {
            return answer;
        }
        else {
            Page_ClientValidate("valTACApproval")
            if (Page_IsValid) {
                return true;
            }
        }
    }
}

function SelectionValidationApproval_Form(GridViewID, ColIndex) {
    var refcheck;
    var tbl = document.getElementById(GridViewID);
    var hidIsApproveValidate = "Are you sure you want to Approve ?"
    var SelectedCount = 0;
    for (i = 1; i < tbl.rows.length; i++) {
        if (tbl.rows[i].cells[ColIndex] != null) {
            refcheck = tbl.rows[i].cells[ColIndex].getElementsByTagName("Input")[0]
            if (refcheck.checked == true) {
                SelectedCount = SelectedCount + 1;
                rval = tbl.rows[i].cells[ColIndex + 1].getElementsByTagName('span')[0]
                rval.errormessage = 'Remarks is required at row # ' + i;
                ValidatorEnable(rval, refcheck.checked)
            }
            else {
                rval = tbl.rows[i].cells[ColIndex + 1].getElementsByTagName('span')[0]
                ValidatorEnable(rval, false)
            }
        }
    }
    if (SelectedCount == 0) {
        alert("Select at least one Line")
        return false;
    }
    else {
        var answer = confirm(hidIsApproveValidate);
        if (answer == false) {
            return answer;
        }
        else {
            //Page_ClientValidate("valTACApproval")
            //if (Page_IsValid) {
                return true;
            //}
        }
    }
}

function callChat(SenderID, ReferenceType, ReferenceID, ReferenceProcessID, url) {
    //window.showModalDialog(url + '?SenderID=' + SenderID + "&ReferenceType=" + ReferenceType + "&ReferenceID=" + ReferenceID + "&ReferenceProcessID=" + ReferenceProcessID + "&type=popup",
    //window, 'dialogHeight:420px;dialogWidth:700px;center:yes;help:no;resizable:no;status:no');
    window.open(url + '?SenderID=' + SenderID + "&ReferenceType=" + ReferenceType + "&ReferenceID=" + ReferenceID + "&ReferenceProcessID=" + ReferenceProcessID + "&type=popup");
    return false;
}