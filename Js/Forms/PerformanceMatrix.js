

$(function () {

    FillCriteria();

    var arrTitles = ['BT', 'OT', 'AT'];
    var temp = '<td></td><td></td>';
    $.each(arrTitles, function (i, item) {
        temp += '<td><div class="kpiLabels">• ' + item + '</div></td>';
    });
    //  $('#RatingTitles').html(temp);
});


$('#btnShow').click(function (e) {
    if (validate() == false) { return; }

    $('.mbox').closest('td').css('width', '180px');
    $('.employeecount span').html('<i class="fa fa-spinner fa-spin"></i>');

    setTimeout(function () {

        populateMatrix('matrix11', 1, 1);
        populateMatrix('matrix12', 1, 2);
        populateMatrix('matrix13', 1, 3);

        populateMatrix('matrix21', 2, 1);
        populateMatrix('matrix22', 2, 2);
        populateMatrix('matrix23', 2, 3);

        populateMatrix('matrix31', 3, 1);
        populateMatrix('matrix32', 3, 2);
        populateMatrix('matrix33', 3, 3);

    }, 1200);


    $('#mainMatrix').fadeIn();

    $('#hideShowCriteria').toggleClass('fa-chevron-up fa-chevron-down');
    $('#criteria').slideToggle();

});

function populateMatrix(matrixNo, KPI, OBJ) {

    try {

        var paramsData = {
            pReviewTypeIDKPI: $('#ddlReviewTypeKPI').val(),
            pReviewTypeIDOBJ: $('#ddlReviewTypeOBJ').val(),
            pReviewYear: $('#ddlReviewYear').val(),
            pEmployeeIDs: getIDsString($('#ddlEmployee').val()),
            pDepartmentIDs: getIDsString($('#ddlDepartment').val()),
            pSubDepartmentIDs: getIDsString($('#ddlSubDepartment').val()),
            pDivisionIDs: getIDsString($('#ddlDivision').val()),
            pFunctionIDs: getIDsString($('#ddlGroupLevel').val()),
            pKPI: KPI,
            pOBJ: OBJ,
            pCompanyID: 1,
        }

        postRequest('GetDataForPerformancePotentialMatrix', paramsData, function (response) {
            var data = JSON.parse(response.d);

            //console.log(data);
            data_ = data.Data;
            var Ratings = data.RatingTitle;
            var userdt = data.UserDetail;
            var dtemppic = data.EmployeePics;
            console.log(dtemppic);

            $('#' + matrixNo + ' .employeecount span').html(data_.length);
            $('#' + matrixNo).click(function (e) {

                var template = '';

                template = '';
                $.each(userdt, function (i, item) {
                    var sno = i + 1;
                    var empimage = '';
                    var picpath = dtemppic.filter(function (value) {
                        return item.EmployeeID = value.EmployeeID;
                    });


                    if (picpath.length > 0) {
                        empimage = picpath[0].EmployeeImage;
                    } else {
                        empimage = '../images/avatar.png';
                    }

                    template += '<tr>' +
                        '<td>' + sno + '</td>' +
                        '<td style="text-align:center;"><img src="' + empimage + '" class="img img-circle img-thumbnail userpic"></td>' +
                        '<td>' + item.EmployeeRefNo + '</td>' +
                        '<td>' + item.EmployeeName + '</td>' +
                        '<td>' + item.DesignationTitle + '</td>' +
                        '<td>' + item.DepartmentTitle + '</td>' +
                        '<td>' + item.BranchTitle + '</td>' +
                        '<td>' + item.DivisionTitle + '</td>' +
                        '<td>' + item.GroupLevelTitle + '</td>' +
                        '<td>' + item.GradeTitle + '</td>' +
                        '<td>' + item.Email + '</td>' +
                        '<td>' + getFormattedDateNew(item.BirthDate, '') + '</td>' +
                        '<td>' + item.Age + '</td>' +
                        '<td>' + item.Sex + '</td>' +
                        '<td>' + item.QualificationTitle + '</td>' +
                        '<td>' + getFormattedDateNew(item.AppointmentDate, '') + '</td>' +
                        '<td>' + item.ServicePeriod + '</td>' +
                        '<td>' + getFormattedDateNew(item.PromotionDate, '') + '</td>' +
                        '<td>' + item.PromotionPeriod + '</td>' +

                        '</tr>'
                });

                var table = '<div class="table-responsive"><table class="table table-bordered">' +
                    '<thead>' +
                    '<tr>' +
                    '<th>Sno.</th>' +
                    '<th></th>' +
                    '<th>Employee ID</th>' +
                    '<th>Employee Name</th>' +
                    '<th>Designation</th>' +
                    '<th>Department</th>' +
                    '<th>Branch</th>' +
                    '<th>Division</th>' +
                    '<th>Function</th>' +
                    '<th>Group</th>' +
                    '<th>Email Address</th>' +
                    '<th>Birth Date</th>' +
                    '<th>Age</th>' +
                    '<th>Gender</th>' +
                    '<th>Qualification</th>' +
                    '<th>Appointment Date</th>' +
                    '<th>Service Period</th>' +
                    '<th>Last Promotion Date</th>' +
                    '<th>Last Promotion Period</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>             ' +
                    template +
                    '</tbody>' +
                    '</table></div>';




                $('#listcontainer').html(table);
                $("#myModal").modal();
            });
        });

    } catch (error) {
        //console.log(error);
    }


}


