'use strict';

var eid, uid, ecode, secKey, cid, lid, ename;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');



// let columns = ['Father / Husband Name','CNIC No.','CNIC Expiry','Age','Birth Date','Place Of Birth','Gender',
// 'Maritial Status','Religion','Country','Telephone No. ','Mobile No.','Emergency No.','Blood Group ',
// 'Official Email','Web Site','Address ','Permanent Address'];

// let columnsdata = ['Father/HusbandName','NICNumber','CNICExpiry','Age','BirthDate','PlaceOfBirth','Gender',
// 'MaritialStatus','Religion','Country','Telephone','MobileNumber','EmergencyContactNo','BloodGroup','Email',
// 'URLAddress','Address','PermanentAddress'];


// let columns = ['CNIC No.','CNIC Expiry','Age','Birth Date','Place Of Birth','Gender',
// 'Maritial Status','Religion','Country','Telephone No. ','Mobile No.','Emergency No.','Blood Group ',
// 'Official Email','Web Site','Address ','Permanent Address'];

// let columnsdata = ['NICNumber','CNICExpiry','Age','BirthDate','PlaceOfBirth','Gender',
// 'MaritialStatus','Religion','Country','Telephone','MobileNumber','EmergencyContactNo','BloodGroup','Email',
// 'URLAddress','Address','PermanentAddress'];











{/* <div class="col-sm-6">
<div class="row mgbt-xs-0">
    <label class="col-xs-4 control-label lbldim">${element}
</label>
    <input type="text" class="col-xs-7 controls txt txtRemove" value="Jameel AHmed">                
    <!-- col-sm-10 -->
</div>
</div> */}
var txtEmpNo = $('#txtEmpNo');
var txtName = $('#txtName');
var txtDesignation = $('#txtDesignation');
var txtFatherHusbandName = $('#txtFatherHusbandName');
var txtNICNumber = $('#txtNICNumber');
var txtCNICExpiry = $('#txtCNICExpiry');
var txtAge = $('#txtAge');
var txtBirthDate = $('#txtBirthDate');
var txtPlaceOfBirth = $('#txtPlaceOfBirth');
var txtGender = $('#txtGender');
var txtMaritialStatus = $('#txtMaritialStatus');
var txtReligion = $('#txtReligion');
var txtCountry = $('#txtCountry');
var txtTelephone = $('#txtTelephone');
var txtMobileNumber = $('#txtMobileNumber');
var txtEmergencyContactNo = $('#txtEmergencyContactNo');
var txtBloodGroup = $('#txtBloodGroup');
var txtPersonalEmail = $('#txtPersonalEmail');
var txtEmail = $('#txtEmail');
var txtURLAddress = $('#txtURLAddress');
var txtAddress = $('#txtAddress');
var txtPermanentAddress = $('#txtPermanentAddress');


jQuery(function ($) {
    init();
});


function init() {
    fillDrowDownsAll(0);
    getPersonalInfo();
}

function getPersonalInfo() {
    postRequest('getEmployeeProfileInfo', { pEid: 0 }, function (res) {

        postRequest('GetFlagValueGeneric', { pFlagName: 'IsMyInfoEdititingAllow' }, function (res) {
            // console.log(res.d);
            if (res.d === 'True') {
                $('.field-icon').css('display', 'block');
                $('.customddl').css('width', '92%');

                //$('#field-icon').css("display","block");
            }
        });

        var data = JSON.parse(res.d);
        // console.log(data);
        var html = '';

        $.each(data, function (i) {

            $('#pimg').attr('src', getBaseUrl() + data[i].EmployeeImage);
            $('#pimg').on('load', function (e) {
            }).on('error', function (e) {
                //$('#pimg').attr('src', getBaseUrl() + 'UsersPicture/noimage.png');
                $('#pimg').attr('src', 'img/avatar.png');

            });
            txtEmpNo.html(data[i].EmployeeID);
            txtName.html(data[i].EmployeeName);
            txtDesignation.html(data[i].Designation);
            txtFatherHusbandName.val(data[i].FatherHusbandName);
            txtNICNumber.val(data[i].NICNumber);
            txtCNICExpiry.val(data[i].CNICExpiry);
            txtAge.val(getAge(data[i].BirthDate));
            txtBirthDate.val(data[i].BirthDate);
            txtPlaceOfBirth.val(data[i].PlaceOfBirth);
            txtGender.val(data[i].Gender);
            txtMaritialStatus.val(data[i].MaritialStatus);
            txtReligion.val(data[i].Religion);
            txtCountry.val(data[i].CountryID);
            txtTelephone.val(data[i].Telephone);
            txtMobileNumber.val(data[i].MobileNumber);
            txtEmergencyContactNo.val(data[i].EmergencyContactNo);
            txtBloodGroup.val(data[i].BloodGroup);
            txtPersonalEmail.val(data[i].PersonalEmail);
            txtEmail.val(data[i].Email);
            txtURLAddress.val(data[i].URLAddress);
            txtAddress.val(data[i].Address);
            txtPermanentAddress.val(data[i].PermanentAddress);

        });

    });
}

