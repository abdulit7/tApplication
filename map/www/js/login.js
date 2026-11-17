
var varUrl, deviceID, deviceOS, deviceVersion;
var env = "d";

function setDefaultURL() {
    var url, pincode;
    url = getLocalStorageItem_String('baseurl');
    pincode = getLocalStorageItem_String('pincode');
    url = url.trim() === "" ? varBaseUrl : url;

    if (isAppActivated() === true) {
        $('#divFullName').css('display', 'none');
        $('#txtFullName').prop('required', false);
        $('#divEmail').css('display', 'none');
        $('#txtEmail').prop('required', false);
    }

    $('#txtServicePath').val(url);
    $('#txtPin').val(pincode);
}

function isAppActivated() {
    if (window.localStorage) {
        var isregister = localStorage.getItem('isregister');
        if (isregister != "undefined" && isregister != null) {
            if (isregister == 'Y') {
                return true;
            }
        }
    }
    return false;
}

function checkLogin() {
    try {
        if (window.localStorage != null) {
            //alert("local storage is enable");

            var isLogedin = localStorage.getItem('logedin');

            if (isLogedin != "undefined" && isLogedin != null) {

                if (isLogedin == 'Y') {
                    document.location.href = "main.html";
                }

            }
            else {
                //alert("local store not found");
            }
        }

    } catch (e) {

        $('#diverror').innerHTML = '<p>Incompatible Device</p>';
        $('#btnLogin').hide();
    }
}

//overload of $(document).ready()
$(function () {

    checkLogin();
    setDefaultURL();
    $('#loginForm').on('submit', handleSubmit);
});

function handleSubmit(e) {
    e.preventDefault();
    EnableDisableButtonSpin($('#btnLogin'), 'd', '')
    var $btnLogin;
    $btnLogin = $('#btnLogin');
    DisableButton($btnLogin);

    //TODO : Rollback for production mode    
    if (env == "p") {
        if (device != null) {
            deviceID = device.uuid;
            deviceOS = device.platform;
            deviceVersion = device.version;
        } else {
            deviceID = "1";
            deviceOS = "Windows";
            deviceVersion = "7";
        }

    } else {
        deviceID = "1";
        deviceOS = "Windows";
        deviceVersion = "7";
    }

    if (isAppActivated() === false) {
        processActivation($btnLogin);
    }
    else {
        processLogin($btnLogin);
    }
    //EnableDisableButtonSpin($('#btnLogin'),'e','Login')

}

function processLogin($btnLogin) {
    var varBaseUrl1 = $('#txtServicePath').val();
    if (varBaseUrl1.substr(-1) !== "/") {
        varBaseUrl1 = varBaseUrl1 + "/";
    }
    var isLogedin = localStorage.getItem('logedin');
    if (isLogedin != "undefined" && isLogedin != null) {
        if (isLogedin == 'Y') {
            document.location.href = "main.html";
        }
    }
    else {
        var pincode = $('#txtPin').val();
        var varData = {
            pCompanyPin: pincode,
            pUserName: $('#txtUserID').val(),
            pPassword: $('#txtPassword').val(),
            pCallType: 'json',
            pDeviceID: deviceID
        }
        postRequest2(varBaseUrl1 + 'wsttmapp.asmx/GetUserAuthentificationJson_New', varData, function (r) {
            atterLoginCallSuccess(r, $btnLogin, varBaseUrl1, pincode);
        }, function (err) {

            var varData2 = {
                pCompanyPin: pincode,
                pUserName: $('#txtUserID').val(),
                pPassword: $('#txtPassword').val(),
                pCallType: 'json'
                //pDeviceID: getLocalStorageItem_String('DeviceID')
            }

            postRequest2(varBaseUrl1 + 'wsttmapp.asmx/GetUserAuthentificationJson', varData2, function (res) {
                atterLoginCallSuccess(res, $btnLogin, varBaseUrl1, pincode);
            }, function (r) {
                alert('Something is wrong! Please try again.');
                EnableDisableButtonSpin($('#btnLogin'), 'e', 'Login')
            });
        })
    }
}


function atterLoginCallSuccess(r, $btnLogin, varBaseUrl1, pincode) {
    var json = JSON.parse(r.d);
    if (r.d != "-1") {
        jQuery.each(json, function (rec) {
            //console.log({ rec });
            localStorage.setItem('logedin', 'Y');
            localStorage.setItem('secKey', this.SecKey);
            localStorage.setItem('eid', this.EmployeeID);
            localStorage.setItem('ename', this.EmployeeName);
            localStorage.setItem('ecode', this.EmployeeCode);
            localStorage.setItem('cid', this.CompanyID);
            localStorage.setItem('uid', this.UserID);
            localStorage.setItem('lid', this.LanguageID);
            localStorage.setItem('gid', this.GradeID);
            localStorage.setItem('dateformat', this.PreferredDateFormat);
            localStorage.setItem('baseurl', varBaseUrl1);
            localStorage.setItem('pincode', pincode);
            localStorage.setItem('timeformat', 'hh:mm:ss');
            localStorage.setItem('isAdmin', this.IsAdmin ? 1 : 0);
            localStorage.setItem('DeviceID', deviceID);
            if (this.TerritoryID){
                localStorage.setItem('territoryid', this.TerritoryID);
            }
            
        });

        GetUpdatedMenuToLocalStorage();

        //commented temp
        document.location.href = "main.html";
        EnableButton($btnLogin, 'Login');
    } else {
        alert('Invalid Credentials or Invalid User!');
        EnableButton($btnLogin, 'Login');
    }
}

