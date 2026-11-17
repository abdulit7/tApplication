

function postRequestD(methodName, data, callback) {
    var d;
    var eid, uid, ecode, secKey, cid, lid, ename, Type, Url, Data, ContentType, DataType, ProcessData;
    eid = localStorage.getItem('9ygzefro1ppU70system');
    ename = 'TimeTrax'; //localStorage.getItem('ename');
    uid = localStorage.getItem('ZCI6efrovMLFOQsystem');
    cid = localStorage.getItem('XN4Jaib00XIsystem');
    lid = 1; //localStorage.getItem('lid');
    ecode = localStorage.getItem('SuevSwzqwJosystem');
    secKey = localStorage.getItem('UzegQQ2qG3gsystem');

    Type = "POST";
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    //Url = getBaseUrl() + "wsttmapp.asmx/"+methodName;
    if (methodName.indexOf('/') > -1) {
        //nothing
    } else {
        methodName = "wsttdashboard.asmx/" + methodName;
    }
    Url = getAppPath() + methodName;
    
    var params = {
        pSecKey: secKey,
        pEmployeeIDEncode: eid,
        pEmployeeRefNoEncode: ecode,
        pUserIDEncode: uid,
        pCompanyIDEncode: cid,
    }
    
    var newparams = Object.assign({}, params, data)
    newparams = JSON.stringify(newparams);
    //////console.log(newparams);
    $.ajax({
        //async: false,
        type: Type, //GET or POST or PUT or DELETE verb
        url: Url, // Location of the service
        data: newparams, //Data sent to server
        contentType: ContentType, // content type sent to server
        dataType: DataType, //Expected data format from server
        processdata: ProcessData, //True or False                    
        beforeSend: function (request) {
            //request.setRequestHeader("ZCI6efrovMLFOQsystem", localStorage.getItem('ZCI6efrovMLFOQsystem'));
            //request.setRequestHeader("XN4Jaib00XIsystem", localStorage.getItem('XN4Jaib00XIsystem'));
            //request.setRequestHeader("9ygzefro1ppU70system", localStorage.getItem('9ygzefro1ppU70system'));
            //request.setRequestHeader("SuevSwzqwJosystem", localStorage.getItem('SuevSwzqwJosystem'));
            //request.setRequestHeader("UzegQQ2qG3gsystem", localStorage.getItem('UzegQQ2qG3gsystem'));
            //request.setRequestHeader("IRObRaCqfjOV3tkEYhffNA", localStorage.getItem('IRObRaCqfjOV3tkEYhffNA'));
        },
        // success: function(result){
        //     d = result
        // },
        success: callback,
        //error: OnWsError_Toaster,// When Service call fails
        //           failure:OnWsError_Toaster
    });
    //return d;
}




function postRequestDWithcomplete(methodName, data, callback,completecallback) {
    var d;
    var eid, uid, ecode, secKey, cid, lid, ename, Type, Url, Data, ContentType, DataType, ProcessData;
    eid = localStorage.getItem('9ygzefro1ppU70system');
    ename = 'TimeTrax';
    uid = localStorage.getItem('ZCI6efrovMLFOQsystem');
    cid = localStorage.getItem('XN4Jaib00XIsystem');
    lid = 1; 
    ecode = localStorage.getItem('SuevSwzqwJosystem');
    secKey = localStorage.getItem('UzegQQ2qG3gsystem');

    Type = "POST";
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    if (methodName.indexOf('/') > -1) {
    } else {
        methodName = "wsttdashboard.asmx/" + methodName;
    }
    Url = getAppPath() + methodName;

    var params = {
        pSecKey: secKey,
        pEmployeeIDEncode: eid,
        pEmployeeRefNoEncode: ecode,
        pUserIDEncode: uid,
        pCompanyIDEncode: cid,
        arr123: data
    }
    var data = data;
    var newparams = Object.assign({}, params)
    newparams = JSON.stringify(newparams);
    
    $.ajax({
        type: Type, //GET or POST or PUT or DELETE verb
        url: Url, // Location of the service
        data: newparams, //Data sent to server
        contentType: ContentType, // content type sent to server
        dataType: DataType, //Expected data format from server
        processdata: ProcessData, //True or False                    
        beforeSend: function (request) {
            //request.setRequestHeader("ZCI6efrovMLFOQsystem", localStorage.getItem('ZCI6efrovMLFOQsystem'));
            //request.setRequestHeader("XN4Jaib00XIsystem", localStorage.getItem('XN4Jaib00XIsystem'));
            //request.setRequestHeader("9ygzefro1ppU70system", localStorage.getItem('9ygzefro1ppU70system'));
            //request.setRequestHeader("SuevSwzqwJosystem", localStorage.getItem('SuevSwzqwJosystem'));
            //request.setRequestHeader("UzegQQ2qG3gsystem", localStorage.getItem('UzegQQ2qG3gsystem'));
            //request.setRequestHeader("IRObRaCqfjOV3tkEYhffNA", localStorage.getItem('IRObRaCqfjOV3tkEYhffNA'));
        },
        success: callback,
        complete: completecallback
    });

}

function emptyDropDown(ddl) {
    //  for (var j = ddl.options.length - 1; j >= 0; j--) { ddl.remove(j); }
}

function fillDD(ddlobj, data) {
    postRequestD('FillDropDownGeneric', data, function (res) {
        var r = JSON.parse(res.d);
        var ddl = document.getElementById(ddlobj);
        _fillDropDown(r, ddl, data.PID2, data.PID3, false);
    })
}

function _fillDropDown(json, ddlObject, value, text, isClearFirst) {
    //////console.log({ json, ddlObject, value, text });
    if (isClearFirst === true) {
        emptyDropDown(ddlObject);
        var option = document.createElement("option");
        option.value = 0;
        option.text = '- select -';
        ddlObject.options.add(option)
    }
    var options = '';
    json.forEach(function (record) {
        // var option = document.createElement("option");
        // option.value = record[value];
        // option.text = record[text]; //resultObject[i];       
        // ddlObject.options.add(option)
        options += '<option value=' + record[value] + '>' + record[text] + '</option>'

    });
    //////console.log(options, ddlObject);
    ddlObject.innerHTML = ddlObject.innerHTML + options;


}

function getAppPath() {
    return '../../../';
    // var pathArray = location.pathname.split('/');
    // var appPath = "/";
    // for (var i = 1; i < pathArray.length - 3; i++) {
    //     appPath += pathArray[i] + "/";
    // }
    // var url = window.location.href;
    // //alert(url);
    // if (url.toLocaleLowerCase().indexOf('timetraxweb') > -1) {
    //     url = 'http://localhost:3580/TimeTraxWeb/';
    // } else {
    //     url = '/';
    // }
    // return url;

}

function cerror(err) {
    ////console.log(err);
}

// Charts


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function renderColor() {
    //return 'rgba(' + getRandomInt(255) + ',' + getRandomInt(255) + ',' + getRandomInt(255) + ',';
    return 'rgba(245, 130, 31,';
}

var DefaultOptions = {
    bgColorOpacity: 0.3,
    borderWidth: 2,
    fill: false,
    lineTension: 0.3,
    datalabels: false,
    yAxesTitle: '',
    xAxesTitle: '',
    tickCallback: function () { },
    tickCallbackX: function () { },
    xAxesType: 'category',
    showLine: true,
    borderDash: [0, 0],
    pointRadius: 2,
    pointHoverRadius: 1,
    pointBackgroundColor: '#ddd',
    legendVisible: true,
    legnedPosition: 'top',
    showGridLine: true,
    responsive: true,
    xfontSize: 15,
    pointBorderColor: '#999',

}

var BasicChartpDefaultObjections = {
    dataLabelText: '',
    legnedPosition: 'top'
}

Chart.defaults.global.defaultFontFamily = "segoe UI";
Chart.defaults.scale.gridLines.display = true;
Chart.defaults.scale.gridLines.color = '#f1f1f1';