function getIDsString(data) {
    try {
        if (data !== null || data !== []) {
            var str = '';
            $.each(data, function (i, item) {
                str += item + ",";
            });
            return str + -786;
        } else {
            str = '';
        }
    } catch (error) {
        return '';
    }


}

$('#hideShowCriteria').click(function (e) {
    $('#hideShowCriteria').toggleClass('fa-chevron-up fa-chevron-down');
    $('#criteria').slideToggle();
});


function postRequest(url, data, callback) {
    var d;

    Type = "POST";
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    Url = getAppPath() + 'wsttmapp.asmx/' + url;

    //console.log(newparams);
    $.ajax({
        //async: false,
        type: Type, //GET or POST or PUT or DELETE verb
        url: Url, // Location of the service
        data: JSON.stringify(data), //Data sent to server
        contentType: ContentType, // content type sent to server
        dataType: DataType, //Expected data format from server
        processdata: ProcessData, //True or False                                    
        success: callback,
        error: cerror,
        failure: cerror
    });
    //return d;
}

function cerror(err) {
    // console.log('Something went wrong!' + err)
}

function FillCriteria() {

    var paramsReviewYear = {
        pSecKey: getItem('secKey'),
        pEmployeeID: getItem('eid'),
        pEmployeeRefNo: getItem('ecode'),
        pUserID: getItem('uid'),
        PID1: 'tblReviewYear',
        PID2: 'ReviewYear',
        PID3: 'ReviewYear',
        pCompanyID: localStorage.getItem('cid'),
        PID4: ''
    }
    var ddlReviewYear = document.getElementById("ddlReviewYear");
    fillDropDownGeneric(paramsReviewYear, ddlReviewYear, true, 0);

    var paramsReviewype = {
        pSecKey: getItem('secKey'),
        pEmployeeID: getItem('eid'),
        pEmployeeRefNo: getItem('ecode'),
        pUserID: getItem('uid'),
        PID1: 'tblreviewtype',
        PID2: 'ReviewTypeTitle',
        PID3: 'ReviewTypeID',
        pCompanyID: localStorage.getItem('cid'),
        PID4: ''
    }
    var ddlReviewTypeKPI = document.getElementById("ddlReviewTypeKPI");
    fillDropDownGeneric(paramsReviewype, ddlReviewTypeKPI, true, 0);

    var ddlReviewTypeOBJ = document.getElementById("ddlReviewTypeOBJ");
    fillDropDownGeneric(paramsReviewype, ddlReviewTypeOBJ, true, 0);


    var arr = ['Department', 'Division', 'SubDepartment', 'GroupLevel', 'Employee'];
    $.each(arr, function (i, item) {
        funcFillDropDownListSelec2(10, "GetDataFromSelect2", $('#ddl' + item), function (params) {
            var valueToPush = {};
            valueToPush["q"] = params.term;
            valueToPush["pagesize"] = 10;
            //var PControl1 = document.getElementById(ddlEmployee);

            valueToPush["PID1"] = getItem('uid');
            valueToPush["PID2"] = getItem('cid');


            valueToPush["pSecKey"] = getItem('secKey');
            valueToPush["pEmployeeID"] = getItem('eid');
            valueToPush["pEmployeeRefNo"] = getItem('ecode');
            valueToPush["pUserID"] = getItem('uid');

            valueToPush["pCompanyID"] = getItem('cid');
            valueToPush["PID3"] = "True";
            valueToPush["PID4"] = "False";

            valueToPush["_PID1"] = "tbl" + item;
            valueToPush["_PID2"] = item + "Title as 'Title'";
            valueToPush["_PID3"] = item + "ID as 'ID'";
            valueToPush["_PID4"] = " and " + item + "Title like '%" + params.term + "%'";

            valueToPush["page"] = params.page;
            return valueToPush;
        });
    });

    funcFillDropDownListSelec2(10, "GetEmployeeListJson", $('#ddlEmployee'), function (params) {
        var valueToPush = {};
        valueToPush["q"] = params.term;
        valueToPush["pagesize"] = 10;
        //var PControl1 = document.getElementById(ddlEmployee);

        valueToPush["pSecKey"] = getItem('secKey');
        valueToPush["pEmployeeID"] = getItem('eid');
        valueToPush["pEmployeeRefNo"] = getItem('ecode');
        valueToPush["pUserID"] = getItem('uid');
        valueToPush["pCompanyID"] = getItem('cid');

        valueToPush["PID1"] = localStorage.getItem('uid');
        valueToPush["PID2"] = 1;
        valueToPush["PID3"] = "False";
        valueToPush["PID4"] = "False";
        valueToPush["page"] = params.page;

        return valueToPush;
    });


}


