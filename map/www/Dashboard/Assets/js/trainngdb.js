

function renderTrainingDashboard(pFirstLoad, filterc) {
    trainingDashboard.loadAllTrainingDashboard(['tc1', 'tc2', 'tc3', 'tc4']);
}

var trainingDashboard = {};

trainingDashboard.loadAllTrainingDashboard = function (ctxArr) {

    var __Years = typeof globalpayrrolFilter.Years === 'object' ? globalpayrrolFilter.Years.join(',') : globalpayrrolFilter.Years[0];
    var __Month = typeof globalpayrrolFilter.Months === 'object' ? globalpayrrolFilter.Months.join(',') : '';
    var params = { pYears: __Years, pMonths: __Month, pFilterCriteria: globalFilter };

    jQuery.each(ctxArr, function (i, ctx) { showChartLoader(ctx); })

    var traningSummmary = {};
    traningSummmary.totalCompletedTrainings = 0;
    traningSummmary.totalNoOfParticipants = 0;
    traningSummmary.totalTrainingManHours = 0;
    traningSummmary.totalTrainingCosts = 0;
    traningSummmary.totalCostsPerPerson = 0;
    traningSummmary.totalAbsent = 0;

    for (var key in traningSummmary) {
        jQuery('#' + key).html(progress());
    }

    postRequestD('GetTrainingDataForDashboard', params, function (r) {

        r = JSON.parse(r.d);

        var summaryData = r;

        jQuery.each(summaryData, function (i, item) {
            item['TrainingManHours'] = item['Training Man Hours'];
            item['TrainingCosts'] = item['Training Costs'];

        });

        traningSummmary.totalCount = alasql('select count(EmployeeID) as totalCount From ? where  lower(Status)  in ("attended","feedback","evaluated","certificateissued")', [summaryData]);
        traningSummmary.totalCompletedTrainings = alasql('select count(distinct TrainingID) as totalCompletedTrainings From ? where Year is not null', [summaryData]);
        traningSummmary.totalNoOfParticipants = alasql('select count(distinct EmployeeID) as totalNoOfParticipants From ? where lower(Status) in ("attended","feedback","evaluated","certificateissued") and Year is not null', [summaryData]);
        traningSummmary.totalTrainingManHours = alasql('select sum(TrainingManHours) as totalTrainingManHours  From ?  where lower(Status) in ("attended","feedback","evaluated","certificateissued") and Year is not null', [summaryData]);
        traningSummmary.totalTrainingCosts = alasql('select sum(distinct TrainingCosts) as totalTrainingCosts  From ?  where lower(Status) in ("attended","feedback","evaluated","certificateissued") and Year is not null', [summaryData]);
        traningSummmary.totalCostsPerPerson = alasql('select sum(distinct TrainingCosts) / count(distinct EmployeeID) as totalCostsPerPerson  From ?  where lower(Status) in ("attended","feedback","evaluated","certificateissued") and Year is not null', [summaryData]);

        var totalAbsent = alasql('select count(distinct EmployeeID) as totalAbsent  From ?  where lower(Status) NOT IN ("attended","feedback","evaluated","certificateissued") and lower(Status) IN ("nominated") ', [summaryData]);

        traningSummmary.totalAbsent = totalAbsent;

        for (var key in traningSummmary) {
            var val = traningSummmary[key][0][key];

            if (key == 'totalTrainingCosts' || key == 'totalCostsPerPerson') {
                val = val / 1000;
            }

            if (key == 'totalAbsent') {
                console.log(traningSummmary);
                
                    val = (traningSummmary['totalNoOfParticipants'][0]['totalNoOfParticipants'] /
                            (traningSummmary['totalNoOfParticipants'][0]['totalNoOfParticipants'] + traningSummmary['totalAbsent'][0]['totalAbsent'])) * 100
                    
                //alert(val);
                //if (traningSummmary['totalNoOfParticipants'][0]['totalNoOfParticipants'] != 0) {
                //    val =  traningSummmary['totalCount'][0]['totalCount'] / 100;
                //} else {
                //    val = 0;
                //}
            }

            if (key != 'totalCount') {

                val = val.toFixed(2);

                if (key == 'totalTrainingCosts' || key == 'totalCostsPerPerson') {
                    if (val > 0) {
                        val = val + ' K'
                    }
                }

                if (key == 'totalAbsent') {
                    if (val > 0) {
                        val = val + ' %'
                    }
                }
                jQuery('#' + key).html(val);
            }
        }

        jQuery.each(ctxArr, function (i, ctx) { removeChartLoader(ctx); })
        var d = alasql('select * From ? where lower(Status) in ("attended","feedback","evaluated","certificateissued") and Year is not null', [r]);
        trainingDashboard.noOfParticipantsByTraining('tc1', d);
        trainingDashboard.trainingsByCategory('tc2', d);
        trainingDashboard.trainingsByType('tc3', d);
        trainingDashboard.trainingshoursByMonth('tc4', d);
    });

}