// function processLogin0($btnLogin) {
//     var isLogedin = localStorage.getItem('logedin');
//     if (isLogedin != "undefined" && isLogedin != null) {
//         if (isLogedin == 'Y') {
//             document.location.href = "main.html";
//         }
//     }
//     else {
//         var varType;
//         var varData;
//         var varContentType;
//         var varDataType;
//         var varProcessData;
//         var varBaseUrl1, pincode;
//         //$btnLogin = $('#btnLogin');
//         varBaseUrl1 = $('#txtServicePath').val();

//         if (varBaseUrl1.substr(-1) !== "/") {
//             varBaseUrl1 = varBaseUrl1 + "/";
//         }

//         varType = "POST";
//         varUrl = varBaseUrl1 + "wsttmapp.asmx/GetUserAuthentificationJson";
//         pincode = $('#txtPin').val();

//         varData = '{"pCompanyPin": "' + pincode + '" , "pUserName": "' + $('#txtUserID').val() + '" , "pPassword": "' + $('#txtPassword').val() + '" ,"pCallType" : "json"}';
//         // varData ={
//         //     pCompanyPin:  pincode,
//         //     pUserName:  $('#txtUserID').val(),
//         //     pPassword:  $('#txtPassword').val(),
//         //     pCallType : json};

//         varContentType = "application/json; charset=utf-8";
//         varDataType = "json";
//         varProcessData = true;

//         //$btnLogin.html('Logging In...');
//         //$btnLogin.prop('disabled', true);

//         $.ajax({
//             type: varType, //GET or POST or PUT or DELETE verb
//             url: varUrl, //Location of the service
//             data: varData, //Data sent to server
//             contentType: varContentType, //content type sent to server
//             dataType: varDataType, //Expected data format from server
//             processdata: varProcessData, //True or False
//             success: function (result) {//On Successfull service call

//                 var json = JSON.parse(result.d);
//                 if (result.d != "-1") {
//                     jQuery.each(json, function (rec) {
//                         localStorage.setItem('logedin', 'Y');
//                         localStorage.setItem('secKey', this.SecKey);
//                         localStorage.setItem('eid', this.EmployeeID);
//                         localStorage.setItem('ename', this.EmployeeName);
//                         localStorage.setItem('ecode', this.EmployeeCode);
//                         localStorage.setItem('cid', this.CompanyID);
//                         localStorage.setItem('uid', this.UserID);
//                         localStorage.setItem('lid', this.LanguageID);
//                         localStorage.setItem('gid', this.GradeID);
//                         localStorage.setItem('dateformat', this.PreferredDateFormat);

//                         localStorage.setItem('baseurl', varBaseUrl1);
//                         localStorage.setItem('pincode', pincode);
//                         localStorage.setItem('timeformat', 'hh:mm:ss');
//                     });

//                     GetUpdatedMenuToLocalStorage();

//                     //commented temp
//                     document.location.href = "main.html";
//                     EnableButton($btnLogin, 'Login');
//                 }
//                 else {
//                     alert('Invalid Credentials');
//                     //document.getElementById("diverror").innerHTML = "<p>Invalid Credentials</p>";                    
//                     // $btnLogin.html('Login');
//                     // $btnLogin.prop('disabled', false);
//                     EnableButton($btnLogin, 'Login');
//                 }
//             },
//             error: function (err) {
//                 OnWsError(err);
//                 EnableButton($btnLogin, 'Login');
//             }
//         });
//     }
// }

function processActivation($btnLogin) {
    //alert('test');
    //e.preventDefault();
    var varType;
    var varData;
    var varContentType;
    var varDataType;
    var varProcessData;
    var varBaseUrl1, fullName, email, pincode, username;
    //TODO : Rollback for production mode
    varBaseUrl1 = "http://ttappactivation.efrotech.com/"
    //varBaseUrl1 = "http://localhost:3580/TimeTraxWeb/"

    varType = "POST";
    varUrl = varBaseUrl1 + "wsttactivate.asmx/ttAppActivateAuto";

    //processLogin($btnLogin);


    fullName = $('#txtFullName').val();
    email = $("#txtEmail").val();
    pincode = $('#txtPin').val();
    username = $('#txtUserID').val();

    varData = {
        pFSecKey: '+Imw91aCSvXvCq9RdpwYjw==',
        pDeviceID: deviceID,
        pDeviceOS: deviceOS,
        pDeviceVersion: deviceVersion,
        pUserName: username,
        pFullName: fullName,
        pEmail: email,
        pPinCode: pincode
    };
    varData = JSON.stringify(varData);
    varContentType = "application/json; charset=utf-8";
    varDataType = "json";
    varProcessData = true;

    $.ajax({
        type: varType, //GET or POST or PUT or DELETE verb
        url: varUrl, //Location of the service
        data: varData, //Data sent to server
        contentType: varContentType, //content type sent to server
        dataType: varDataType, //Expected data format from server
        processdata: varProcessData, //True or False
        success: function (result) {//On Successfull service call
            var obj = JSON.parse(result.d);
            obj = obj[Object.keys(obj)[0]];
            if (obj.AKey !== "") {
                localStorage.setItem('isregister', 'Y');
                localStorage.setItem('DeviceID', obj.DeviceID);
                localStorage.setItem('AKey', obj.AKey);
                localStorage.setItem('email', email);

                //TODO : Rollback for production mode
                //document.location.href = "login.html";

                //alert(obj.Message);
                processLogin($btnLogin);
            }
            else {
                //document.getElementById("diverror").innerHTML = "<p>" + obj.Message + "</p>";
                alert(obj.Message);
                EnableButton($btnLogin);
            }
        },
        error: function (err) {
            OnWsError(err);
            EnableButton($btnLogin);
        }
    });
}