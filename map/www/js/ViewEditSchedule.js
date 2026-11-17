'use strict';

var eid, uid, ecode, secKey, cid, lid, ename, dateformat, isAdmin;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');
dateformat = getLocalStorageItem_String('dateformat');
isAdmin = getLocalStorageItem_String('isAdmin');

const ptr = PullToRefresh.init({
    mainElement: '#pulltorefresh',
    triggerElement: '.trigger,.trigger2',
    onRefresh() {
        populateScheduleDetailsList();
    },
});

jQuery(function ($) {


    dateformat = getLocalStorageItem_String('dateformat');
    $('#txtScheduleDate').datetimepicker({
        format: dateformat.toUpperCase(),
        ignoreReadonly: true
    });

    init();

});

function init() {

    $('#txtScheduleDate').val(sysdate);
    populateScheduleDetailsList();

}


function populateScheduleDetailsList() {
    try {
        postRequest('GetScheduleDetail', { pScheduleDate: $('#txtScheduleDate').val() }, function (res) {
            var result = JSON.parse(res.d);
            //console.log(result);
            var data_ = result['ScheduleData'];
            var shifts = result['ShiftData'];
            var mode = 2;
            var fdata = {};
            var template = '';
            if (mode === 1) {
                fdata = $(data_).filter(function (i) {
                    return data_[i].EmployeeID === parseInt(eid)
                });

                template += generateTemplate(fdata[0], shifts)


            } else {
                fdata = data_;
                $.each(fdata, function (j) {
                    template += generateTemplate(fdata[j], shifts)
                });
            }

            if (!isEmptyObj(data_)) {
                $('#fixeddiv').html(
                    '<div id="hidden" class="row fixedHeader" style="display: none;margin-left:0px;">' +
                    '<div class="scheduleday">' +
                    'Schedule Date : ' + data_[0].ScheduleDate + ' - ' + data_[0].Day + '' +
                    '</div>' +
                    '</div>'
                );
            }

            $('#ScheduleList').html(template);
            $('select').select2({
                width: '100%' // need to override the changed default
            });

        });
    } catch (error) {
        toastr.error('Something is wrong!' + error);
    }
}

$('#editsave').click(function (e) {
    alert();
    $(this).toggleClass("fa-pencil fa-save");
    var input = $($(this).attr("toggle"));
});

var lastValue = '';
function editSchedule(eid, mode) {

    var input = $('#ddlShfit' + eid)


    if (input.attr("disabled") == "disabled") {

        if (mode !== 'd') {

            $('#box' + eid).css("background", "#fef1e7");
            $('#editsave' + eid).toggleClass("fa-pencil fa-save");

            input.removeAttr("disabled");
            input.removeClass('myselect');
            lastValue = input.val().trim();
        }

        if (mode === 'c') {
            $('#editsave' + eid).removeClass('fa-plus');
            $('#editsave' + eid).addClass('fa-save');
            $('#row' + eid).fadeIn();
            $('#close' + eid).fadeIn();
            $('#ddlShfit' + eid).removeAttr("disabled");
        }
        else if (mode === 'u') {

        } else if (mode === 'd') {
            if (input.val() !== '0') {
                if (confirm('Are you sue to delete this record!')) {
                    var selectedShift = input.val().trim();
                    params_ = {
                        pSelectedEmployee: parseInt(eid),
                        pShiftID: parseInt(selectedShift),
                        pScheduleDate: $('#txtScheduleDate').val(),
                        pOperationType: mode
                    }
                    postRequest('CRUDFinalSchedule', params_, function (response) {

                        var res = JSON.parse(response.d);
                        var result = res.result;
                        var msg = res.msg;

                        if (result === 'success') {
                            toastr.success(msg);
                            populateScheduleDetailsList();
                        }
                        if (result === 'fail') {
                            toastr.error(msg);
                        }
                    });
                }
            }
        }

    } else {

        if (!validate(input)) {
            $('#editsave' + eid).addClass('fa-save');
            return;
        }
        if (mode === 'c') {

            $('#editsave' + eid).removeClass('fa-plus');
            $('#editsave' + eid).addClass('fa-pencil');
        }


        input.attr("disabled", "disabled");
        input.addClass('myselect');
        var selectedShift = input.val().trim();
        var params_;
        if (selectedShift !== lastValue) {

            params_ = {
                pSelectedEmployee: parseInt(eid),
                pShiftID: parseInt(selectedShift),
                pScheduleDate: $('#txtScheduleDate').val(),
                pOperationType: mode

            }

            postRequest('CRUDFinalSchedule', params_, function (response) {

                var res = JSON.parse(response.d);
                var result = res.result;
                var msg = res.msg;

                if (result === 'success') {
                    toastr.success(msg);
                    populateScheduleDetailsList();
                }
                if (result === 'fail') {
                    toastr.error(msg);
                }
            });

        } else {
            toastr.info('No changes are made!');
            $('#box' + eid).css("background", "#fff");
            $('#editsave' + eid).removeClass('fa-save');
            $('#editsave' + eid).addClass('fa-pencil');
        }
    }
}

