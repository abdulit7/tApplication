function renderHRDashboard(pFirstLoad, filterc) {

    var _CurrentYear = getYears(0);
    
    vyears = $('#ddlYear').val().join();
    vyears = pFirstLoad == 1 ? getYears(1) : vyears;
    var pdata = { pYears: vyears, pType: 'joiners', pFilterCriteria: filterc };
    populateJoinersDiversity('joinersarea', pdata);

    var pdata1 = { pYears: vyears, pType: 'leavers', pFilterCriteria: filterc };
    populateJoinersDiversity('leaversarea', pdata1);

    var pdata2 = { pYears: vyears, pType: 'all', pFilterCriteria: filterc };
    populateJoinersDiversity('headcountallarea', pdata2);

    vyears = pFirstLoad == 1 ? getYears(1) : vyears;
    var pdata3 = { pYears: vyears, pFilterCriteria: filterc };
    TimeToQuitJob('jobquit', pdata3);
    TimeToQuitJobByAge('jobquitage', pdata3);
    AverageTenureByDept('avgtenurebydept', pdata3);

    GetTurnOverMonthly('turnovermonthly', pdata3);
    pdata3 = { pYears: getYears(20, new Date().getFullYear()), pFilterCriteria: filterc };
    //GetEmployeesByYear('noofempbyyear', pdata3);

    GetEmployeesByYear2('noofempbyyear', pdata3);

    GetStaffGenderSplitAndAvgAgeByDept('staffsplitbygenderdept', pdata3);
    pdata3 = { pYears: new Date().getFullYear(), pFilterCriteria: filterc };
    //GetStaffSplitByGenderAndDepartment('staffsplitbygenderdept', pdata3);


    vyears = vyears = pFirstLoad == 1 ? getYears(3) : vyears;
    var pdata5 = { pYears: vyears, pFilterCriteria: filterc };
    yearwiseTurnoverretention('yearwiseturnoverret', pdata5);

    vyears = pFirstLoad == 1 ? _CurrentYear : vyears.split(',')[0];
    var pdata4 = { pYears: vyears, pFilterCriteria: filterc };
    GetTurnOverByDept('turnoverretbydept', pdata4);

}