function getItem(key) {
    return localStorage.getItem(key);
}

function getAppPath() {
    var pathArray = location.pathname.split('/');
    var appPath = "/";
    for (var i = 1; i < pathArray.length - 2; i++) {
        appPath += pathArray[i] + "/";
    }
    return appPath;
}

function funcFillDropDownListSelec2(pagingSize, WSMethodName, ddlobj, pData) {
    //alert('inside');

    //var $ = jQuery.noConflict(); Change by HMN on 24-09-2018 (Remove var)
    $ = jQuery.noConflict();
    var result = ddlobj.select2({
        ajax: {
            url: getAppPath() + "wsttmapp.asmx/" + WSMethodName,
            type: "POST",
            dataType: 'json',
            delay: 500,
            data: pData,
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: data.items,
                    pagination:
                    {
                        more: (params.page * pagingSize) < parseInt(data.total_count)
                    }
                };
            },
            cache: true
        },
        placeholder: " - All -",
        allowClear: true,
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        minimumInputLength: 1,
        templateResult: function (repo) {
            var markup;
            if (repo.loading) { return repo.text; }
            markup = "<div class='select2-result-repository__title'>" + repo.text + "</div>";
            return markup;
        }, //formatRepoddlItem omitted for brevity, see the source of this page
        templateSelection: function (repo) { return repo.text; }
        //formatRepoSelectionddlItem // omitted for brevity, see the source of this page

    });

    return result;
}

function validate() {

    var controlsTovalidate = ['ReviewYear', 'ReviewTypeKPI', 'ReviewTypeOBJ'];
    var controlsTovalidateLabels = ['Review Year', 'Review Type For Performance', 'Review Type For Potential'];
    var res = true;
    var validationmsg = '';

    $.each(controlsTovalidate, function (i, item) {
        var itemval = $('#ddl' + item);
        if (itemval.val() == 0) {
            itemval.addClass('required');
            validationmsg += '○ ' + controlsTovalidateLabels[i] + ' is required! <br>';
            res = false;
        } else {
            itemval.removeClass('required');
            res = true;
        }
    });

    if (validationmsg.length > 0) {
        toastr.error(validationmsg);
    }



    return res;
}

function fillDropDownGeneric(parametersobj, ddlControl, EmptyFirst, pselectedValue) {
    //var parametersobj;
    var text = parametersobj.PID2;
    var value = parametersobj.PID3;

    var varType = "POST";
    var varUrl = getAppPath() + "wsttmapp.asmx/FillDropDownGeneric";
    var parametersobj = JSON.stringify(parametersobj);
    var varContentType = "application/json; charset=utf-8";
    var varDataType = "json";
    var varProcessData = true;

    $.ajax({
        type: varType, //GET or POST or PUT or DELETE verb
        url: varUrl, // Location of the service
        data: parametersobj, //Data sent to server
        contentType: varContentType, // content type sent to server
        dataType: varDataType, //Expected data format from server
        processdata: varProcessData, //True or False
        aysnc: false,
        success: function (result) {//On Successfull service call
            //var ddlObject = document.getElementById("ddlControl");
            //  emptyDropDown(ddlObject);
            var resultObject = null;
            if (varDataType == "json") {
                var json = JSON.parse(result.d);
                //checkLoggedIn(json);
                //console.log(json);               

                //  afterfillDropDownGenericSuccess();

                _fillDropDown(json, ddlControl, value, text, EmptyFirst);

                if (!isNull(pselectedValue) && pselectedValue !== 0) {
                    ddlControl.value = pselectedValue;
                }
            }
        },
        error: OnWsError// When Service call fails
    });

}