var DashboardHelper = {

    chartBar2: function (ctx, obj, pType, myoptions) {
        var options = Object.assign({}, BasicChartpDefaultObjections, myoptions);

        var barChartData = obj;
        if (!pType) {
            pType = 'horizontalBar';
        }
        var ctx_ = document.getElementById(ctx).getContext('2d');

        // var bg = [];
        // $.each(obj['data'], function (i, item) {
        //     bg.push(materialColor());
        // });

        var typec = ctx + '' + ctx;
        if (window[typec] != undefined)
            window[typec].destroy();
        window[typec] = new Chart(ctx_, {
            type: pType,
            data: barChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        color: '#999',
                        formatter: function (value, context) {
                            if (options.dataLabelText != '') {
                                value += ' ' + options.dataLabelText;
                            } else {
                                value = '';
                            }
                            return value;
                        },
                        font: {
                            Family: 'segoe UI',
                            size: 12,
                            weight: 'normal'
                        },
                        align: 'center'

                    }
                },

                title: {
                    display: true,
                    text: ''
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (tooltipItems, data) {
                            return tooltipItems.yLabel + ' (1000s)';
                        }
                    }
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: false,
                    }],
                    yAxes: [{
                        stacked: false,
                        ticks: {
                            callback: function (label, index, labels) {
                                return label + '(1000s)';
                            }
                        },

                    }]
                }
            }
        });
    },

    chartStackBar: function (ctx, obj, pType, myoptions) {
        var options = Object.assign({}, BasicChartpDefaultObjections, myoptions);

        var barChartData = obj;


        var ctx_ = document.getElementById(ctx).getContext('2d');

        var typec = ctx + '' + ctx;
        if (window[typec] != undefined)
            window[typec].destroy();
        window[typec] = new Chart(ctx_, {
            type: pType,
            data: barChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        color: '#999',
                        formatter: function (value, context) {
                            return ''; //value + options.dataLabelText;
                        },
                        font: {
                            Family: 'segoe UI',
                            size: 12,
                            weight: 'normal'
                        },
                        align: 'center'

                    }
                },
                title: {
                    display: true,
                    text: ''
                },
                legend: {
                    position: 'right',
                    display: false,
                    labels: {
                        //fontSize: '9px'
                    }
                },
                tooltips: {
                    mode: 'point',
                    intersect: true,
                    callbacks: {
                        label: function (tooltipItems, data) {
                            return data.datasets[tooltipItems.datasetIndex].label + ': ' + tooltipItems.yLabel + ' (1000s)';
                        }
                    }
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            callback: function (label, index, labels) {
                                return label + '(1000s)';
                            }
                        },

                    }]
                }
            }
        });

        //document.getElementById('js - legend').innerHTML = window[typec].generateLegend();
    },

    chartBasic: function (ctx, obj, pType, myoptions) {


        var options = Object.assign({}, BasicChartpDefaultObjections, myoptions);
        var ctx_ = document.getElementById(ctx).getContext('2d');

        var bg = [];
        if (pType == 'line') {
            bg.push(materialColor());
        } else {
            $.each(obj['data'], function (i, item) {
                bg.push(materialColor());
            });
        }




        var horizontalBarChartData = {
            labels: obj['label'],
            datasets: [{
                label: '',
                backgroundColor: bg, //materialColor(),
                borderWidth: 1,
                data: obj['data']
            }]

        };

        if (!pType) {
            pType = 'horizontalBar';
        }

        var typec = ctx + '' + ctx;
        if (window[typec] != undefined)
            window[typec].destroy();
        window[typec] = new Chart(ctx_, {
            type: pType,
            data: horizontalBarChartData,
            options: {
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    rectangle: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: options.legnedPosition,
                },
                title: {
                    display: true,
                    text: ''
                },
                plugins: {
                    datalabels: {
                        color: '#999',
                        formatter: function (value, context) {
                            return value + options.dataLabelText;
                        },
                        font: {
                            Family: 'segoe UI',
                            size: 12,
                            weight: 'normal'
                        },
                        align: 'center'

                    }
                },

            }
        })

    },

    createChart: function (context, chartType, dataArray, labelArray, label, IsColored, myoptions) {

        var options = Object.assign({}, DefaultOptions, myoptions);

        if (!options) {
            options = {};
        }
        var gridLineColor = 0;
        var bgColors = [];
        var borderColor = [];

        var ctx = document.getElementById(context).getContext('2d');

        if (options.showGridLine) {
            gridLineColor = 0.03;
        }

        if (IsColored) {
            var i;
            for (i = 0; i < dataArray.length; i++) {
                var strcolor = renderColor();
                var bgopacity = options.bgColorOpacity;
                bgColors.push(strcolor += '' + bgopacity + ')');
                borderColor.push(strcolor += '1)');
                //////console.log({strcolor});
            }
            bgColors = '#FCD9BB';
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

        var typec = chartType + '' + context;
        if (window[typec] != undefined)
            window[typec].destroy();
        window[typec] = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labelArray,
                datasets: [{

                    label: label,
                    data: dataArray,
                    borderWidth: options.borderWidth,
                    backgroundColor: bgColors,//'#FCD9BB', //bgColors,
                    borderColor: borderColor,
                    lineTension: options.lineTension,
                    fill: options.fill,
                    showLine: options.showLine,
                    borderDash: options.borderDash,
                    pointRadius: options.pointRadius,
                    pointHoverRadius: options.pointHoverRadius,
                    pointBackgroundColor: options.pointBackgroundColor,
                    pointBorderColor: options.pointBorderColor,


                }]
            },
            options: {
                plugins: {
                    datalabels: options.datalabels
                },
                responsive: options.responsive,
                maintainAspectRatio: false,
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
                        gridLines: {
                            color: "rgba(0, 0, 0, " + gridLineColor + ")",
                        }
                    }],
                    xAxes: [{
                        type: options.xAxesType,
                        position: 'bottom',
                        scaleLabel: {
                            display: true,
                            labelString: options.xAxesTitle
                        },
                        ticks: {
                            beginAtZero: true,
                            precision: 0,
                            userCallback: function (label, index, labels) {
                                // when the floored value is the same as the value we have a whole number
                                return label; //label.toFixed();
                            },
                            fontSize: options.xfontSize,
                        },
                        gridLines: {
                            color: "rgba(0, 0, 0, " + gridLineColor + ")",
                        }


                    }]
                },
                legend: {
                    position: options.legnedPosition,
                    display: options.legendVisible,
                    labels: {
                        fontColor: 'rgb(0, 0, 0,0.5)',
                        fontFamily: 'segoe UI',
                    },
                },
                tooltips: {
                    backgroundColor: '#fff',
                    titleFontColor: '#333',
                    bodyFontColor: '#999',
                    cornerRadius: 0,
                    borderWidth: 1,
                    borderColor: 'orange',
                    xPadding: 10,
                    yPadding: 10,

                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
            }
        });
    },
    createChart2: function (context, chartType, dataArray, IsColored, options) {
        if (!options) {
            options = {};
        }
        var bgColors = [];
        var borderColor = [];
        var ctx = document.getElementById(context).getContext('2d');

        if (IsColored) {
            var i;
            for (i = 0; i < 10; i++) {
                var strcolor = renderColor();
                bgColors.push(strcolor += '0.25)');
                borderColor.push(strcolor += '1)');
            }

        }

        var typec = chartType + '' + context;
        if (window[typec] != undefined)
            window[typec].destroy();
        window[typec] = new Chart(ctx, {
            type: chartType,
            data: dataArray,
            options: {
                plugins: {
                    datalabels: options.datalabels
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: !isNull(options.yAxesTitle) ? options.yAxesTitle : ''
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: !isNull(options.tickCallback) ? options.tickCallback : function (label, index, labels) { return label; }
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: !isNull(options.xAxesTitle) ? options.xAxesTitle : ''
                        },
                    }]
                },
                legend: {
                    display: true,
                    labels: {
                        fontColor: 'rgb(0, 0, 0,0.5)',
                        fontFamily: 'segoe UI'
                    },


                },
                tooltips: {
                    backgroundColor: '#fff',
                    titleFontColor: '#333',
                    bodyFontColor: '#999',
                    cornerRadius: 0,
                    borderWidth: 1,
                    borderColor: 'orange',
                    xPadding: 10,
                    yPadding: 10,

                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
            }
        });


    }

}



