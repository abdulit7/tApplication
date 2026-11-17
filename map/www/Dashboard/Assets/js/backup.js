function TimeToQuitJob(ctx, data, vyears) {
    var options = {
        yAxesTitle: 'Left employee(s)',
        xAxesTitle: 'Years at company',
        lineTension: 0.1,
        tickCallback: function (label, index, labels) { return label + ' %'; },
        fill: true,
        borderWidth: 4,
        //xAxesType : 'linear'
        //xAxesType: 'linear',

    };

    postRequest('GetEmployeeTimeQuitByTimeSpend', data, function (response) {
        var d = JSON.parse(response.d);
        //console.log({ d });

        createRandomColor(5);
        var yeararry = vyears.split(',');
        var lbls = [];
        var _data = [];
        var total = sum(d, 'NoOfEmployees');
        $.each(d, function (i, item) {
            lbls.push(item.YearsAtCompany);
            //_data.push(item.NoOfEmployees);
            var per = item.NoOfEmployees * 100.0 / total;
            _data.push(parseFloat(per.toFixed(2)));

        });


        var objdata = {
            labels: lbls.filter(onlyUnique),
            Data: _data
        };

        DashboardHelper.createChart(ctx, 'line', objdata.Data, objdata.labels, 'Percentage', true, options)

    });
}


////////////

var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(231,233,237)'
};

var randomScalingFactor = function () {
    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
}
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var config = {
    type: 'line',
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: chartColors.red,
            borderColor: chartColors.red,
            data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
            ],
            fill: false,
        }, {
            label: "My Second dataset",
            fill: false,
            backgroundColor: chartColors.blue,
            borderColor: chartColors.blue,
            data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
            ],
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Chart.js Line Chart'
        },
        tooltips: {
            mode: 'label',
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                gridLines: {
                    display: false
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    display: false
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                }
            }]
        }
    }
};


var ctx = document.getElementById("canvas").getContext("2d");
window.myLine = new Chart(ctx, config);