function OnWsError(err) {
    alert(err);
}

function isNull(value) {
    return typeof value === 'undefined' || value === null;
}

function getFormattedDateNew(dt, fullMonthName) {
    if (!isNull(dt)) {
        // dt = Date From Web Service which is unformatted    
        var dateformat = getLocalStorageItem_Int('dateformat') === 0 ? 'dd/mm/yyyy' : getLocalStorageItem_Int('dateformat')
        console.log(dateformat);
        if (fullMonthName) {
            return getDateWithMonthName(DTHelper.GetFormattedDate(getDateByASPNETTimeStamp(dt), dateformat));
        }
        return DTHelper.GetFormattedDate(getDateByASPNETTimeStamp(dt), dateformat)
    }
    return ''
}

function getLocalStorageItem_Int(key) {

    var result;
    result = localStorage.getItem(key);
    result = isNull(result) ? 0 : result;
    return result;
}

function getDateByASPNETTimeStamp(pASPNETDate) {
    return new Date(parseInt(/\d+/.exec(pASPNETDate)[0]));
}

function getDateWithMonthName(dt) {

    // var monthNames = [
    //     "01", "02", "03",
    //     "04", "05", "06", "07",
    //     "08", "09", "10",
    //     "11", "12"
    //   ];

    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = dt.getDate();
    var monthIndex = dt.getMonth();
    var year = dt.getFullYear();
    day = day < 9 ? '0' + day : day
    return day + '/' + monthNames[monthIndex] + '/' + year;
}

var DTHelper = {};

DTHelper.GetFormattedDate = function (date, format) {

    var dd, mm, yyyy, result = date;
    dd = date.getDate();
    mm = date.getMonth() + 1;   //January is 0
    yyyy = date.getFullYear();

    dd = dd < 10 ? '0' + dd.toString() : dd.toString();
    mm = mm < 10 ? '0' + mm.toString() : mm.toString();

    if (format.toLowerCase() == 'dd/mm/yyyy') {
        result = dd + '/' + mm + '/' + yyyy;
    }
    else if (format.toLowerCase() == 'mm/dd/yyyy') {
        result = mm + '/' + dd + '/' + yyyy;
    }

    return result;
}

DTHelper.GetNativeDate = function (date, format) {

    var dd, mm, yyyy, result = new Date();
    var datearr = date.split('/');
    var date, month, year;


    if (format.toLowerCase() == 'yyyy/mm/dd') {
        year = datearr[0];
        month = datearr[1];
        date = datearr[2];
        result = new Date(year + '/' + month + '/' + date);
    }

    else if (format.toLowerCase() == 'dd/mm/yyyy') {
        date = datearr[0];
        month = datearr[1];
        year = datearr[2];
        result = new Date(year + '/' + month + '/' + date);
    }
    else if (format.toLowerCase() == 'mm/dd/yyyy') {
        month = datearr[0];
        date = datearr[1];
        year = datearr[2];
        result = new Date(year + '/' + month + '/' + date);
    }


    return result;
}

DTHelper.GetFormattedTime = function (date, format) {
    var hours, mins, secs, result = date;
    hours = date.getHours();
    mins = date.getMinutes();
    secs = date.getSeconds();

    hours = hours < 10 ? "0" + hours.toString() : hours.toString();
    mins = mins < 10 ? "0" + mins.toString() : mins.toString();
    secs = secs < 10 ? "0" + secs.toString() : secs.toString();

    if (format.toLowerCase() === "hh:mm:ss") {
        result = hours + ":" + mins + ":" + secs;
    }
    else if (format.toLowerCase() === "hh:mm") {
        result = hours + ":" + mins;
    }

    return result;
}


function _fillDropDown(json, ddlObject, value, text, isClearFirst) {

    if (isClearFirst == true) {
        emptyDropDown(ddlObject);
        var option = document.createElement("option");
        option.value = 0;
        option.text = '- select -';
        ddlObject.options.add(option)
    }

    json.forEach(function (record) {
        var option = document.createElement("option");
        option.value = record[value];
        option.text = record[text]; //resultObject[i];
        ddlObject.options.add(option)
    });
}

function emptyDropDown(ddl) {
    for (var j = ddl.options.length - 1; j >= 0; j--) { ddl.remove(j); }
}




