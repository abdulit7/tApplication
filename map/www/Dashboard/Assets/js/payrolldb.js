function renderPayrollDashboard(pFirstLoad, filterc) {

    //vyears = pFirstLoad == 1 ? '2019' : vyears.split(',')[0];
    //var pdata4 = { pYears: vyears, pFilterCriteria: filterc };

    //////console.log({ globalpayrrolFilter });

    var __Years = typeof globalpayrrolFilter.Years === 'object' ? globalpayrrolFilter.Years.join(',') : globalpayrrolFilter.Years[0];
    var __Month = typeof globalpayrrolFilter.Months === 'object' ? globalpayrrolFilter.Months.join(',') : '';//globalpayrrolFilter.Months[0];
    var pdata4 = { pYears: __Years, pMonths: __Month, pFilterCriteria: filterc };
    GetAverageSalaryByDept('averageSalaryByDept', pdata4);
    GetAverageSalaryByDesig('averageSalaryByDesig', pdata4);

    GetSalaryRangeBreakDown('salaryRangeBreakdown', pdata4);
    GetSalaryByMonth('salaryByMonth', pdata4);
    GetSalaryBreakDownByMonth('salaryBreakdownByMonth', pdata4);

    //GetSalaryBreakDownByDept('salaryBreakdownByDept', pdata4);
    //GetSalaryBreakDownByDepartment('salaryBreakdownByDept', pdata4);

}

function GetAverageSalaryByDesig(ctx, data) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetAverageSalaryByDesig', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);

        var options = {
            fill: false,
        }
        DrillDownChart(ctx, res, 'Designation', 'GrossSalary', 'avg', 'string', 'bar', options, 'Average Salary', 'Designation', 'Average Salary (1000s)', 'top', '', 'false');
        $('#' + ctx + 'expand').click(function () { controlWidth(ctx, 'line', res); });


    });
}

function GetAverageSalaryByDept(ctx, data) {
    //$('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');

    ////////console.log({ data });

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetAverageSalaryByDept', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);

        //console.log({ res });

        DrillDownChart2(ctx, res, false, "Employee ID", "Year", "GrossSalary", "avg", "Department", "bar", 'number', 1, '(1000s)');
        return;

        var deptarray = [];
        $.each(res, function (k, ditem) {
            deptarray.push(ditem.DepartmentTitle);
        });

        var options = {
            dataLabelText: ''
        };

        var _Years = globalpayrrolFilter.Years;
        var _Months = globalpayrrolFilter.Months;
        //_Years = _Years.split(',');
        //_Months = _Months.split(',');
        var ds = [];
        $.each(_Years, function (i, yitem) {
            //$.each(_Months, function (j, mitem) {
            var filterData = res.filter(function (value) {
                return value.Year == yitem; //&& value.Month == mitem;
            });
            //////console.log({ filterData });
            var yearMonth = yitem;

            var dataarray = [];
            $.each(filterData, function (k, ditem) {
                dataarray.push(ditem.Average.toFixed(1));
            });

            //////console.log({ dataarray });

            var dataObj = {
                label: yearMonth,
                backgroundColor: materialColor(),
                data: dataarray
            }
            ds.push(dataObj);
            //});
        });

        obj = {
            labels: deptarray.filter(onlyUnique), //deptarray,
            datasets: ds
        };
        $('#' + ctx + 'expand').click(function () { controlWidth(ctx, 'line', res); });
        DashboardHelper.chartBar2(ctx, obj, 'bar', options);
    });

}