// Others

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function _Found(obj, key) {
    if (obj.hasOwnProperty(key)) {
        return true;
    } else {
        return false;
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function renderColorE() {

    //var hex = Math.floor(Math.random() * 0xFFFFFF);
    //var res = document.getElementById('result');
    //var result = "#" + hex.toString(16);
    var rgb = hexToRgb(materialColor());

    return 'rgba(' + rgb['r'] + ',' + rgb['g'] + ',' + rgb['b'] + ',';
    //return hexToRgb(result).g; 
    //return 'rgba(' + getRandomInt(255) + ',' + getRandomInt(255) + ',' + getRandomInt(255) + ',';
    //return 'rgba(245, 130, 31,';
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1 / ++count)
            result = prop;
    return result;
}


function materialColor() {
    // colors from https://github.com/egoist/color-lib/blob/master/color.json
    var colors = {
        "red": {
            "50": "#ffebee",
            "100": "#ffcdd2",
            "200": "#ef9a9a",
            "300": "#e57373",
            "400": "#ef5350",
            "500": "#f44336",
            "600": "#e53935",
            "700": "#d32f2f",
            "800": "#c62828",
            "900": "#b71c1c",
            "hex": "#f44336",
            "a100": "#ff8a80",
            "a200": "#ff5252",
            "a400": "#ff1744",
            "a700": "#d50000"
        },
            "purple": {
                "50": "#f3e5f5",
                "100": "#e1bee7",
                "200": "#ce93d8",
                "300": "#ba68c8",
                "400": "#ab47bc",
                "500": "#9c27b0",
                "600": "#8e24aa",
                "700": "#7b1fa2",
                "800": "#6a1b9a",
                "900": "#4a148c",
                "hex": "#9c27b0",
                "a100": "#ea80fc",
                "a200": "#e040fb",
                "a400": "#d500f9",
                "a700": "#aa00ff"
            },
            "deepPurple": {
                "50": "#ede7f6",
                "100": "#d1c4e9",
                "200": "#b39ddb",
                "300": "#9575cd",
                "400": "#7e57c2",
                "500": "#673ab7",
                "600": "#5e35b1",
                "700": "#512da8",
                "800": "#4527a0",
                "900": "#311b92",
                "hex": "#673ab7",
                "a100": "#b388ff",
                "a200": "#7c4dff",
                "a400": "#651fff",
                "a700": "#6200ea"
            },
            "indigo": {
                "50": "#e8eaf6",
                "100": "#c5cae9",
                "200": "#9fa8da",
                "300": "#7986cb",
                "400": "#5c6bc0",
                "500": "#3f51b5",
                "600": "#3949ab",
                "700": "#303f9f",
                "800": "#283593",
                "900": "#1a237e",
                "hex": "#3f51b5",
                "a100": "#8c9eff",
                "a200": "#536dfe",
                "a400": "#3d5afe",
                "a700": "#304ffe"
            },        
        "blue": {
            "50": "#e3f2fd",
            "100": "#bbdefb",
            "200": "#90caf9",
            "300": "#64b5f6",
            "400": "#42a5f5",
            "500": "#2196f3",
            "600": "#1e88e5",
            "700": "#1976d2",
            "800": "#1565c0",
            "900": "#0d47a1",
            "hex": "#2196f3",
            "a100": "#82b1ff",
            "a200": "#448aff",
            "a400": "#2979ff",
            "a700": "#2962ff"
        },
            "teal": {
                "50": "#e0f2f1",
                "100": "#b2dfdb",
                "200": "#80cbc4",
                "300": "#4db6ac",
                "400": "#26a69a",
                "500": "#009688",
                "600": "#00897b",
                "700": "#00796b",
                "800": "#00695c",
                "900": "#004d40",
                "hex": "#009688",
                "a100": "#a7ffeb",
                "a200": "#64ffda",
                "a400": "#1de9b6",
                "a700": "#00bfa5"
            },       
            "green": {
            "50": "#e8f5e9",
            "100": "#c8e6c9",
            "200": "#a5d6a7",
            "300": "#81c784",
            "400": "#66bb6a",
            "500": "#4caf50",
            "600": "#43a047",
            "700": "#388e3c",
            "800": "#2e7d32",
            "900": "#1b5e20",
            "hex": "#4caf50",
            "a100": "#b9f6ca",
            "a200": "#69f0ae",
            "a400": "#00e676",
            "a700": "#00c853"
        },
        "yellow": {
            "50": "#fffde7",
            "100": "#fff9c4",
            "200": "#fff59d",
            "300": "#fff176",
            "400": "#ffee58",
            "500": "#ffeb3b",
            "600": "#fdd835",
            "700": "#fbc02d",
            "800": "#f9a825",
            "900": "#f57f17",
            "hex": "#ffeb3b",
            "a100": "#ffff8d",
            "a200": "#ffff00",
            "a400": "#ffea00",
            "a700": "#ffd600"
        },
        "amber": {
            "50": "#fff8e1",
            "100": "#ffecb3",
            "200": "#ffe082",
            "300": "#ffd54f",
            "400": "#ffca28",
            "500": "#ffc107",
            "600": "#ffb300",
            "700": "#ffa000",
            "800": "#ff8f00",
            "900": "#ff6f00",
            "hex": "#ffc107",
            "a100": "#ffe57f",
            "a200": "#ffd740",
            "a400": "#ffc400",
            "a700": "#ffab00"
        },
        "orange": {
            "50": "#fff3e0",
            "100": "#ffe0b2",
            "200": "#ffcc80",
            "300": "#ffb74d",
            "400": "#ffa726",
            "500": "#ff9800",
            "600": "#fb8c00",
            "700": "#f57c00",
            "800": "#ef6c00",
            "900": "#e65100",
            "hex": "#ff9800",
            "a100": "#ffd180",
            "a200": "#ffab40",
            "a400": "#ff9100",
            "a700": "#ff6d00"
        },
        "deepOrange": {
            "50": "#fbe9e7",
            "100": "#ffccbc",
            "200": "#ffab91",
            "300": "#ff8a65",
            "400": "#ff7043",
            "500": "#ff5722",
            "600": "#f4511e",
            "700": "#e64a19",
            "800": "#d84315",
            "900": "#bf360c",
            "hex": "#ff5722",
            "a100": "#ff9e80",
            "a200": "#ff6e40",
            "a400": "#ff3d00",
            "a700": "#dd2c00"
            },
            "brown": {
            "50": "#efebe9",
            "100": "#d7ccc8",
            "200": "#bcaaa4",
            "300": "#a1887f",
            "400": "#8d6e63",
            "500": "#795548",
            "600": "#6d4c41",
            "700": "#5d4037",
            "800": "#4e342e",
            "900": "#3e2723",
            "hex": "#795548"
            },
        "black": {
            "hex": "#000000"
            },

    }

    // pick random property
    //var property = pickRandomProperty(colors);
    var colorList = colors[pickRandomProperty(colors)];
    var newColorKey = pickRandomProperty(colorList);
    var newColor = colorList[newColorKey];
    return newColor;
}

////console.log(hexToRgb(materialColor()));

var __d = new Date();
var month = __d.getMonth() + 1;
var day = __d.getDate();
var sysdate = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + __d.getFullYear();
var sysdate1 = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + __d.getFullYear();

function getIcon(pIconName) {
    return '&nbsp;<i class="fa fa-' + pIconName + '" aria-hidden="true"></i>';
}

function data404() {
    return '<div class="text-center"><small>No Data Found!</small></div>';
}
function progress(optinalText) {
    if (!optinalText) { optinalText = ''; }
    return '<div class="text-center">' + optinalText + '<i class="fa fa-spinner fa-spin"></i></div>';
}


function getDistinctArray(_d, prop) {
    return _d.map(function (item) {
        return item[prop];
    }).filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
}

function getYears(value, pFrom) {

    var date = new Date();
    if (!pFrom) {
        date = new Date();
    } else {
        date = new Date('01-01-' + pFrom + '');
    }

    var yrsarr = [];
    for (var i = 0; i <= value; i++) {
        yrsarr.push(date.getFullYear() - i);
    }
    return yrsarr.join();
}

function getDistinctArray(array, col) {
    var flags = [], output = [], l = array.length, i;
    for (i = 0; i < l; i++) {
        if (flags[array[i][col]]) continue;
        flags[array[i][col]] = true;
        output.push(array[i][col]);
    }
    return output;
}

function isNull(value) {
    return typeof value === 'undefined' || value === null;
}

function isEmptyObj(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function getFormattedDateNew(dt, fullMonthName) {
    if (!isNull(dt)) {
        // dt = Date From Web Service which is unformatted    
        var dateformat = 'dd/mm/yyyy';
        //////console.log(dateformat);
        if (fullMonthName) {
            return getDateWithMonthName(DTHelper.GetFormattedDate(getDateByASPNETTimeStamp(dt), dateformat));
        }
        return DTHelper.GetFormattedDate(getDateByASPNETTimeStamp(dt), dateformat)
    }
    return ''
}

function getDateWithMonthName(dt) {

    // var monthNames = [
    //     "01", "02", "03",
    //     "04", "05", "06", "07",
    //     "08", "09", "10",
    //     "11", "12"
    //   ];

    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = dt.getDate();
    var monthIndex = dt.getMonth();
    var year = dt.getFullYear();
    day = day < 9 ? '0' + day : day
    return day + '/' + monthNames[monthIndex] + '/' + year;
}

var DTHelper = {};

DTHelper.GetFormattedDate = function (date, format) {

    var dd, mm, yyyy, result = date;
    dd = date.getDate();
    mm = date.getMonth() + 1;   //January is 0
    yyyy = date.getFullYear();

    dd = dd < 10 ? '0' + dd.toString() : dd.toString();
    mm = mm < 10 ? '0' + mm.toString() : mm.toString();

    if (format.toLowerCase() == 'dd/mm/yyyy') {
        result = dd + '/' + mm + '/' + yyyy;
    }
    else if (format.toLowerCase() == 'mm/dd/yyyy') {
        result = mm + '/' + dd + '/' + yyyy;
    }

    return result;
}

DTHelper.GetNativeDate = function (date, format) {

    var dd, mm, yyyy, result = new Date();
    var datearr = date.split('/');
    var date, month, year;


    if (format.toLowerCase() == 'yyyy/mm/dd') {
        year = datearr[0];
        month = datearr[1];
        date = datearr[2];
        result = new Date(year + '/' + month + '/' + date);
    }

    else if (format.toLowerCase() == 'dd/mm/yyyy') {
        date = datearr[0];
        month = datearr[1];
        year = datearr[2];
        result = new Date(year + '/' + month + '/' + date);
    }
    else if (format.toLowerCase() == 'mm/dd/yyyy') {
        month = datearr[0];
        date = datearr[1];
        year = datearr[2];
        result = new Date(year + '/' + month + '/' + date);
    }


    return result;
}

DTHelper.GetFormattedTime = function (date, format) {
    var hours, mins, secs, result = date;
    hours = date.getHours();
    mins = date.getMinutes();
    secs = date.getSeconds();

    hours = hours < 10 ? "0" + hours.toString() : hours.toString();
    mins = mins < 10 ? "0" + mins.toString() : mins.toString();
    secs = secs < 10 ? "0" + secs.toString() : secs.toString();

    if (format.toLowerCase() === "hh:mm:ss") {
        result = hours + ":" + mins + ":" + secs;
    }
    else if (format.toLowerCase() === "hh:mm") {
        result = hours + ":" + mins;
    }

    return result;
}

function getDateByASPNETTimeStamp(pASPNETDate) {
    return new Date(parseInt(/\d+/.exec(pASPNETDate)[0]));
}


function DrillDownChartOnDemand(pChartType, pData, pContextID, xSeriesColumn, ySeriesColumn, pOptions) {

    var DefaultOptions = {
        IsDataInPercentage: false,
        DecimalRoundPoint: 2,
        IsDataLabelVisible: true,
        DataLabelPosition: 'top',
        xAxesTitle: '',
        yAxesTitle: '',
        tooltipLabel: '',
        pYaxisTickAppendText: ''
    }

    DefaultOptions = Object.assign({}, DefaultOptions, pOptions)

    var finalOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                display: DefaultOptions.IsDataLabelVisible,
                color: '#999',
                formatter: function (value, context) {
                    return value;//pDataLabelAppendText == 'false' ? '' : value + pDataLabelAppendText;
                },
                font: { Family: 'segoe UI', size: 12, weight: 'normal' },
                align: DefaultOptions.DataLabelPosition
            }
        },

        scales: {
            yAxes: [{
                //type: 'linear',
                scaleLabel: {
                    display: true,
                    labelString: DefaultOptions.yAxesTitle
                },
                ticks: {
                    beginAtZero: true,
                    //callback: options.tickCallback,
                    fontSize: 15,
                    //display: pVisibleyAxesScale == false ? false : true,
                    callback: function (label, index, labels) {
                        return label + ' ' + DefaultOptions.pYaxisTickAppendText;
                    }
                },
            }],
            xAxes: [{
                //type: xAxisType == '' || !xAxisType ? 'category' : 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: DefaultOptions.xAxesTitle
                },
                ticks: {
                    beginAtZero: true,
                    precision: 0,
                    display: true,
                    //display: pVisiblexAxesScale == false ? false : true,
                    userCallback: function (label, index, labels) {
                        // when the floored value is the same as the value we have a whole number
                        return label; //label.toFixed();
                    },
                    // fontSize: options.xfontSize,
                },
                gridLines: {
                    // color: "rgba(0, 0, 0, " + gridLineColor + ")",
                }


            }]
        },
    };

    var xDataArray = [];
    var yDataArray = [];
    var total = 0;
    if (DefaultOptions.pIsDataInPercentage) { total = sum(pData, ySeriesColumn) }

    $.each(pData, function (i, item) {
        xDataArray.push(item[xSeriesColumn]);
        var yDataPoint = 0;
        yDataPoint = DefaultOptions.pIsDataInPercentage ? (item[ySeriesColumn] / total) * 100 : item[ySeriesColumn];
        yDataArray.push(yDataPoint.toFixed(DefaultOptions.DecimalRoundPoint));
    });

    var bg = [];
    if (pChartType == 'line') {
        bg.push(materialColor());
    } else {
        $.each(yDataArray, function (i, item) {
            bg.push(materialColor());
        });
    }


    // Chart Create Here
    var canvas = document.getElementById(pContextID);
    var ctx = canvas.getContext("2d");
    var typec = pContextID + '' + pChartType;
    if (window[typec] != undefined) { window[typec].destroy(); }
    window[typec] = new Chart(ctx, {
        type: pChartType,
        data: {
            labels: xDataArray,
            datasets: [{
                label: DefaultOptions.tooltipLabel,
                data: yDataArray,
                backgroundColor: bg,// materialColor(),
                //fillOpacity: 0,
                //fill: finalOptions.fill,
                //tension: finalOptions.tension
            }]
        },
        options: finalOptions

    });

    // Drill Down    
    canvas.onclick = function (evt) {
        var activePoints = window[typec].getElementsAtEvent(evt);
        if (activePoints[0]) {
            var chartData = activePoints[0]['_chart'].config.data;
            var idx = activePoints[0]['_index'];

            var label = chartData.labels[idx];
            //var value = chartData.datasets[0].data[idx];
            //var color = '' //chartData.datasets[0].backgroundColor[idx]; //Or any other data you wish to take from the clicked slice
            // var drillData = pData.filter(function (value) {
            //     return value[pGroupBy] == label;
            // });
            //var pdata4 = { pYears: vyears, pReturnDataType: "detail", pFilterCriteria: filterc };

            var params = window['filter' + pContextID];
            params.pReturnDataType = 'detail';
            params.pDetailDataFilter = label;
            params.pAdditionalDetailWhereClause = "AND Status = 'AbsentLeave'"
            //console.log(params);
            var pGroupBy = '';

            doModalProgress(pContextID, 'Detail - ' + pGroupBy + ' : ' + label + '', params);

            //postRequestD('GetAbsentismByDepartment', params, function (r) {
            //  r = JSON.parse(r.d);


            //doModal('Detail (' + pGroupBy + ' : ' + label + ')', CreateTableFromJSON(r));
            //var table = $('.drillTable').DataTable({ responsive: true, bDestroy: true, });
            //$('.dataTables_filter input').addClass('show');

            //})

            //doModal('Detail (' + pGroupBy + ' : ' + label + ')', CreateTableFromJSON(drillData));
            //var table = $('.drillTable').DataTable({ responsive: true, bDestroy: true, });
            //$('.dataTables_filter input').addClass('show');
        }
    };

}