function populateJoinersDiversity(divID, pdata) {
    postRequestD('GetJoinersDiversityByGenderAndYearWS', pdata, function (response) {
        var r = JSON.parse(response.d);
        //////////console.log({ r });
        ////////////console.log(pdata.pYears);
        var yrs = pdata.pYears.split(',');
        var data;
        var template = '';
        var ftemplate = '';

        var malecount = 0;
        var femalecount = 0;
        var maleage = 0.00;
        var femaleage = 0.00;
        var totalcountofyear = 0;
        var orangeClass = 'orangecount';
        yrs.sort(function (a, b) { return b - a });
        var yrs;
        var isActive = 'active';
        //////////console.log({ yrs });
        var yrsLength = yrs.length;
        $.each(yrs, function (i, item) {


            var maledata;
            var femaledata;
            // if (divID.toLowerCase() == 'headcountallarea') {
            //     data = r.filter(function (value) {
            //         yrs = item;
            //         return value.year == item;
            //     });
            //     maledata = data.filter(function (val) { return val.Sex === 'M' && val.year == item; });
            //     femaledata = data.filter(function (val) { return val.Sex === 'F' && val.year == item;; });
            // } else {
            //}

            data = alasql('select Year,Gender, count("EmployeeID") as Total from ? WHERE Year = ' + item + ' GROUP BY Gender,Year ', [r]);
            maledata = data.filter(function (val) { return val.Gender === 'Male' && val.Year == item; });
            femaledata = data.filter(function (val) { return val.Gender === 'Female' && val.Year == item;; });


            var currentyear = new Date().getFullYear();
            ////////////console.log(yrs + ''+ currentyear);
            if (parseInt(yrs) == parseInt(currentyear)) { orangeClass = 'orangecount'; } else { orangeClass = ''; }



            malecount = isEmptyObj(maledata) ? 0 : parseInt(maledata[0].Total);
            femalecount = isEmptyObj(femaledata) ? 0 : parseInt(femaledata[0].Total);

            //maleage = parseFloat(isEmptyObj(maledata) ? 0.00 : maledata[0].Age).toFixed(2);
            //femaleage = parseFloat(isEmptyObj(femaledata) ? 0.00 : femaledata[0].Age).toFixed(2);

            totalcountofyear = malecount + femalecount;
            maleage = malecount > 0 ? malecount * 100.0 / totalcountofyear : 0;
            femaleage = femalecount > 0 ? femalecount * 100.0 / totalcountofyear : 0;

            template += '<div class="col-md-6 divbox diversitydiv">' +
                '<div class="row">' +
                '<div class="col-xs-12">' +
                '<table class="table table-condensed">' +
                '<tr>' +
                '<td><span class="divcount ' + orangeClass + '">' + malecount + '</span></td>' +
                '<td><span class="divcount ' + orangeClass + '">' + femalecount + '</span></td>' +
                '</tr>' +
                '<tr>' +
                //'<td><span class="fa fa-male divicon"></span></td>' +
                //onClick="drillDownDiversity(' + item + ', \'Male\');"
                '<td><img data-gender="Male" data-year="' + item + '" src="assets/images/male.png" /></td>' +
                '<td><img data-gender="Female"  data-year="' + item + '"  src="assets/images/female.png" /></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span class="divper ' + orangeClass + '">' + maleage.toFixed(1) + ' %</span></td>' +
                '<td><span class="divper ' + orangeClass + '">' + femaleage.toFixed(1) + ' %</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2"><span class="divyear">' + item + '</span></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</div>';

            var idx = i + 1;
            if (idx % 2 == 0) {
                ftemplate += `<div class="item ${isActive}">${template}</div>`;
                isActive = '';
                template = '';
            }

            if (idx == yrsLength) {
                if (idx % 2 != 0) {
                    ftemplate += `<div class="item ${isActive}">${template}</div>`;
                    isActive = '';
                    template = '';
                }
            }

            ////////////console.log(ftemplate);

        });

        mrd = divID;
        var temp = '<div id="myCarousel' + mrd + '" class="carousel slide" data-ride="carousel' + mrd + '">        ' +
            '<ol class="carousel-indicators">' +
            '<li data-target="#myCarousel' + mrd + '" data-slide-to="0" class="active"></li>' +
            '<li data-target="#myCarousel' + mrd + '" data-slide-to="1"></li>' +
            '<li data-target="#myCarousel' + mrd + '" data-slide-to="2"></li>' +
            '</ol>              ' +
            '<div class="carousel-inner">' +
            ftemplate +
            '<a class="left carousel-control" href="#myCarousel' + mrd + '" data-slide="prev">' +
            '<span class="glyphicon glyphicon-chevron-left"></span>' +
            '<span class="sr-only">Previous</span>' +
            '</a>' +
            '<a class="right carousel-control" href="#myCarousel' + mrd + '" data-slide="next">' +
            '<span class="glyphicon glyphicon-chevron-right"></span>' +
            '<span class="sr-only">Next</span>' +
            '</a>' +
            '</div>';

        $('#' + divID).html(temp);

        //if (divID.toLowerCase() != 'headcountallarea') {
        $('#' + divID + ' .diversitydiv .table img').click(function (e) {
            ////console.log({ r });
            var gender = $(this).attr('data-gender');
            var year = $(this).attr('data-year');
            //alert(gender + '-' + year);
            var filterData = alasql('select * from ? where Year = ' + year + ' and Gender = "' + gender + '"', [r]);
            doModal('Detail', CreateTableFromJSON(filterData));
            var table = $('.drillTable').DataTable({
                responsive: true, bDestroy: true,
            });
            $('.dataTables_filter input').addClass('show');

        });
        // }



    })
}