function GetSalaryRangeBreakDown(ctx, data) {

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetSalaryRangeBreakDown', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);
        //res = res.filter(function (value) { return value.GrossSalaryRange > 0; })

        res = res.filter(function (value) {
            return value.GrossSalaryRange !== "0";
        })

        $.each(res, function (i, item) {
            item.GrossSalary = parseFloat(item.GrossSalary);
            switch (item.GrossSalaryRange) {
                case '< 20K': item.OrderNo = 1; break;
                case '20K - 40K': item.OrderNo = 2; break;
                case '40K - 60K': item.OrderNo = 3; break;
                case '60K - 80K': item.OrderNo = 4; break;
                case '80K - 100K': item.OrderNo = 5; break;
                case '100K - 150K': item.OrderNo = 6; break;
                case '150K - 200K': item.OrderNo = 7; break;
                case '200K - 250K': item.OrderNo = 8; break;
                case '250K - 300K': item.OrderNo = 9; break;
                case '> 300K': item.OrderNo = 10; break;
            }
        })

        res.sort(function (a, b) { return a.OrderNo - b.OrderNo; });

        var options = {
            fill: false,
            legend: {
                position: 'right',
            }
        }

        DrillDownChart(ctx, res, "GrossSalaryRange", "Employee ID", "count", "string", "doughnut", options, '', '', '', 'top', '', '%', null, 2, false, false, true, -1);
        return;
        //var _retdata = getDatasetSalaryRangeBreakDown(res);
        //var __Years = data.pYears;
        //var __Months = data.pMonths;
        ////console.log({ _retdata });

        var options = {
            dataLabelText: ' %',
            legnedPosition: 'right'
        };

        //alert(__Years);
        if (1 === 0) { //__Years.indexOf(',') > -1 || __Months.indexOf(',') > -1

            //obj = {
            //  labels: _retdata.dataarray.filter(onlyUnique), //deptarray,
            //                datasets: _retdata.ds
            //};
            //DashboardHelper.chartBar2(ctx, obj, 'bar', options);
        } else {
            ////console.log(res);

            $.each(res, function (i, item) {
                switch (item.SalaryRange) {
                    case '< 20K': res[i].OrderNo = 1; break;
                    case '20K - 40K': res[i].OrderNo = 2; break;
                    case '40K - 60K': res[i].OrderNo = 3; break;
                    case '60K - 80K': res[i].OrderNo = 4; break;
                    case '80K - 100K': res[i].OrderNo = 5; break;
                    case '100K - 150K': res[i].OrderNo = 6; break;
                    case '150K - 200K': res[i].OrderNo = 7; break;
                    case '200K - 250K': res[i].OrderNo = 8; break;
                    case '200K - 300K': res[i].OrderNo = 9; break;
                    case '> 300K': res[i].OrderNo = 10; break;
                }
            });

            res.sort(function (a, b) { return a.OrderNo - b.OrderNo; });

            var _data = [];
            var _lbl = [];
            var total = sum(res, 'AvergeEmployee')
            $.each(res, function (i, item) {
                _lbl.push(item.SalaryRange);
                var value = (item.AvergeEmployee / total) * 100;
                _data.push(value.toFixed(2));
            });
            var obj;
            obj = {
                label: _lbl,
                data: _data
            }

            DashboardHelper.chartBasic(ctx, obj, 'doughnut', options);

        }



        ////////console.log({ ds });

        //DashboardHelper.createChart(ctx, 'bar', obj.data, obj.label, '', true, options);
        //DashboardHelper.chartBasic(ctx, obj, 'horizontalBar', options);

        //});

        //  var __Years = data.pYears;
    });



}

function GetSalaryBreakDownByMonth(ctx, data) {

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetSalaryBrakDownByMonth', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var dt = JSON.parse(response.d);
        //////console.log({ dt });

        var options = { dataLabelText: '' };

        var _Years = globalpayrrolFilter.Years;
        var _Months = globalpayrrolFilter.Months;
        var ds = [];
        //$.each(_Months, function(j, mitem) { });

        var arr = getDistinctArray(dt, 'AllowanceGroup');
        $.each(_Years, function (i, yitem) {

            $.each(arr, function (ag, agitem) {

                var _filterData = dt.filter(function (value) {
                    return value.Year == yitem && value.AllowanceGroup == agitem;
                });

                //////console.log({ _filterData });

                var data_ = [];
                for (var mitem = 1; mitem <= 12; mitem++) {
                    var filterData2 = _filterData.filter(function (value2) {
                        return value2.Month == mitem;
                    });

                    // ////console.log(mitem, { filterData2 });

                    if (filterData2.length > 0) {
                        data_.push(filterData2[0].GroupTotal.toFixed(1));
                    } else {
                        data_.push(0);
                    }
                }

                var row =
                {
                    label: agitem + ' (' + yitem + ')',
                    backgroundColor: materialColor(),
                    data: data_,
                    stack: parseInt(yitem)
                }
                ds.push(row);

            });

        });

        var obj = {

            labels: monthNames,
            datasets: ds
        };
        $('#' + ctx + 'expand').click(function () { controlWidth(ctx, 'line', dt); });
        DashboardHelper.chartStackBar(ctx, obj, 'bar', options);

    });

}

