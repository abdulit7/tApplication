"use strict";

var varType;
var varUrl;
var varData;
var varContentType;
var varDataType;
var varProcessData;
var FType = '';
var globalRoutes;

var eid, uid, ecode, secKey, cid, lid, ename, territoryid;
eid = getLocalStorageItem_Int("eid");
ename = getLocalStorageItem_Int("ename");
uid = getLocalStorageItem_Int("uid");
cid = getLocalStorageItem_Int("cid");
lid = getLocalStorageItem_Int("lid");
ecode = getLocalStorageItem_String("ecode");
secKey = getLocalStorageItem_String("secKey");
FType = getParameterByName('FType');
territoryid = getLocalStorageItem_Int("territoryid");
if (FType == null) {
    FType = '';
}

var IsCustomerOnExpenseRequest = false;
var IsRouteOnExpenseRequest = false;
var golbalBalance = {};

var txtClaimDate = $("#txtClaimDate");
var txtExpenseDate = $("#txtExpenseDate");
var ddlExpenseType = $("#ddlExpenseType");
var txtRate = $("#txtRate");
var txtQuantity = $("#txtQuantity");
var txtAmount = $("#txtAmount");
var txtDescription = $("#txtDescription");

var ddlCustomer = $("#ddlCustomer");
var ddlRoute = $("#ddlRoute");

$(function ($) {
    //just like $(document).ready()

    var scheduleDate, dateformat;
    dateformat = getLocalStorageItem_String("dateformat");
    $("#datetimepicker0,#datetimepicker1").datetimepicker({
        format: dateformat.toUpperCase(),
        ignoreReadonly: true
    });

    $("textarea[maxlength]").on("propertychange input", function () {
        if (this.value.length > this.maxlength) {
            this.value = this.value.substring(0, this.maxlength);
        }
    });

    jQuery('#ddlRoute').change(function (e) {
        if (jQuery('#ddlRoute').val() != 0) {
            var _Mileage = globalRoutes.filter(function (value) { return value.RouteID == jQuery('#ddlRoute').val() });
            if (_Mileage.length > 0) {
                txtQuantity.val(_Mileage[0].Mileage);
                jQuery(txtQuantity).trigger('keyup');
            } else {
                toastr.error('Mileage not defined. Please contact to administrator.');
            }
        }
    });


    jQuery(ddlExpenseType).change(function (e) {
        var v = jQuery(this).val();
        ddlExpenseTypeChange(v);
    });
    init();
});

function init() {
    txtClaimDate.val(sysdate);
    txtExpenseDate.val(sysdate);
    txtRate.val(0);
    txtQuantity.val(1);
    //txtAmount.val(0);
    fillExpenseType();

    applyFlagSettings();
    if (FType == 'MileageExpense' || FType == 'NightStayExpense') {
        jQuery('.page-heading').append(FType == 'MileageExpense' ? ' (Mileage)' : ' (NightStay)');
        findMyCurrentLocation();
        getFlagValues_Callback({ d: '{"IsCustomerOnExpenseRequest":"False" , "IsRouteOnExpenseRequest" : "True" }' });
        jQuery('.NotForMileageExpense').hide();
        jQuery('.ForMileageExpense').removeClass('hide');
        txtAmount.val(0);
    } else {
        applyFlagSettings();
        jQuery('.ForMileageExpense').addClass('hide');
    }
    jQuery('#showProcess').hide();
    jQuery('form').removeClass('hide');

}

function applyFlagSettings() {
    postRequest("GetFlagValues", { pForm: "expense" }, getFlagValues_Callback);
}

function getFlagValues_Callback(res) {
    //console.log(res);
    var json = JSON.parse(res.d);

    IsCustomerOnExpenseRequest = json.IsCustomerOnExpenseRequest;
    IsRouteOnExpenseRequest = json.IsRouteOnExpenseRequest;

    if (
        IsCustomerOnExpenseRequest === "false" &&
        IsRouteOnExpenseRequest === "false"
    ) {
        $("#divHidden").hide();
    } else {
        $("#divHidden").show();
    }

    var lblCustomer = $("#lblCustomer");
    var divCustomer = $("#divCustomer");
    var lblRoute = $("#lblRoute");
    var divRoute = $("#divRoute");

    if (IsCustomerOnExpenseRequest === "True") {
        fillCustomer(cid);
        lblCustomer.show();
        divCustomer.show();
    }
    if (IsRouteOnExpenseRequest === "True") {
        fillRoute();
        lblRoute.show();
        divRoute.show();
    }
}