function GetEmployeesByYear2(ctx, data) {

    data.pType = "summary";
    data.pAdditionalFilter = "";
    window['filter' + ctx] = data;
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetEmployeesByYearOnDemand', data, function (response) {

        removeChartLoader(ctx);
        var _d = JSON.parse(response.d);
        _d = alasql('select * from ? order by Year ', [_d]);
        //////////console.log({ _d });

        var options = {
            IsDataInPercentage: false,
            DecimalRoundPoint: 2,
            IsDataLabelVisible: false,
            DataLabelPosition: 'top',
            xAxesTitle: 'Years ',
            yAxesTitle: '',
            tooltipLabel: 'No of Employee(s)',
        }

        DrillDownChartOnDemandGeneric('bar', _d, ctx, 'Year', 'TotalEmployee', options, 'GetEmployeesByYearOnDemand', {});
        //var abgabsentismrate = sum(_d, 'TotalEmployee') / _d.length;
        //$('#gauge2').html(abgabsentismrate.toFixed(2) + '');
        //jQuery('#gauge2').parent().find('h4').html('Employee Absentism Rate %  (' + data.pYears + ')');
        //console.log({ data });
        return;


    });

}


function TimeToQuitJobByAge(ctx, data) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetEmployeeTimeQuitByAgeGroup', data, function (response) {
        $('#' + ctx + 'progress').remove();

        var _d = JSON.parse(response.d);
        //////////console.log({ _d });

        DrillDownChart(ctx, _d, 'AgeGroup', 'Employee ID', 'count', 'string', 'bar', {}, 'No of Employee(s)', 'Age Group', 'Employee(s)', 'top', '', '');
        // return;

        // var lbls = [];
        // var _data = [];
        // var total = sum(_d, 'NoOfEmployees');
        // $.each(_d, function (i, item) {
        //     lbls.push(item.AgeGroup);
        //     //_data.push(item.NoOfEmployees);
        //     var per = item.NoOfEmployees * 100.0 / total;
        //     _data.push(parseFloat(per.toFixed(2)));

        // });

        // var options = {
        //     tickCallback: function (label, index, labels) { return label + ' %'; },
        //     yAxesTitle: 'Left Employee(s)',
        //     xAxesTitle: 'Age Group',
        //     //bgColorOpacity: 0.3,
        //     borderWidth: 1,
        //     datalabels: {
        //         color: '#333',
        //         formatter: function (value, context) {
        //             return value + ' %';
        //         },
        //         font: {
        //             Family: 'segoe UI',
        //             size: 12,
        //             weight: 'light'
        //         }
        //     },


        // }

        // var obj = {
        //     label: lbls.filter(onlyUnique),
        //     data: _data
        // };


        // DashboardHelper.createChart(ctx, 'bar', obj.data, obj.label, 'Percentage', false, options);


    });

}

