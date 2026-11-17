
'use strict';
var moduleName = getParameterByName('modulename');
var _email = getLocalStorageItem_String('email');
var txtEmail = $('#txtEmail');
$(function () {
    txtEmail.val(_email);
    if (moduleName) {
        $('#txtFeedback').val('We want to activate "' + moduleName + '" Module/Feature.');
        $('#txtFeedback').css('font-size', '16px');
        $('#txtFeedback').css('padding', '10px');
    }
    $('#feedbackForm').on('submit', saveFeedback);

})

function saveFeedback(e) {

    var extraInfowithFeedback = getLocalStorageItem_String('pincode') + '^' + getLocalStorageItem_String('ecode') + '^' + getLocalStorageItem_String('ename') + '^';

    EnableDisableButtonSpin($('#btnSend'), 'd', 'Sending ');

    var type, url, data, contentType, dataType, processdata,
        txtFeedback, fSecKey, email, aKey, feedback;

    e.preventDefault();

    type = "POST";
    url = "http://ttappactivation.efrotech.com/"; //http://localhost:3560/TimeTraxWeb/wsttactivate.asmx;
    url += "wsttactivate.asmx/ttAppSaveReview";
    txtFeedback = $('#txtFeedback');
    email = txtEmail.val();
    feedback = txtFeedback.val();
    aKey = getLocalStorageItem_String('AKey');

    data = {
        pFSecKey: '+Imw91aCSvXvCq9RdpwYjw==',
        pEmail: email,
        pAKey: aKey,
        pReviewText: extraInfowithFeedback + feedback,
    };
    data = JSON.stringify(data);
    contentType = "application/json; charset=utf-8";
    dataType = "json";
    processdata = true;
    $.ajax({
        type: type,
        url: url, // Location of the service
        data: data, //Data sent to server
        contentType: contentType, // content type sent to server
        dataType: dataType, //Expected data format from server
        processdata: processdata, //True or False
        success: function (result) {//On Successfull service call
            EnableDisableButtonSpin($('#btnSend'), 'e', 'Send');
            var obj = JSON.parse(result.d);
            obj = obj[Object.keys(obj)[0]];
            if (obj.Message) {
                toastr.success(obj.Message);
                //txtEmail.val('');
                txtFeedback.val('');
            }
        },
        error: function (err) {
            EnableDisableButtonSpin($('#btnSend'), 'e', 'Send');
            //toastr.error('Something went wrong!');
            toastr.error('Something went wrong!');
        } //OnWsError// When Service call fails
    });
}