function DrillDownChartOnDemandGeneric(pChartType, pData, pContextID, xSeriesColumn, ySeriesColumn, pOptions, pDrillDOwnMethodName, pData2) {

    var DefaultOptions = {
        IsDataInPercentage: false,
        DecimalRoundPoint: 2,
        IsDataLabelVisible: true,
        DataLabelPosition: 'top',
        xAxesTitle: '',
        yAxesTitle: '',
        tooltipLabel: '',
        pYaxisTickAppendText: ''
    }

    DefaultOptions = Object.assign({}, DefaultOptions, pOptions)

    var finalOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                display: DefaultOptions.IsDataLabelVisible,
                color: '#999',
                formatter: function (value, context) {
                    return value;//pDataLabelAppendText == 'false' ? '' : value + pDataLabelAppendText;
                },
                font: { Family: 'segoe UI', size: 12, weight: 'normal' },
                align: DefaultOptions.DataLabelPosition
            }
        },

        scales: {
            yAxes: [{
                //type: 'linear',
                scaleLabel: {
                    display: true,
                    labelString: DefaultOptions.yAxesTitle
                },
                ticks: {
                    beginAtZero: true,
                    //callback: options.tickCallback,
                    fontSize: 15,
                    //display: pVisibleyAxesScale == false ? false : true,
                    callback: function (label, index, labels) {
                        return label + ' ' + DefaultOptions.pYaxisTickAppendText;
                    }
                },
            }],
            xAxes: [{
                //type: xAxisType == '' || !xAxisType ? 'category' : 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: DefaultOptions.xAxesTitle
                },
                ticks: {
                    beginAtZero: true,
                    precision: 0,
                    display: true,
                    //display: pVisiblexAxesScale == false ? false : true,
                    userCallback: function (label, index, labels) {
                        // when the floored value is the same as the value we have a whole number
                        return label; //label.toFixed();
                    },
                    // fontSize: options.xfontSize,
                },
                gridLines: {
                    // color: "rgba(0, 0, 0, " + gridLineColor + ")",
                }


            }]
        },
    };

    var xDataArray = [];
    var yDataArray = [];
    var total = 0;
    if (DefaultOptions.pIsDataInPercentage) { total = sum(pData, ySeriesColumn) }

    $.each(pData, function (i, item) {
        xDataArray.push(item[xSeriesColumn]);
        var yDataPoint = 0;
        yDataPoint = DefaultOptions.pIsDataInPercentage ? (item[ySeriesColumn] / total) * 100 : item[ySeriesColumn];
        yDataArray.push(yDataPoint.toFixed(DefaultOptions.DecimalRoundPoint));
    });

    var bg = [];
    if (pChartType == 'line') {
        bg.push(materialColor());
    } else {
        $.each(yDataArray, function (i, item) {
            bg.push(materialColor());
        });
    }


    // Chart Create Here
    var canvas = document.getElementById(pContextID);
    var ctx = canvas.getContext("2d");
    var typec = pContextID + '' + pChartType;
    if (window[typec] != undefined) { window[typec].destroy(); }
    window[typec] = new Chart(ctx, {
        type: pChartType,
        data: {
            labels: xDataArray,
            datasets: [{
                label: DefaultOptions.tooltipLabel,
                data: yDataArray,
                backgroundColor: bg,// materialColor(),
                //fillOpacity: 0,
                //fill: finalOptions.fill,
                //tension: finalOptions.tension
            }]
        },
        options: finalOptions

    });

    // Drill Down    
    canvas.onclick = function (evt) {
        var activePoints = window[typec].getElementsAtEvent(evt);
        if (activePoints[0]) {
            var chartData = activePoints[0]['_chart'].config.data;
            var idx = activePoints[0]['_index'];

            var label = chartData.labels[idx];
            //var value = chartData.datasets[0].data[idx];
            //var color = '' //chartData.datasets[0].backgroundColor[idx]; //Or any other data you wish to take from the clicked slice
            // var drillData = pData.filter(function (value) {
            //     return value[pGroupBy] == label;
            // });
            //var pdata4 = { pYears: vyears, pReturnDataType: "detail", pFilterCriteria: filterc };

            var params = window['filter' + pContextID];
            params.pType = 'detail';
            params.pAdditionalFilter = label;
            //params.pAdditionalDetailWhereClause = "AND Status = 'AbsentLeave'"
            //var drilldownParams = Object.assign({}, params, pData2)
            //console.log(params);
            var pGroupBy = '';

            //doModalProgress(pContextID, 'Detail - ' + pGroupBy + ' : ' + label + '', params);
            doModalProgress2(pContextID, 'Detail - ' + pGroupBy + ' : ' + label + '', pDrillDOwnMethodName, params);
            //postRequestD('GetAbsentismByDepartment', params, function (r) {
            //  r = JSON.parse(r.d);


            //doModal('Detail (' + pGroupBy + ' : ' + label + ')', CreateTableFromJSON(r));
            //var table = $('.drillTable').DataTable({ responsive: true, bDestroy: true, });
            //$('.dataTables_filter input').addClass('show');

            //})

            //doModal('Detail (' + pGroupBy + ' : ' + label + ')', CreateTableFromJSON(drillData));
            //var table = $('.drillTable').DataTable({ responsive: true, bDestroy: true, });
            //$('.dataTables_filter input').addClass('show');
        }
    };

}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function DrillDownChartFormatted(pContext, pData, pGroupBy, pGroupOnColumn, pGroupFunc, pConditionDataType, pChartType, pOptions, yTitle, xTitle, pTooltipLabel, pDataLabelAlign, pYaxisTickLabel, pDataLabelAppendText, xAxisType, pDecimalPoint, pVisibleyAxesScale, pVisiblexAxesScale, pIsDataInPercentage, initOrderBy, pChartTitle) {
    var canvas = document.getElementById(pContext);
    var ctx = canvas.getContext("2d");
    if (!pChartTitle) {
        pChartTitle = '';
    }

    if (!initOrderBy) {
        initOrderBy = 'order by ' + pGroupBy + '';
    } else if (initOrderBy == '-1') {
        initOrderBy = '';
    }
    pData = alasql('select * from ? ' + initOrderBy + '', [pData]);

    var DefaultOptions = {
        excludeColumns: [],
        tension: 0.1,
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 30,
                left: 0,
                right: 0,
                bottom: 30
            }
        },
        plugins: {
            datalabels: {
                color: 'black',
                formatter: function (value, context) {
                    return pDataLabelAppendText == 'false' ? '' : numberWithCommas(value) + pDataLabelAppendText;
                },
                font: {
                    Family: 'segoe UI',
                    size: 12,
                    weight: 'normal'
                },
                align: 'end',
                offset: 40,
                display: 'auto'
                //display: function (context) {
                //    return context.dataIndex % 2; 
                //}
            },
            legend: true,

        },
        title: {
            display: true,
            text: pChartTitle
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var dataLabel = data.labels[tooltipItem.index];
                    var value = ': ' + numberWithCommas(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString());
                    if (Chart.helpers.isArray(dataLabel)) {
                        dataLabel = dataLabel.slice();
                        dataLabel[0] += value;
                    } else {
                        dataLabel += value;
                    }

                    return dataLabel;
                }
            }
        },
        scales: {
            yAxes: [{
                //type: 'category',
                scaleLabel: {
                    display: true,
                    labelString: yTitle
                },
                ticks: {
                    beginAtZero: true,
                    //callback: options.tickCallback,
                    fontSize: 11,
                    display: pVisibleyAxesScale == false ? false : true,
                    callback: function (label, index, labels) {
                        return !pYaxisTickLabel ? label : label + pYaxisTickLabel;
                    }
                },
            }],
            xAxes: [{
                type: xAxisType == '' || !xAxisType ? 'category' : 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: xTitle
                },
                ticks: {
                    beginAtZero: true,
                    display: pVisiblexAxesScale == false ? false : true,
                    userCallback: function (label, index, labels) {
                        // when the floored value is the same as the value we have a whole number
                        return label; //label.toFixed();
                    },
                    // fontSize: options.xfontSize,
                },
                gridLines: {
                    // color: "rgba(0, 0, 0, " + gridLineColor + ")",
                }


            }]
        }
    }

    var finalOptions = Object.assign({}, DefaultOptions, pOptions)

    var labels = [];
    var data = [];

    if (pChartType != 'scatter') {
        labels = _.uniq(_.map(pData, pGroupBy));
        $.each(labels, function (i, item) {
            var gc = pGroupOnColumn.indexOf(' ') > -1 ? "'" + pGroupOnColumn + "'" : pGroupOnColumn;
            var finalData = alasql('select ' + pGroupFunc + '(' + gc + ') as Total from ? where ' + pGroupBy + ' = ' + addslashes(item) + ' ', [pData]);
            if (pContext.toLowerCase().indexOf('break') > -1) {
            }
            if (finalData.length > 0) {
                var _val = 0;
                if (pIsDataInPercentage) {
                    _val = ((finalData[0]['Total'] / pData.length) * 100).toFixed(!pDecimalPoint ? 0 : pDecimalPoint);
                } else {
                    _val = finalData[0]['Total'];

                    if (finalData[0]['Total'] !== 'undefined') {
                        _val = finalData[0]['Total'].toFixed(!pDecimalPoint ? 0 : pDecimalPoint);
                    }

                }
                data.push(_val);
            } else {
                data.push(0);
            }
        });
    } else {
        finalOptions.plugins.datalabels.display = false;
        var dta = alasql('select  ' + pGroupBy + ' , ' + pGroupFunc + '(' + pGroupBy + ') as Total  From ? GROUP BY ' + pGroupBy + ' ORDER By ' + pGroupBy + ' ', [pData])
        var total = sum(dta, 'Total');
        $.each(dta, function (i, item) {
            var per = item.Total * 100.0 / total;
            per = parseFloat(per.toFixed(2));
            var xy = { x: item[pGroupBy], y: per };
            data.push(xy);
        });


    }

    var bg = [];
    if (pChartType == 'line' || pChartType == 'scatter') {
        bg.push(materialColor());
    } else {
        $.each(data, function (i, item) {
            bg.push(materialColor());
        });
    }

    var typec = pContext + '' + pChartType;
    if (window[typec] != undefined)
        window[typec].destroy();
    window[typec] = new Chart(ctx, {
        type: pChartType,
        data: {
            labels: labels,
            datasets: [{
                label: pTooltipLabel,
                data: data,
                backgroundColor: bg,
                fillOpacity: 0,
                fill: finalOptions.fill,
                tension: finalOptions.tension,
                showLine: true,
            }]
        },
        options: finalOptions,


    });

    //DrillDown
    canvas.onclick = function (evt) {
        var activePoints = window[typec].getElementsAtEvent(evt);
        if (activePoints[0]) {
            var chartData = activePoints[0]['_chart'].config.data;
            var idx = activePoints[0]['_index'];

            console.log(chartData);

            var label;

            if (pChartType !== 'scatter') {
                label = chartData.labels[idx];
            } else {
                label = chartData.datasets[0].data[idx]['x'];
            }

            var drillData = pData.filter(function (value) {
                return value[pGroupBy] == label;
            });
            if (finalOptions.excludeColumns.length > 0) {
                drillData = drillData.map(function (item) {
                    jQuery.each(finalOptions.excludeColumns, function (c, col) {
                        delete item[col];
                    })
                    return item;
                });
            }

            jQuery.each(drillData, function (i, item) {
                if (item.GrossSalary) {
                    item.GrossSalary = item.GrossSalary + ' (1000s)';
                }
            })

            doModal('Detail (' + pGroupBy + ' : ' + label + ')', CreateTableFromJSON(drillData));
            var table = $('.drillTable').DataTable({ responsive: true, bDestroy: true, });
            $('.dataTables_filter input').addClass('show');
        }
    };


};
function DrillDownChart(pContext, pData, pGroupBy, pGroupOnColumn, pGroupFunc, pConditionDataType, pChartType, pOptions, yTitle, xTitle, pTooltipLabel, pDataLabelAlign, pYaxisTickLabel, pDataLabelAppendText, xAxisType, pDecimalPoint, pVisibleyAxesScale, pVisiblexAxesScale, pIsDataInPercentage, initOrderBy, pChartTitle) {
    ////console.log(pData);
    //console.log(pVisibleyAxesScale, pVisiblexAxesScale);
    //console.log(pContext, pDataLabelAppendText);
    //var gc0 = pGroupOnColumn.indexOf(' ') > -1 ? "'" + pGroupOnColumn + "'" : pGroupOnColumn;
    //pData = alasql('select * from ? order by ' + pGroupBy + '', [pData]);

    if (!pChartTitle) {
        pChartTitle = '';
    }

    if (!initOrderBy) {
        initOrderBy = 'order by ' + pGroupBy + '';
    } else if (initOrderBy == '-1') {
        initOrderBy = '';
    }
    pData = alasql('select * from ? ' + initOrderBy + '', [pData]);

    var DefaultOptions = {
        excludeColumns: [],
        tension: 0.1,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                color: '#999',
                formatter: function (value, context) {
                    //return 'ok';
                    return pDataLabelAppendText == 'false' ? '' : value + pDataLabelAppendText;
                },
                font: {
                    Family: 'segoe UI',
                    size: 12,
                    weight: 'normal'
                },
                align: pDataLabelAlign

            }
        },
        title: {
            display: true,
            text: pChartTitle
        },
        scales: {
            yAxes: [{
                //type: 'category',
                scaleLabel: {
                    display: true,
                    labelString: yTitle
                },
                ticks: {
                    beginAtZero: true,
                    //callback: options.tickCallback,
                    fontSize: 11,
                    display: pVisibleyAxesScale == false ? false : true,
                    callback: function (label, index, labels) {
                        return !pYaxisTickLabel ? label : label + pYaxisTickLabel;
                    }
                },
            }],
            xAxes: [{
                type: xAxisType == '' || !xAxisType ? 'category' : 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: xTitle
                },
                ticks: {
                    beginAtZero: true,
                    display: pVisiblexAxesScale == false ? false : true,
                    userCallback: function (label, index, labels) {
                        // when the floored value is the same as the value we have a whole number
                        return label; //label.toFixed();
                    },
                    // fontSize: options.xfontSize,
                },
                gridLines: {
                    // color: "rgba(0, 0, 0, " + gridLineColor + ")",
                }


            }]
        },
    }

    var finalOptions = Object.assign({}, DefaultOptions, pOptions)

    var labels = [];
    var data = [];
    
    
    if (pChartType != 'scatter') {
        labels = _.uniq(_.map(pData, pGroupBy));                
        $.each(labels, function (i, item) {
            //item = pConditionDataType == 'string' ? "'" + item + "'" : item;
            var gc = pGroupOnColumn.indexOf(' ') > -1 ? "'" + pGroupOnColumn + "'" : pGroupOnColumn;
            ////console.log(pConditionDataType, item);
            var finalData = alasql('select ' + pGroupFunc + '(' + gc + ') as Total from ? where ' + pGroupBy + ' = ' + addslashes(item) + ' ', [pData]);
            //var finalData = alasql(`select ${pGroupFunc}(${gc}) as Total from ? where ${pGroupBy} = '${addslashes(item)}'`, [pData]);
            //var finalData = alasql("select " + pGroupFunc + "(" + gc + ") as Total from ? where " + pGroupBy + " = `` ", [pData])
            //console.log('select ' + pGroupFunc + '(' + gc + ') as Total from ? where ' + pGroupBy + ' = ' + addslashes(item) + ' ');
            //console.log({ pContext, finalData });
            if (pContext.toLowerCase().indexOf('break') > -1) {
                //console.log({ pData });
                //     console.log({ finalData }, { pData });
                //     console.log('select ' + pGroupFunc + '(' + gc + ') as Total from ? where ' + pGroupBy + ' = ' + item + ' ');
                //console.log({ pData });
                //var _val = (finalData[0]['Total'] / pData.length) * 100
                //console.log({ _val });
            }
            if (finalData.length > 0) {
                var _val = 0;
                if (pIsDataInPercentage) {
                    _val = ((finalData[0]['Total'] / pData.length) * 100).toFixed(!pDecimalPoint ? 0 : pDecimalPoint);
                } else {
                    _val = finalData[0]['Total'];

                    if (finalData[0]['Total'] !== 'undefined') {
                        _val = finalData[0]['Total'].toFixed(!pDecimalPoint ? 0 : pDecimalPoint);
                    }

                }
                data.push(_val);
            } else {
                data.push(0);
            }
        });
    } else {
        finalOptions.plugins.datalabels.display = false;
        var dta = alasql('select  ' + pGroupBy + ' , ' + pGroupFunc + '(' + pGroupBy + ') as Total  From ? GROUP BY ' + pGroupBy + ' ORDER By ' + pGroupBy + ' ', [pData])
        var total = sum(dta, 'Total');
        $.each(dta, function (i, item) {
            var per = item.Total * 100.0 / total;
            per = parseFloat(per.toFixed(2));
            //per = item.Total;
            var xy = { x: item[pGroupBy], y: per };
            data.push(xy);
        });


    }


    var bg = [];
    if (pChartType == 'line' || pChartType == 'scatter') {
        bg.push(materialColor());
    } else {
        $.each(data, function (i, item) {
            bg.push(materialColor());
        });
    }


    var canvas = document.getElementById(pContext);
    var ctx = canvas.getContext("2d");
    var typec = pContext + '' + pChartType;
    if (window[typec] != undefined)
        window[typec].destroy();
    window[typec] = new Chart(ctx, {
        type: pChartType,
        data: {
            labels: labels,
            datasets: [{
                label: pTooltipLabel,
                data: data,
                backgroundColor: bg,// materialColor(),
                fillOpacity: 0,
                fill: finalOptions.fill,
                tension: finalOptions.tension,

                //test
                //borderWidth: 2,
                //borderColor: '#333',
                //lineTension: 0,
                //fill: true,
                showLine: true,



            }]
        },
        options: finalOptions

    });

    //DrillDown
    canvas.onclick = function (evt) {
        var activePoints = window[typec].getElementsAtEvent(evt);
        if (activePoints[0]) {
            var chartData = activePoints[0]['_chart'].config.data;
            var idx = activePoints[0]['_index'];

            console.log(chartData);

            var label;

            if (pChartType !== 'scatter') {
                label = chartData.labels[idx];
            } else {
                label = chartData.datasets[0].data[idx]['x'];
            }

            //alert(label);
            //var value = chartData.datasets[0].data[idx]['x'];
            //alert(value);
            //var color = '' //chartData.datasets[0].backgroundColor[idx]; //Or any other data you wish to take from the clicked slice
            var drillData = pData.filter(function (value) {
                return value[pGroupBy] == label;
            });
            //finalOptions.excludeColumns = ['Birth Date'];
            if (finalOptions.excludeColumns.length > 0) {
                drillData = drillData.map(function (item) {
                    jQuery.each(finalOptions.excludeColumns, function (c, col) {
                        delete item[col];
                    })
                    return item;
                });
            }

            jQuery.each(drillData, function (i, item) {
                if (item.GrossSalary) {
                    item.GrossSalary = item.GrossSalary + ' (1000s)';
                }
            })

            doModal('Detail (' + pGroupBy + ' : ' + label + ')', CreateTableFromJSON(drillData));
            var table = $('.drillTable').DataTable({ responsive: true, bDestroy: true, });
            $('.dataTables_filter input').addClass('show');
        }
    };


};