function GetTurnOverByDept(ctx, data) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetDepartmentWiseTurnOverAndRetention', data, function (response) {
        $('#' + ctx + 'progress').remove();

        var _d = JSON.parse(response.d);
        ////////console.log({ _d });

        var lbls = [];
        var _data = [];
        var _data1 = [];

        $.each(_d, function (i, item) {

            //var avgEmployees = (item.EmpLastCount + item.EmpCurrentCount) / 2
            //var _turnOver = avgEmployees > 0 ? (item.LeftEmployees / avgEmployees) * 100 : 0;
            //var _retention = item.EmpCurrentCount > 0 ? (item.LeftEmployees / item.EmpCurrentCount) * 100 : 0;

            var _turnOver = item.OpeningCount + item.ClosingCount != 0 ? item.LeftEmployees / ((item.OpeningCount + item.ClosingCount) / 2) * 100 : 0;
            var _retention = item.ClosingCount != 0 ? ((item.ClosingCount - item.LeftEmployees) / item.ClosingCount) * 100 : 0;
            lbls.push(item.DepartmentTitle);
            _data.push(_turnOver.toFixed(2));
            _data1.push(_retention.toFixed(2));
        });


        var options = {
            tickCallback: function (label, index, labels) { return label + ' %'; },
            yAxesTitle: '',
            xAxesTitle: 'Department(s)',
            bgColorOpacity: 0.6,
            borderWidth: 2,
            datalabels: {
                color: '#333',
                formatter: function (value, context) {
                    return ''; //value + ' %';
                },
                font: {
                    Family: 'segoe UI',
                    size: 12,
                    weight: 'light'
                },
                align: 'bottom'
            },


        }

        var ds = [];



        //var clr = materialColor();
        var objdata = {
            datasets: [{
                label: 'Turnover',
                data: _data,
                fill: true,
                type: 'bar',
                backgroundColor: 'orange', //materialColor(),
                borderColor: 'orange', //materialColor(),
                lineTension: 0
            },

                // {
                //     label: 'Retention',
                //     data: _data1,
                //     fill: true,
                //     type: 'bar',
                //     backgroundColor: materialColor(),
                //     borderColor: materialColor(),
                //     lineTension: 0
                //     // label: 'Retention',
                //     // data: _data1,
                //     // fill: false,
                //     // lineTension: 0,
                //     // borderColor: 'materialColor()',
                //     // borderWidth: 2,
                //     // borderDash: [5, 5],
                //     // backgroundColor: 'materialColor()',
                //     // pointRadius: 4,
                //     // pointHoverRadius: 1,
                //     // pointBackgroundColor: 'materialColor()',
                // }
            ],
            labels: lbls.filter(onlyUnique)
        };

        $('#' + ctx + 'expand').click(function () {
            controlWidth(ctx, _d);
        });

        DashboardHelper.createChart2(ctx, 'bar', objdata, true, options);

        // var options = {
        //     tickCallback: function(label, index, labels) { return label + ' %'; },
        //     yAxesTitle: 'Left Employee(s)',
        //     xAxesTitle: 'Age Group',
        //     bgColorOpacity: 0.6,
        //     borderWidth: 4,
        //     fill: true,
        //     datalabels: {
        //         color: '#333',
        //         formatter: function(value, context) {
        //             return value + ' %';
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
        //     pointRadius: 1,
        //     //borderDash: [2, 3],

        // }


        // var obj = {
        //     label: lbls.filter(onlyUnique),
        //     data: _data
        // };

        // var _ddt = _d;
        // $('#' + ctx + 'expand').click(function() {
        //     controlWidth(ctx, _ddt);
        // });


        // DashboardHelper.createChart(ctx, 'line', obj.data, obj.label, 'Percentage', false, options);

        //var abgabsentismrate = sum(_d, 'Percentage') / _d.length;
        //$('#gauge2').html(abgabsentismrate.toFixed(2));

    });

}


function TimeToQuitJob(ctx, data, vyears) {
    var options = {
        yAxesTitle: 'Left employee(s)',
        xAxesTitle: 'Years at company',
        lineTension: 0,
        tickCallback: function (label, index, labels) { return label + ' %'; },
        fill: true,
        borderWidth: 0,
        xAxesType: 'linear',
        showLine: true,
        borderDash: [2, 2]
    };

    postRequestD('GetEmployeeTimeQuitByTimeSpend', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var d = JSON.parse(response.d);
        //console.log({ d });
        //console.log({ d });    
        var opt = {
            fill: true
        }

        DrillDownChart(ctx, d, 'ServicePeriodInYear', 'Employee ID', 'count', 'number', 'scatter', opt, 'No of Employee(s)', 'Year(s) at Company', 'Employee(s)', 'top', '%', '', 'linear', 0, true, true, false);
        return;

        d = alasql('select  ServicePeriodInYear , count(ServicePeriodInYear) as NoOfEmployees  From ? GROUP BY ServicePeriodInYear ORDER By ServicePeriodInYear ', [d])

        //console.log({ d });

        //createRandomColor(5);
        //  var yeararry = vyears.split(',');
        var lbls = [];
        var _data = [];
        var total = sum(d, 'NoOfEmployees');

        var dataarray = [];

        $.each(d, function (i, item) {
            lbls.push(item.ServicePeriodInYear);
            //_data.push(item.NoOfEmployees);
            //_data.push(parseFloat(per.toFixed(2)));

            var per = item.NoOfEmployees * 100.0 / total;
            per = parseFloat(per.toFixed(2));

            var xy = { x: item.ServicePeriodInYear, y: per };
            dataarray.push(xy);
        });

        // $('#' + ctx + 'expand').click(function() {
        //     controlWidth(ctx, d);
        // });
        console.log({ dataarray });
        DashboardHelper.createChart(ctx, 'scatter', dataarray, [], 'Percentage', false, options)
        //DashboardHelper.createChart('myscatter', 'scatter', dta, lbl, 'Percentage', false, options);

    });


}