function closeSchedule(eid, mode) {
    var input = $('#ddlShfit' + eid);
    input.attr("disabled", "disabled");
    $('#row' + eid).hide();
    $('#close' + eid).hide();
    $('#editsave' + eid).removeClass('fa-save fa-eye');
    $('#editsave' + eid).addClass('fa-plus');

}


function generateTemplate(data, shifts) {
    var template = '';
    var templateself = '';
    var btnTemplate = '';
    var lineTemplate = '';
    var shiftoptions = '';

    if (!isEmptyObj(shifts)) {
        var seletedShift = data.ShiftID;

        $.each(shifts, function (s) {
            var selected = shifts[s].ShiftID === seletedShift ? 'selected' : '';
            shiftoptions += '<option ' + selected + ' value="' + shifts[s].ShiftID + '">' + shifts[s].ShiftTitle + '</option>';
        });

    }



    templateself +=

        '<div class="row">' +
        '<div class="surveyinfo">' +
        '<div class="col-xs-12">' +
        '<select disabled id="ddlShfit' + data.EmployeeID + '" class="form-control myselect ok ">' +
        '<option value="0">- Holiday -</option>' + shiftoptions + '</select>' +
        '</div>' +
        '</div>'
        ;

    if (data.EmployeeID !== parseInt(eid) && data.ScheduleDate !== '') {
        var _update = "'u'";
        var _delete = "'d'";
        btnTemplate =
            '<span onClick="editSchedule(' + data.EmployeeID + ',' + _update + ');" id="editsave' + data.EmployeeID + '" data-columnname="" toggle="#ddlShfit' + data.EmployeeID + '" ' +
            'class="fa fa-fw fa-pencil toggle-edit pull-right" style="font-size:18px;"></span>' +
            '<span onClick="editSchedule(' + data.EmployeeID + ',' + _delete + ');" id="editsave' + data.EmployeeID + '" data-columnname="" toggle="#ddlShfit' + data.EmployeeID + '" ' +
            'class="fa fa-fw fa-trash-o toggle-edit pull-right" style="font-size:18px;"></span>'
            ;

    }

    if (data.ScheduleDate === '') {
        var noScheduleFoundMessage = "No schedule found for this employee!";
        template =

            '<br><center><span style="color:#999;">' + noScheduleFoundMessage + '</span></center>' +
            '<div class="row" id="row' + data.EmployeeID + '" style="display:none;">' +
            '<div class="surveyinfo">' +
            '<div class="col-xs-12">' +
            '<select disabled id="ddlShfit' + data.EmployeeID + '" class="form-control myselect">' +
            '<option value="0">- select -</option>' + shiftoptions + '</select>' +
            '</div>' +
            '</div>'
            ;
        if (data.EmployeeID !== parseInt(eid)) {
            var _create = "'c'";
            btnTemplate =
                '<span onClick="editSchedule(' + data.EmployeeID + ',' + _create + ');" id="editsave' + data.EmployeeID + '" data-columnname="" toggle="#ddlShfit' + data.EmployeeID + '"' +
                'class="fa fa-fw fa-plus toggle-edit pull-right" style=""></span>' +
                '<span id="close' + data.EmployeeID + '" style="Display:none;" onClick="closeSchedule(' + data.EmployeeID + ',' + _create + ');"  data-columnname="" toggle="#ddlShfit' + data.EmployeeID + '"' +
                'class="fa fa-fw fa-close toggle-edit pull-right" style=""></span>'
                ;
        }
    } else {

        template =

            '<div class="row">' +
            '<div class="surveyinfo">' +
            '<div class="col-xs-4"><span class="surveylbl">In / Out Time</span></div>' +
            '<div class="col-xs-8"><span id="InDate" class="surveytxt"></span>' + data.StartingTime + ' - ' + data.EndingTime + '</div>' +
            '</div>' +
            '</div>' +
            '' + templateself + ''
    }

    if (data.EmployeeID === parseInt(eid)) {
        lineTemplate = '<div class="strike"><span>My Team Schedule</span></div>';
    }

    var hr = '';
    if (data.EmployeeID === parseInt(eid)) {
        hr = '<div class="strike"><span>My Schedule</span></div>';
    }

    return '' + hr + '<div id="box' + data.EmployeeID + '" class="panel panelshadow"><div class="panel-body"><span id="surveyTitle" class="surveytitle"><small><i class="fa fa-user" style="color:#999;">&nbsp;&nbsp;</i></small><a style="font-size: 16px;" href="#">' + data.EmployeeName + '<span class="badge btn-default">' + data.EmployeeRefNo + '</span></a>' + btnTemplate + '</span>' + template + '</div></div></div>' + lineTemplate + '';




}



