function SelectAllCheckBoxOnly_New(sender, gridname) {
    var grid, hidEmployeeCode, chkSelected, parentCheckbox, hidDeviceID, hidSelectedRows, objSelectedRows, waitModal;
    var employeeCode, isSelected;

    waitModal = $('#waitModal');
    waitModal.modal({
        isShow: 'show',
        backdrop: 'static',
        keyboard: false
    });

    gridname = 'ctl00_ContentPlaceHolder1_' + gridname;
    grid = $("#" + gridname);
    parentCheckbox = $('#' + sender.id);
    hidSelectedRows = $('#ctl00_ContentPlaceHolder1_hidSelectedRows');
    
    objSelectedRows = JSON.parse(hidSelectedRows.val());
    isSelected = parentCheckbox.is(":checked");    

    grid.children("tbody").children("tr").map(function (index, item) {

        hidEmployeeCode = $(item).find('[id$="hidEmployeeCode"]');        
        chkSelected = $(item).find('[id$="chkSelected"]');        
        chkSelected.prop("checked", isSelected);
        hidDeviceID = $(item).find('[id$="hidDeviceID"]');

        employeeCode = !isNaN(hidEmployeeCode.val()) ? parseFloat(hidEmployeeCode.val()) : "0";        

        objSelectedRows = ProcessSelection_Bulk(employeeCode, isSelected, objSelectedRows, hidDeviceID.val());

        if (isSelected) {
            $(item).addClass('highlight');
        }
        else {
            $(item).removeClass('highlight');
        }
    });

    hidSelectedRows.val(JSON.stringify(objSelectedRows));

    waitModal.modal('hide');
}

//**Used for Select All, Deselect All purpose*/
function ProcessSelection_Bulk(keyValue, isSelected, obj, deviceID) {
    
    var arrKeys = [],  objAccessControl;   
    
    arrKeys = Object.keys(obj);    

    if (isSelected) {
        if (!Array.contains(arrKeys, keyValue.toString())) {
            
            objAccessControl = {
                "EmployeeCode": keyValue,
                "DeviceID": deviceID
            }
            obj[keyValue.toString()] = objAccessControl;
        }
        //tr$.addClass('highlight');
    }
    else {
        if (Array.contains(arrKeys, keyValue.toString())) {
            delete obj[keyValue.toString()];
        }
        //tr$.removeClass('highlight');
    }

    return obj;    
}

function ProcessSelection_New(keyValue, checkboxID, hiddenField,hidDeviceID_ID) {
    var hidSelectedRows;
    var checkbox;
    var arrKeys = [],obj,objAccessControl;
    var itemIndex;
    var selectedRows = ""
    var hidDeviceID;
    var tr$;
    
    checkbox = document.getElementById(checkboxID);
    hidSelectedRows = document.getElementById(hiddenField);
    hidDeviceID = document.getElementById(hidDeviceID_ID);
    tr$ = $('#' + checkboxID).parent().parent();

    selectedRows = hidSelectedRows.value.trim();    
    
    //console.log(checkbox, hidSelectedRows);

    if (selectedRows.length > 0) {        
        //arrKeys = selectedRows.split(',');
        obj = JSON.parse(selectedRows);
        arrKeys = Object.keys(obj);
    }

    if (checkbox.checked) {
        if (!Array.contains(arrKeys, keyValue.toString())) {
            //arrKeys.push(keyValue.toString());
            objAccessControl = {
                "EmployeeCode": keyValue,
                "DeviceID" : hidDeviceID.value
            }
            obj[keyValue.toString()] = objAccessControl;
        }
        tr$.addClass('highlight');
    }
    else {
        if (Array.contains(arrKeys, keyValue.toString())) {
            //itemIndex = arrKeys.indexOf(keyValue.toString());
            //if (itemIndex > -1) {
            //    arrKeys.splice(itemIndex, 1);
            //}
            delete obj[keyValue.toString()];
        }
        tr$.removeClass('highlight');
    }
    //hidSelectedRows.value = arrKeys.join(',');
    hidSelectedRows.value = JSON.stringify(obj);
    //console.table(JSON.parse(hidSelectedRows.value));
}

function ddlSource_change(e) {
    var ddlDevice, rfv_SourceDevice;
    ddlDevice = document.getElementById('ctl00_ContentPlaceHolder1_ddlDevice');
    rfv_SourceDevice = document.getElementById('ctl00_ContentPlaceHolder1_rfv_SourceDevice');
    enable(e.target, ddlDevice, rfv_SourceDevice);
}

function ddlTarget_change(e) {
    var ddlDevice, rfv_TargetDevice;
    ddlTargetDevice = document.getElementById('ctl00_ContentPlaceHolder1_ddlTargetDevice');
    rfv_TargetDevice = document.getElementById('ctl00_ContentPlaceHolder1_rfv_TargetDevice');
    enable(e.target, ddlTargetDevice, rfv_TargetDevice);
}

function enable(ddl, ddlDevice, validator) {
    ddlDevice.value = ddl.value.toLowerCase() === 'database' ? "0" : ddlDevice.value;
    ddlDevice.disabled = ddl.value.toLowerCase() === 'database';
    ValidatorEnable(validator, ddl.value.toLowerCase() === 'device');
}

function applyDatatableToGrid(gridID) {
    var grid, rows, firstRow, thead, options;
    $ = jQuery.noConflict();
    grid = $('#' + gridID);
    rows = grid.children('tbody').children('tr');
    firstRow = grid.find('tr:first');

    options = {
        paging: false,
        searching: true,
        info: false
    };
    grid.prepend($('<thead></thead').append(firstRow)).dataTable(options);
}

var prm = Sys.WebForms.PageRequestManager.getInstance();
$(document).ready(function() {
    applyDatatableToGrid('ctl00_ContentPlaceHolder1_gvwList');
    //applyDatatableToGrid('ctl00_ContentPlaceHolder1_gvwDevices');
    applyDatatableToGrid('ctl00_ContentPlaceHolder1_gvwEmployeeEnrollment');
});

prm.add_endRequest(function() {
    applyDatatableToGrid('ctl00_ContentPlaceHolder1_gvwList');
    //applyDatatableToGrid('ctl00_ContentPlaceHolder1_gvwDevices');
    applyDatatableToGrid('ctl00_ContentPlaceHolder1_gvwEmployeeEnrollment');
});

function ShowSearchPopup() {
    var url;
    url = "DeviceQueryPopup.aspx";
    ShowDialog(url, 800, 800);
}