function GetSalaryBreakDownByDept(ctx, data) {

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetSalaryBrakDownByMonth', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var dt = JSON.parse(response.d);
        //////console.log({ dt });

        var options = { dataLabelText: '' };

        var _Years = globalpayrrolFilter.Years;
        var _Months = globalpayrrolFilter.Months;
        var ds = [];
        //$.each(_Months, function(j, mitem) { });

        var arr = getDistinctArray(dt, 'AllowanceGroup');
        $.each(_Years, function (i, yitem) {

            $.each(arr, function (ag, agitem) {

                var _filterData = dt.filter(function (value) {
                    return value.Year == yitem && value.AllowanceGroup == agitem;
                });

                //////console.log({ _filterData });

                var data_ = [];
                for (var mitem = 1; mitem <= 12; mitem++) {
                    var filterData2 = _filterData.filter(function (value2) {
                        return value2.Month == mitem;
                    });

                    // ////console.log(mitem, { filterData2 });

                    if (filterData2.length > 0) {
                        data_.push(filterData2[0].GroupTotal);
                    } else {
                        data_.push(0);
                    }
                }

                var row =
                {
                    label: agitem + ' (' + yitem + ')',
                    backgroundColor: materialColor(),
                    data: data_,
                    stack: parseInt(yitem)
                }
                ds.push(row);

            });

        });

        ////console.log(ds);

        ////console.log(JSON.stringify(ds));

        var obj = {

            labels: monthNames,
            datasets: ds
        };

        DashboardHelper.chartStackBar(ctx, obj, 'bar', options);

    });

}

function GetSalaryBreakDownByMonthdept(ctx, data) {

    var options = {
        dataLabelText: ''
    };

    var obj = {
        labels: monthNames,
        datasets: [{
            label: 'Salary',
            backgroundColor: materialColor(),
            data: [12, 45, 64, 43, 55, 78]
        },
        {
            label: 'Overtime',
            backgroundColor: materialColor(),
            data: [99, 47, 45, 74, 78, 56, 45]
        }]

    };
    DashboardHelper.chartStackBar(ctx, obj, options);
}

function GetSalaryBreakDownByDepartment(ctx, data) {

    var options = {
        dataLabelText: ''
    };

    var obj = {
        labels: ['Admin', 'HR', 'Sales', 'Marketing'],
        datasets: [{
            label: 'Dataset 1',
            backgroundColor: materialColor(),
            data: [12, 45, 64, 43]
        },
        {
            label: 'Dataset 1',
            backgroundColor: materialColor(),
            data: [99, 47, 45, 74]
        }]
    };

    DashboardHelper.chartStackBar(ctx, obj, options);

}


function NoOfEmployeeByYearAndGenderBarChart(data) {

    var lbls = [];
    var cdatam = [];
    var cdataf = [];
    $.each(data, function (i, item) {
        lbls.push(item.year);
    });

    var mdata = data.filter(function (v) { return v.Sex === 'M'; });
    $.each(mdata, function (i, item) {
        cdatam.push(item.Total);
    });
    mdata = data.filter(function (v) { return v.Sex === 'F'; });
    $.each(mdata, function (i, item) {
        cdataf.push(item.Total);
    });



    var objdata = {
        datasets: [{
            label: 'Male',
            data: cdatam,
            fill: false,
            backgroundColor: createRandomColor(5).bgColors,
            borderColor: createRandomColor(5).borderColor,
        }, {
            label: 'Female',
            data: cdataf,
            fill: false,
            type: 'bar',
        }],
        labels: lbls.filter(onlyUnique)
    };

    DashboardHelper.createChart2('myChart', 'bar', objdata, true)


}



