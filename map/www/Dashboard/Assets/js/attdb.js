function renderAttendanceDashboard(pFirstLoad, filterc) {

    vyears = typeof globalpayrrolFilter.Years === 'object' ? globalpayrrolFilter.Years.join(',') : globalpayrrolFilter.Years[0];
    var pdata4 = { pYears: vyears, pMonths: __Month, pReturnDataType: "summary", pDetailDataFilter: '', pAdditionalDetailWhereClause: '',pIsfromMobile:false, pFilterCriteria: filterc };
    GetAbsentism('absenteeismbydept', pdata4);

    var pdata6 = { pYears: getYears(2, new Date().getFullYear() - 1),pIsfromMobile:false, pFilterCriteria: filterc };
    AbsentismLast3Year('absenteeismlast3yrs', pdata6);

    vyears = pFirstLoad == 1 ? '2019' : vyears;
    if (pFirstLoad == undefined) {
        pFirstLoad = 0;
    }
    var pdata3 = { pFirstLoad: pFirstLoad, pYears: vyears, pMonths: __Month, pFilterCriteria: filterc };
    //AvgOTByAgeGroup('avgotage', pdata3);
    GetAttendanceSummary(pdata3);
    pdata3 = { pFirstLoad: pFirstLoad, pYears: getYears(9, new Date().getFullYear()), pMonths: __Month, pFilterCriteria: filterc };
    //YearlyAvgOTHours('yearlyavhothrs', pdata3);

}



function AvgOTByAgeGroup(ctx, data) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');

    var fixedGroup = ['<25', '25-35', '35-45', '45-55', '>55'];

    postRequestD('GetAverageOverTimeByAgeGroup', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var _d = JSON.parse(response.d);
        ////console.log({ _d });

        $.each(fixedGroup, function (g, group) {
            var data = _d.filter(function (value) { return value.AgeGroup == group; });
            if (data.length <= 0) {
                _d.push(
                    {
                        AgeGroup: group,
                        AgeGroupOorder: g,
                        OTMins: 0
                    }
                );
            }
        });

        _d.sort(function (a, b) { return a.AgeGroupOorder - b.AgeGroupOorder; });

        var lbls = [];
        var _data = [];
        $.each(_d, function (i, item) {
            lbls.push(item.AgeGroup);
            var per = item.OTHours > 0 ? item.OTHours.toFixed(2) : 0; //item.NoOfEmployees * 100.0 / total;
            _data.push(parseFloat(per));
        });


        var options = {
            dataLabelText: ' (h)'
            // tickCallback: function (label, index, labels) { return label + ' %'; },
            // yAxesTitle: 'Hour(s)',
            // xAxesTitle: 'Age Group',
            // bgColorOpacity: 0.6,
            // borderWidth: 0,
            // datalabels: {
            //     color: '#333',
            //     formatter: function (value, context) {
            //         return value + ' (h)';
            //     },
            //     font: {
            //         Family: 'segoe UI',
            //         size: 12,
            //         weight: 'light'
            //     }
            // },
            // legendVisible: false

        }

        var obj = {
            label: lbls.filter(onlyUnique),
            data: _data
        };

        DashboardHelper.chartBasic(ctx, obj, 'bar', options);
        //DashboardHelper.createChart(ctx, 'bar', obj.data, obj.label, '', false, options);
    });

}


function GetAttendanceSummary(data) {
    data.pDate = $('#txtDashboardDate').val(); //'11/06/2019';
    data.pType = 'summary';
    data.pIsfromMobile = false;

    var txtAttTotal = $('#txtAttTotal');
    var txtAttStrength = $('#txtAttStrength');
    var txtAttPresent = $('#txtAttPresent');
    var txtAttAbsent = $('#txtAttAbsent');
    var txtAttLeave = $('#txtAttLeave');

    txtAttTotal.html(progress());
    txtAttStrength.html(progress());
    txtAttPresent.html(progress());
    txtAttAbsent.html(progress());
    txtAttLeave.html(progress());

    postRequestD('GetAttendanceSummary', data, function (response) {
        var _d = JSON.parse(response.d);
        if (_d.length > 0) {
            var att = _d[0];
            txtAttTotal.html(att.Total);
            txtAttStrength.html(att.Strength);
            txtAttPresent.html(att.Present);
            txtAttAbsent.html(att.Absent);
            txtAttLeave.html(att.Leave);

            jQuery('#txtAttStrength,#txtAttPresent,#txtAttAbsent,#txtAttLeave,#txtAttTotal').off('click').on('click', function (e) {
                e.preventDefault();
                //alert(jQuery(this).attr('id'));
                var type = jQuery(this).attr('id').slice(6, this.length);
                var displayDate = data.pDate.split('/')[1] + '-' + monthNames[data.pDate.split('/')[0] - 1] + '-' + data.pDate.split('/')[2];
                var modalHeading = jQuery(this).attr('id').slice(6, this.length) + ' - ' + displayDate;
                //console.log({ type, data });
                data.pDate = $('#txtDashboardDate').val();
                data.pType = type;
                doModalProgress2(type, modalHeading, 'GetAttendanceSummary', data);
            });
        } else {
            txtAttStrength.html(0); txtAttPresent.html(0); txtAttAbsent.html(0); txtAttLeave.html(0), txtAttTotal.html(0);
        }


    });
}