trainingDashboard.noOfParticipantsByTraining = function (ctx, r) {
    var options = {
        fill: false, excludeColumns: ['TrainingID', 'Training', 'CompanyID', 'Year', 'Month'], legend: { position: 'right', },
        layout: {
            padding: {
                left: 30,
                right: 30
            }
        }

    }


    DrillDownChart(ctx, r, 'Training', 'EmployeeID', 'count', 'string', 'horizontalBar', options, '', 'No of Participants', '', 'middle', '', '', 'linear', 0, true, true, false, 'TrainingTitle', '');
}

trainingDashboard.trainingsByCategory = function (ctx, r) {
    jQuery.each(r, function (i, item) {
        item['TrainingCategory'] = item['Training Category'];
    })
    var options = { fill: false, excludeColumns: ['TrainingID', 'Training', 'CompanyID', 'Year', 'Month', 'TrainingCategory'], legend: { position: 'right', } }
    DrillDownChart(ctx, r, "TrainingCategory", "TrainingCategory", "count", "string", "doughnut", options, '', '', '', 'top', '', '%', null, 0, false, false, true, -1);
}

trainingDashboard.trainingsByType = function (ctx, r) {
    jQuery.each(r, function (i, item) {
        item['TrainingType'] = item['Training Type'];
    })
    var options = { fill: false, excludeColumns: ['TrainingID', 'Training', 'CompanyID', 'Year', 'Month', 'TrainingType'], legend: { position: 'right', } }
    DrillDownChart(ctx, r, "TrainingType", "TrainingType", "count", "string", "doughnut", options, '', '', '', 'top', '', '%', null, 0, false, false, true, -1);
}

trainingDashboard.trainingshoursByMonth = function (ctx, r) {
    jQuery.each(r, function (i, item) {
        item['TrainingType'] = item['Training Type'];
        item['Year'] = String(item['Year']);
        item['MonthName'] = monthNames[item['Month'] - 1];
    })
    var options = { fill: false, excludeColumns: ['TrainingID', 'Training', 'CompanyID', 'Year', 'Month', 'TrainingType'], legend: { position: 'right', } }
    r = alasql('select * From ? order by Month', [r]);
    DrillDownChart2(ctx, r, false, "", "Year", "TrainingID", "sum", "MonthName", "line", 'string', 0);
}


//Useful Trash -  ==== Don't Delete it ====

//console.log(data);

    //var numberOfParticipitants = alasql('select count("EmployeeID") as, sum("TotalTrainingManHours") , sum("TotalTrainingCost") , sum("TotalTrainingCost") / count("EmployeeID")  from ? ', [data]);

    //console.log(numberOfParticipitants);

    // var options = {
    //     fill: false,
    //     legend: {
    //         position: 'right',
    //     }
    // }

    //DrillDownChart('tc2', data, "TrainingTitle", "EmployeeID", "count", "string", "doughnut", options, '', '', '', 'top', '', '%', null, 2, false, false, true, -1);
    //DrillDownChart('test2', data, 'TrainingCategoryTitle', 'TrainingCategoryTitle', 'count', 'string', 'doughnut', {}, 'No of Participants', 'Training(s)', '', 'top', '', '');

    //DrillDownChart('test3', data, 'CompleteMonth', 'TotalTrainingHours', 'sum', 'number', 'line', options, 'No of Participants', 'Training(s)', '', 'top', '', '');
    //DrillDownChart('test3', data, 'CompleteMonth', 'TotalTrainingHours', 'count', 'number', 'line', {}, 'No of Participants', 'Training(s)', '', 'top', '', '');
    //DrillDownChart2('test3', data, false, "", "CompleteYear", "EmployeeRefNo", "sum", "CompleteMonth", "stackBar", 'number', 0);

    // jQuery.each(data, function(i, item) {
    //     item.TotalTrainingHours = parseFloat(item.TotalTrainingHours)
    // })

    //DrillDownChart('tc2', data, "TrainingCategoryTitle", "TrainingCategoryTitle", "count", "string", "doughnut", options, '', '', '', 'top', '', '%', null, 2, false, false, true, -1);
    //DrillDownChart('tc3', data, "TrainingCategoryTitle", "TrainingTypeTitle ID", "count", "string", "doughnut", options, '', '', '', 'top', '', '%', null, 2, false, false, true, -1);

    // DrillDownChart2('tc4', data, false, "", "CompleteYear", "TotalTrainingHours", "sum", "CompleteMonth", "line", 'string', 0);