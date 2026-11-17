
function fillExpenseType() {
    var EmployeeID, CompanyID, ExpenseDate, params;
       
    EmployeeID = jQuery('#ctl00_ContentPlaceHolder1_hidSelectedEmployeeID').val();
    ExpenseDate = jQuery('#' + getClientID('txtExpenseDate')).val();
    CompanyID = jQuery('#ctl00_ContentPlaceHolder1_hidCompanyID').val();

    params = {
        pEmployeeID: EmployeeID,
        pExpenseDate: ExpenseDate,
        pCompanyID: CompanyID
    };
    params = JSON.stringify(params);

    jQuery.ajax({
        url: "ExpenseRequest.aspx/GetExpenseTypes",
        type: "POST",
        data: params,
        contentType: "application/json;chartset=utf-8",
        dataType: "json",
        success: fillExpenseType_Success,
        error: function (err) {
            //console.log(err);
            //alert(err.responseJSON.Message);
            alert("Error while making call to the server");
        }
    })
}

function fillExpenseType_Success(res) {
    var data, $ddlExpenseType;
    data = JSON.parse(res.d);
    $ddlExpenseType = jQuery('#ctl00_ContentPlaceHolder1_ddlExpenseTypeID');
    $ddlExpenseType.html('');
    $ddlExpenseType.append(jQuery('<option />').val(0).text('- Select -'));
    jQuery.each(data, function (index) {
        var item = data[index];
        $ddlExpenseType.append(jQuery('<option />').val(this.AllowanceID).text(this.AllowanceTitle));
    });
}

function EmployeeChanged(s, e) {
    var value, hidSelectedEmployeeID;
    //console.log('EmployeeChanged');
    value = s.GetSelectedItem().value;
    hidSelectedEmployeeID = document.getElementById('ctl00_ContentPlaceHolder1_hidSelectedEmployeeID');
    hidSelectedEmployeeID.value = value;

    //console.log('triggered');
    //SetEmployeeDetail(value);    
}

function SetEmployeeDetail(EmployeeID) {
    var hidWSPath, url, EmployeeID, CompanyID, ClaimDate, params;
    
    hidWSPath = jQuery('#ctl00_ContentPlaceHolder1_hidWSPath');    
    CompanyID = jQuery('#ctl00_ContentPlaceHolder1_hidCompanyID').val();

    params = {
        PID1: EmployeeID.toString(),
        PID2: CompanyID
    };

    params = JSON.stringify(params);
    url = hidWSPath.val() + '/GetEmployeeDetailInString'
    //console.log('going for ajax request 2');
    jQuery.ajax({
        url: url,
        type: "POST",
        data: params,
        contentType: "application/json;chartset=utf-8",
        dataType: "json",
        success: function (res) {
            var hidEmployeeDetail = document.getElementById('ctl00_ContentPlaceHolder1_hidEmployeeDetail');
            hidEmployeeDetail.value = res.d;
            funcSetValue(hidEmployeeDetail);
            SetHierarchyApprover('ctl00_ContentPlaceHolder1_btnSetApprover');
        },
        error: function (err) {
            console.log(err);
        }
    })
}