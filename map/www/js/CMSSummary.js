'use strict';

var varType;
var varUrl;
var varData;
var varContentType;
var varDataType;
var varProcessData;

var eid, uid, ecode, secKey, cid, lid, ename, dateformat;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');
dateformat = getLocalStorageItem_String('dateformat');

var txtFromDate = $('#txtFromDate');
var txtToDate = $('#txtToDate');

jQuery(function ($) {
    $('#datetimepicker,#datetimepicker1').datetimepicker({
        format: dateformat.toUpperCase(),
        ignoreReadonly: true
    });
    init();
});

function init() {
    txtFromDate.val(sysdate);
    txtToDate.val(sysdate);
    fillCustomer();



    funcFillDropDownListSelec2(10, "GetDataFromSelect2", $('#ddlProject'), function (params) {
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

        valueToPush["_PID1"] = "  tblProjectCustomer inner join tblProject ON tblProjectCustomer.ProjectID = tblProject.ProjectID ";
        valueToPush["_PID2"] = " tblProject.ProjectTitle as 'Title'";
        valueToPush["_PID3"] = " distinct tblProject.ProjectID as 'ID'";
        valueToPush["_PID4"] = " AND tblProject.ProjectTitle like '%" + params.term + "%'"; //and CustomerTitle like '%" + params.term + "%'

        valueToPush["page"] = params.page;
        return valueToPush;
    });

}

function fillCustomer() {
    funcFillDropDownListSelec2(10, "GetCustomerListJson", $('#ddlCustomer'), function (params) {
        var valueToPush = {};
        valueToPush["q"] = params.term;
        valueToPush["pagesize"] = 10;

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
        valueToPush["page"] = params.page;

        return valueToPush;
    });
}

$("#btnShow").click(function (e) {
    var SummaryType = $('#ddlType').val();
    if (SummaryType == 0) {
        toastr.error('Please select summary type first!');
        return;
    }

    if (SummaryType == 1) {
        populateSummary(SummaryType);
    } else if (SummaryType == 2) {
        populateRatingSummary();
    } else if (SummaryType == 3 || SummaryType == 4) {
        populateDaywiseComplainCount(SummaryType);
    }

});

function populateDaywiseComplainCount(ptype) {
    var customerID = $('#ddlCustomer').val() === null ? 0 : $('#ddlCustomer').val();
    var projectID = $('#ddlProject').val() === null ? 0 : $('#ddlProject').val();
    var template = '';
    var customerID = $('#ddlCustomer').val() === null ? 0 : $('#ddlCustomer').val();
    var pData = {
        pFromDate: txtFromDate.val(),
        pToDate: txtToDate.val(),
        pCustomerID: customerID,
        pProjectID: projectID,
        pType: ptype
    }
    $('#ratingsummary').html('');
    $('#summary').html(progress());
    postRequest('GetHelpdeskSummary', pData, function (r) {
        var d = JSON.parse(r.d);
        if (d.length > 0) {
            template = '<div class="panel panelshadow">' +
                '<div class="panel-body">' +
                '<div>' +
                '<div class="row">' +
                '<div class="surveyinfo">' +
                '<div class="">' +
                '<div class="cplaceholder">' +
                '<canvas id="linec" width="1000" height="300"></canvas>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            $('#summary').html(template);
            if (ptype == 3) {
                populateChartLine(d);
            } else {
                populateChartBar(d);
            }

        } else {
            $('#summary').html(data404());
        }

    });
}

function populateRatingSummary() {
    var customerID = $('#ddlCustomer').val() === null ? 0 : $('#ddlCustomer').val();
    var pData = {
        pFromDate: txtFromDate.val(),
        pToDate: txtToDate.val(),
        pCustomerID: customerID
    }
    $('#summary').html('');
    $('#ratingsummary').html(progress());
    postRequest('GetRatingSummary', pData, function (r) {
        var d = JSON.parse(r.d);
        var template = '';
        var template2 = '';
        var allOverTotalRating = 0;
        var allOverCountComplains = 0;
        var allOverAvgRating = 0;

        if (d.length <= 0) {
            template = data404();
            $('#ratingsummary').html(template);
            return;
        }

        template += '<div class="strike"><span>Employee Wise Average Rating(s)</span></div>';

        $.each(d, function (i, item) {
            allOverAvgRating += item.AvgRating;
            allOverCountComplains += item.TotalComplain;
            template +=
                '<li class="list-group-item lst">' +
                '<div>' +
                '<i class="fa fa-user"></i> ' + item.EmployeeName + ' ' +
                '<br>' +
                'Average rating for ' + item.TotalComplain + ' request(s)' + '' +
                '</div>' +
                '<div class="text-center starcontainer">' +
                generateStars(item.AvgRating.toFixed()) + '<span class="pull-right"><b>' + item.AvgRating.toFixed(2) + '</b></span>' +
                '</div>' +
                '</li>';
        });

        allOverAvgRating = allOverAvgRating / allOverCountComplains;

        template2 +=
            '<div class="strike"><span>Over All  Average Rating</span></div>' +
            '<li class="list-group-item">' +
            '<div>' +
            //'<i class="fa fa-circle"></i> All Over Rating ' +            
            'Average all over rating for ' + allOverCountComplains + ' request(s)' +
            '</div>' +
            '<div class="text-center starcontainer">' +
            generateStars(allOverAvgRating.toFixed()) + '<span class="pull-right"><b>' + allOverAvgRating.toFixed(2) + '</b></span>' +
            '</div>' +
            '</li>';

        $('#ratingsummary').html(template2 + template);

    });

}

