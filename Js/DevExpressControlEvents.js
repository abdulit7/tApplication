/* 
Event For DevExpress Dropdown
*/

//var nullString = "-Select-";

if (typeof nullString === 'undefined') {
  var nullString = "-Select-";
}

function OnLostFocus(s, e) {
    if (s.GetValue() != "" && s.GetValue() != null) // if no item is selected
        return;

    var input = s.GetInputElement();
    input.value = nullString;
}


function OnGotFocus(s, e) {
    var input = s.GetInputElement();
    var defaultValue = "";
    if (typeof nullString !== 'undefined' && nullString !== undefined && nullString !== null) {
        defaultValue = nullString;
    }
//    if (input.value == null) {
    if (input.value == defaultValue) {
        input.value = "";
    }
}

function OnInit(s, e) {
    //s.SetEnabled(false);
    OnLostFocus(s, e);
}

/* 
End of Event For DevExpress Dropdown
*/

/* 
Functions and Events For DevExpress ASpxGridView
*/

$ = jQuery.noConflict();
function ProcessSelection(grid, visibleIndex, checkbox, keyValue, hiddenField){
   
    var hidSelectedRows = document.getElementById(hiddenField);
    var selectedRows = ""
    selectedRows = hidSelectedRows.value.trim();

    var arrKeys = [];
    var itemIndex;

    if (selectedRows.length > 0) {
        arrKeys = selectedRows.split(',');
    }
    
    if (checkbox.GetChecked()) {
        grid.SelectRowOnPage(visibleIndex);
        if (!Array.contains(arrKeys, keyValue.toString())) {
            arrKeys.push(keyValue.toString());
        }
    }
    else {
        grid.UnselectRowOnPage(visibleIndex);
        if (Array.contains(arrKeys, keyValue.toString())) {
            itemIndex = arrKeys.indexOf(keyValue.toString());
            if (itemIndex > -1) {
                arrKeys.splice(itemIndex, 1);
            }
        }
    }
    hidSelectedRows.value = arrKeys.join(',');   
    
    //console.log(hidSelectedRows.value);
    
}

function unSelectAllRows(hidSelectedValues,GridViewClientID) {
    var SelectedRows = document.getElementById(hidSelectedValues);
    if (typeof SelectedRows !== 'undefined' && SelectedRows !== null) { SelectedRows.value = ""; }
    GridViewClientID.UnselectRows();
}

function onSelectAll(s, e, GridViewClientID, hidSelectedValues) {

    var isselected = s.GetChecked();
    if (isselected == false) {
        //console.log('hidSelectedValues : ', hidSelectedValues);
        unSelectAllRows(hidSelectedValues, GridViewClientID);
    }
    else {                
        var IsIE = false;
        IsIE = (navigator.appName == "Microsoft Internet Explorer" || navigator.appName == "Netscape");
        $('.detailCheckbox').each(function(index) {
            try {
                if (IsIE) {
                    var chk = $(this).children()[1];
                }
                else {
                    var chk = eval($(this).children()[1].id);
                }

                if (chk.tagName != 'INPUT') {
                }
                else {
                    if (chk.type == 'checkbox') {
                        chk.click();
                    }
                }
            }
            catch (err) {
            }
        });
    }
    return false;
}

function onSelectAllDefault(s, e, GridViewClientID) {
    var isselected = s.GetChecked();
    if (isselected == false) {
        GridViewClientID.UnselectAllRowsOnPage();
    }
    else {
        GridViewClientID.SelectAllRowsOnPage();
    }
    return false;
}

function onSelectAllDefault(sender, event, GridViewClientID) {
    var isselected = sender.GetChecked();
    if (isselected == false) {
        unSelectAllRows("",GridViewClientID);
    }
    else {
        GridViewClientID.SelectAllRowsOnPage();
    }
    return false;
}