function AbsGauge(_id, val) {
    if (!window._id) {
        window._id = new JustGage({
            id: _id,
            value: val,
            decimals: 1,
            min: 0,
            max: 100,
            title: "Avg Absenteeism Rate",
            titleFontSize: 12,
            titlePosition: "below",
            titleFontColor: "red",
            titleFontFamily: "Georgia",
            titlePosition: "below",
            valueFontColor: "orange",
            valueFontFamily: "Georgia",
            label: "%",
            levelColors: ['#f5821f'],
            lableFontSize: "10px",
            width: 300,
            height: 200,
            relativeGaugeSize: true,
            pointer: true,
            counter: true,
        });
    } else {
        window._id.refresh(val, 100);
    }

}

function GetTurnOverMonthly(ctx, data) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');

    postRequestD('GetMonthlyTurnover', data, function (response) {
        $('#' + ctx + 'progress').remove();

        var _d = JSON.parse(response.d);

        ////console.table(_d);

        var lbls = [];
        var _data = [];
        var _data1 = [];

        var distinctYear = getDistinctArray(_d, 'Year0');

        ////////console.log({ distinctYear });

        var ds = [];
        $.each(distinctYear, function (i, item) {

            var filterData = _d.filter(function (value) {
                return value.Year0 == item;
            });



            ////////console.log({ filterData });
            _data = [];
            _data1 = [];
            $.each(filterData, function (i, ditem) {



                //lbls.push(monthNames[ditem.Month]);
                var turnOver = ditem.OpeningCount + ditem.ClosingCount != 0 ? ditem.LeftEmployees / ((ditem.OpeningCount + ditem.ClosingCount) / 2) * 100 : 0;
                var retention = ditem.ClosingCount != 0 ? ((ditem.ClosingCount - ditem.LeftEmployees) / ditem.ClosingCount) * 100 : 0;

                var per = turnOver;
                var per2 = retention;


                if (per % 1 !== 0) {
                    per = per.toFixed(2);
                }

                if (per2 % 1 !== 0) {
                    per2 = per2.toFixed(2);
                }

                _data.push(parseFloat(per));
                _data1.push(parseFloat(per2));

            });

            //////////console.log({ _data, _data1 });
            var rcolor = materialColor();
            var chrtTurnover = {
                label: 'Turnover-' + item + '',
                data: _data,
                fill: false,
                type: 'line',
                backgroundColor: rcolor,
                borderColor: rcolor,
                lineTension: 0
            }
            rcolor = materialColor();
            var chrtRetention = {
                label: 'Retention-' + item + '',
                data: _data1,
                fill: false,
                type: 'line',
                backgroundColor: rcolor,
                borderColor: rcolor,
                lineTension: 0,
                borderDash: [2, 3],
            }


            ds.push(chrtTurnover);



        });

        ////////console.log({ ds });
        //////console.table(getDistinctArray(_d, 'Year0'));







        var objdataTurnOver = {
            // datasets: [{
            //     label: 'Turnover-2019',
            //     data: [3, 5, 35, 7, 4, 2, 6, 7, 3, 4, 52, 6, 8],
            //     fill: false,
            //     type: 'line',
            //     backgroundColor: 'orange',
            //     borderColor: 'orange',
            //     lineTension: 0
            // },

            // {
            //     label: 'Retention-2019',
            //     data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            //     fill: false,
            //     lineTension: 0,
            //     borderColor: '#ddd',
            //     borderWidth: 5,
            //     borderDash: [5, 5],
            //     backgroundColor: '#ddd',
            //     pointRadius: 4,
            //     pointHoverRadius: 1,
            //     pointBackgroundColor: '#ddd',

            // }
            // ],
            datasets: ds,
            labels: monthNames //lbls.filter(onlyUnique)
        };

        var objdataRetention = {
            // datasets: [{
            //     label: 'Turnover-2019',
            //     data: [3, 5, 35, 7, 4, 2, 6, 7, 3, 4, 52, 6, 8],
            //     fill: false,
            //     type: 'line',
            //     backgroundColor: 'orange',
            //     borderColor: 'orange',
            //     lineTension: 0
            // },

            // {
            //     label: 'Retention-2019',
            //     data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            //     fill: false,
            //     lineTension: 0,
            //     borderColor: '#ddd',
            //     borderWidth: 5,
            //     borderDash: [5, 5],
            //     backgroundColor: '#ddd',
            //     pointRadius: 4,
            //     pointHoverRadius: 1,
            //     pointBackgroundColor: '#ddd',

            // }
            // ],
            datasets: [ds[0]],
            labels: monthNames //lbls.filter(onlyUnique)
        };

        var options = {
            tickCallback: function (label, index, labels) { return label + ''; },
            yAxesTitle: '',
            xAxesTitle: 'Month',
            fill: false,
            bgColorOpacity: 0.6,
            borderWidth: 0,
            datalabels: {
                color: '#333',
                formatter: function (value, context) {
                    return value + '';
                },
                font: {
                    Family: 'segoe UI',
                    size: 16,
                    weight: 'light'
                },
                font: {
                    size: 9,
                },
                clamp: false,
                align: 'top'
            },
            lineTension: 0,
            //borderDash: [4, 5],
            borderWidth: 3,


        }



        // $('#' + ctx + 'expand').click(function () {
        //     controlWidth(ctx, _d);
        // });

        DashboardHelper.createChart2(ctx, 'line', objdataTurnOver, true, options);
        //DashboardHelper.createChart2(ctx + 'ret', 'bar', objdataRetention, true, options);

        // var obj = {
        //     label: lbls, //.filter(onlyUnique),
        //     data: _data
        // };

        // DashboardHelper.createChart(ctx, 'line', obj.data, obj.label, 'Average Tenure', false, options);



    });

}