function DrillDownChart2(ctxID, response, isMultiSet, multisetColumn, GroupByColumn, GroupOnColumn, fx, GroupOnColumnb, ChartType, pGroupByColumnDataType, pDecimalPoint, pTooltipLabel,pOptions) {

    var BasicChartpDefaultObjections = {
        excludeColumns : [],
        labelColor : '#555',
        labelBackgroungColor : 'transparent',        
        labelBorderRadius : 0,        
        labelAnchor : 'default',
        labelClamp : false,
        labelAlign : 'center',
        isPercentage : false,
        isUseGroupByColumnFiledToCalculatePercentage : false,
        fieldToCalculatePercentage : GroupOnColumnb,
        DistinctColorForEachGroup : false,
        tension : 0.1,
        fill : true,
        pointBorderWidth : 1,
        borderWidth : 3,
        borderColor : 'rgba(0, 0, 0, 0.1)',
        beginAtZeroX : true,
        beginAtZeroY : true,
        isShowLegend : true,
        legendPosition : 'top',        
        Chartpadding : 4
    }

    pOptions = Object.assign({}, BasicChartpDefaultObjections, pOptions);
    //console.log({mypOptions});
    var ds = [];
    var uniqueGroupa = _.uniq(_.map(response, multisetColumn));
    var uniqueGroupb = _.uniq(_.map(response, GroupByColumn));
    var uniqueLabels = _.uniq(_.map(response, GroupOnColumnb));    
    
    var isPercentage = pOptions.isPercentage;
    var isUseGroupByColumnFiledToCalculatePercentage = pOptions.isUseGroupByColumnFiledToCalculatePercentage;
    var fieldToCalculatePercentage = pOptions.fieldToCalculatePercentage;

    if (!isMultiSet) {

        var usedColors = [];
        $.each(uniqueGroupb, function (j, jitem) {

            //var _where1 = !pGroupByColumnDataType =
            var _where1 = pGroupByColumnDataType == 'string' ? "'" + jitem + "'" : jitem;
            var _temp = GroupOnColumn.toLowerCase().indexOf(' ') > -1 ? '"' + GroupOnColumn + '"' : GroupOnColumn;
            var res = alasql('SELECT ' + GroupOnColumnb + ', ' + GroupByColumn + ', ' + fx + '(' + _temp + ') as Total FROM ? WHERE 1=1  AND ' + GroupByColumn + ' = ' + _where1 + ' GROUP By ' + GroupOnColumnb + ', ' + GroupByColumn + '', [response]);            
            //console.log('SELECT ' + GroupOnColumnb + ', ' + GroupByColumn + ', ' + fx + '(' + _temp + ') as Total FROM ? WHERE 1=1  AND ' + GroupByColumn + ' =  ' + _where1 + ' GROUP By ' + GroupOnColumnb + ', ' + GroupByColumn + '');
            //console.log({ res });

            var data = [];
            //if (DefaultOptions.pIsDataInPercentage) { total = sum(pData, ySeriesColumn) }
           
            //alert(total);
            //console.log({uniqueLabels})
            $.each(uniqueLabels, function (k, kitem) {
                ////console.log({ res });
                var filterData = res.filter(function (value) { return value[GroupOnColumnb] == kitem; });                
               

                if (isPercentage){
                    var total = 0;                    
                    var _datatocalcPer;
                    if (isUseGroupByColumnFiledToCalculatePercentage == true){
                        _datatocalcPer = response.filter(function (value) { return value[GroupByColumn] == jitem; });                    
                    }else{
                        _datatocalcPer = response.filter(function (value) { return value[fieldToCalculatePercentage] == kitem; });                    
                    }
                    
                    total = sum(_datatocalcPer, GroupOnColumn)                    
                }

                if (filterData.length > 0) {
                    if (!isPercentage){
                        data.push(filterData[0]['Total'].toFixed(!pDecimalPoint ? 0 : pDecimalPoint));
                    }else{                        
                        var per = (filterData[0]['Total'] / total) * 100;
                        //console.log(filterData[0]['Total']  + '/' + total  + '* 100');
                        data.push(per.toFixed(!pDecimalPoint ? 0 : pDecimalPoint));
                    }
                    
                } else {
                    data.push(0);
                }
            });

            var _color = materialColor(ChartType);

            if (pOptions.DistinctColorForEachGroup == true){
                if (usedColors.indexOf(_color) > -1){
                    _color = materialColor(ChartType);            
                }
                usedColors.push(_color);
            }
            

            var obj = {
                label: jitem,
                data: data,
                backgroundColor: _color,
                fill: pOptions.fill,
                tension: pOptions.tension,
                pointBorderWidth : pOptions.pointBorderWidth,
                borderWidth : pOptions.borderWidth,
                borderColor : pOptions.borderColor != 'rgba(0, 0, 0, 0.1)' ? pOptions.borderColor : _color,
            }
            ds.push(obj);

        });
    }

    if (isMultiSet) {
        $.each(uniqueGroupa, function (i, item) {
            $.each(uniqueGroupb, function (j, jitem) {

                var res = alasql('SELECT ' + multisetColumn + ',' + GroupOnColumnb + ', ' + GroupByColumn + ', ' + fx + '("' + GroupOnColumn + '") as Total FROM ? WHERE 1=1 AND ' + multisetColumn + ' = "' + item + '" AND ' + GroupByColumn + ' = "' + jitem + '" GROUP By ' + multisetColumn + ', ' + GroupOnColumnb + ', ' + GroupByColumn + '', [response]);
                var data = [];
                $.each(uniqueLabels, function (k, kitem) {
                    ////console.log({ res });
                    var filterData = res.filter(function (value) { return value[GroupOnColumnb] == kitem; });
                    if (filterData.length > 0) {
                        data.push(filterData[0]['Total']);
                    } else {
                        data.push(0);
                    }
                });

                var obj = {
                    label: item + '-' + jitem,
                    data: data,
                    backgroundColor: renderColor(),
                    fill: false,
                    tension: 0.1                    
                }
                ds.push(obj);

            });
        });
    }

    if (!pTooltipLabel) {
        pTooltipLabel = '';
    }


    //////console.log({ ds });
    var yStack = false;
    var xStack = false;
    if (ChartType.toLowerCase().indexOf('stack') > -1) {        
        yStack = true;
        xStack = true;        
    }

    if (ChartType.toLowerCase().indexOf('horizontal') > -1) {        
        ChartType = 'horizontalBar';
    }
    else{
        //ChartType = 'bar';
    }
  
    var selectedPoint;
    var dsIndex = 0;
    var canvas = document.getElementById(ctxID);
    var ctx = canvas.getContext("2d");

    var typec = ctxID + '' + ctxID;
    if (window[typec] != undefined)
        window[typec].destroy();
    window[typec] = new Chart(ctx, {
        type: ChartType,
        data: {
            labels: uniqueLabels,
            datasets: ds,
            backgroundColor: materialColor(),
        },
        options: {
            //indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: pOptions.Chartpadding
            },
            plugins: {
                datalabels: {
                    backgroundColor : pOptions.labelBackgroungColor,
                    color: pOptions.labelColor,
                    borderRadius : pOptions.labelBorderRadius,                    
                    anchor : pOptions.labelAnchor,
                    clamp : pOptions.labelClamp,
                    align : pOptions.labelAlign,
                    formatter: function (value, context) {
                        if (value === 0) {
                            return '';
                        } else {
                            return value;
                        }
                    },
                }
            },
            tooltips: {
                mode: 'single',
                callbacks: {
                    label: function (tooltipItems, data) {
                        return tooltipItems.yLabel + pTooltipLabel;
                    },
                    afterBody: (data) => {
                        if (data && data[0])
                            selectedPoint = data[0];
                        return [''];
                    }
                }
            },
            scales: {
                xAxes: [{
                    stacked: xStack,
                    ticks: {
                        beginAtZero: pOptions.beginAtZeroX,
                    }
                }],
                yAxes: [{
                    stacked: yStack,
                    ticks: {
                        beginAtZero: pOptions.beginAtZeroY,
                    }
                }]
            },
            legend: {
                display: pOptions.isShowLegend,
                position : pOptions.legendPosition,
                labels: {
                    fontColor: 'rgb(0, 0, 0,0.5)',
                    fontFamily: 'segoe UI'
                },
            },
        }
    });

    //DrillDown
    canvas.onclick = function (evt) {
        var activePoints = window[typec].getElementsAtEvent(evt);
        //////console.log({ activePoints });
        if (activePoints) {
            //alert(activePoints.length);
            //dsIndex = activePoints.length == 1 || activePoints.length == 0 ? 0 : selectedPoint.datasetIndex;
            dsIndex = selectedPoint.datasetIndex;
            //alert(dsIndex);
            //alert(dsIndex);
            //////console.log({ activePoints });
            //alert(selectedPoint.datasetIndex);
            //////console.log({ activePoints });
            var chartData = activePoints[dsIndex]['_chart'].config.data;

            ////console.log({ chartData });

            var idx = activePoints[dsIndex]['_index'];

            ////console.log({ chartData });
            //alert(idx + '-' + selectedPoint.datasetIndex);
            var _legend = chartData.labels[idx];
            var _label = chartData.datasets[dsIndex].label;
            // var value = chartData.datasets[selectedPoint.datasetIndex].data[idx];
            ////console.log(_legend, _label);
            //////console.log(legend, label, value);
            //////console.log('select  * from  ? where Department = "' + legend + '" and Year = "' + label.split('-')[0] + '" and Gender = "' + label.split('-')[1] + '" ');

            var _where2 = pGroupByColumnDataType == 'string' ? "'" + _label + "'" : _label;
            if (isMultiSet) {
                var ddata = alasql('select  * from  ? where ' + GroupOnColumnb + ' = "' + _legend + '" and ' + multisetColumn + ' = "' + _label.split('-')[0] + '" and ' + GroupByColumn + ' = "' + _label.split('-')[1] + '" ', [response]) //where lower(department) = "' + legend + '" and Year = "' + label.split('-')[0] + '" and Gender = "' + label.split('-')[1] + '" ', [response]);    
            } else {
                var ddata = alasql('select  * from  ? where ' + GroupOnColumnb + ' = "' + _legend + '" and ' + GroupByColumn + ' = ' + _where2 + ' ', [response]) //where lower(department) = "' + legend + '" and Year = "' + label.split('-')[0] + '" and Gender = "' + label.split('-')[1] + '" ', [response]);
                ////console.log('select  * from  ? where ' + GroupOnColumnb + ' = "' + _legend + '" and ' + GroupByColumn + ' = ' + _where2 + ' ');
            }

            if (pOptions.excludeColumns.length > 0) {
                ddata = ddata.map(function (item) {
                    jQuery.each(pOptions.excludeColumns, function (c, col) {
                        delete item[col];
                    })
                    return item;
                });
            }

            jQuery.each(ddata, function (i, item) {
                if (item.GrossSalary) {
                    item.GrossSalary = item.GrossSalary + ' (1000s)';
                }
            })
            //console.log({ ddata });
            //console.log({ ddata });
            doModal('Detail - ' + _legend + '-' + _label, CreateTableFromJSON(ddata));

            //var color = '' //chartData.datasets[0].backgroundColor[idx]; //Or any other data you wish to take from the clicked slice
            //var drillData = pData.filter(function (value) {
            //return value[pGroupBy] == label;
            //});
            //doModal('Detail (Age Group : ' + label + ')', CreateTableFromJSON(drillData));
            var table = $('.drillTable').DataTable({
                responsive: true, bDestroy: true,
            });
            $('.dataTables_filter input').addClass('show');
        }
    };


}

