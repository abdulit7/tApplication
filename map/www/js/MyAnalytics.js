callview();

function callview() {

    window.chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };

    var options = {
        tickCallback: function (label, index, labels) { return label + ''; },
        //tickCallbackX: function (label, index, labels) { return ''; },
        yAxesTitle: 'Spent Hours',
        xAxesTitle: 'Date',
        bgColorOpacity: 0.8,
        borderWidth: 2,
        showLine: true,
        legendVisible: false,
        lineTension: 0,
        fill: true,
        xfontSize: 13,
        showGridLine: true,
        responsive: true,
        chartTitle: '📈 Daily Time Spent',
        datalabels: {
            color: '#333',
            formatter: function (value, context) {
                return '' + ''; //+ ' - ' + context.chart.data.labels[context.dataIndex]; //return value + '';
            },
            anchor: 'end',
            clamp: true,
            font: {
                family: 'segoe UI',
                size: 12
            }
        },

    }

    // var obj = { label: [], data: [] };
    // var per = 0;
    // $.each(d, function (i, item) {
    //     obj.label.push(item.Date);
    //     obj.data.push(item.TotalComplains);
    // });

    DashboardHelper.createChart('chartdailytimespent', 'bar'
        , [23, 45, 12, 23, 45, 12, 45, 12, 23, 45, 12, 45, 12, 23, 45, 12, 45, 12, 23, 45, 12, 45, 12, 23, 45, 12, 45, 12, 23, 45, 12, 45, 12, 23, 45, 12, 45, 12, 23, 45, 12, 45, 12, 23, 45, 12, 23, 45, 12]
        , ['1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020'], '', false, options);


    options.chartTitle = "📈 Previous vs Current Month Total Time Spent ";

    DashboardHelper.createChart('chartcurrentvslasmonthtotalspenttime', 'bar'
        , [23, 45]
        , ['Feb', 'Mar'], '', false, options);

    options.chartTitle = "📈 Current Month Present/Absent/Leave";
    options.legendVisible = true;
    DashboardHelper.createChart('chartpresentabsentleave', 'pie'
        , [23, 5, 2]
        , ['Presenr', 'Absent', 'Leave'], '', false, options);



    options.chartTitle = "📈 Availed Leaves by Typr";
    options.legendVisible = false;
    options.yAxesTitle = '';
    options.xAxesTitle = '';
    DashboardHelper.createChart('chartleaveavailedbytype', 'pie'
        , [23, 5, 2]
        , ['Presenr', 'Absent', 'Leave'], '', false, options);




    ////

    function randomScalingFactor() {
        return Math.round(getRandomInt(100));
    };

    avaivstaken();
    function avaivstaken() {

        var barChartData = {
            labels: ['Annual Leave', 'Sick Leave', 'Casual leave', 'Compensatory Leave', 'Maternity Leave', 'Hajj Leaves', 'Others'],
            datasets: [{
                label: 'Available',
                backgroundColor: window.chartColors.red,
                data: [
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor()
                ]
            }, {
                label: 'Taken',
                backgroundColor: window.chartColors.blue,
                data: [
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor()
                ]
            }]

        };

        var ctx = document.getElementById('charleaveavailabelvstaken').getContext('2d');
        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                title: {
                    display: true,
                    text: '📈 Available vs Taken Leave Summary'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    }




    currentvslast();
    function currentvslast() {

        var lineChartData = {
            labels: ['1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020', '1/1/2020'],
            datasets: [{
                label: 'Previous Month',
                borderColor: '#f44336',
                // backgroundColor: window.chartColors.red,
                fill: false,
                data: [
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                ],
                yAxisID: 'y-axis-1',
            }, {
                label: 'Current Month',
                borderColor: '#4CAF50',
                // backgroundColor: window.chartColors.blue,
                fill: false,
                data: [
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                ],
                yAxisID: 'y-axis-2'
            }]
        };


        var ctx = document.getElementById('chartcurrentvslasmonthspenttime').getContext('2d');
        var context = 'chartcurrentvslasmonthspenttime';
        var typec = 'bat'
        if (window[typec] != undefined)
            window[typec].destroy();
        window[typec] = new Chart(ctx, {
            data: lineChartData,
            type: 'line',
            options: {
                responsive: true,
                hoverMode: 'index',
                plugins: {
                    datalabels: {
                        color: '#333',
                        formatter: function (value, context) {
                            return '' + ''; //+ ' - ' + context.chart.data.labels[context.dataIndex]; //return value + '';
                        },
                        anchor: 'end',
                        clamp: true,
                        font: {
                            family: 'segoe UI',
                            size: 12
                        }
                    },
                },
                stacked: false,
                title: {
                    display: true,
                    text: '📈 Current vs Last Month Time Spent'
                },
                scales: {
                    yAxes: [{
                        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: 'left',
                        id: 'y-axis-1',
                    }, {
                        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: 'right',
                        id: 'y-axis-2',

                        // grid line settings
                        gridLines: {
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                    }],
                }
            }
        });
    }


    var dataObj = {
        label: ['Annual Leave', 'Sick Leave', 'Casual leave', 'Compensatory Leave', 'Maternity Leave', 'Hajj Leaves', 'Others'],
        data: [4, 5, 2, 12, 30, 45, 8]
    }
    horizontalBarChart('chartleavebalance', dataObj.label, dataObj.data, '📈 Leave Balance (Chart View)');

    function horizontalBarChart(pID, pLabels, dataArray, pChatTitle) {
        if (!pChatTitle) {
            pChatTitle = '';
        }
        var bgColors = [];
        var borderColor = [];
        var IsColored = true;
        if (IsColored) {
            var i;
            for (i = 0; i < dataArray.length; i++) {
                var strcolor = renderColorE();
                var bgopacity = 0.9;
                bgColors.push(strcolor += '' + bgopacity + ')');
                borderColor.push(strcolor += '1)');
                //////console.log({strcolor});
            }
            //bgColors = '#FCD9BB';
        } else {
            var i;
            for (i = 0; i < dataArray.length; i++) {
                var strcolor = renderColorE();
                var bgopacity = options.bgColorOpacity;
                bgColors.push(strcolor += '' + bgopacity + ')');
                borderColor.push(strcolor += '1)');
                //////console.log({strcolor});
            }
        }

        var horizontalBarChartData = {
            labels: pLabels,
            datasets: [{
                label: 'Leave Type',
                backgroundColor: bgColors,
                //backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                //borderColor: 're',
                borderWidth: 1,
                data: dataArray
            }]

        };


        var ctx = document.getElementById(pID).getContext('2d');
        window.myHorizontalBar = new Chart(ctx, {
            type: 'horizontalBar',
            data: horizontalBarChartData,
            options: {
                plugins: {
                    datalabels: options.datalabels
                },
                responsive: options.responsive,
                maintainAspectRatio: true,

                responsive: true,
                legend: {
                    position: 'right',
                    display: false
                },
                title: {
                    display: true,
                    text: pChatTitle
                },

                scales: {
                    yAxes: [{
                        // type : options.yAxesType,                           
                        scaleLabel: {
                            display: true,
                            labelString: options.yAxesTitle
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: options.tickCallback,
                            fontSize: 15,
                        },

                    }]
                },
            }
        });



    }
}