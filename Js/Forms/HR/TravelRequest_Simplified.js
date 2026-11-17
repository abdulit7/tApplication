
var _prm = Sys.WebForms.PageRequestManager.getInstance();

jQuery(document).ready(changeName);

_prm.add_endRequest(changeName);


function changeName() {

    var txtPassenger, txtFatherName, ddlRelation, ddlBirthDay, ddlBirthMonth, ddlBirthYear, ddlGender, txtCNIC,
        ddlCNICExpiryDay, ddlCNICExpiryMonth, ddlCNICExpiryYear, txtPassport, ddlPassportExpiryDay, ddlPassportExpiryMonth,
        ddlPassportExpiryYear, hidSNo5, ddlEmployee, hidCompanyID, hidIsTicketApprovalMode, ddlPassport, hidTravelID, ddlScope;    
    var obj, passengerDetail, birthDate, cnicExpiryDate, passportExpiryDate,passports,scopeText;
        
    ddlEmployee = document.getElementById(getClientID('ddlEmployee'));
    hidCompanyID = document.getElementById(getClientID('hidCompanyID'));    
    hidIsTicketApprovalMode = document.getElementById(getClientID('hidIsTicketApprovalMode'));    
    hidTravelID = document.getElementById(getClientID('hidTravelID'));    

    txtPassenger = document.getElementById(getGridControlClientID('txtPassenger', 'gvwEmployeeTravel', 2));
    txtFatherName = document.getElementById(getGridControlClientID('txtFatherName', 'gvwEmployeeTravel', 2));
    ddlRelation = document.getElementById(getGridControlClientID('ddlRelation', 'gvwEmployeeTravel', 2));
    ddlBirthDay = document.getElementById(getGridControlClientID('ddlBirthDay', 'gvwEmployeeTravel', 2));
    ddlBirthMonth = document.getElementById(getGridControlClientID('ddlBirthMonth', 'gvwEmployeeTravel', 2));
    ddlBirthYear = document.getElementById(getGridControlClientID('ddlBirthYear', 'gvwEmployeeTravel', 2));
    ddlGender = document.getElementById(getGridControlClientID('ddlGender', 'gvwEmployeeTravel', 2));
    txtCNIC = document.getElementById(getGridControlClientID('txtCNIC', 'gvwEmployeeTravel', 2));
    ddlCNICExpiryDay = document.getElementById(getGridControlClientID('ddlCNICExpiryDay', 'gvwEmployeeTravel', 2));
    ddlCNICExpiryMonth = document.getElementById(getGridControlClientID('ddlCNICExpiryMonth', 'gvwEmployeeTravel', 2));
    ddlCNICExpiryYear = document.getElementById(getGridControlClientID('ddlCNICExpiryYear', 'gvwEmployeeTravel', 2));
    //txtPassport = document.getElementById(getGridControlClientID('txtPassport', 'gvwEmployeeTravel', 2));
    ddlPassport = document.getElementById(getGridControlClientID('ddlPassport', 'gvwEmployeeTravel', 2));
    ddlPassportExpiryDay = document.getElementById(getGridControlClientID('ddlPassportExpiryDay', 'gvwEmployeeTravel', 2));
    ddlPassportExpiryMonth = document.getElementById(getGridControlClientID('ddlPassportExpiryMonth', 'gvwEmployeeTravel', 2));
    ddlPassportExpiryYear = document.getElementById(getGridControlClientID('ddlPassportExpiryYear', 'gvwEmployeeTravel', 2));
    hidSNo5 = document.getElementById(getGridControlClientID('hidSNo5', 'gvwEmployeeTravel', 2));

    var url, params;

    url = "TravelRequest_Simplified.aspx/GetPassengerDetail";

    params = {
        pTravelID : hidTravelID.value,
        pIsTicketApprovalMode: hidIsTicketApprovalMode.value.toLowerCase() === 'true',
        pEmployeeID: parseInt(ddlEmployee.value),
        pCompanyID : parseInt(hidCompanyID.value)
    };

    params = JSON.stringify(params);

    postRequest(url, params, function (res) {

        obj = JSON.parse(res.d);

        //console.log("debug : ", obj);

        if (Object.keys(obj).length === 0)
            return;

        passengerDetail = obj["dtPassengerDetail"];
        //console.log("passengerDetail : ", passengerDetail);

        passports = obj["dtPassport"];
        
        //console.log("passports : ", passports);

        passengerDetail = passengerDetail[0];

        birthDate = getDateByASPNETTimeStamp(passengerDetail["BirthDate"]);
        cnicExpiryDate = getDateByASPNETTimeStamp(passengerDetail["CNICExpiryDate"]);
        passportExpiryDate = getDateByASPNETTimeStamp(passengerDetail["PassportExpiryDate"]);
        
        txtPassenger.value = passengerDetail["DependentName"];
        txtFatherName.value = passengerDetail["FatherName"];
        ddlRelation.value = passengerDetail["Relation"] !== "" ? passengerDetail["Relation"] : "MySelf";
        ddlBirthDay.value = birthDate.getDate();
        ddlBirthMonth.value = birthDate.getMonth() + 1;
        ddlBirthYear.value = birthDate.getFullYear().toString();
        ddlGender.value = passengerDetail["Gender"];
        
        txtCNIC.value = passengerDetail["CNICNo"] ? passengerDetail["CNICNo"] : passengerDetail["CNICNO"];

        ddlCNICExpiryDay.value = cnicExpiryDate.getDate();
        ddlCNICExpiryMonth.value = cnicExpiryDate.getMonth() + 1;
        ddlCNICExpiryYear.value = cnicExpiryDate.getFullYear().toString();
        //txtPassport.value = passengerDetail["PassportNo"];
        ddlPassportExpiryDay.value = passportExpiryDate.getDate();
        ddlPassportExpiryMonth.value = passportExpiryDate.getMonth() + 1;
        ddlPassportExpiryYear.value = passportExpiryDate.getFullYear().toString();;
        hidSNo5.value = passengerDetail["TranID"];

        ddlPassport = jQuery(ddlPassport);
        ddlScope = jQuery("#" + getClientID('ddlScope'));
        scopeText = ddlScope.children('option:selected').text();

        //console.log({scopeText});

        if (scopeText.toLowerCase() === 'international') {
            if (passports.length > 0)
                ddlPassport.html('');

            jQuery.each(passports, function (i, val) {
                val = val["DocumentNo"];
                ddlPassport.append(jQuery('<option></option>').text(val).val(val));
            });

            //console.log('PassportNo : ', passengerDetail["PassportNo"].toString());
            if (passengerDetail["PassportNo"])
                ddlPassport.val(passengerDetail["PassportNo"].toString());
        }
        else {
            ddlPassport.html('');
            ddlPassport.append(jQuery('<option></option>').text("None").val("0"));
        }
        //console.log('test 102');
        
    });
}