function doModal(heading, formContent) {
    html = '<div id="dynamicModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
    html += '<div class="modal-dialog" style="width:98%;">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header" style="padding: 2px 15px 2px 15px;">';
    html += '<a class="close" data-dismiss="modal">×</a>';
    html += '<h4>' + heading + '</h4>'
    html += '</div>';
    html += '<div class="modal-body" style="overflow:auto;">';
    html += formContent;
    html += '</div>';
    //html += '<div class="modal-footer">';
    //html += '<span class="btn btn-primary" data-dismiss="modal">Close</span>';
    //html += '</div>';  // content
    html += '</div>';  // dialog
    html += '</div>';  // footer
    html += '</div>';  // modalWindow
    $('body').append(html);
    $("#dynamicModal .close").css('line-height', 2);
    $("#dynamicModal").modal();
    $("#dynamicModal").modal('show');


    $('#dynamicModal').on('hidden.bs.modal', function (e) {
        $(this).remove();
    });

}

function doModalProgress2(pContextID, heading, pMethod, params) {

    html = '<div id="dynamicModal' + pContextID + '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
    html += '<div class="modal-dialog" style="width:90%;">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header" style="padding: 2px 15px 2px 15px;">';
    html += '<a class="close" data-dismiss="modal">×</a>';
    html += '<h4>' + heading + '</h4>'
    html += '</div>';
    html += '<div class="modal-body" style="overflow:auto;">';
    html += '<div id="modal' + pContextID + '"><center> Loading <i class="fa fa-spinner fa-spin"></i></center></div>';
    html += '</div>';
    //html += '<div class="modal-footer">';
    //html += '<span class="btn btn-primary" data-dismiss="modal">Close</span>';
    //html += '</div>';  // content
    html += '</div>';  // dialog
    html += '</div>';  // footer
    html += '</div>';  // modalWindow
    $('body').append(html);
    $('#dynamicModal' + pContextID + ' .close').css('line-height', 2);
    $('#dynamicModal' + pContextID + '').modal();
    $('#dynamicModal' + pContextID + '').modal('show');
    $('#dynamicModal' + pContextID + '').on('hidden.bs.modal', function (e) {
        $(this).remove();
    });

    postRequestD(pMethod, params, function (r) {
        r = JSON.parse(r.d);
        var temp = '';
        if (r.length <= 0) {
            temp = data404();
        } else {
            temp = CreateTableFromJSON(r);
        }
        jQuery('#modal' + pContextID).html(temp);
        var table = $('.drillTable').DataTable({ responsive: true, bDestroy: true, });
        $('.dataTables_filter input').addClass('show');
    });

}

