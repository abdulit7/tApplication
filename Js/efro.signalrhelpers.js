function Progess(progressPercent, itemsCompleted, totalItems, dbOperation, isShow, isStart, pMessage, isCompleted, additionalParams) {

    var progressModal, headProgressTitle, paraProgressStatus, divProgress, btnCloseModal, message;
    var headingText, operationText;
    var lblStartTime, lblEndTime;

    headingText = "Operation Progress";
    operationText = "done";

    progressModal = $('#progressModal');
    headProgressTitle = $('#headProgressTitle');
    paraProgressStatus = $('#paraProgressStatus');
    divProgress = $('#divProgress');
    btnCloseModal = $('#btnCloseModal');
    lblStartTime = $('#lblStartTime');
    lblEndTime = $('#lblEndTime');

    if (dbOperation.toString().toLowerCase() === "emailpayslip") {
        headingText = "Payslip Email Progress";
        operationText = "payslip(s) emailed";
    }
    else if (dbOperation.toString().toLowerCase() === "createpayslip") {
        headingText = "Payslip Creation Progress";
        operationText = "paysilp(s) created";
    }

    //change heading text
    headProgressTitle.text(headingText);

    //change para text
    message = itemsCompleted.toString() + " of " + totalItems.toString() + " " + operationText + " succesfully.";
    if (typeof pMessage !== 'undefined' && pMessage !== null) {
        message += pMessage;
    }
    //paraProgressStatus.text(message);
    paraProgressStatus.html(message);

    //initiate progress bar to 0%
    divProgress.prop("aria-valuenow", progressPercent.toString());
    divProgress.css("width", progressPercent + "%");


    //show the modal
    progressModal.modal({
        isShow: (isShow ? 'show' : 'hide'),
        backdrop: 'static',
        keyboard: false
    });

    //console.log({isCompleted});

    if (itemsCompleted === totalItems || isCompleted === true) {
        btnCloseModal.css('display', 'inline');
        console.log(btnCloseModal.css('display'));
        endTime = new Date();

        lblStartTime.text('Process Start Date Time : ' + DTHelper.GetFormattedDate(startTime, "dd/mm/yyyy") + ' ' + DTHelper.GetFormattedTime(startTime, "hh:mm:ss"));
        lblEndTime.text('Process End Date Time : ' + DTHelper.GetFormattedDate(endTime, "dd/mm/yyyy") + ' ' + DTHelper.GetFormattedTime(endTime, "hh:mm:ss"));
        
        additionalParams = JSON.parse(additionalParams);
        if (OnCompletion) {
            OnCompletion(additionalParams);
        }
        
    }

    if (isStart === true) {
        btnCloseModal.css('display', 'none');
        lblStartTime.text('');
        lblEndTime.text('');
    }
}

function error_Modal(pError) {
    var paraProgressStatus, headingText, operationText;

    paraProgressStatus = $('#paraProgressStatus');

    //change para text
    paraProgressStatus.html("Oops, something went wrong, " + pError + "<br />" + paraProgressStatus.text());
}

//Register SignalR events
function registerClientMethods(hub) {
    var progressBar;

    hub.client.addProgress = function (totalItems, itemsCompleted, percentage, operation, msg, isCompleted,additionalParams) {
        Progess(percentage, itemsCompleted, totalItems, operation.toLowerCase(), true, false, msg, isCompleted, additionalParams);
    }

    hub.client.handleError_Modal = function (error) {
        error_Modal(error);
    }
}