function fillExpenseType() {
    if (FType != 'MileageExpense' || FType != 'NightStayExpense') {
        postRequest(
            "FillExpenseTypes",
            { pClaimDate: txtClaimDate.val() },
            fillExpenseType_Callback
        );
    }
}

function fillExpenseType_Callback(res) {
    res = JSON.parse(res.d);

    var ddlobj = document.getElementById("ddlExpenseType");
    _fillDropDown(res, ddlobj, "AllowanceID", "AllowanceTitle", true);

    // var searchresult = [];
    // if (FType == 'MileageExpense' || FType == 'NightStayExpense') {
    //     searchresult = res.filter(function (item) {
    //         return item.AllowanceTitle.toLowerCase().indexOf(FType == 'MileageExpense' ? 'mileage' : 'night') > -1;
    //     });
    //     if (searchresult.length > 0) {
    //         jQuery("#ddlExpenseType option").each(function (e) { this.selected = $(this).text() == searchresult[0]['AllowanceTitle']; });
    //         jQuery(ddlExpenseType).trigger('change');
    //     }

    // }

}

function ddlExpenseTypeChange(value) {
    if (value === "0") {
        $("#expenseBalDetail").html("");
        return;
    }
    var dateformat = getLocalStorageItem_String("dateformat");
    var data = {
        ExpenseID: value,
        ExpenseTitle: ddlExpenseType.val(),
        ClaimDate: txtClaimDate.val(),
        ExpenseDate: txtExpenseDate.val(),
        TranID: "0", // TranID is '0' for insert mode
        pDateFormat: dateformat
    };

    postRequest("GetExpenseDetails", data, expenseDetail_CallBack);

}

function expenseDetail_CallBack(res) {
    var otherValues,
        AllowanceBaseEntry,
        AllowanceRate,
        defaultQuantity,
        isFixed,
        strnewjson;
    var r = JSON.parse(res.d);
    //console.log(JSON.parse(res.d));
    var item = r[0];
    golbalBalance = r[0];
    var template = "";
    var template1 = "";
    var template2 = "";

    if (item.hasOwnProperty("MonthlyLimit") === true) {
        template1 +=
            "<td>Monthly Limit</td>" +
            "<td>Monthly Availed</td>" +
            "<td>Monthly Balance</td>";

        template2 +=
            "<td>" +
            item.MonthlyLimit +
            "</td>" +
            "<td>" +
            item.MonthlyAvailed +
            "</td>" +
            "<td>" +
            item.MonthlyBalance +
            "</td>";
    }

    template =
        '<table class="table table-bordered table-condensed">' +
        '<tr class="bg-dark">' +
        "<td>Limit In</td>" +
        "<td>Limit</td>" +
        "<td>Availed</td>" +
        "<td>Balance</td>" +
        template1;
    ("</tr>");

    template +=
        '<tr class="bg-light">' +
        "<td>" +
        item.LimitIn +
        "</td>" +
        "<td>" +
        item.Limit +
        "</td>" +
        "<td>" +
        item.Availed +
        "</td>" +
        "<td>" +
        item.Balance +
        "</td>" +
        template2;
    ("</tr></table>");

    $("#expenseBalDetail").html(template);
    //console.log({ item });

    txtQuantity.val(item.DefaultQuantity);
    txtRate.val(item.AllowanceRate);

    if (parseFloat(item.AllowanceRate) !== 0) {
        txtAmount.attr("disabled", "true");
    } else {
        txtAmount.removeAttr("disabled", "false");
    }
    txtAmount.val(0);
    calculateRate();
    jQuery(ddlRoute).trigger('change');
}