function fillDrowDownsAll(id) {
    // Gender DropDown
    var paraAll = {};
    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: cid
    }

    var paramswithoutCmpanyID = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: 0
    }

    paraAll = Object.assign({}, paramswithoutCmpanyID, {
        PID1: 'tblGender',
        PID2: 'GenderTitle',
        PID3: 'GenderValue',
        PID4: ''
    })
    var ddloj = document.getElementById("txtGender");
    fillDropDownGeneric(paraAll, ddloj, true, id);

    paraAll = Object.assign({}, params, {
        PID1: 'tblCountry',
        PID2: 'CountryTitle',
        PID3: 'CountryID',
        PID4: ''
    })
    var ddloj = document.getElementById("txtCountry");
    fillDropDownGeneric(paraAll, ddloj, true, id);

    paraAll = Object.assign({}, paramswithoutCmpanyID, {
        PID1: 'tblReligion',
        PID2: 'ReligionTitle',
        PID3: 'ReligionTitle',
        PID4: ' and LanguageID = ' + lid
    })
    var ddloj = document.getElementById("txtReligion");
    fillDropDownGeneric(paraAll, ddloj, true, id);

    paraAll = Object.assign({}, paramswithoutCmpanyID, {
        PID1: 'tblMartialStatus',
        PID2: 'MartialStatusTitle',
        PID3: 'MartialStatusValue',
        PID4: ''
    })
    var ddloj = document.getElementById("txtMaritialStatus");
    fillDropDownGeneric(paraAll, ddloj, true, id);

}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString.split('/')[2], dateString.split('/')[1], dateString.split('/')[0]);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

$('#btnSave').hide();
$('#editinfo').click(function (e) {
    $('#btnSave').show();
    $(this).hide();
    $('input:text').removeAttr("disabled");

});
$('#btnSave').click(function (e) {
    $('#editinfo').show();
    $(this).hide();
    $('input:text').attr("disabled", "disabled");

    var data = {
        pFatherHusbandName: txtFatherHusbandName.val().trim(),
        pNICNumber: txtNICNumber.val().trim(),
        pCNICExpiry: txtCNICExpiry.val().trim(),
        pBirthDate: txtBirthDate.val().trim(),
        pPlaceOfBirth: txtPlaceOfBirth.val().trim(),
        pGender: txtGender.val().trim(),
        pMaritialStatus: txtMaritialStatus.val().trim(),
        pReligion: txtReligion.val().trim(),
        pCountry: txtCountry.val().trim(),
        pTelephone: txtTelephone.val().trim(),
        pMobileNumber: txtMobileNumber.val().trim(),
        pEmergencyContactNo: txtEmergencyContactNo.val().trim(),
        pBloodGroup: txtBloodGroup.val().trim(),
        pEmail: txtEmail.val().trim(),
        pURLAddress: txtURLAddress.val().trim(),
        pAddress: txtAddress.val().trim(),
        pPermanentAddress: txtPermanentAddress.val().trim()
    }
    postRequest('saveEmployeeProfileEditInfo', data, function (res) {

    });
});

$("#ppic").on("click", function () {
    $("#file").trigger("click");
});


var fileByteArray = [];
var fileArray = [];
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        var reader0 = new FileReader();

        reader0.onload = function (e) {

            var arrayBuffer = this.result; //.split('base64,')[1];
            var fileArray0 = arrayBuffer;
            var array = new Uint8Array(arrayBuffer);
            for (var i = 0; i < array.length; i++) {
                fileByteArray.push(array[i]);
            }

            fileArray = fileByteArray;
            var prms = {
                pParameter0: '',
                pParameter1: '',
                pParameter2: '',
                pImage: fileArray,
                pFileName: getFileName('file')
            }
            postRequest('SaveEditProfile', prms, function (res) {

                if (res.d === 'success') {
                    getPersonalInfo();
                    toastr.success('Image Upload Successfully');
                } else {
                    var data = JSON.parse(res.d);
                    if (data.result === 'imagesizeexceed') {
                        getPersonalInfo();
                        toastr.error(data.msg);
                    }
                }
            })
        }

        reader.onload = function (e) {
            $('#pimg').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
        reader0.readAsArrayBuffer(input.files[0]);
    }
    return fileArray;
}
$("#file").change(function () {
    readURL(this);
});

var lastValue;
$(".toggle-edit").click(function () {

    $(this).toggleClass("fa-eye fa-save");
    var input = $($(this).attr("toggle"));

    // var isDropDown = $(this).attr("data-isDropDown");
    var columnName = $(this).attr("data-columnname");
    var datatype = $(this).attr("data-datatype");
    //console.log(input.selector);
    //console.log('Column :' +columnName);

    if (input.attr("disabled") == "disabled") {
        input.removeAttr("disabled");
        lastValue = input.val().trim();
        // console.log();

    } else {

        var columnValue = input.val().trim();
        //  console.log(columnValue + ' ' + lastValue);

        if (columnValue !== lastValue) {

            var dataType = datatype === undefined ? 'string' : datatype;
            var params = {
                pParameter0: columnName,
                pParameter1: columnValue,
                pParameter2: dataType,
                pImage: [],
                pFileName: ''
            }

            postRequest('SaveEditProfile', params, function (response) {
                var result = JSON.parse(response.d);
                // console.log(result);
                var res = result.result;
                var message = result.msg;
                //  console.log(res + ' ' +res.message);
                if (res === 'success') {
                    init();
                    toastr.success(message);
                }
                if (res === 'error' || res === 'fail') {
                    toastr.error(message);
                }
            });
        } else {
            toastr.info('No changes were made!');
        }

        input.attr("disabled", "disabled");






    }
});


// $.fn.toggleText = function(t1, t2){
//     if (this.html() == t1) this.html(t2);
//     else                   this.html(t1);
//     return this;
//   };