function doModalProgress(pContextID, heading, params) {

    html = '<div id="dynamicModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
    html += '<div class="modal-dialog" style="width:90%;">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header" style="padding: 2px 15px 2px 15px;">';
    html += '<a class="close" data-dismiss="modal">×</a>';
    html += '<h4>' + heading + '</h4>'
    html += '</div>';
    html += '<div class="modal-body" style="overflow:auto;">';
    html += '<div id="modal' + pContextID + '"><center> Loading <i class="fa fa-spinner fa-spin"></i></center></div>';
    html += '</div>';
    //html += '<div class="modal-footer">';
    //html += '<span class="btn btn-primary" data-dismiss="modal">Close</span>';
    //html += '</div>';  // content
    html += '</div>';  // dialog
    html += '</div>';  // footer
    html += '</div>';  // modalWindow
    $('body').append(html);
    $("#dynamicModal .close").css('line-height', 2);
    $("#dynamicModal").modal();
    $("#dynamicModal").modal('show');


    //var table = $('.drillTable').DataTable({ responsive: true, bDestroy: true, });
    //$('.dataTables_filter input').addClass('show');

    $('#dynamicModal').on('hidden.bs.modal', function (e) {
        $(this).remove();
    });


    postRequestD('GetAbsentismByDepartment', params, function (r) {
        r = JSON.parse(r.d);
        r = r.filter(function (value) {
            return value.AbsentLeave > 0;
        })
        jQuery('#modal' + pContextID).html(CreateTableFromJSON(r));
        var table = $('.drillTable').DataTable({ responsive: true, bDestroy: true, });
        $('.dataTables_filter input').addClass('show');
    });

}