function expenseDetail_CallBack_OLD(res) {
    var otherValues,
        AllowanceBaseEntry,
        AllowanceRate,
        defaultQuantity,
        isFixed,
        strnewjson;
    var strjson = res.d;
    strjson = JSON.stringify(strjson);
    strjson = strjson.replace(/br \//gi, "br/");
    strjson = strjson.replace(/&nbsp;/gi, "");

    strjson = JSON.parse(strjson);
    strjson = strjson.split("^");

    otherValues = strjson;
    //  console.log(otherValues);

    // AllowanceBaseEntry = strjson[2];
    // AllowanceRate = strjson[3];
    // defaultQuantity = strjson[4];
    // isFixed = strjson[5];

    strnewjson = strjson[0];

    strnewjson = strnewjson.split("<br/>");

    //  console.log(strnewjson);

    $("#span0").html(strnewjson[0]);
    $("#span1").html(strnewjson[1]);
    $("#span2").html(strnewjson[2]);
    $("#span3").html(strnewjson[3]);

    AllowanceBaseEntry = otherValues[2];
    AllowanceRate = otherValues[3];
    defaultQuantity = otherValues[4];
    isFixed = otherValues[5];

    // console.log(AllowanceBaseEntry);
    // console.log(AllowanceRate);
    // console.log(defaultQuantity);
    // console.log(isFixed);

    if (AllowanceBaseEntry.toLowerCase() === "expensequantitybased") {
        AllowanceRate = otherValues[3];
        txtAmount.prop("disabled", "disabled");

        txtRate.val(AllowanceRate);
        if (isEdit === false) {
            txtQty.val(defaultQuantity);
            txtQty.prop("disabled", isFixed === "true");
            txtAmount.val(AllowanceRate.toString());
        }
    }
}

function fillRoute(id, pType) {

    var RouteType = ['MileageExpense', 'NightStayExpense', ''];
    var RouteTypeValue = ['Mileage', 'Stay', ''];

    var strRouteType = '';
    if (RouteTypeValue[RouteType.indexOf(FType)] != '') {
        strRouteType = " and RouteType = '" + RouteTypeValue[RouteType.indexOf(FType)] + "' ";
    }

    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        PID1: "tblRoute",
        PID2: "RouteTitle",
        PID3: "RouteID",
        pCompanyID: cid,
        PID4: territoryid == 0 ? "" : " and TerritoryID = " + territoryid + strRouteType
    };

    var ddlObj = document.getElementById("ddlRoute");
    if (FType == 'MileageExpense' || FType == 'NightStayExpense') {

        params.PID3 = "cast(RouteID as nvarchar(100)) + '^' + cast(Mileage as nvarchar(100)) as 'RouteID'",
            fillDropDownGeneric(params, ddlObj, true, 0, function (r) {
                var d = JSON.parse(JSON.stringify(r));
                globalRoutes = d;
                jQuery.each(globalRoutes, function (i, item) { item.Mileage = item.RouteID.split('^')[1]; item.RouteID = item.RouteID.split('^')[0]; });
                jQuery.each(r, function (i, item) { item.RouteID = item.RouteID.split('^')[0]; });
                _fillDropDown(r, ddlObj, 'RouteID', 'RouteTitle', true);
            });
    } else {
        fillDropDownGeneric(params, ddlObj, true, 0);
    }


}

function fillCustomer(id) {
    // var params = {
    //   pSecKey: secKey,
    //   pEmployeeID: eid,
    //   pEmployeeRefNo: ecode,
    //   pUserID: uid,
    //   PID1: "tblCustomer",
    //   PID2: "CustomerTitle",
    //   PID3: "CustomerID",
    //   pCompanyID: cid,
    //   PID4: " and CompanyID = " + id
    // };
    // var ddlObj = document.getElementById("ddlCustomer");
    // fillDropDownGeneric(params, ddlObj, true, 0);


    funcFillDropDownListSelec2(10, "GetDataFromSelect2", $('#ddlCustomer'), function (params) {
        var valueToPush = {};
        valueToPush["q"] = params.term;
        valueToPush["pagesize"] = 10;
        //var PControl1 = document.getElementById(ddlEmployee);
        valueToPush["pSecKey"] = secKey;
        valueToPush["pEmployeeID"] = eid;
        valueToPush["pEmployeeRefNo"] = ecode;
        valueToPush["pUserID"] = uid;
        valueToPush["pLangID"] = lid;
        valueToPush["pCompanyID"] = cid;

        valueToPush["PID1"] = uid;
        valueToPush["PID2"] = cid;
        valueToPush["PID3"] = "True";
        valueToPush["PID4"] = "False";

        valueToPush["_PID1"] = "tblCustomer";
        valueToPush["_PID2"] = "CustomerTitle as 'Title'";
        valueToPush["_PID3"] = "CustomerID as 'ID'";
        valueToPush["_PID4"] = " and CustomerTitle like '%" + params.term + "%'";

        valueToPush["page"] = params.page;
        return valueToPush;
    });

}

$("#formExpenseClaim").submit(function (e) {
    e.preventDefault();

    if (!checkIfGPSEnabled()) {
        return;
    }

    if (!validate()) {
        return;
    } //Validation
    DisableButton($("#btnSave"), "Submitting ...");
    performSaving();
});

