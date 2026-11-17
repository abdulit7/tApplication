
function btnPaid_Click(senderID, pEmployeeID, pYear, pMonth, pCompanyID) {
    var data, sender, btnPayAndPrint, btnPrint, lblInfo, hidTotalSalaryAmount, img;

    if (confirm("Are you sure you want to Save ?") == false) { return; }

    sender = $('#' + senderID);
    btnPayAndPrint = $('#ctl00_ContentPlaceHolder1_btnPayAndPrint');
    btnPrint = $('#ctl00_ContentPlaceHolder1_btnPrint')
    lblInfo = $('#ctl00_ContentPlaceHolder1_lblInfo');
    img = $('#ctl00_ContentPlaceHolder1_imgProgress');
    hidTotalSalaryAmount = $('#ctl00_ContentPlaceHolder1_hidTotalSalaryAmount');

    updateDisbursement(sender, btnPayAndPrint, btnPrint, lblInfo, false, hidTotalSalaryAmount.val(), pEmployeeID, pYear, pMonth, pCompanyID);
}


function btnPayAndPrint_Click(senderID, pEmployeeID, pYear, pMonth, pCompanyID) {
    var data, btnPay, btnPayAndPrint, btnPrint, hidTotalSalaryAmount, lblInfo, img;

    if (confirm("Are you sure you want to Save ?") == false) { return; }

    //btnPayAndPrint = $('#' + e.target.id);
    btnPayAndPrint = $('#' + senderID);
    btnPay = $('#ctl00_ContentPlaceHolder1_btnPay');
    btnPrint = $('#ctl00_ContentPlaceHolder1_btnPrint')
    lblInfo = $('#ctl00_ContentPlaceHolder1_lblInfo');
    //img = $('#ctl00_ContentPlaceHolder1_imgProgress');
    hidTotalSalaryAmount = $('#ctl00_ContentPlaceHolder1_hidTotalSalaryAmount');

    updateDisbursement(btnPay, btnPayAndPrint, btnPrint, lblInfo, true, hidTotalSalaryAmount.val(), pEmployeeID, pYear, pMonth, pCompanyID);
}

function btnPrint_Click() {
    printdiv('ctl00_ContentPlaceHolder1_pnlData');
}

function updateDisbursement(btnPay, btnPayAndPrint, btnPrint, lblInfo, isPrint, pDisburseAmount, pEmployeeID, pYear, pMonth, pCompanyID) {
    var data;
    data = {        
        pEmployeeID: pEmployeeID,
        pYear: pYear,
        pMonth: pMonth,        
        pDisburseAmount : pDisburseAmount,
        pCompanyID: pCompanyID        
    };
    data = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url: "ViewPayslipDialog.aspx/UpdateDisBursement",
        data: data,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function(res) {
            var data = res.d;

            if (data === 'true') {
                btnPay.hide();
                btnPayAndPrint.hide();
                lblInfo.show();
                lblInfo.text("Paid");
                btnPrint.show();

                if (isPrint === true) {
                    printdiv('ctl00_ContentPlaceHolder1_pnlData');
                }
            }
        },
        error: function(response) {
            //OnWsError(response, btnPaid, ImgProgess); // When Service call fails
        }
    });
}

function btnVerify_Click(senderID, pEmployeeID, pYear, pMonth, pCompanyID) {
    var data, sender, btnPayAndPrint, btnPrint, lblInfo, hidTotalSalaryAmount, img;

    if (confirm("Are you sure you want to verify ?") == false) { return; }

    sender = $('#' + senderID);
    btnPayAndPrint = $('#ctl00_ContentPlaceHolder1_btnPayAndPrint');
    btnPrint = $('#ctl00_ContentPlaceHolder1_btnPrint')
    lblInfo = $('#ctl00_ContentPlaceHolder1_lblInfo');
    img = $('#ctl00_ContentPlaceHolder1_imgProgress');
    hidTotalSalaryAmount = $('#ctl00_ContentPlaceHolder1_hidTotalSalaryAmount');

    
    var data;
    data = {
        pEmployeeID: pEmployeeID,
        pYear: pYear,
        pMonth: pMonth,        
        pCompanyID: pCompanyID
    };
    data = JSON.stringify(data);

    var btnVerify = jQuery('#ctl00_ContentPlaceHolder1_btnVerify');
    btnVerify.val("verifying ...");

    $.ajax({
        type: "POST",
        url: "ViewPayslipDialog.aspx/VerifyPayroll",
        data: data,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (res) {

            btnVerify.val("Verify");

            var data = res.d;
            var isSuccess = data.split('|')[0];
            var message = data.split('|')[1];

            if (isSuccess.toLowerCase() == 'true') {
                btnVerify.val("Verified");
                btnVerify.attr('disabled',true);
                alert(message);
            } else if (isSuccess.toLowerCase() == 'false') {
                btnVerify.val("Verify");
                alert(message);
            } else {
                alert('Unknown errror!');
            }
        },
        error: function (response) {
            //OnWsError(response, btnPaid, ImgProgess); // When Service call fails
        }
    });

}