'use strict';


var eid, uid, ecode, secKey, cid, lid, ename, isAdmin;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');
isAdmin = getLocalStorageItem_String('isAdmin');
var intimationDays = getParameterByName('intimationDays');
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
$(function () {

    intimationDays = !intimationDays ? 60 : intimationDays;
    if (intimationDays == 0) { $('#result').html(center('Something went wrong! Try Again!')); return; }

    var intimations = [
        {
            IntimationTitle: 'Confirmation Due under ' + intimationDays + ' days',
            placeholderID: 'data1',
            IntimationType: 'confirmation',
            ColumnTitle: 'Confirmation Due',
            DBColumnName: 'ConfirmationDueDate',
            IsDateColumn: true,
            Visible: true,

        },
        {
            IntimationTitle: 'Contract Ends under ' + intimationDays + ' days',
            placeholderID: 'data2',
            IntimationType: 'contract',
            ColumnTitle: 'Contract End',
            DBColumnName: 'ContractEndDate',
            IsDateColumn: true,
            Visible: true,
        },
        {
            IntimationTitle: 'CNIC Expiry under ' + intimationDays + ' days',
            placeholderID: 'data3',
            IntimationType: 'cnicexpiry',
            ColumnTitle: 'CNIC Expiry',
            DBColumnName: 'CNICExpiry',
            IsDateColumn: true,
            Visible: true,
        },
        {
            IntimationTitle: 'Retirement under ' + intimationDays + ' days',
            placeholderID: 'data4',
            IntimationType: 'retirement',
            ColumnTitle: 'Retirement Date',
            DBColumnName: 'RetirementDate',
            IsDateColumn: true,
            Visible: true,
        },
        {
            IntimationTitle: 'Next Appraisal under ' + intimationDays + ' days',
            placeholderID: 'data5',
            IntimationType: 'nextappraisal',
            ColumnTitle: 'Next Appraisal',
            DBColumnName: 'NextAppraisalDate',
            IsDateColumn: true,
            Visible: true,
        },
        {
            IntimationTitle: 'Today\'s Birthday &nbsp;<i class="fa fa-birthday-cake fa-lg"></i>',
            placeholderID: 'data6',
            IntimationType: 'birthday',
            ColumnTitle: 'Birth Day',
            DBColumnName: 'Birthdate',
            IsDateColumn: false,
            Visible: true,
        },
        {
            IntimationTitle: months[new Date().getMonth()] + '\'s Birthday &nbsp;<i class="fa fa-birthday-cake fa-lg"></i>',
            placeholderID: 'data7',
            IntimationType: 'birthdaymonthly',
            ColumnTitle: 'Birth Day',
            DBColumnName: 'Birthdate',
            IsDateColumn: false,
            Visible: true,
        },
        {
            IntimationTitle: 'Today\'s Work Anniversary &nbsp;<i class="fa fa-birthday-cake fa-lg"></i>',
            placeholderID: 'data8',
            IntimationType: 'jobanniversary',
            ColumnTitle: 'Appoint. Day',
            DBColumnName: 'AppointmentDate',
            IsDateColumn: false,
            Visible: true,
        },
        {
            IntimationTitle: months[new Date().getMonth()] + '\'s Work Anniversary &nbsp;<i class="fa fa-birthday-cake fa-lg"></i>',
            placeholderID: 'data9',
            IntimationType: 'jobanniversarymonthly',
            ColumnTitle: 'Appoint. Day',
            DBColumnName: 'AppointmentDate',
            IsDateColumn: false,
            Visible: true,
        },
    ];

    var sourcepage = location.href.split("/").slice(-1);
    $('#result').before('<div id="progress"><br>' + progress('Please wait ') + '<br></div>');
    //$('#result').hide();
    $.each(intimations, function (i, item) {
        if (!item.Visible) { return; }
        var template = '';
        $('#result').append(makeCollpase(item.placeholderID, item.IntimationTitle));
        postRequest('GetIntimation', { pIntimationType: item.IntimationType }, function (r) {
            r = JSON.parse(r.d);
            //console.log({ r });
            template = '';
            $('#totalCount' + item.placeholderID).html(r.length);
            if (r.length > 0) {
                var _date_;
                $.each(r, function (j, jitem) {
                    _date_ = item.IsDateColumn ? getFormattedDateNew(jitem[item.DBColumnName]) : jitem[item.DBColumnName];
                    template += '<li class="list-group-item">' +
                        //'<a class="employeeName" href="ViewProfileCompany.html?eid=' + jitem.EmployeeID + '&source=' + sourcepage + '">' + getIcon('user') + jitem.EmployeeRefNo + ' | ' + jitem.EmployeeName + '&nbsp;' + getIcon('external-link') + '</a>' +
                        '<a class="employeeName" onclick="gotoDetail(' + jitem.EmployeeID + ',\'' + sourcepage + '\');" >' + getIcon('user') + jitem.EmployeeRefNo + ' | ' + jitem.EmployeeName + '&nbsp;' + getIcon('external-link') + '</a>' +
                        '<table class="table table-sm table-bordered table-responsive table-condensed"><tr>' +
                        '<td style="width:50%">' + item.ColumnTitle + '</td>' +
                        '<td>' + _date_ + '</td>' +
                        '</tr></table>' +
                        '</li>';
                });
                jQuery('#boxno' + item.placeholderID).css('display', '');

            } else {
                template = '';//center('No Data Found!');
                $('#' + item.placeholderID).html('');
                //jQuery('#boxno' + item.placeholderID).hide();
            }


            $('#' + item.placeholderID).html(template);
            $('#progress').remove();
            $('#result').fadeIn();
        });
    });
});

function makeCollpase(pID, pTitle, pTotal) {
    return '<div id="boxno' + pID + '" class="panel-group" style="display:none;">' +
        '<div class="panel panel-default">' +
        '<div class="panel-heading" style="box-shadow: 0px -2px 5px #ddd;border-bottom: 2px solid ' + getThemeColor() + ';">' +
        '<h4 class="panel-title">' +
        '<a style="font-weight:600;color:#999 !important;" data-toggle="collapse" href="#c' + pID + '"><span class="label label-default pull-riht" id="totalCount' + pID + '"></span>&nbsp;' + pTitle + ' &nbsp;</a>' +
        '</h4>' +
        '</div>' +
        '<div id="c' + pID + '" class="panel-collapse collapse">' +
        '<ul class="list-group" id="' + pID + '">' +
        '</ul>' +
        '<div class="panel-footer hide">Footer</div>' +
        '</div>' +
        '</div>' +
        '</div>';
}

function gotoDetail(pEmpID, sourcePage) {
    if (isAdmin === '1') {
        window.location.href = 'ViewProfileCompany.html?eid=' + pEmpID + '&source=' + sourcePage + '';
    }
}