function GetSalaryByMonth(ctx, data) {
    //$('#' + ctx).before('<div class="blocklayout">fdgf</div>');
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetSalaryByMonth', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);

        var _retdata = getDatasetSalaryByMonth(res);
        //////console.log({ _retdata });
        var options = {
            dataLabelText: ''
        };

        var obj = {
            labels: _retdata.dataarray.filter(onlyUnique), //deptarray,
            datasets: _retdata.ds
        };
        $('#' + ctx + 'expand').click(function () { controlWidth(ctx, 'line', res); });
        DashboardHelper.chartBar2(ctx, obj, 'bar', options);

        // options = {
        //     tickCallback: function(label, index, labels) { return label + ''; },
        //     yAxesTitle: '',
        //     xAxesTitle: 'Department',
        //     fill: false,
        //     bgColorOpacity: 0.6,
        //     borderWidth: 0,
        //     datalabels: {
        //         color: '#333',
        //         formatter: function(value, context) {
        //             return value != 0 || value != '' ? value + ' Rs' : '';
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

        // $('#' + ctx + 'expand').click(function () {
        //     controlWidth(ctx, _d);
        // });

        //DashboardHelper.createChart2(ctx, 'bar', obj, true, options);

    });



    // var monthNames = ["January", "February", "March", "April", "May", "June",
    //     "July", "August", "September", "October", "November", "December"
    // ];

    // var obj = {
    //     label: monthNames,
    //     data: [23, 435, 45, 566, 565, 342, 656, 343, 564, 545, 454, 76]
    // }

    // DashboardHelper.chartBasic(ctx, obj, 'line', options);

}

function getDatasetSalaryByMonth(res) {
    //////console.log({ res });
    var deptarray = [];
    var dataarray = [];
    $.each(res, function (k, ditem) {
        var monthNames_ = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        deptarray.push(monthNames_[ditem.Month]);
    });



    var _Years = globalpayrrolFilter.Years;
    var _Months = globalpayrrolFilter.Months;

    var ds = [];
    $.each(_Years, function (i, yitem) {

        var filterData = res.filter(function (value) {

            return value.Year == yitem; //&& value.Month == mitem;
        });
        //////console.log({ filterData });
        var yearMonth = yitem;
        dataarray = [];
        // var total = sum(res, 'TotalEmployee')
        $.each(filterData, function (k, ditem) {
            dataarray.push(ditem.TotalAmount.toFixed(1));
            //dataarray.push(value.toFixed(2));
        });

        //////console.log({ dataarray });

        var dataObj = {
            label: yearMonth,
            backgroundColor: materialColor(),
            data: dataarray
        }
        ds.push(dataObj);
        // });
    });

    var obj = {
        ds: ds,
        dataarray: deptarray
    }
    return obj;
}

function getDatasetSalaryRangeBreakDown(res) {
    //////console.log({ res });
    var deptarray = [];
    var dataarray = [];
    $.each(res, function (k, ditem) {
        deptarray.push(ditem.SalaryRange);
    });



    var _Years = globalpayrrolFilter.Years;
    var _Months = globalpayrrolFilter.Months;

    var ds = [];
    $.each(_Years, function (i, yitem) {
        $.each(_Months, function (j, mitem) {
            var filterData = res.filter(function (value) {
                ////////console.log(value.Year, yitem, value.Month, mitem);
                return value.Year == yitem && value.Month == mitem;
            });
            //////console.log({ filterData });
            var yearMonth = yitem + '-' + mitem;

            dataarray = [];
            var total = sum(res, 'TotalEmployee')
            $.each(filterData, function (k, ditem) {
                var value = (ditem.TotalEmployee / total) * 100;
                //dataarray.push(ditem.TotalEmployee);
                dataarray.push(value.toFixed(1));
            });

            var dataObj = {
                label: yearMonth,
                backgroundColor: materialColor(),
                data: dataarray
            }
            ds.push(dataObj);
        });
    });

    var obj = {
        ds: ds,
        dataarray: deptarray
    }
    return obj;
}