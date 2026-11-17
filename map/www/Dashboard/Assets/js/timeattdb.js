function renderAttendanceTimeAnalysisDashboard(pFirstLoad, filterc) {
    vyears = typeof globalpayrrolFilter.Years === 'object' ? globalpayrrolFilter.Years.join(',') : globalpayrrolFilter.Years[0];
    var pdata1 = { pYears: vyears, pMonths: __Month, pType: "summary", pDetailDataFilter: '', pAdditionalDetailWhereClause: '', pFilterCriteria: filterc };
    var pdata2 = { pYears: vyears, pMonths: __Month, pType: "earlygoing", pDetailDataFilter: '', pAdditionalDetailWhereClause: '', pFilterCriteria: filterc };
    var pdata3 = { pYears: vyears, pMonths: __Month, pType: "leave", pDetailDataFilter: '', pAdditionalDetailWhereClause: '', pFilterCriteria: filterc };
    var pdata4 = { pYears: vyears, pMonths: __Month, pType: "ontime", pDetailDataFilter: '', pAdditionalDetailWhereClause: '', pFilterCriteria: filterc };
    var pdata5 = { pYears: vyears, pMonths: __Month, pType: "late", pDetailDataFilter: '', pAdditionalDetailWhereClause: '', pFilterCriteria: filterc };
    var pdata6 = { pYears: vyears, pMonths: __Month, pType: "halfday", pDetailDataFilter: '', pAdditionalDetailWhereClause: '', pFilterCriteria: filterc };

    setTimeout(() => {
        GetAttendanceTimeAnalysis('AttendanceTimeAnalysisCanvas', pdata1);
    }, 500)
    setTimeout(() => {
        GetAnalysisOfFullDayLeave('AnalysisOfFullDayLeaveCanvas', pdata3);
    }, 600)
    setTimeout(() => {
        GetAnalysisOfOnTime('AnalysisOfOnTimeCanvas', pdata4);
    }, 700)
    setTimeout(() => {
        GetAnalysisOfLateArrival('AnalysisOfLateArrivalCanvas', pdata5);
    }, 800)
    setTimeout(() => {
        GetAnalysisOfHalfDay('AnalysisOfHalfDayCanvas', pdata6);
    }, 900)
    setTimeout(() => {
        GetAnalysisOfEarlyGoing('AnalysisOfEarlyGoingCanvas', pdata2);
    }, 1000)

}
function GetAttendanceTimeAnalysis(ctx, data) {

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetAttendanceTimeAnalysis', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);

        var options = {
            fill: false,
            legend: {
                position: 'right',
            }
        }

        DrillDownChartSumLogic(ctx, res.dt1, "FlagTitle", "FlagValue", "sum", "string", "pie", options, '', '', '', 'top', '', '%', null, 2, false, false, true, -1);

        GenerateDataTable("AttendanceTimeAnalysisTbl", res.dt1, [], true)
        return;

    });



}
function GetAnalysisOfFullDayLeave(ctx, data) {

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetAnalysisOfOnLeave', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);

        var options = {
            fill: false,
            legend: {
                display: false,
                position: 'top',
            },
            excludeColumns: [
                'EmpID'
            ]
        }

        DrillDownChartSumLogic(ctx, res.dt1, "EmployeeName", "FlagValue", "sum", "string", "bar", options, '', '', '', 'top', '', '%', null, 2, false, false, true, -1);

        GenerateDataTable("AnalysisOfFullDayLeaveTbl", res.dtPivot, options.excludeColumns, false);
        return;

    });



}
function GetAnalysisOfOnTime(ctx, data) {

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetAnalysisOfOnTime', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);

        var options = {
            fill: false,
            legend: {
                display: false,
                position: 'top',
            },
            excludeColumns: [
                'EmpID'
            ]
        }

        DrillDownChartSumLogic(ctx, res.dt1, "EmployeeName", "FlagValue", "sum", "string", "bar", options, '', '', '', 'top', '', '%', null, 2, false, false, true, -1);
        GenerateDataTable("AnalysisOfOnTimeTbl", res.dtPivot, options.excludeColumns, false);

        return;

    });



}
function GetAnalysisOfLateArrival(ctx, data) {

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetAnalysisOfLate', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);

        var options = {
            fill: false,
            legend: {
                display: false,
                position: 'top',
            },
            excludeColumns: [
                'EmpID'
            ]
        }

        DrillDownChartSumLogic(ctx, res.dt1, "EmployeeName", "FlagValue", "sum", "string", "bar", options, '', '', '', 'top', '', '%', null, 2, false, false, true, -1);
        GenerateDataTable("AnalysisOfLateArrivalTbl", res.dtPivot, options.excludeColumns, false);

        return;

    });



}
function GetAnalysisOfHalfDay(ctx, data) {

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetAnalysisOfHalfDay', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);

        var options = {
            fill: false,
            legend: {
                display: false,
                position: 'top',
            },
            excludeColumns: [
                'EmpID'
            ]
        }

        DrillDownChartSumLogic(ctx, res.dt1, "EmployeeName", "FlagValue", "sum", "string", "bar", options, '', '', '', 'top', '', '%', null, 2, false, false, true, -1);
        GenerateDataTable("AnalysisOfHalfDayTbl", res.dtPivot, options.excludeColumns, false);

        return;

    });



}
function GetAnalysisOfEarlyGoing(ctx, data) {

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetAnalysisOfEarlyGoing', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);
        var options = {
            fill: false,
            legend: {
                display: false,
                position: 'top'
            },
            excludeColumns: [
                'EmpID'
            ]
        }

        DrillDownChartSumLogic(ctx, res.dt1, "EmployeeName", "FlagValue", "sum", "string", "bar", options, '', '', '', 'top', '', '%', null, 2, false, false, true, -1);
        GenerateDataTable("AnalysisOfEarlyGoingTbl", res.dtPivot, options.excludeColumns, false);

        return;

    });



}

