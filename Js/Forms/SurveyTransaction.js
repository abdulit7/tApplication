
var interval = null;
var currentStep = 0;
var isStartTest = false;
var FType;

$(function () {
    //var FType;
    FType = getParameterByName("FType");
    FType = isNull(FType) ? "" : FType;

    if (FType.toLowerCase() === "onlinetest") {
        disableNextButton();
    }
});

function applyWizard() {
    $ = jQuery.noConflict();
    $('#ucWizard').smartWizard({
        transitionEffect: 'slide',
        IsBackwardEnabled: false,
        onLeaveStep: onLeaveStepCallback,
        onShowStep: onShowStep
    });
    currentStep = 1;

}

function onShowStep() {
    disablePreviousButton();
}

function onLeaveStepCallback(e, obj) {
    var stepNo, fromStep, toStep, NoOfQuestionGroups, isNext, isPrevious, isReset, lblTimeLimit, timeLeft, isProceed,
        isFirstStep;

    fromStep = obj.fromStep;
    toStep = obj.toStep;
    isFirstStep = fromStep === 1;

    //if form is opened in survey mode
    if (FType.toLowerCase() === "survey") { return true; }

    //if first step and online test and isStartTest = false
    if (isFirstStep && FType.toLowerCase() === "onlinetest" && !isStartTest) {
        return false;
    }
    stepNo = e.attr('rel');
    isReset = currentStep < toStep;     //if user is moving forward
    lblTimeLimit = document.getElementById('ctl00_ContentPlaceHolder1_lblTimeLimit');
    timeLeft = lblTimeLimit.innerHTML;
    isProceed = true;

    //IsReset , which means if user is leaving an open section, then system should confirm, otherwise system should not
    if (isReset && (timeLeft !== "00:00" || timeLeft !== "0:0")) {
        if (isFirstStep) {
            //isProceed = confirm("Are you sure you want to Start the test ?");
        }
        else {
            isProceed = confirm("You cannot resume if you leave this section, are you sure you want to leave ?");
        }
    }

    //if reset should happen and if user wants to proceed, otherwise it should not
    if (isReset && isProceed) {
        currentStep = parseInt(stepNo) + 1;
        resetTimer(toStep, isReset);
        if (!isFirstStep) { disableControls(stepNo); }
    }

    return isProceed;
}

function disablePreviousButton() {
    $ = jQuery.noConflict();
    $('.buttonPrevious').addClass('buttonDisabled');
}

function disableNextButton() {
    $ = jQuery.noConflict();
    $('.buttonNext').addClass('buttonDisabled');
}
function enableNextButton() {
    $ = jQuery.noConflict();
    $('.buttonNext').removeClass('buttonDisabled');
}

function resetTimer(pStepNo, isResetTimer) {
    var time, hidQGTL, obj;

    hidQGTL = document.getElementById('ctl00_ContentPlaceHolder1_hidQGTL');
    obj = JSON.parse(hidQGTL.value);
    time = obj[pStepNo];

    if (isResetTimer) {
        if (interval !== null) {
            clearInterval(interval);
        }
        interval = initTestTimeLimt(time);
    }
}

function disableControls(pCurrentStep) {
    var gvwList, rows;
    //console.log('disableControls pCurrentStep : ', pCurrentStep);
    if (pCurrentStep === 0) { return; }

    //ids of tables are rendered with stepNo i.e, gvwList1,gwvList2,gvwList3
    gvwList = $('#gvwList' + pCurrentStep);
    rows = gvwList.find('tr');

    rows.map(function (index, item) {
        $(item).find('textarea').map(function (cIndex, cItem) {
            $(cItem).attr('disabled', 'disabled')
        });

        $(item).find('select').map(function (cIndex, cItem) {
            $(cItem).attr('disabled', 'disabled')
        });
    });

}

function initTestTimeLimt(timeLimit) {
    var totalSeconds; var mins; var seconds; var lblTimeLimit; var interval;

    timeLimit = typeof timeLimit === 'undefined' || timeLimit === null || isNaN(timeLimit) ? 0 : timeLimit;
    lblTimeLimit = document.getElementById('ctl00_ContentPlaceHolder1_lblTimeLimit');
    totalSeconds = timeLimit * 60;
    lblTimeLimit.innerHTML = timeLimit.toString() + ":00";

    interval = setInterval(function () {
        totalSeconds -= 1;
        if (totalSeconds > -1) {
            mins = Math.floor(totalSeconds / 60);
            seconds = totalSeconds - (mins * 60);
            mins = mins < 10 ? "0" + mins.toString() : mins.toString();
            seconds = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
            lblTimeLimit.innerHTML = mins + ":" + seconds;
        } else {

            //stop the test or go to next section if available.
            clearInterval(interval);
            lblTimeLimit.style.backgroundColor = "red";
            disableControls(currentStep);
        }
    }, 1000);
    return interval;
}