function CreateTableFromJSON(mydata) {
    ////console.log({ mydata });
    var table = '';
    var thead = '<th>Sno</th>';
    var tbody = '';
    var key = Object.keys(mydata[0]);
    $.each(key, function (i, item) {
        thead += '<th>' + item + '</th>';
    });
    thead = '<thead><tr>' + thead + '</tr></thead>';

    var temp = '';
    $.each(mydata, function (j, jitem) {
        var sno = j + 1;
        temp = '<td>' + sno + '</td>';
        $.each(Object.keys(jitem), function (i, item) {
            var _value_ = '';
            if (item.toLowerCase() === 'month') {
                _value_ = monthNames[jitem[item] - 1];
            } else {
                _value_ = jitem[item];
            }
            temp += '<td>' + _value_ + '</td>';
        });
        tbody += '<tr>' + temp + '</tr>';
    });
    tbody = '<tbody>' + tbody + '</tbody>';
    table = '<table class="table table-sm compact nowrap table-responsve table-condensed table-bordered table-hover drillTable" style="width="100%;">' + thead + tbody + '</table>';
    return table;
}

function CreateTableFromJSONWithFooter(ctx,mydata) {
    var table = '';
    var thead = '<th>Sno</th>';
    var tbody = '';
    var key = Object.keys(mydata[0]);
   
    $.each(key, function (i, item) {
        thead += '<th>' + item + '</th>';
    });

    var tfoot = '<tfoot><tr>';
    for (var i = 1; i <= key.length; i++) {
        if (i == 1) {
            tfoot += '<th colspan="2" style="text-align:right">Grand Total</th>';
        } else {
            tfoot += '<th></th>';
        }
    }
    tfoot += '</tr></tfoot>';

    thead = '<thead><tr>' + thead + '</tr></thead>';

    var temp = '';
    $.each(mydata, function (j, jitem) {
        var sno = j + 1;
        temp = '<td>' + sno + '</td>';
        $.each(Object.keys(jitem), function (i, item) {
            var _value_ = '';
            if (item.toLowerCase() === 'month') {
                _value_ = monthNames[jitem[item] - 1];
            } else {
                _value_ = jitem[item];
            }
            temp += '<td>' + _value_ + '</td>';
        });
        tbody += '<tr>' + temp + '</tr>';
    });
    tbody = '<tbody>' + tbody + '</tbody>' + tfoot;
    table = '<table class="table table-sm compact nowrap table-responsve table-condensed table-bordered table-hover drillTable" id="' + ctx+'" style="width="100%;">' + thead + tbody + '</table>';
    return table;
}


Number.prototype.toFixed = function (precision) {
    var power = Math.pow(10, precision || 0);
    return isNaN(this) ? String('0') : (String(Math.round(this * power) / power));
}


function clearAllConsolelogs(DEBUG) {
    if (!DEBUG) {
        console.log = function () { }
        console.table = function () { }
    }
}

function addslashes(str) {
    //console.log({ str }, 'before');
    str = (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    //console.log({ str }, 'after');
    //return str;
    return "'" + str + "'";
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

function showChartLoader(ctx) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
}

function removeChartLoader(ctx) {
    $('#' + ctx + 'progress').remove();
}



// $(document).ajaxStart(function () {
//     $("#wait").css("display", "block");
// });

// $(document).ajaxComplete(function () {
//     $("#wait").css("display", "none");
// });

// Raw

// function getGroup(pObjectArray, pGroupByColumn, pGoupOnColumn, pFxFunx) {

    //     var GroupColumnName = pGroupByColumn;
    //     var result;
    //     switch (pFxFunx.toLowerCase()) {
    //         case 'count':
    //             result = _(pObjectArray)
    //                 .groupBy(pGroupByColumn)
    //                 .map((array, key) => ({
    //                     [pGroupByColumn]: key,
    //                     "Count": _.uniqBy(array, pGoupOnColumn).length,
    //                 }))
    //                 .value();
    //             break;
    //         case 'sum':
    //             result = _(pObjectArray)
    //                 .groupBy(pGroupByColumn)
    //                 .map((array, key) => ({
    //                     GroupColumnName: key,
    //                     "Sum": _.sumBy(array, pGoupOnColumn)
    //                 }))
    //                 .value();
    //             break;
    //         case 'avg':
    //             result = _(pObjectArray)
    //                 .groupBy(pGroupByColumn)
    //                 .map((array, key) => ({
    //                     GroupColumnName: key,
    //                     "Average": _.meanBy(array, pGoupOnColumn)
    //                 }))
    //                 .value();
    //             break;
    //     }
    //     return result;
    // }

    // function CreateTableFromJSON(mydata) {
    //     ////console.log({ mydata });
    //     var table = '';
    //     var thead = '<th>Sno</th>';
    //     var tbody = '';
    //     var key = Object.keys(mydata[0]);
    //     $.each(key, function (i, item) {
    //         thead += '<th>' + item + '</th>';
    //     });
    //     thead = '<thead><tr>' + thead + '</tr></thead>';

    //     var temp = '';
    //     $.each(mydata, function (j, jitem) {
    //         var sno = j + 1;
    //         temp = '<td>' + sno + '</td>';
    //         $.each(Object.keys(jitem), function (i, item) {
    //             temp += '<td>' + jitem[item] + '</td>';
    //         });
    //         tbody += '<tr>' + temp + '</tr>';
    //     });
    //     tbody = '<tbody>' + tbody + '</tbody>';
    //     table = '<table class="table compact table-responsve table-condensed table-bordered table-hover drillTable" style="width="100%;">' + thead + tbody + '</table>';
    //     return table;
    // }

    // function doModal(heading, formContent) {
    //     html = '<div id="dynamicModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
    //     html += '<div class="modal-dialog" style="width:90%;">';
    //     html += '<div class="modal-content">';
    //     html += '<div class="modal-header">';
    //     html += '<a class="close" data-dismiss="modal">×</a>';
    //     html += '<h4>' + heading + '</h4>'
    //     html += '</div>';
    //     html += '<div class="modal-body">';
    //     html += formContent;
    //     html += '</div>';
    //     html += '<div class="modal-footer">';
    //     html += '<span class="btn btn-primary" data-dismiss="modal">Close</span>';
    //     html += '</div>';  // content
    //     html += '</div>';  // dialog
    //     html += '</div>';  // footer
    //     html += '</div>';  // modalWindow
    //     $('body').append(html);
    //     $("#dynamicModal").modal();
    //     $("#dynamicModal").modal('show');

    //     $('#dynamicModal').on('hidden.bs.modal', function (e) {
    //         $(this).remove();
    //     });

    // }