function AbsentismLast3Year(ctx, data) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');

    postRequestD('GetAverageAbsentism', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var _d = JSON.parse(response.d);
        //////////console.log({ _d });

        var lbls = [];
        var _data = [];
        $.each(_d, function (i, item) {
            lbls.push(item.Year);
            _data.push(parseFloat(item.Average.toFixed(2)));

        });



        var options = {
            tickCallback: function (label, index, labels) { return label + ''; },
            yAxesTitle: 'Hour(s)',
            xAxesTitle: 'Year',
            bgColorOpacity: 0.6,
            borderWidth: 0,
            lineTension: 0,
            datalabels: {
                color: '#333',
                formatter: function (value, context) {
                    return value + '';
                },
                font: {
                    Family: 'segoe UI',
                    size: 12,
                    weight: 'light'
                },
                align: 'bottom'
            },
            legendVisible: true,
            fill: false,
            lineTension: 0,
            borderColor: 'orange',
            borderWidth: 0,
            borderDash: [4, 5],
            backgroundColor: 'orange',
            pointRadius: 4,
            pointHoverRadius: 1,
            pointBackgroundColor: 'orange',
            legendVisible: false,

        }

        var obj = {
            label: lbls,
            data: _data
        }


        //doughnut
        DashboardHelper.createChart(ctx, 'line', obj.data, obj.label, 'Avg OT By Year', false, options);

    });


}

function YearlyAvgOTHours(ctx, data) {

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');



    postRequestD('GetYealyAverageOverTimeHours', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var _d = JSON.parse(response.d);
        //console.log({ _d });

        var lbls = [];
        var _data = [];
        $.each(_d, function (i, item) {
            lbls.push(item.Year);
            var per = item.OTHours > 0 ? item.OTHours.toFixed(2) : 0; //item.NoOfEmployees * 100.0 / total;
            _data.push(parseFloat(per));
        });


        // var options = {
        //     dataLabelText: ' (h)'
        // }

        var options = {
            tickCallback: function (label, index, labels) { return label + ''; },
            yAxesTitle: 'Hour(s)',
            xAxesTitle: 'Year',
            bgColorOpacity: 0.6,
            borderWidth: 0,
            lineTension: 0,
            datalabels: {
                color: '#333',
                formatter: function (value, context) {
                    return '';
                },
                font: {
                    Family: 'segoe UI',
                    size: 12,
                    weight: 'light'
                }
            },
            legendVisible: true,
            fill: false,
            lineTension: 0.3,
            borderColor: '',
            borderWidth: 4,
            borderDash: [2, 2],
            backgroundColor: '',
            pointRadius: 2,
            pointHoverRadius: 1,
            pointBackgroundColor: '',
            legendVisible: false,



        }

        var obj = {
            label: lbls.filter(onlyUnique),
            data: _data
        };


        DashboardHelper.createChart(ctx, 'line', obj.data, obj.label, 'Avg OverTime', false, options);
        //DashboardHelper.chartBasic(ctx, obj, 'line', options);
        //DashboardHelper.createChart(ctx, 'bar', obj.data, obj.label, '', false, options);
    });




    // var obj = {
    //     label: ['2016', '2017', '2018', '2019'],
    //     data: [300, 450, 200, 120]
    // }
    // DashboardHelper.createChart(ctx, 'line', obj.data, obj.label, 'Avg OT By Year', false, options);

}

function otYearlyAvg(ctx, data) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');

    var options = {
        yAxesTitle: 'Left employee(s)',
        xAxesTitle: 'Years at company',
        lineTension: 0,
        tickCallback: function (label, index, labels) { return label + ' %'; },
        fill: true,
        borderWidth: 0,
        showLine: true,
        borderDash: [2, 2]
    };

    var obj = {
        label: ['a', 'b'],
        data: [1, 2]
    }

    DashboardHelper.createChart(ctx, 'pie', obj.data, obj.label, '', false, options)
    //DashboardHelper.createChart('myscatter', 'scatter', dta, lbl, 'Percentage', false, options);



}

function GetAbsentism(ctx, data) {
    window['filter' + ctx] = data;
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetAbsentismByDepartment', data, function (response) {
        $('#' + ctx + 'progress').remove();

        var _d = JSON.parse(response.d);
        //////////console.log({ _d });

        var options = {
            IsDataInPercentage: false,
            DecimalRoundPoint: 2,
            IsDataLabelVisible: false,
            DataLabelPosition: 'top',
            xAxesTitle: 'Department ',
            yAxesTitle: '',
            tooltipLabel: 'Percentage',
        }

        DrillDownChartOnDemand('bar', _d, ctx, 'DepartmentTitle', 'Percentage', options);
        var abgabsentismrate = sum(_d, 'Percentage') / _d.length;
        $('#gauge2').html(abgabsentismrate.toFixed(2) + '');
        jQuery('#gauge2').parent().find('h4').html('Employee Absentism Rate %  (' + data.pYears + ')');
        //console.log({ data });
        return;

        // var lbls = [];
        // var _data = [];


        // $.each(_d, function (i, item) {
        //     lbls.push(item.DepartmentTitle);
        //     _data.push(item.Percentage.toFixed(2));
        // });

        // var options = {
        //     tickCallback: function (label, index, labels) { return label + ' %'; },
        //     yAxesTitle: '',
        //     xAxesTitle: 'Department(s)',
        //     bgColorOpacity: 0.6,
        //     borderWidth: 0,

        //     datalabels: {
        //         color: '#333',
        //         formatter: function (value, context) {
        //             return '';//value + ' %';
        //         },
        //         font: {
        //             Family: 'segoe UI',
        //             size: 12,
        //             weight: 'light'
        //         },
        //         font: {
        //             size: 9,
        //         },
        //         clamp: false,
        //         align: 'top'
        //     },
        //     lineTension: 0,
        //     borderDash: [2, 3],

        // }


        // var obj = {
        //     label: lbls.filter(onlyUnique),
        //     data: _data
        // };

        // $('#' + ctx + 'expand').click(function () {
        //     controlWidth(ctx, _d);
        // });


        // DashboardHelper.createChart(ctx, 'bar', obj.data, obj.label, 'Percentage', false, options);

    });

}