function performSaving() {
    var geoService = navigator.geolocation;
    if (geoService) {

        geoService.getCurrentPosition(function (position) {
            var apiurl = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&addressdetails=1'
            postRequest2(apiurl, {}, function (r) {
                var adrs = '';
                if (r.display_name != null) {
                    adrs = r.display_name;
                } else {

                    if (r.address["house_number"] != null) { adrs = r.address["house_number"] + ", "; }
                    if (r.address["suburb"] != null) { adrs += r.address["suburb"] + ", "; }
                    if (r.address["town"] != null) { adrs += r.address["town"] + ", "; }
                    if (r.address["neighbourhood"] != null) { adrs += r.address["neighbourhood"] + ", "; }
                    if (r.address["county"] != null) { adrs += r.address["county"] + ", "; }
                    if (r.address["city"] != null) { adrs += r.address["city"]; }

                }


                var dateformat = getLocalStorageItem_String("dateformat");
                var data = {
                    pDateFormat: dateformat,
                    pExternalRefNo: 0,
                    pExpenseDate: txtExpenseDate.val(),
                    pClaimDate: txtClaimDate.val(),
                    pRate: txtRate.val(),
                    pCustomreID: ddlCustomer.val(),
                    pRouteID: ddlRoute.val(),
                    pRemakrs: txtDescription.val(),
                    pExpenseTypeID: ddlExpenseType.val(),
                    pQty: txtQuantity.val(),
                    pAmount: txtAmount.val(),
                    pStatus: "Submitted",
                    pFileBytes: fileArray,
                    pFileName: getFileName("fileAttachment"),
                    pLatitude: position.coords.latitude,
                    pLongitude: position.coords.longitude,
                    pLocation: adrs,
                    pFType: FType
                };
                //console.log(JSON.stringify(data));

                var _methodName = 'SaveExpenseClaimRequest';
                if (FType.toLowerCase() == 'mileageexpense' || FType.toLowerCase() == 'nightstayexpense') {
                    _methodName = 'SaveExpenseClaimRequestABI';
                }

                postRequest(_methodName, data, _performSaving, function (err) {
                    OnPostRequestError(err);
                    EnableButton($("#btnSave"), "Submit");
                });

            });



        }, errorHandler, { enableHighAccuracy: true });
    } else {
        document.getElementById("divcurrentlocation").innerHTML = "Your Device does not supports GeoLocation.";
        EnableButton($("#btnSave"), "Submit");
    }


}

function _performSaving(res) {
    EnableButton($("#btnSave"), "Submit");
    //console.log(res);
    var result = JSON.parse(res.d);
    var res = result.result;
    var msg = result.msg;
    //  console.log(result);

    if (res === "success") {
        clearForm();
        toastr.success(msg);
    } else {
        toastr.error(msg);
    }
}

function clearForm() {


    txtAmount.val("");

    if (FType == 'MileageExpense' || FType == 'NightStayExpense') {
        txtAmount.val(0);
    }

    ddlExpenseType.val(0);
    txtRate.val(0);
    //txtDescription.summernote("code", "");
    txtQuantity.val(1);
    ddlCustomer.val(0).trigger('change');
    $("#expenseBalDetail").html('');
}

txtQuantity.on("keyup", function () {
    calculateRate();
});

txtAmount.on("keyup", function () {
    calculateRate();
});

function calculateRate() {
    var rate = parseFloat(txtRate.val());
    var qty = parseFloat(txtQuantity.val());
    var amt = parseFloat(txtAmount.val());
    var res = 0;

    if (qty != 0 && amt != 0 && txtAmount.attr("disabled") != "disabled") {
        res = amt / qty;
        if (isNaN(res) == false) {
            txtRate.val(res.toFixed(2));
        }


    } else if (qty != 0 && rate != 0 && txtAmount.attr("disabled") == "disabled"
    ) {
        res = qty * rate;
        if (isNaN(res) == false) { txtAmount.val(Math.round(res)); }
    } else if (amt == 0 && qty != 0 && rate != 0 && txtRate.attr("disabled") == "disabled"

    ) {
        res = qty * rate;
        if (isNaN(res) == false) { txtAmount.val(Math.round(res)); }

    }
}