function validate(ddl) {
    //console.log(ddl);
    if ($(ddl).val() === '0') {
        toastr.error('Please ! Select Shift First!');
        return false;
    } else {
        return true;
    }
}

var date = new Date();
$(function () {
    //$('#txtScheduleDate').val(date.toLocaleDateString());
    $('#prev').click(function () {
        date.setDate(date.getDate() - 1);
        //date.setDate(date($('#txtScheduleDate').val()) - 1);
        $('#txtScheduleDate').val(date.toLocaleDateString('en-GB'));
        //$('#ScheduleList').html('');
        populateScheduleDetailsList();

    });
    $('#next').click(function () {
        date.setDate(date.getDate() + 1);
        $('#txtScheduleDate').val(date.toLocaleDateString('en-GB'));
        //$('#ScheduleList').html('');
        populateScheduleDetailsList();
    });

    $('#txtScheduleDate').blur(function (e) {

        var d = DTHelper.GetNativeDate($('#txtScheduleDate').val(), dateformat);
        //console.log(d);
        //console.log(d.getDate());
        date.setDate(d.getDate());

        //console.log(date);
    });

});


$('#form1').submit(function (e) {
    var schdate = $('#txtScheduleDate');
    e.preventDefault();
    //toastr.success(schdate.val());
    populateScheduleDetailsList();
});



{/* <div class="row">
<div class="surveyinfo">
    <div class="col-xs-4"><span class="surveylbl">Out Time</span></div>
    <div class="col-xs-8"><span id="toDate" class="surveytxt"></span>${data.EndingTime}</div>
</div>
</div> */}

// <div class="row">
// <div class="surveyinfo">
//     <div class="col-xs-4"><span class="surveylbl">Schedule Day</span></div>
//     <div class="col-xs-8"><span id="fromDate" class="surveytxt" </span>${data.Day} </div> </div> </div>
//             <div class="row">
//             <div class="surveyinfo">
//                 <div class="col-xs-4"><span class="surveylbl">Sch. Date</span></div>
//                 <div class="col-xs-8"><span id="fromDate" class="surveytxt" </span>${data.ScheduleDate} </div>
//                         </div> </div>

// When the user scrolls the page, execute myFunction

jQuery(function ($) {
    function fixDiv() {
        var $cache = $('.fixedHeader');
        if ($(window).scrollTop() > 80) {

            $cache.addClass('sticky');
            $cache.fadeIn();
        }
        else {
            $cache.removeClass('sticky');
            $cache.fadeOut();
        }
    }
    $(window).scroll(fixDiv);
    fixDiv();
});