function GetStaffSplitByGenderAndDepartment(ctx, data) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');

    //var fixedGroup = [1, 2, 3, 4, 5];

    postRequestD('GetEmployeesByYear', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);
        //Jam
        var options = {
            fill: true
        }
        //console.log({ res });

        DrillDownChart2(ctx, res, false, "Year", "Gender", "Employee ID", "count", "Department", "stackBar", 'string', 0);
    });
}
function GetEmployeesByYear(ctx, data) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');

    //var fixedGroup = [1, 2, 3, 4, 5];

    postRequestD('GetEmployeesByYear', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var _d = JSON.parse(response.d);
        //Jam
        var options = {
            fill: true,
            excludeColumns: ['Birth Date']
        }

        DrillDownChart(ctx, _d, 'Year', 'Employee ID', 'count', 'number', 'bar', options, 'No Of Employee(s)', 'Year', 'No Of Employee(s)', 'top', '', '');
        _d = alasql('select * from ? where Year = ' + new Date().getFullYear() + '', [_d]);
        DrillDownChart('avgagebydept', _d, 'Department', 'Age', 'avg', 'string', 'line', options, 'Average Age', 'Department', 'Average Age of Employee', 'top', '', '', null, 0);
        _d = alasql('select * from ? where Year = ' + new Date().getFullYear() + '', [_d]);
        //DrillDownChart2('staffsplitbygenderdept', _d, false, "", "Gender", "Employee ID", "count", "Department", "bar", 'string', 0);
    });
}

function GetStaffGenderSplitAndAvgAgeByDept(ctx, data) {
    data.pYears = sysdate.split('/')[2];
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetEmployeesByYear', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var _d = JSON.parse(response.d);
        //Jam
        var options = {
            fill: true,
            excludeColumns: ['Birth Date']
        }

        //DrillDownChart(ctx, _d, 'Year', 'Employee ID', 'count', 'number', 'bar', options, 'No Of Employee(s)', 'Year', 'No Of Employee(s)', 'top', '', '');
        //_d = alasql('select * from ? where Year = ' + new Date().getFullYear() + '', [_d]);
        DrillDownChart('avgagebydept', _d, 'Department', 'Age', 'avg', 'string', 'line', options, 'Average Age', 'Department', 'Average Age of Employee', 'top', '', '', null, 0);
        _d = alasql('select * from ? where Year = ' + new Date().getFullYear() + '', [_d]);
        DrillDownChart2('staffsplitbygenderdept', _d, false, "", "Gender", "Employee ID", "count", "Department", "bar", 'string', 0);
    });
}

