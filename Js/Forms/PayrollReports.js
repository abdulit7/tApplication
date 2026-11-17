//console.log('called');

var PayrollReports = (function() {

    var mod = {
        confirmation: function(operation) {
            var ddlCriteria, result;

            ddlCriteria = document.getElementById('ctl00_ContentPlaceHolder1_SearchCriteria1_ddlCriteria');
            result = true;
            if (ddlCriteria.value.toLowerCase() !== 'employee') {
                result = window.confirm("Are you sure you want to continue " + operation + "?");
            }
            return result;
        },
        ddlEOSMonthBasedOn_Changed: function(ddlEOSMonthBasedOn_ID, ddlEmployeeID, hidCompanyID_ID) {
            var ddlEOSMonthBasedOn, ddlEmployee, hidCompanyID, url, data, result;
            ddlEOSMonthBasedOn = document.getElementById(ddlEOSMonthBasedOn_ID);
            ddlEmployee = document.getElementById(ddlEmployeeID);
            hidCompanyID = document.getElementById(hidCompanyID_ID);
            result = true;

            if (typeof $ === 'undefined' || $ === null) {
                $ = jQuery.noConflict();
            }

            if (ddlEOSMonthBasedOn.value.toLowerCase() === "leaving") {
                url = "PayrollReports.aspx/IsPayrollProcessedOfLeavingMonth"
                data = "{'pEmployeeID' : '" + ddlEmployee.value + "'}";
                $.ajax({
                    type: "POST",
                    url: url,
                    data: data,
                    dataType: "json",
                    contentType: "application/json;charset=utf=8",
                    async: false,
                    success: function(res) {
                        if (res.d === true) {
                            result = confirm("Payroll has been processed for EOS month, are you sure you want to proceed ?");
                        }
                        else {
                            result = true;
                        }
                    }
                });
            }
            return result;
        }
    };

    return {
        confirmation: mod.confirmation,
        ddlEOSMonthBasedOn_Changed: mod.ddlEOSMonthBasedOn_Changed
    }
}());




function showEOSPendingCheque() {
    window.showModalDialog('EOSChequesDetailSave.aspx', window, 'dialogHeight:650px;dialogWidth:90%;center:yes;help:no;resizable:no;status:no');
}