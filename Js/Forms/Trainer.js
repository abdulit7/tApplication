function ddlTrainerType_Change(e) {
    var value;
    value = e.target.value;
    value = value;
    ManageVisibility(value);
    //    if (value === 'internal') {

    //    } 
    //    else { 
    //    
    //    }

}

function ManageVisibility(pTrainerType) {
    var trEmployee, trNoOfTrainingConducted, trEducation, trExperience, trWorkDetail, trPicture;
    var rfv_TrainerPicture, txtExperience, rfv_Education, rfv_NoOfTrainingsConducted, rfv_Employee;

    trEmployee = document.getElementById('trEmployee');
    trNoOfTrainingConducted = document.getElementById('trNoOfTrainingConducted');
    trEducation = document.getElementById('trEducation');
    trExperience = document.getElementById('trExperience');
    trWorkDetail = document.getElementById('trWorkDetail');
    trPicture = document.getElementById('trPicture');

    rfv_TrainerPicture = document.getElementById('ctl00_ContentPlaceHolder1_rfv_TrainerPicture');
    rfv_Experience = document.getElementById('ctl00_ContentPlaceHolder1_rfv_Experience');
    rfv_Education = document.getElementById('ctl00_ContentPlaceHolder1_rfv_Education');
    rfv_NoOfTrainingsConducted = document.getElementById('ctl00_ContentPlaceHolder1_rfv_NoOfTrainingsConducted');
    rfv_Employee = document.getElementById('ctl00_ContentPlaceHolder1_rfv_Employee');
    
    if (pTrainerType.trim().toLowerCase() === 'internal') {
        trEmployee.style.display = "";
        trNoOfTrainingConducted.style.display = "";
        trEducation.style.display = "none";
        trExperience.style.display = "none";
        trWorkDetail.style.display = "none";
        trPicture.style.display = "none";

        ValidatorEnable(rfv_Employee, true);
        ValidatorEnable(rfv_NoOfTrainingsConducted, true);
        ValidatorEnable(rfv_Experience, false);
        ValidatorEnable(rfv_Education, false);
        ValidatorEnable(rfv_TrainerPicture, false);
    }
    else {      //default is external
        trEmployee.style.display = "none";
        trNoOfTrainingConducted.style.display = "none";

        trEducation.style.display = "";
        trExperience.style.display = "";
        trWorkDetail.style.display = "";
        trPicture.style.display = "";

        ValidatorEnable(rfv_Employee, false);
        ValidatorEnable(rfv_NoOfTrainingsConducted, false);
        ValidatorEnable(rfv_Experience, true);
        ValidatorEnable(rfv_Education, true);
        ValidatorEnable(rfv_TrainerPicture, true);
    }
}

function CallUpload() {
    document.getElementById('ctl00_ContentPlaceHolder1_ImageUpload').click(); 
    return false;
}

function showpreview(input) {
    var imgUserPicture, imgpreview, reader;

    imgUserPicture = document.getElementById("ctl00_ContentPlaceHolder1_imgUserPicture");
    imgUserPicture.style.display = "none";
    imgpreview = document.getElementById("imgpreview");
    imgpreview.style.display = "block";

    if (input.files && input.files[0]) {
        reader = new FileReader();
        reader.onload = function(e) {
            $('#imgpreview').css('visibility', 'visible');
            $('#imgpreview').attr('src', e.target.result);
            IsImageUploaded = true;
        }
        reader.readAsDataURL(input.files[0]);
    }
}