function SelectionValidationApprovalOldPage(GridViewID, ColIndex, Action) {
    
    var span,IsChecked,$span;
    var tbl = document.getElementById(GridViewID);
    var hidIsApproveValidate = "Are you sure you want to " + Action + " ?"
    var SelectedCount = 0; var result;
    var $ = jQuery.noConflict();
    for (i = 2; i <= tbl.rows.length - 1; i++) {
        if (tbl.rows[i].cells[ColIndex] != null) {
            span = tbl.rows[i].cells[ColIndex].getElementsByTagName("span")[0];
            //console.log('span : ', span);
            if (typeof span !== 'undefined') {

                $span = $(span);
                IsChecked = $span.hasClass('dxWeb_edtCheckBoxChecked');
                //console.log('IsChecked : ', IsChecked);
                if (IsChecked == true) {
                    SelectedCount = SelectedCount + 1;
                    //console.log('SelectedCount : ', SelectedCount);
                    rval = tbl.rows[i].cells[ColIndex + 1].getElementsByTagName('span')[0];
                    rval.errormessage = 'Remarks are required at row # ' + (i - 1).toString();

                    if (Action.toLowerCase() == 'reject' || Action.toLowerCase() == 'return') {
                        ValidatorEnable(rval, IsChecked);
                    }
                    else {
                        ValidatorEnable(rval, false)
                    }

                }
                else {
                    rval = tbl.rows[i].cells[ColIndex + 1].getElementsByTagName('span')[0]
                    ValidatorEnable(rval, false)
                }
            }
        }
    }

    if (SelectedCount == 0) {
        alert("Select atleast one line")
        result = false;
    }
    else {
        var answer = confirm(hidIsApproveValidate);
        if (answer == false) {
            result = answer;
        }
        else {
            Page_ClientValidate("valAttendaceApproval");
            if (Page_IsValid) {
                reuslt = true;
            }
        }
    }
    return result;
}

function SelectionValidationApproval(GridViewID, ColIndex, Action) {
    var refcheck;
    var refspan;
    var IsChecked;
    var $span;
    var tbl = document.getElementById(GridViewID);
    var hidIsApproveValidate = "Are you sure you want to " + Action + " ?"
    var SelectedCount = 0; var result;
    var $ = jQuery.noConflict();
    for (i = 2; i <= tbl.rows.length - 1; i++) {
        if (tbl.rows[i].cells[ColIndex] != null) {
            refspan = tbl.rows[i].cells[ColIndex].getElementsByTagName("span")[0];
            //console.log('refspan : ', refspan);
            if (typeof refspan !== 'undefined') {

                $span = $(refspan);
                IsChecked = $span.hasClass('dxWeb_edtCheckBoxChecked');
                //console.log('IsChecked : ', IsChecked);
                if (IsChecked == true) {
                    SelectedCount = SelectedCount + 1;
                    //console.log('SelectedCount : ', SelectedCount);
                    rval = tbl.rows[i].cells[ColIndex + 1].getElementsByTagName('span')[0];
                    rval.errormessage = 'Remarks are required at row # ' + (i - 1).toString();

                    if (Action.toLowerCase() == 'reject' || Action.toLowerCase() == 'return') {
                        ValidatorEnable(rval, IsChecked);
                    }
                    else {
                        ValidatorEnable(rval, false)
                    }

                }
                else {
                    rval = tbl.rows[i].cells[ColIndex + 1].getElementsByTagName('span')[0]
                    ValidatorEnable(rval, false)
                }
            }
        }
    }

    if (SelectedCount == 0) {
        alert("Select atleast one line")
        result = false;
    }
    else {
        var answer = confirm(hidIsApproveValidate);
        if (answer == false) {
            result = answer;
        }
        else {
            Page_ClientValidate("valAttendaceApproval");
            if (Page_IsValid) {
                reuslt = true;
            }
        }
    }
    return result;
}

/* 
End of Functions and Events For DevExpress ASpxGridView
*/ 