'use strict';

var eid, uid, ecode, secKey, cid, lid, ename, dateformat;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');
dateformat = getLocalStorageItem_String('dateformat');
var op = $('#txtOPassword');
var np = $('#txtPassword');
var cp = $('#txtCPassword');

jQuery(function ($) {

    init();

});

function init() {
    passwordStrength();
}



$('#changePassword').submit(function (e) {
    e.preventDefault();
    if (!validate()) return;

    var data = {
        pOP: op.val().trim(),
        pNP: np.val().trim(),
        pCP: cp.val().trim()
    }
    postRequest('ChangePasswordEmployee', data, function (res) {
        var response = JSON.parse(res.d);
        var res = response.result;
        var msg = response.msg;

        if (res === 'success') {
            op.val('');
            np.val('');
            cp.val('');
            toastr.success(msg);
            logOut(false);
        } else {
            toastr.error(msg);
        }

        //console.log(response);
    });


});

function validate() {
    var result = false;
    if (op.val().trim() === '' || np.val().trim() === '' || cp.val().trim() === '') {
        toastr.error('Fill in all fields!');
    }
    if (checkPassword(np.val().trim())) {
        result = true;
    } else {
        return false;
    }

    if (cp.val() !== np.val()) {
        $('#password_strength').html('New Password and Confirm Password Must be same!');
        $("#password_strength").css("color", '#f44336');
        result = false;
    }

    return result;
}

function passwordStrength() {


    $(".toggle-password").click(function () {

        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

    $("#txtPassword").bind("keyup", function () {
        //TextBox left blank.
        if ($(this).val().length == 0) {
            $("#password_strength").html("");
            return;
        }

        //Regular Expressions.
        var regex = new Array();
        regex.push("[A-Z]"); //Uppercase Alphabet.
        regex.push("[a-z]"); //Lowercase Alphabet.
        regex.push("[0-9]"); //Digit.
        regex.push("[$@$!%*#?&]"); //Special Character.

        var passed = 0;

        //Validate for each Regular Expression.
        for (var i = 0; i < regex.length; i++) {
            if (new RegExp(regex[i]).test($(this).val())) {
                passed++;
            }
        }

        //Validate for length of Password.
        if (passed > 2 && $(this).val().length > 8) {
            passed++;
        }

        //Display status.
        var color = "";
        var strength = "";
        switch (passed) {
            case 0:
            case 1:
                strength = "Weak";
                color = "red";
                break;
            case 2:
                strength = "Good";
                color = "darkorange";
                break;
            case 3:
            case 4:
                strength = "Strong";
                color = "green";
                break;
            case 5:
                strength = "Very Strong";
                color = "darkgreen";
                break;
        }
        $("#password_strength").html('Password Strength : <b>' + strength + '</b>');
        $("#password_strength").css("color", color);
    });
}

function checkPassword(password) {
    var pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[@#$%&]).*$/;
    if (pattern.test(password)) {
        return true;
    } else {
        // toastr.error(`
        // Must be at least 8 characters
        // At least 1 number, 1 lowercase, 1 uppercase letter<br>
        // At least 1 special character
        // `);

        $("#password_strength").css("color", '#f44336');
        $('#password_strength').html(
            '<ul>' +
            '<li>Must be at least 8 characters</li>' +
            '<li>At least 1 number</li>' +
            '<li>At least 1 special character</li>' +
            '</ul>'
        );

        return false;
    }
}