function validate() {
    //var data = new FormData($('#formExpenseClaim'));
    // console.log(data);
    //uploadFile(); //'getFileBytes($("#fileAttachment").val());
    var msg = "", result;

    if (FType == 'MileageExpense' || FType == 'NightStayExpense') {
        if (IsRouteOnExpenseRequest === "True" || FType == 'MileageExpense' || FType == 'NightStayExpense') {
            msg += ddlRoute.val().trim() === "0" ? "-Route <br>" : "";
            ddlRoute.focus();
        }

    } else {

        msg += ddlExpenseType.val().trim() === "0" ? "-Expense Type <br>" : "";
        msg +=
            txtAmount.val().trim() === "0" || txtAmount.val().trim() === ""
                ? "-Amount <br>"
                : "";
        msg +=
            txtQuantity.val().trim() === "0" || txtQuantity.val().trim() === ""
                ? "-Quantity <br>"
                : "";

        if (IsCustomerOnExpenseRequest === "True") {
            msg += ddlCustomer.val() === "0" ? "-Customer <br>" : "";
        }
        if (IsRouteOnExpenseRequest === "True") {
            msg += ddlRoute.val().trim() === "0" ? "-Route <br>" : "";
        }

    }





    if (msg.trim() !== "") {

        msg = "Please fill the following fields <br>" + msg;
        toastr.error(msg);
    }
    var expamt = parseFloat(txtAmount.val());
    if (expamt > golbalBalance.Balance && golbalBalance.Limit != 0 && golbalBalance.Limit != -1) {
        toastr.error("Your expense amount is greater then you remaining balance! ");
        return;
    }

    return msg.trim() === "";
}

var fileArray = [];
var fileByteArray = [];
document.getElementById("fileAttachment").addEventListener(
    "change",
    function () {
        var reader = new FileReader();
        reader.onload = function () {
            var arrayBuffer = this.result; //.split('base64,')[1];
            var fileArray0 = arrayBuffer;
            //fileArray = new Uint8Array(fileArray0);
            var array = new Uint8Array(arrayBuffer);
            for (var i = 0; i < array.length; i++) {
                fileByteArray.push(array[i]);
            }
            //  console.log(fileByteArray);
            fileArray = fileByteArray;
        };
        reader.readAsArrayBuffer(this.files[0]);
    },
    false
);




function findMyCurrentLocation() {
    try {
        var geoService = navigator.geolocation;
        //console.log('geoService : ',geoService);
        if (geoService) {
            navigator.geolocation.getCurrentPosition(showCurrentLocation, errorHandler, { enableHighAccuracy: true });
        } else {
            document.getElementById("divcurrentlocation").innerHTML = "Your Device does not supports GeoLocation.";
        }
    }
    catch (e) {
        document.getElementById("divcurrentlocation").innerHTML = "Your Device does not supports GeoLocation.";
    }
}

function showCurrentLocation(position) {

    var apiurl = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&addressdetails=1'
    jQuery('#lblLat').html(position.coords.latitude);
    jQuery('#lblLong').html(position.coords.longitude);

    jQuery('#divcurrentlocation').html(center(progress('Getting Location ')));
    postRequest2(apiurl, {}, function (r) {
        var adrs;
        if (r.display_name != null) {
            adrs = r.display_name;
        } else {
            if (r.address["house_number"] != null) { adrs = r.address["house_number"] + ", "; }
            if (r.address["suburb"] != null) { adrs += r.address["suburb"] + ", "; }
            if (r.address["town"] != null) { adrs += r.address["town"] + ", "; }
            if (r.address["neighbourhood"] != null) { adrs += r.address["neighbourhood"] + ", "; }
            if (r.address["county"] != null) { adrs += r.address["county"] + ", "; }
            if (r.address["city"] != null) { adrs += r.address["city"]; }
        }
        jQuery('#divcurrentlocation').html(getIcon('location-arrow') + adrs);

    });

}

function checkIfGPSEnabled() {
    if (typeof cordova != 'undefined') {
        cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
            if (enabled == false) {
                toastr.info('Location is disabled! Please enable it.');
                //if ($('#ddlActivityType').val() > -1) {                
                return false;
            } else {
                return true;
                //findMyCurrentLocation();
            }
        }, function (error) {
            toastr.info('Location is disabled! Please enable it.');
            return false;
            //findMyCurrentLocation();
        });
    } else {
        return true;
        //findMyCurrentLocation();
    }
    return true;
}

function errorHandler(error) {
    // console.log('error', error.code);

    //    EnableButton($('#btnSave'), 'Submit');

    switch (error.code) {
        case 1:
            document.getElementById("divcurrentlocation").innerHTML = "Your Device does not supports GeoLocation."
            break;
        case error.PERMISSION_DENIED:
            document.getElementById("divcurrentlocation").innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("divcurrentlocation").innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            document.getElementById("divcurrentlocation").innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("divcurrentlocation").innerHTML = "An unknown error occurred."
            break;
        default:
            document.getElementById("divcurrentlocation").innerHTML = "An unknown error occurred."
            break;
    }
    //document.getElementById("divcurrentlocation").innerHTML = "Error while retrieving current position. Error code: " + error.code + ",Message: " + error.message;
}
