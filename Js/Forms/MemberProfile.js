
//var $ = jQuery.noConflict();

function btnSave_Click(e) {
    var isValid;
    gvwList_GetXML('tbl1');
    gvwQualificationList_GetXML('tbl2');
    gvwExperienceList_GetXML('tbl3');
    gvwLanguageSkillList_GetXML('tbl4');
    gvwReferenceList_GetXML('tbl5');
    gvwCoursesList_GetXML('tblCandidateCourse');
    
    //return _IsPageValid();
    isValid = _IsPageValid();

    if (isValid) {
        e.target.disabled = true;
        __doPostBack("ctl00$ContentPlaceHolder1$btnSave");
    }
    return false;
    
}

function _IsPageValid() {
    var isValid = true; var msg = "";

    //    isValid = Page_ClientValidate("Add");
    isValid = Page_ClientValidate();
    //console.log('isValid : ', isValid);
    if (!isValid) { return isValid; }
    
    if (!IsQualificationValid()) { msg += "At least one row required of Education detail. \n" }
    if (!IsLanguageValid()) { msg += "At least one row required of Language detail. \n" }    
    
    isValid = (msg.trim() == "");
    if (!isValid) { alert(msg); return isValid; }

    //console.log(isValid);
    return isValid;
}

function IsQualificationValid() {
    var hidEducationTab, GvwQualificationID, result;
    hidEducationTab = document.getElementById('ctl00_ContentPlaceHolder1_hidEducationTab');
    GvwQualificationID = document.getElementById('ctl00_ContentPlaceHolder1_gvwQualificationList').id;
    result = false;

    //console.log(hidEducationTab.value, gvwHasRows(GvwQualificationID));

    if (hidEducationTab.value.toLowerCase() == 'false') {       //means there should not be any validation
        result = true;
    }

    if (gvwHasRows(GvwQualificationID) === false) {
        result = false;
    }
    else {
        result = true;
    }
    return result;
}

function IsLanguageValid() {
    var gvwLanguageSkillListID, hidLanguagesTab, result = false;
    gvwLanguageSkillListID = document.getElementById('ctl00_ContentPlaceHolder1_gvwLanguageSkillList').id;
    hidLanguagesTab = document.getElementById('ctl00_ContentPlaceHolder1_hidLanguagesTab');    
    if (hidLanguagesTab.value.toLowerCase() == 'false')
        return true;

    if (gvwHasRows(gvwLanguageSkillListID) == false) {
        result = false;
    }
    else {
        result = true;
    }
    return result;
}

function PerformAddRowCourses() {
    var msg = "", ddlInstitute, txtCourseName, txtCategory, txtType, txtCourseAddress, txtMajorSubject, txtDateOfcompletion, txtDurationInHourse;

    ddlInstitute = document.getElementById('ctl00_ContentPlaceHolder1_ddlInstitute');
    txtCourseName = document.getElementById('ctl00_ContentPlaceHolder1_txtCourseName');
    txtCategory = document.getElementById('ctl00_ContentPlaceHolder1_txtCategory');
    txtType = document.getElementById('ctl00_ContentPlaceHolder1_txtType');
    txtCourseAddress = document.getElementById('ctl00_ContentPlaceHolder1_txtAddress');
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
        addSNo6();
    }
    else {
        //msg = "Please fill follwing values \n " + msg;
        alert(msg);
    }
}

function addSNo6() {

    var txtSNo = document.getElementById('ctl00_ContentPlaceHolder1_txtSnoCourses');
                                          //ctl00_ContentPlaceHolder1_txtSnoCourses
    var hidSNo = document.getElementById('ctl00_ContentPlaceHolder1_hidSnoCourses');
    var hidmaxSno = 1;
    var rows = document.getElementById('ctl00_ContentPlaceHolder1_gvwCoursesList').rows;


    for (i = 1; i < rows.length; i++) {
        var CellsCount = rows[i].cells.length - 2;
        var hidhrSNo = rows[i].cells[9].childNodes[0].data;
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

function checkPictureFileSize(sender, args) {
    var hidPictureFileSizeLimit, maxFileSize, fileUpload;

    fileUpload = jQuery('#ctl00_ContentPlaceHolder1_fuUpload');
    hidPictureFileSizeLimit = jQuery('#ctl00_ContentPlaceHolder1_hidPictureFileSizeLimit');
    maxFileSize = parseInt(hidPictureFileSizeLimit.val());

    if (maxFileSize === 0) {
        args.IsValid = true;
        return;
    }

    if (fileUpload.val() == '') {
        args.IsValid = false;
    }
    else {
        if (fileUpload[0].files[0].size < maxFileSize) {
            args.IsValid = true;
        } else {
            args.IsValid = false;
        }
    }
}

function checkCVFileSize(sender, args) {
    var hidCVFileSizeLimit, maxFileSize, fileUpload;

    fileUpload = jQuery('#ctl00_ContentPlaceHolder1_fcUploadResume');        
    hidCVFileSizeLimit = jQuery('#ctl00_ContentPlaceHolder1_hidCVFileSizeLimit');
    maxFileSize = parseInt(hidCVFileSizeLimit.val());

    if (maxFileSize === 0) {
        args.IsValid = true;
        return;
    }

    if (fileUpload.val() == '') {
        args.IsValid = false;
    }
    else {
        if (fileUpload[0].files[0].size < maxFileSize) {
            args.IsValid = true;
        } else {
            args.IsValid = false;
        }
    }
}