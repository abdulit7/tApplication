function renderHelpdeskDashboard(pFirstLoad, filterc) {

    //alert();
    var obj = {
        label: ['Pending', 'Open', 'Close', 'Waiting for Customer Response'],
        data: [4, 1, 11, 3]
    }
    //DashboardHelper.createChart('helpdeskstatussummary0', 'bar', obj.data, obj.label, '', false, options);

    //var params = { ' pYears: __Years, pMonths: __Month, pFilterCriteria: filterc };

    data = {
        pFromDate: $('#txtFromHelpdesk').val(),
        pToDate: $('#txtToHelpdesk').val(),
        pCustomerID: 0,
        pProjectID: 0,
        pType: 0,
        pFilterCriteria: filterc
    }


    GetHelpdeskSummary('helpdeskstatussummary0', data, 1);
    GetHelpdeskSummary('helpdeskstatussummary1', data, 3);


    GetHelpdeskSummary('helpdeskstatussummary2', data, 4);
    getRatingSummary();
    //DrillDownChart('helpdeskstatussummary1', data, 'ComplainStatusTitle', 'Total', 'sum', 'string', 'bar', {}, 'No of Complain(s)', 'Complain Status', '', '', '', '', '', '', '', '', '', '');

}

function GetHelpdeskSummary(ctx, data, pType) {

    data.pType = pType;

    //alert();
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetHelpdeskSummary', data, function (response) {
        //
        var res = JSON.parse(response.d);
        //console.log(res);


        $('#' + ctx + 'progress').remove();
        getHelpdeskDetail(ctx, res, pType)

    });
}


function getHelpdeskDetail(ctx, res, pType) {
    if (pType == 1) {
        var htemplate = '';
        var totalComplain = 0;
        $.each(res, function (i, item) {
            totalComplain += item.Total;
            htemplate += '<li class="list-group-item">' + item.ComplainStatusTitle + ' <span class="badge">' + item.Total + '<span></li>';
        })
        htemplate = '<li class="list-group-item list-group-item-info"><b>Total</b> <span class="badge">' + totalComplain + '</span></li>' + htemplate;
        $('#listhelpdeskstatussummary').html(htemplate);

        $.each(res, function (i, item) {
            item.age = (item.Total / totalComplain) * 100;
        })

        DrillDownChart(ctx, res, 'ComplainStatusTitle', 'age', 'sum', 'string', 'pie', {}, '', '', '', '', '', '%', '', '', '', '', '', '');
    } else if (pType == 3) {
        DrillDownChart(ctx, res, 'ComplainDate', 'ID', 'count', 'string', 'line', { fill: true }, 'Complain(s)', 'Complain Date', '', '', '', '', null, null, null, null, null, null, 'Day Wise Complain Count');
        //DrillDownChart(ctx, res, 'ComplainDate', 'ID', 'count', 'string', 'line', { fill: true }, 'Complain(s)', 'Complain Date', '', '', '', '', '', '', '', '', '', '', 'Day Wise Complain Count');
    } else if (pType == 4) {
        //DrillDownChart2(ctx, res, false, "", "Month", "ID", "count", "ID", "bar", 'string', 0);
        DrillDownChart(ctx, res, 'Date', 'ID', 'count', 'string', 'bar', { fill: true }, 'Complain(s)', 'Month(s)', '', '', '', '');
    }
}



function getRatingSummary() {

    function helpdeskDataForamt(data) {
        var mm = data.split('/')[0];
        var dd = data.split('/')[1];
        var yy = data.split('/')[2];
        return dd + '/' + mm + '/' + yy;
    }
    var data = {
        pFromDate: helpdeskDataForamt($('#txtFromHelpdesk').val()),
        pToDate: helpdeskDataForamt($('#txtToHelpdesk').val()),
        pCustomerID: 0,
        //pProjectID: 0,
        //pType: 0,
        //pFilterCriteria: filterc
    }
    postRequestD('wsttmapp.asmx/GetRatingSummaryWeb', data, function (response) {
        //$('#' + ctx + 'progress').remove();
        var d = JSON.parse(response.d);
        //console.log(res);
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
                generateStars(item.AvgRating.toFixed()) + '<span class="pull-right"><b>' + item.AvgRating + '</b></span>' +
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