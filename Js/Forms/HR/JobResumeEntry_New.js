function PerformAddRowCourses() {
    var msg = "", ddlInstitute, txtCourseName, txtCategory, txtType, txtCourseAddress, txtMajorSubject, txtDateOfcompletion, txtDurationInHourse;

    ddlInstitute = document.getElementById('ctl00_ContentPlaceHolder1_ddlInstitute');
    txtCourseName = document.getElementById('ctl00_ContentPlaceHolder1_txtCourseName');
    txtCategory = document.getElementById('ctl00_ContentPlaceHolder1_txtCategory');
    txtType = document.getElementById('ctl00_ContentPlaceHolder1_txtType');
    txtCourseAddress = document.getElementById('ctl00_ContentPlaceHolder1_txtCourseAddress');
    txtMajorSubject = document.getElementById('ctl00_ContentPlaceHolder1_txtMajorSubject');
    txtDateOfcompletion = document.getElementById('ctl00_ContentPlaceHolder1_txtDateOfcompletion');
    txtDurationInHourse = document.getElementById('ctl00_ContentPlaceHolder1_txtDurationInHourse');

    msg += txtCourseName.value === "" ? "Enter Course Name \n" : "";
    msg += txtCategory.value === "" ? "Enter Category \n" : "";
    msg += ddlInstitute.value === "0" ? "Select Institution \n" : "";
    msg += txtType.value === "" ? "Enter Type \n" : "";
    msg += txtMajorSubject.value === "" ? "Enter Major Subject \n" : "";
    msg += txtCourseAddress.value === "" ? "Enter Address \n" : "";
    msg += txtDateOfcompletion.value === "" ? "Enter Completion Date \n" : "";
    msg += txtDurationInHourse.value === "" ? "Enter Duration Hours \n" : "";

    if (msg.trim() === "") {
        gvwCoursesList_AddRow();
        addSNoCourses();
    }
    else {
        //msg = "Please fill follwing values \n " + msg;
        alert(msg);
    }
}

function addSNoCourses() {
    var txtSNo, hidSNo, hidmaxSno, rows, CellsCount, hidhrSNo; 
    txtSNo = document.getElementById('ctl00_ContentPlaceHolder1_txtSnoCourses');
    hidSNo = document.getElementById('ctl00_ContentPlaceHolder1_hidSnoCourses');
    hidmaxSno = 1;
    rows = document.getElementById('ctl00_ContentPlaceHolder1_gvwCoursesList').rows;

    for (i = 1; i < rows.length; i++) {
        CellsCount = rows[i].cells.length - 2;
        hidhrSNo = rows[i].cells[9].childNodes[0].data;
        if (hidhrSNo == null) {
            hidhrSNo = rows[i].cells[9].childNodes[0].value;
        }
        else {
            hidmaxSno = hidhrSNo;
        }
    }
    if (hidmaxSno > 0) {
        hidmaxSno = hidmaxSno * (-1);
    }
    txtSNo.value = parseFloat(hidmaxSno) - 1;
    hidSNo.value = txtSNo.value;
}

// function makeRemarksConditionallyMandatory(e,conditionText) {
function makeRemarksConditionallyMandatory(e,conditionText) {    
    var $ddlOptionsSelectedText, $rfv_txtRemarksID,rfv_txtRemarks;
    
    $ddlOptionsSelectedText = $('#' + e.target.id + ' option[value="'+ e.target.value +'"]').text();
    $rfv_txtRemarksID = $('#'+e.target.id).siblings('[id$="rfv_txtRemarks"]').attr('id');
    //console.log($rfv_txtRemarksID);
    rfv_txtRemarks = document.getElementById($rfv_txtRemarksID);
    ValidatorEnable(rfv_txtRemarks, conditionText.toLowerCase() === $ddlOptionsSelectedText.toLowerCase());        
}

function emptyFunc(e){

}
function getClientID(pID) {
    var hidContentPlaceHolderID;
    hidContentPlaceHolderID = document.getElementById('hidContentPlaceHolderID');
    return 'ctl00_' + hidContentPlaceHolderID.value + '_' + pID;
}
function ddlCandidateExperience_change(e) {
    var ddlCandidateExperience, hidEmploymentTab;

    ddlCandidateExperience = document.getElementById('ctl00_ContentPlaceHolder1_ddlCandidateExperience');
    hidEmploymentTab = document.getElementById('ctl00_ContentPlaceHolder1_hidEmploymentTab');
    
    //disable all controls by PanelDisplay
    PanelDisplay(ddlCandidateExperience, 'pnlExperience');

    //if Candidate is fresh i.e 0 experience is selected, then Employement Tab should not be validated
    hidEmploymentTab.value = ddlCandidateExperience.value === '0' ? 'False' : hidEmploymentTab.value
    
}

function ddlResumeSource_change() {    
    var ddlResumeSource = document.getElementById('ctl00_ContentPlaceHolder1_ddlResumeSource');
    var txtResumeSourceRemarks = document.getElementById('ctl00_ContentPlaceHolder1_txtResumeSourceRemarks');
    var selectedValue = ddlResumeSource.value;
    selectedValue = selectedValue.toLowerCase();
    if (selectedValue == 'other' || selectedValue == 'others') {
        txtResumeSourceRemarks.style.display = "";
    } else {
        txtResumeSourceRemarks.style.display = "none";
    }
}