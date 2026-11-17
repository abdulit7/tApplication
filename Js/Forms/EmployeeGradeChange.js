
function funcSetValue(targetControl) {
    var obj, arr;

    if (targetControl.id === "ctl00_ContentPlaceHolder1_hidPositionDetail") {
        obj = JSON.parse(targetControl.value);        
        setPositionDetails(obj.BranchID, obj.DivisionID, obj.DepartmentID, obj.SubDepartmentID, obj.EmployeeGradeID, obj.EmployeeCategoryID);
    }
}

function setPositionDetails(branchID, divisionID, departmentID, subDepartmentID, employeeGradeID, employeeCategoryID) {
    var ddlBranchID, ddlDivisionID, ddlDepartmentID, ddlSubDepartmentID, ddlEmployeeGradeID, ddlEmployeeCategoryID;
    // console.log(branchID, divisionID, departmentID, subDepartmentID, employeeGradeID, employeeCategoryID);
    ddlBranchID = document.getElementById('ctl00_ContentPlaceHolder1_ddlNewBranch');
    ddlDivisionID = document.getElementById('ctl00_ContentPlaceHolder1_ddlDivision');
    ddlDepartmentID = document.getElementById('ctl00_ContentPlaceHolder1_ddlNewDepartment');
    ddlSubDepartmentID = document.getElementById('ctl00_ContentPlaceHolder1_ddlSubDepartment');
    ddlEmployeeGradeID = document.getElementById('ctl00_ContentPlaceHolder1_ddlEmployeeGrade');
    ddlEmployeeCategoryID = document.getElementById('ctl00_ContentPlaceHolder1_ddlNewCategory');

    ddlBranchID.value = branchID;
    jQuery('#ctl00_ContentPlaceHolder1_ddlNewBranch').select2().trigger('change');
    ddlBranchID.disabled = true;

    ddlDivisionID.value = divisionID;
    jQuery('#ctl00_ContentPlaceHolder1_ddlDivision').select2().trigger('change');
    ddlDivisionID.disabled = true;

    ddlDepartmentID.value = departmentID;
    jQuery('#ctl00_ContentPlaceHolder1_ddlNewDepartment').select2().trigger('change');
    ddlDepartmentID.disabled = true;

    ddlSubDepartmentID.value = subDepartmentID;
    jQuery('#ctl00_ContentPlaceHolder1_ddlSubDepartment').select2().trigger('change');
    ddlSubDepartmentID.disabled = true;

    ddlEmployeeGradeID.value = employeeGradeID;
    jQuery('#ctl00_ContentPlaceHolder1_ddlEmployeeGrade').select2().trigger('change');
    ddlEmployeeGradeID.disabled = true;

    ddlEmployeeCategoryID.value = employeeCategoryID;
    jQuery('#ctl00_ContentPlaceHolder1_ddlNewCategory').select2().trigger('change');
    ddlEmployeeCategoryID.disabled = true;
}

function ddlNewPosition_Change(event) {
    var value, hidDdlPositionValue;
    value = event.target.value;
    $ = jQuery.noConflict();
    hidDddlPositionValue = $('#ctl00_ContentPlaceHolder1_hidDdlPositionValue');
    hidDddlPositionValue.val(value);
}