function populateSummary(pType) {
    var customerID = $('#ddlCustomer').val() === null ? 0 : $('#ddlCustomer').val();
    var projectID = $('#ddlProject').val() === null ? 0 : $('#ddlProject').val();
    var pData = {
        pFromDate: txtFromDate.val(),
        pToDate: txtToDate.val(),
        pCustomerID: customerID,
        pProjectID: projectID,
        pType: pType
    }
    $('#ratingsummary').html('');
    $('#summary').html(progress());
    postRequest('GetHelpdeskSummary', pData, function (r) {
        var d = JSON.parse(r.d);
        var template = '';
        var template2 = '';
        var totalCount = 0;

        if (d.length <= 0) {
            template = data404();
            $('#summary').html(template);
            return;
        }

        $.each(d, function (i, item) {
            totalCount += item.Total;
            template2 += '<div class="col-xs-8"><span class="surveylbl">' + item.ComplainStatusTitle + '</span></div>' +
                '<div class="col-xs-4" style="text-align:right;"><span id="fromDate" class="surveytxt">' + item.Total + '</span></div>';
        });

        template = '<div class="panel panelshadow">' +
            '<div class="panel-body">' +
            '<div>' +
            '<div class="row">' +
            '<div class="surveyinfo">' +
            '<div class="col-xs-6"><span class="surveylbl">Total</span></div>' +
            '<div class="col-xs-6" style="text-align:right;"><span id="fromDate" class="surveytxt">' + totalCount + '</span></div>' +
            '<div class="col-xs-12 line"></div>' +
            template2 +
            '<div class="col-xs-12 line"></div>' +
            '<div class="col-xs-12">' +
            '<canvas id="piec" width="1000" height="400"></canvas>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        $('#summary').html(template);
        populateChart(d);

    });

}

function populateChart(d) {

    var options = {
        tickCallback: function (label, index, labels) { return ''; },
        tickCallbackX: function (label, index, labels) { return ''; },
        yAxesTitle: '',
        xAxesTitle: '',
        bgColorOpacity: 1,
        borderWidth: 2,
        showLine: false,
        legendVisible: true,
        maintainAspectRatio: false,
        datalabels: {
            color: '#333',
            formatter: function (value, context) {
                //console.log({ value, context });
                return value + '%'; //+ ' - ' + context.chart.data.labels[context.dataIndex]; //return value + '';
            },
            anchor: 'end',
            clamp: true,
            font: {
                family: 'segoe UI',
                size: 12
            }
        },

    }


    var obj = { label: [], data: [] };
    var per = 0;
    $.each(d, function (i, item) {
        per = (item.Total * 100) / getSum(d, 'Total');
        obj.label.push(item.ComplainStatusTitle);
        obj.data.push(per.toFixed(1));
    });

    DashboardHelper.createChart('piec', 'pie', obj.data, obj.label, '', false, options);
}

function populateChartLine(d) {

    var options = {
        tickCallback: function (label, index, labels) { return label + ''; },
        //tickCallbackX: function (label, index, labels) { return ''; },
        yAxesTitle: 'Total Complain(s)',
        xAxesTitle: 'Day(s)',
        bgColorOpacity: 0.2,
        borderWidth: 3,
        showLine: true,
        legendVisible: false,
        lineTension: 0,
        fill: true,
        xfontSize: 13,
        showGridLine: true,
        responsive: false,
        maintainAspectRatio: false,
        datalabels: {
            color: '#333',
            formatter: function (value, context) {
                //console.log({ value, context });
                return value + ''; //+ ' - ' + context.chart.data.labels[context.dataIndex]; //return value + '';
            },
            anchor: 'end',
            clamp: true,
            font: {
                family: 'segoe UI',
                size: 12
            }
        },

    }

    var obj = { label: [], data: [] };
    var per = 0;
    $.each(d, function (i, item) {
        obj.label.push(item.Date);
        obj.data.push(item.TotalComplains);
    });

    DashboardHelper.createChart('linec', 'line', obj.data, obj.label, '', false, options);
    //$('.placeholder').css('width', 'auto');
}

function populateChartBar(d) {

    var options = {
        tickCallback: function (label, index, labels) { return label + ''; },
        //tickCallbackX: function (label, index, labels) { return ''; },
        yAxesTitle: 'Total Complain(s)',
        xAxesTitle: 'Year-Month(s)',
        bgColorOpacity: 1,
        borderWidth: 1,
        showLine: true,
        legendVisible: false,
        lineTension: 0,
        fill: true,
        showGridLine: false,
        responsive: true,
        xfontSize: 13,
        maintainAspectRatio: false,
        datalabels: {
            color: '#333',
            formatter: function (value, context) {
                //console.log({ value, context });
                return value + ''; //+ ' - ' + context.chart.data.labels[context.dataIndex]; //return value + '';
            },
            anchor: 'center',
            clamp: true,
            font: {
                family: 'segoe UI',
                size: 12
            }
        },

    }

    var monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var obj = { label: [], data: [] };
    var per = 0;
    $.each(d, function (i, item) {
        var monthyear = '';
        var month = item.Date.split('-')[0];
        var year = item.Date.split('-')[1];
        monthyear = monthNames[month].substring(0, 3) + '-' + year.substring(2, 4);
        obj.label.push(monthyear);
        obj.data.push(item.TotalComplains);
    });

    DashboardHelper.createChart('linec', 'bar', obj.data, obj.label, '', false, options);
    //$('.placeholder').css('width', 'auto');
}




function generateStars(stars) {
    var template = '';
    var totalStars = 5;
    var filledStars = stars;
    var emptyStars = totalStars - filledStars;

    for (var i = 1; i <= filledStars; i++) {
        template += '<i class="fa fa-star fa-lg fastar"></i>';
    }

    for (var j = 1; j <= emptyStars; j++) {
        template += '<i class="fa fa-star-o fa-lg fastar"></i>';
    }
    return template;

}