function yearwiseTurnoverretention(divID, data) {
    //$('#' + divID).closest('div').before('<div id="' + divID + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetYearlyTurnOver', data, function (response) {
        //$('#' + divID + 'progress').remove();
        var _d = JSON.parse(response.d);

        if (_d.length <= 0 || _d['status'] == 'Error') {
            $('#' + divID).html(data404());
            return;
        }
        //console.log({ _d });


        var template = '';
        var orangeClass = 'orangecount';

        var currentyear = new Date().getFullYear();

        $.each(_d, function (i, item) {


            if (item.Year == currentyear) {
                orangeClass = 'orangecount';
            } else {
                orangeClass = '';
            }

            //var turnOver = item.OpeningCount + item.ClosingCount != 0 ? item.LeftEmployees / ((item.OpeningCount + item.ClosingCount) / 2) * 100 : 0;
            var turnOver = item.OpeningCount + item.ClosingCount != 0 ? (item.LeftEmployees / item.ClosingCount) * 100 : 0;
            var retention = item.ClosingCount != 0 ? ((item.ClosingCount - item.LeftEmployees) / item.ClosingCount) * 100 : 0;

            template += '<div class="col-md-3 divbox">' +
                '<div class="row">' +
                '<div class="col-xs-12">' +
                '<table class="table table-condensed">' +
                '<tr>' +
                '<td><span class="divcount ' + orangeClass + '">Turnover</span></td>' +
                '<td><span class="divcount ' + orangeClass + '">Retention</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span class="divicon" style="font-size:32px;text-shadow:0px 0px 4px #ddd;">' + turnOver.toFixed(2) + ' </span></td>' +
                '<td><span class="divicon"  style="font-size:32px;text-shadow:0px 0px 4px #ddd;">' + retention.toFixed(2) + '</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2"><span class="divyear">' + item.Year + '</span></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</div>';

        });

        $('#' + divID).html(template);



    });
}


function AverageTenureByDept(ctx, data) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');

    postRequestD('GetAverageTenureByDept', data, function (response) {
        $('#' + ctx + 'progress').remove();

        var _d = JSON.parse(response.d);


        DrillDownChart(ctx, _d, 'Department', 'ServicePeriodInYear', 'avg', 'string', 'line', {}, 'No of Employee(s)', 'Age Group', 'Employee(s)', 'top', '', '', null, 1);

        var avgEmployeeTenure = sum(_d, 'ServicePeriodInYear') / _d.length;
        $('#avgemptenure').html(avgEmployeeTenure.toFixed(2));
        // return;

        // var lbls = [];
        // var _data = [];

        // $.each(_d, function (i, item) {
        //     lbls.push(item.Department);
        //     //_data.push(item.NoOfEmployees);
        //     var per = item.ServicePeriodInYear;

        //     if (per % 1 !== 0) {
        //         per = per.toFixed(2);
        //     }

        //     _data.push(parseFloat(per));

        // });



        // var options = {
        //     tickCallback: function (label, index, labels) { return label + ''; },
        //     yAxesTitle: 'Service Period',
        //     xAxesTitle: 'Department',
        //     fill: true,
        //     bgColorOpacity: 0.6,
        //     borderWidth: 0,
        //     datalabels: {
        //         color: '#333',
        //         formatter: function (value, context) {
        //             return value + '';
        //         },
        //         font: {
        //             Family: 'segoe UI',
        //             size: 16,
        //             weight: 'light'
        //         },
        //         font: {
        //             size: 9,
        //         },
        //         clamp: false,
        //         align: 'top'
        //     },
        //     lineTension: 0,
        //     //borderDash: [4, 5],
        //     borderWidth: 3,


        // }

        // var obj = {
        //     label: lbls, //.filter(onlyUnique),
        //     data: _data
        // };


        // ////////////console.log(_d);

        // //controlWidth(ctx, _d);

        // $('#' + ctx + 'expand').click(function () {
        //     controlWidth(ctx, 'line', _d);
        // });


        // DashboardHelper.createChart(ctx, 'line', obj.data, obj.label, 'Average Tenure', false, options);




    });

}

function drillDownDiversity(pYear, pGender) {
    //console.log(pYear + '-' + pGender);
}