function GenerateDataTable(ctx, data, excludeColumns, IsSummary) {

    $('#emptyDataElement').empty();
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="padding:10%;position:absolute;left:45%;"></div>');

    $('#' + ctx + 'progress').remove();

    var ProductsName = data;

    if (IsSummary == true) {
        ProductsName = alasql('select FlagTitle,Sum(FlagValue) as FlagValue from ? Group By FlagTitle', [data]);
    }
    else {
        if (ProductsName.length > 0) {
            var ColArray = Object.keys(ProductsName[0]);
            var removeArrayItems = ["EmpID", "EmployeeName"];

            ColArray = ColArray.filter(x => !removeArrayItems.includes(x));
            ProductsName = ProductsName.map(function (item) {
                var totalFlagValues = 0;
                jQuery.each(ColArray, function (c, col) {
                    totalFlagValues = totalFlagValues + parseInt(item[col]);
                });
                item["Total"] = totalFlagValues;
                return item;
            });
        }
    }

    if ((ProductsName.length > 0)) {

        if (excludeColumns.length > 0) {
            ProductsName = ProductsName.map(function (item) {
                jQuery.each(excludeColumns, function (c, col) {
                    delete item[col];
                })
                return item;
            });
        }

        
        if (IsSummary == false) {
            var totalCol = pData = alasql('select Sum(Total) as Total from ?', [ProductsName]);
            ProductsName = ProductsName.map(function (item) {
                var totalAvg = ((parseFloat(item["Total"]) / parseFloat(totalCol[0]['Total'])) * 100).toFixed(2);
                item["Analysis"] = totalAvg + " %";
                return item;
            });
        }
        else {
            var totalCol = pData = alasql('select Sum(FlagValue) as Total from ?', [ProductsName]);
            ProductsName = ProductsName.map(function (item) {
                var totalAvg = ((parseFloat(item["FlagValue"]) / parseFloat(totalCol[0]['Total'])) * 100).toFixed(2);
                item["Analysis"] = totalAvg + " %";
                return item;
            });
        }

        $('#' + ctx).empty();
        $('#' + ctx).append(CreateTableFromJSONWithFooter(ctx+'drilltbl',ProductsName));
       
        var table = $('#' + ctx + 'drilltbl').DataTable({
            responsive: true,
            bDestroy: true,
            footerCallback: function (row, data, start, end, display) {
               
                var api = this.api();

                var intVal = function (i) {
                    return typeof i === 'string' ? i.replaceAll('%', '') * 1 : typeof i === 'number' ? i : 0;
                };

                var ColArray = Object.keys(data[0]);
                for (var i = 2; i < ColArray.length; i++){

                    if (i == ColArray.length - 1) {
                        total = "100 %";
                        pageTotal = api
                            .column(i, { page: 'current' })
                            .data()
                            .reduce(function (a, b) {
                                var total = (parseFloat(intVal(a)) + parseFloat(intVal(b))).toFixed(2);
                                if (total > 100) {
                                    total = 100;
                                }
                                return total +' %';
                            }, 0);
                    } else {
                        total = api
                            .column(i)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + Math.round(intVal(b));
                            }, 0);

                        pageTotal = api
                            .column(i, { page: 'current' })
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);
                    }
                   

                    $(api.column(i).footer()).html('Page Total:' + pageTotal + ' (' + total + ' Total)');
                   
                }

            },
        });
        /*$('#' + ctx + 'drilltbl').addClass('show');*/
        $('.dataTables_filter input').addClass('show');
    } else {
        $('#' + ctx).empty();
        $('#' + ctx).append("<div id='emptyDataElement' style='padding:10%;'><h3>Data Not Available...</h3></div>");
    }
    return;
}