function applyWizardGeneral() {
    $ = jQuery.noConflict();
    $('#ucWizard').smartWizard({
        transitionEffect: 'slide',
    });
    currentStep = 1;
    //console.log('applied wizard',onLeaveStep);
}

function startTest(e) {

    var type, url, data, contentType, dataType, processdata, resumeID, resumeRefNo, companyID, employeeID, userID, processID, trainingID, sender;

    if(isStartTest){return;}
    if (!confirm("Are you sure you want to Start the test ?")) { return; }

    //sender= $('#' + e.target.id);
    $ = jQuery.noConflict();
    resumeID = $('#ctl00_ContentPlaceHolder1_hidResumeID').val();
    trainingID = $('#ctl00_ContentPlaceHolder1_hidTrainingID').val();

    if (parseInt(resumeID) > 0) {
        startTest_recruitment(e, resumeID);
    }
    else if (parseInt(trainingID) > 0) {
        startTest_training(e, trainingID);
    }
}

function startTest_recruitment(e, resumeID) {

    var type, url, data, contentType, dataType, processdata, resumeRefNo, companyID, employeeID, userID, processID, sender;

    sender = $('#' + e.target.id);
    // resumeID = $('#ctl00_ContentPlaceHolder1_hidResumeID').val();
    // trainingID = $('#ctl00_ContentPlaceHolder1_hidTrainingID').val();

    resumeRefNo = $('#ctl00_ContentPlaceHolder1_hidResumeRefNo').val();
    companyID = $('#ctl00_ContentPlaceHolder1_hidCompanyID').val();
    employeeID = $('#ctl00_ContentPlaceHolder1_hidEmployeeID').val();
    userID = $('#ctl00_ContentPlaceHolder1_hidUserID').val();
    processID = $('#ctl00_ContentPlaceHolder1_hidProcessID').val();

    type = "POST";
    url = "SurveyTransaction.aspx/InitiateRectruitmentTest";
    data = {
        pResumeID: resumeID,
        pResumeRefNo: resumeRefNo,
        pCompanyID: companyID,
        pEmployeeID: employeeID,
        pProcessID: processID,
        pUserID: userID
    }
    data = JSON.stringify(data);

    contentType = "application/json;charset=utf-8";
    datatype = "json";
    processdata = true;

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        datatype: datatype,
        processdata: processdata,
        success: function (res) {
            if (res.d === 'true') {
                sender.prop('disabled',true);
                sender.css('background','#999');
                isStartTest = true;
                enableNextButton();
                $('#buttonNext').click();
                $('#ctl00_ContentPlaceHolder1_btnSave').css("display", "");
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function startTest_training(e, trainingID) {
    var type, url, data, contentType, dataType, processdata, templateID, testType, companyID, employeeID;

    templateID = $('#ctl00_ContentPlaceHolder1_hidQuestionTemplateID').val();
    companyID = $('#ctl00_ContentPlaceHolder1_hidCompanyID').val();
    employeeID = $('#ctl00_ContentPlaceHolder1_hidEmployeeID').val();
    testType = $('#ctl00_ContentPlaceHolder1_hidTestType').val();

    type = "POST";
    url = "SurveyTransaction.aspx/InitiateTrainingTest";
    data = {
        pTemplateID: templateID,
        pTrainingID: trainingID,
        pTestType: testType,
        pEmployeeID: employeeID,
        pCompanyID: companyID
    }
    data = JSON.stringify(data);

    contentType = "application/json;charset=utf-8";
    datatype = "json";
    processdata = true;

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        datatype: datatype,
        processdata: processdata,
        success: function (res) {
            var TranID = res.d;
            $('#ctl00_ContentPlaceHolder1_hidTranID').val(TranID);
            isStartTest = true;
            enableNextButton();
            $('#buttonNext').click();
            $('#ctl00_ContentPlaceHolder1_btnSave').css("display", "");

        },
        error: function (err) {
            console.log(err);
        }
    });
}