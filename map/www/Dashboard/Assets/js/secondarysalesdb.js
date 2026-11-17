function renderSecondarySalesDashboard(pFirstLoad, filterc) {

    pdata4 = {
        pFromDate: $('#txtFromSS').val(),
        pToDate: $('#txtToSS').val(),
        pCustomerID: 0,
        pProjectID: 0,
        pType: 0,
        pFilterCriteria: filterc
    }
    //GetSummaryData(pdata4);
    GetTopTenProducts('toptenproducts', pdata4);
    GetDistributorsData('distributorByAmount', pdata4);
    GetCustomerTypeWiseData("customerTypeWiseSale", pdata4);
    GetProductsByBrandsData("productsByBrands", pdata4);

}
function renderSecondarySalesReport(pFirstLoad, filterc) {

    pdata4 = {
        pFromDate: $('#txtFromSSR').val(),
        pToDate: $('#txtToSSR').val(),
        pCustomerID: 0,
        pProjectID: 0,
        pType: 0,
        pFilterCriteria: filterc
    }

    if ($("#ddlReport").val() == "1" || $("#ddlReport").val() == 1) {
        document.getElementById('dailysalesDiv').style.display = 'none';
        document.getElementById('dailybydailysalesDiv').style.display = 'block';
    GetDailySalesReportData("DailySalesReport", pdata4);
}
    else {
        document.getElementById('dailysalesDiv').style.display = 'block';
        document.getElementById('dailybydailysalesDiv').style.display = 'none';
        GetDailySalesReportDataNew("DailySalesReportNew", pdata4);
    }   
}

//#region DropDown Change Events
function OnProductGraphType_Change(DropDownType) {
    var data4 = {
        pFromDate: $('#txtFromSS').val(),
        pToDate: $('#txtToSS').val(),
        pCustomerID: 0,
        pProjectID: 0,
        pType: 0,
        pFilterCriteria: []
    }
    if (DropDownType.toLocaleLowerCase() == "topten") {
        GetTopTenProducts('toptenproducts', data4);
    } else if (DropDownType.toLocaleLowerCase() == "brands") {
        GetProductsByBrandsData("productsByBrands", data4);
    }
    
}
//#endregion


//#region Graphs Functions
function GetSummaryData(data) {
    var txtAttSales = $('#txtAttSales');
    var txtAttTarget = $('#txtAttTarget');
    var txtAttLastMonth = $('#txtAttLastMonth');
    var txtAttLastYear = $('#txtAttLastYear');
    debugger
    txtAttSales.html(progress());
    txtAttTarget.html(progress());
    txtAttLastMonth.html(progress());
    txtAttLastYear.html(progress());
    data.pType = 0;
    postRequestD('GetSummaryData', data, function (response) {
        var res = JSON.parse(response.d);
        if (res.length > 0) {
            var att = res[0];
            var OneMillion = 1000000;
            var TotalSale = parseFloat(parseFloat(att["TotalSale"]) / OneMillion).toFixed(2);
            var TargetSale = parseFloat(parseFloat(att["TargetSale"]) / OneMillion).toFixed(2);
            var LastMonthTotalSale = parseFloat(att["LastMonthTotalSale"]);
            var LastYearTotalSale = parseFloat(att["LastYearTotalSale"]);
            var _TargetSale = att["TargetSale"];
            var MonthDiff = parseFloat(parseFloat(att["TotalSale"]) - parseFloat(att["LastMonthTotalSale"]));
            var YearDiff = parseFloat(parseFloat(att["TotalSale"]) - LastYearTotalSale);
            var percentMonthIncrease = 0;
            var percentYearIncrease = 0;
            if ((MonthDiff > 0) && (LastMonthTotalSale > 0)) {
                percentMonthIncrease = (MonthDiff / LastMonthTotalSale) * 100;
            }

            if ((YearDiff > 0) && (LastYearTotalSale > 0)) {
                percentYearIncrease = (YearDiff / LastYearTotalSale) * 100;
            }
            if (_TargetSale == null || _TargetSale == "") {
                _TargetSale = 0
            }
        }
        txtAttSales.html(TotalSale.toString() + "M");
        txtAttTarget.html(parseFloat(_TargetSale).toString() + "M");
        txtAttLastMonth.html(checkNullOrNaNOrUndefined(percentMonthIncrease).toFixed(2).toString() + "%");
        txtAttLastYear.html(checkNullOrNaNOrUndefined(percentYearIncrease).toFixed(2).toString() + "%");

        return;
    });
}


function GetTopTenProducts(ctx, data) {
    var productGraphType = $("#productGraphType").val();

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    if (productGraphType.toLocaleLowerCase() == "quantity") {
        data.pType = 1
    }
    else if (productGraphType.toLocaleLowerCase() == "value") {
        data.pType = 2
    }

    postRequestD('GetTopTenProducts', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);

        $.each(res, function (i, item) {

            if (productGraphType.toLocaleLowerCase() == "quantity") {
                item.Qty = parseFloat(item.Qty);
            }
            else if (productGraphType.toLocaleLowerCase() == "value") {
                item.totalprice = parseFloat(item.totalprice);
            }
        });

        var options = {
            fill: false,
            legend: {
                position: 'right',
                labels: {
                    generateLabels: (chart) => {
                        const datasets = chart.data.datasets;
                        return datasets[0].data.map((data, i) => ({
                            text: `${chart.data.labels[i]} (${numberWithCommas(data)})`,
                            fillStyle: datasets[0].backgroundColor[i],
                            index: i
                        }))
            }
        }
            },

        }

        var filterColumn = "Qty";
        if (productGraphType.toLocaleLowerCase() == "quantity") {
            filterColumn = "Qty";
        }
        else if (productGraphType.toLocaleLowerCase() == "value") {
            filterColumn = "totalprice";
        }
        DrillDownChartFormatted(ctx, res, "Product", filterColumn, "", "number", "doughnut", options, '', '', '', 'top', '', '', null, 2, false, false, false, -1);
        return;
   
    });
}

function GetDistributorsData(ctx, data) {

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    data.pType = 3
    postRequestD('GetDistributorsData', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);
        var options = {
            fill: false,
            legend: {
                position: 'top',
            }
        }
        DrillDownChart(ctx, res, 'DistributorName', 'totalprice', '', 'string', 'bar', options, '', '', 'Distributor(s) Sales', 'top', '', 'false');
        //DrillDownChart(ctx, res, "DistributorName", "totalprice", "", "string", "bar", options, '', '', '', 'top', '', '', null, 2, false, true, false, -1);
        //DrillDownChart2(ctx, res, false, "DistributorCode", "Year", "totalprice", "number","DistributorName", "bar", 'number', 1, '');
        return;
    });

}

function GetCustomerTypeWiseData(ctx, data) {

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    data.pType = 4;
    postRequestD('GetCustomerTypeWiseData', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);

        $.each(res, function (i, item) {
            item.Qty = parseFloat(item.Qty);
        })

        var options = {
            fill: false,
            legend: {
                position: 'right',
                labels: {
                    generateLabels: (chart) => {
                        const datasets = chart.data.datasets;
                        return datasets[0].data.map((data, i) => ({
                            text: `${chart.data.labels[i]} (${numberWithCommas(data)})`,
                            fillStyle: datasets[0].backgroundColor[i],
                            index: i
                        }))
                    }
            }
            },
        }

        DrillDownChartFormatted(ctx, res, "CustomerType", "totalprice", "", "number", "doughnut", options, '', '', '', 'top', '', '', null, 2, false, false, false, -1);
        return;

    });
}

function GetProductsByBrandsData(ctx, data) {
    var productByBrandGraphType = $('#productByBrandGraphType').val().toLocaleLowerCase();
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');

    if (productByBrandGraphType == "quantity") {
        data.pType = 5;
    } else if (productByBrandGraphType == "value") {
        data.pType = 6;
    } 

    postRequestD('GetProductsByBrandsData', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);
        var options = {
            fill: false,
            legend: {
                position: 'top',
            }
        }

        var FilterType = "TotalProducts";
        if (productByBrandGraphType == "quantity") {
            FilterType = "TotalProducts";
        } else if (productByBrandGraphType == "value") {
            FilterType = "TotalAmount";
        }

        DrillDownChart(ctx, res, 'ProductGroup', FilterType, '', 'string', 'bar', options, '', '', 'Brands', 'top', '', 'false');
        return;
    });

}


function GetDailySalesReportData(ctx, data) {
    $('#emptyDataElement').empty();
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="padding:10%;position:absolute;left:45%;"></div>');
    data.pType = 7;
    postRequestD('GetDailySalesReportData', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var jsonData = response.d.split("|");
        var ProductsName = JSON.parse(jsonData[0]);
        var Days = JSON.parse(jsonData[1]);
        var Details = JSON.parse(jsonData[2]);
        if ((ProductsName.length > 0) && (Days.length > 0) && (Details.length > 0)) {

            var html = "<table class='table table-bordered table-striped' id='detailreporttable'><thead>"
                + "<tr style='background-color: #000000c2;color: #fff;''>"
                + "<th colspan='1'></th>"
                + "<th colspan='3'></th>";

            for (var i = 0; i < Days.length; i++) {
                html += "<th>" + Days[i].DayName + "</th>";
            }
            html += "<th colspan='4'></th>"
            html += "</tr><tr style='background-color: #c5c5c5ee;color: #000;'>"
                + "<th>TEAM</th>"
                + "<th>Sr. #</th>"
                + "<th>PRODUCTS</th>"
                + "<th>DP</th>";

            for (var j = 0; j < Days.length; j++) {
                html += "<th class='days-control'>" + Days[j].DayNum + "</th>"
            }
            html += "<th>Total-Units</th><th>Total-Values</th><th>Contri. By Qty</th><th>Contri. By Value</th>"
            html += "</tr></thead><tbody>";

            for (var k = 0; k < ProductsName.length; k++) {
                html += "<tr>";
                var TotalUnits = 0;
                var TotalValues = 0;
                var _productID = ProductsName[k].ProductID;
                var _productName = ProductsName[k].Product;
                var _DP = 0;
                //if (parseFloat(ProductsName[k].DayQty) > 0) {
                //    _DP =Math.round(parseFloat(parseFloat(ProductsName[k].DayValue) / parseFloat(ProductsName[k].DayQty)),2);
                //} else {
                //    _DP = 0;
                //}
              
                html += "<td>" + ProductsName[k].Team + "</td>";
                html += "<td>" + (parseInt(k) + 1).toString() + "</td>";
                html += "<td>" + _productName + "</td>";

                var _tempHtml = '';
                var mapList = Details.filter(p => p.ProductID == _productID);
                for (var l = 0; l < Days.length; l++) {
                    //var DayQty = checkNullOrNaNOrUndefined(mapList[l].DayQty.toString());
                    if (typeof mapList[l] == "undefined") {
                        _tempHtml += "<td></td>"
                    } else {
                        _tempHtml += "<td class='tdDataof_" + Days[l].DayNum + "_" + Days[l].MonthNum + "' itemValue='" + mapList[l].DayQty.toString() + "'>" + numberWithCommas(mapList[l].DayQty.toString()) + "</td>";
                        TotalUnits = parseFloat(TotalUnits) + parseFloat(mapList[l].DayQty.toString());
                        TotalValues += parseFloat(mapList[l].DayValue.toString());
                    }

                /*TotalValues = parseFloat(TotalUnits) * parseFloat(_DP);*/
                  
                }
                _DP = Math.round(parseFloat(TotalValues.toFixed(2) / TotalUnits.toFixed(2)),2);
                html += "<td>" + numberWithCommas(_DP) + "</td>";
                html += _tempHtml;
               
                //Total Amounts Data Show Here
                html += "<td id='td_TotalUnitOf_" + _productID + "' class='td_TotalUnit' TotalUnits='" + TotalUnits + "'>" + numberWithCommas(TotalUnits.toFixed(2)) + "</td>"
                    + "<td id='td_TotalValueOf_" + _productID + "' class='td_TotalValue' TotalValues='" + TotalValues + "'>" + numberWithCommas(TotalValues.toFixed(2)) + "</td>"
                    + "<td id='td_TotalContriByQtyOf_" + _productID + "' class='td_TotalContriByQty'>0%</td>"
                    + "<td id='td_TotalContriByValueOf_" + _productID + "' class='td_TotalContriByValue'>0%</td>";

                html += "</tr>";
            }


            html += "</tbody><tfoot style='background-color: #c5c5c5ee;color: #000;'>";
            html += "<tr>";

            html += "<td style='background-color: #FFF !impotant;'></td><td style='background-color: #FFF !impotant;'></td><td style='background-color: #FFF !impotant;'>Values</td><td></td>";

            for (var m = 0; m < Days.length; m++) {
                html += "<td id='td_TotalOfDay_" + Days[m].DayNum + "_" + Days[m].MonthNum + "'></td>";
            }

            //Total Amounts Data Show Here
            html += "<td id='td_TotalUnits'></td><td id='td_TotalValues'></td>"
                + "<td id='td_TotalContQty'></td><td id='td_TotalContValue'></td>"
            html += "</tr>";
            html += "</tfoot></table>";

            $('#DailySalesReport').empty();
            $('#DailySalesReport').append(html);
            calculateTotalOfDays(Days, 'DayNum', 'td_TotalOfDay_', 'tdDataof_', 'itemValue', false, false, 'MonthNum');
            calculateTotalOfDays('', '', 'td_TotalUnits', 'td_TotalUnit', 'TotalUnits', true);
            calculateTotalOfDays('', '', 'td_TotalValues', 'td_TotalValue', 'TotalValues', true);
            CalculatePercentage(ProductsName, 'ProductID', 'td_TotalUnits', 'td_TotalUnitOf_', 'TotalUnits', 'td_TotalContriByQtyOf_');
            CalculatePercentage(ProductsName, 'ProductID', 'td_TotalValues', 'td_TotalValueOf_', 'TotalValues', 'td_TotalContriByValueOf_');
            calculateTotalOfDays('', '', 'td_TotalContQty', 'td_TotalContriByQty', 'ItemPercent', true, true);
            calculateTotalOfDays('', '', 'td_TotalContValue', 'td_TotalContriByValue', 'ItemPercent', true, true);
            $('#detailreporttable').DataTable({
                "fnInitComplete": function () {
                    // Disable TBODY scoll bars
                    $('.dataTables_scrollBody').css({
                        'overflow': 'hidden',
                        'overflow-y': 'scroll',
                        'border': '0'
                    });

                    // Enable TFOOT scoll bars
                    $('.dataTables_scrollFoot').css('overflow', 'auto');

                    // Sync TFOOT scrolling with TBODY
                    $('.dataTables_scrollFoot').on('scroll', function () {
                        $('.dataTables_scrollHead').scrollLeft($(this).scrollLeft());
                        $('.dataTables_scrollBody').scrollLeft($(this).scrollLeft());
                    });
                },
                dom: 'Bfrtip',
                //pageLength: 10,
                bFilter: true,
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i> Excel',
                        className: 'excelTest',
                        autoFilter: true,
                        footer: true
                    }
                ],
                "searching": true,
                scrollY: 300,
                scroll: true,
                scrollCollapse: true,
                fixedColumns: {
                    left: 2
                },
                fixedHeader: true,
                paging: false,
                responsive: true,
                order: [[0, 'asc']],
                rowGroup: {
                    startRender: null,
                    endRender: function (rows, group) {

                        var TotalDP = rows
                            .data()
                            .pluck(3)
                            .reduce((pv, cv) => {
                                return pv + (parseFloat(cv.replaceAll(',', '')));
                            }, 0);

                        var TotalUnits = rows
                            .data()
                            .pluck(4+Days.length+0)
                            .reduce((pv, cv) => {
                                 return pv + (parseFloat(cv.replaceAll(',', '')));
                            }, 0);

                        var TotalValues = rows
                            .data()
                            .pluck(4 +Days.length + 1)
                            .reduce((pv, cv) => {
                                return pv + (parseFloat(cv.replaceAll(',', '')));
                            }, 0);

                        var ContriByQty = rows
                            .data()
                            .pluck(4 +Days.length +2 )
                            .reduce((pv, cv) => {
                                return pv + (parseFloat(cv.replaceAll('%', '')));
                            }, 0);

                        var ContriByVal = rows
                            .data()
                            .pluck(4 +Days.length + 3)
                            .reduce((pv, cv) => {
                                return pv + (parseFloat(cv.replaceAll('%', '')));
                            }, 0);

                       
                        var rowHtml = "<td/><td/><td>Values</td><td>" + numberWithCommas(TotalDP)+"</td>";
                        for (var j = 0; j < Days.length; j++) {
                            var DaysWiseCal = rows
                                .data()
                                .pluck(4+j)
                                .reduce((pv, cv) => {
                                    if (cv) {
                                        return pv + (parseFloat(cv.replaceAll(',', '')));
                                    } else {
                                        return pv + 0;
                                    }
                                }, 0);
                            rowHtml += "<td>" + numberWithCommas(DaysWiseCal)+"</td>"
                        }
                        rowHtml += "<td>" + numberWithCommas(TotalUnits) + "</td><td>" +numberWithCommas(TotalValues)+"</td><td>"+Math.round(ContriByQty,2)+"%</td><td>"+Math.round(ContriByVal,2)+"%</td>";

                        return $('<tr style= background - color: #808080;id = "RowGroup"/>')
                            .append(rowHtml);
                            //.append('<td/>')
                            //.append('<td>Values</td>')
                            //.append('<td/>')
                           
                            //.append('<td>' + TotalUnits + '</td>')
                            //.append('<td/>')
                            //.append('<td/>')
                            //.append('<td/>')

                    },
                    dataSrc: 0
                }
            });

        } else {
            $('#DailySalesReport').empty();
            $('#DailySalesReport').append("<div id='emptyDataElement' style='padding:10%;'><h3>Data Not Available...</h3></div>");
        }
        

        return;
    });

}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function GetDailySalesReportDataNew(ctx, data) {

    $('#emptyDataElement').empty();
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="padding:10%;position:absolute;left:45%;"></div>');
    data.pType = 8;
    postRequestD('GetDailySalesReportDataNew', data, function (response) {
        $('#' + ctx + 'progress').remove();

        var jsonData = response.d.split("|");
        var ProductsName = JSON.parse(jsonData[0]);
        //var Days = JSON.parse(jsonData[1]);
        //var Details = JSON.parse(jsonData[2]);
        //if ((ProductsName.length > 0) && (Days.length > 0) && (Details.length > 0)) {
        if ((ProductsName.length > 0)) {

            var html = "<table class='table table-bordered table-striped' id='detailreporttableNew'><thead>"


            html += "<tr style='background-color: #c5c5c5ee;color: #000;'>"
                + "<th>TEAM</th>"
                + "<th>SNO</th>"
                + "<th>PRODUCTS</th>"
                + "<th>PACKSIZE</th>"
                + "<th>TARGET</th>"
                + "<th>MTD-UNITS</th>"
                + "<th>MTD-VALUE</th>"
                + "<th>ACH%</th>"
                + "<th>SPLM(UNITS)</th>"
                + "<th>SPLM(VALUE)</th>"
                + "<th>VARIANCE(UNITS)</th>"
                + "<th>GOLM-VALUE</th>"
                + "<th>GOLM-UNITS</th>";

            //for (var j = 0; j < Days.length; j++) {
            //    html += "<th class='days-control'>" + Days[j].DayNum + "</th>"
            //}
            //html += "<th>Total-Units</th><th>Total-Values</th><th>Contri. By Qty</th><th>Contri. By Value</th>"
            html += "</tr></thead><tbody>";
            //var newHtml = html;
            var SNO = 0;
            //console.log(team)
            //if (team.indexOf(ProductsName[k].Team) == -1) {
            //    team.push(ProductsName[k].Team);
            //}

            //ProductsName.forEach(element => {
            //    newHtml += "<tr>";

            //    var _TotalValues = 0;
            //    var __productID = element.ProductID;
            //    var __productName = element.Product;
            //    var __PackSize = element.PackSize;
            //    var __Team = element.Team;
            //    var __Target = element.Target;
            //    var __MTDQuantity = element.MTDQuantity;
            //    var __MtqValue = element.MTDValue;
            //    var __Ach = element.Ach;
            //    var __SPLMQuantity = element.SPLMQuantity;
            //    var __SPLMVALUE = element.SPLMValue;
            //    var __VarianceUnits = element.VarianceUnit;
            //    var __GOLMValue = element.GOLMValues;
            //    var __GOLMUnit = element.GOLMUnits;

            //    newHtml += "<td>" + __Team + "</td>";
            //    newHtml += "<td>" + (parseInt(SNO) + 1).toString() + "</td>";
            //    newHtml += "<td>" + __productName + "</td>";
            //    newHtml += "<td>" + __PackSize + "</td>";
            //    newHtml += "<td>" + __Target + "</td>";
            //    newHtml += "<td>" + __MTDQuantity + "</td>";
            //    newHtml += "<td>" + __MtqValue + "</td>";
            //    newHtml += "<td>" + __Ach + "%" + "</td>";
            //    newHtml += "<td>" + __SPLMQuantity + "</td>";
            //    newHtml += "<td>" + __SPLMVALUE + "</td>";
            //    newHtml += "<td>" + __VarianceUnits + "</td>";
            //    newHtml += "<td>" + __GOLMValue + "%" + "</td>";
            //    newHtml += "<td>" + __GOLMUnit + "%" + "</td>";
            //    newHtml += "</tr>";

            //});
            //newHtml += "</tbody><tfoot style='background-color: #c5c5c5ee;color: #000;'><tr><td style='background-color: #FFF !impotant;'></td><td style='background-color: #FFF !impotant;'>Values</td><td></td></tr></tfoot></table>";
            //console.log(newHtml);

            for (var k = 0; k < ProductsName.length; k++) {
                html += "<tr>";
                /*console.log(team.indexOf(ProductsName[k].Team));*/

                var TotalUnits = 0;
                var TotalValues = 0;
                var _productID = ProductsName[k].ProductID;
                var _productName = ProductsName[k].Product;
                var _PackSize = ProductsName[k].PackSize;
                var _Team = ProductsName[k].Team;
                var _Target = ProductsName[k].Target;
                var _MTDQuantity = ProductsName[k].MTDQuantity;
                var _MtqValue = ProductsName[k].MTDValue;
                var _Ach = ProductsName[k].Ach;
                var _SPLMQuantity = ProductsName[k].SPLMQuantity;
                var _SPLMVALUE = ProductsName[k].SPLMValue;
                var _VarianceUnits = ProductsName[k].VarianceUnit;
                var _GOLMValue = ProductsName[k].GOLMValues;
                var _GOLMUnit = ProductsName[k].GOLMUnits;

                html += "<td>" + _Team + "</td>";
                html += "<td>" + (parseInt(k) + 1).toString() + "</td>";
                html += "<td>" + _productName + "</td>";
                html += "<td>" + _PackSize + "</td>";
                html += "<td>" + numberWithCommas(_Target) + "</td>";
                html += "<td>" + numberWithCommas(_MTDQuantity) + "</td>";
                html += "<td>" + numberWithCommas(_MtqValue)+ "</td>";
                html += "<td>" + _Ach + "%" + "</td>";
                html += "<td>" + numberWithCommas(_SPLMQuantity)+ "</td>";
                html += "<td>" + numberWithCommas(_SPLMVALUE)+ "</td>";
                html += "<td>" + numberWithCommas(_VarianceUnits)+ "</td>";
                html += "<td>" + _GOLMValue + "%" + "</td>";
                html += "<td>" + _GOLMUnit + "%" + "</td>";


                html += "</tr>";

            }


            html += "</tbody></table>"
            //html += "<tfoot style = 'background-color: #c5c5c5ee;color: #000;' > <tr>"
            //html += "<td></td><td></td><td style='background-color: #FFF !impotant;'>Values</td><td></td>"

            //html += "</tr></tfoot > ";

            $('#DailySalesReportNew').empty();
            $('#DailySalesReportNew').append(html);

            //$("#detailreporttableNew tbody tr").each(function () {
            //    _Target += parseFloat($(this).find("td:eq(4)").text())
            //    _MTDQuantity += parseFloat($(this).find("td:eq(4)").text())
            //    _MtqValue += parseFloat($(this).find("td:eq(4)").text())
            //    _Target += parseFloat($(this).find("td:eq(4)").text())
            //    _Target += parseFloat($(this).find("td:eq(4)").text())
            //    _Target += parseFloat($(this).find("td:eq(4)").text())
            //    _Target += parseFloat($(this).find("td:eq(4)").text())
            //    _Target += parseFloat($(this).find("td:eq(4)").text())
            //    _Target += parseFloat($(this).find("td:eq(4)").text())
            //    _Target += parseFloat($(this).find("td:eq(4)").text())
            //    $('<tr style= background - color: #808080;id = "RowGroup"/>')
            //        .append('<td/>')
            //        .append('<td/>')
            //        .append('<td>Values</td>')
            //        .append('<td/>')
            //        .append('<td>' + _Target + '</td>')
            //        .append('<td>' + MTDQuantity + '</td>')
            //        .append('<td>' + MTDValue + '</td>')
            //        .append('<td>' + Ach + '%' + '</td>')
            //        .append('<td>' + SPLMQuantity + '</td>')
            //        .append('<td>' + SPLMVALUE + '</td>')
            //        .append('<td>' + VarianceUnits + '</td>')
            //        .append('<td>' + GOLMValue + '%' + '</td>')
            //        .append('<td>' + GOLMUnit + '%' + '</td>')
            //})


            //calculateTotalOfDays(Days, 'DayNum', 'td_TotalOfDay_', 'tdDataof_', 'itemValue', false, false, 'MonthNum');
            //calculateTotalOfDays('', '', 'td_TotalUnits', 'td_TotalUnit', 'TotalUnits', true);
            //calculateTotalOfDays('', '', 'td_TotalValues', 'td_TotalValue', 'TotalValues', true);
            //CalculatePercentage(ProductsName, 'ProductID', 'td_TotalUnits', 'td_TotalUnitOf_', 'TotalUnits', 'td_TotalContriByQtyOf_');
            //CalculatePercentage(ProductsName, 'ProductID', 'td_TotalValues', 'td_TotalValueOf_', 'TotalValues', 'td_TotalContriByValueOf_');
            //calculateTotalOfDays('', '', 'td_TotalContQty', 'td_TotalContriByQty', 'ItemPercent', true, true);
            //calculateTotalOfDays('', '', 'td_TotalContValue', 'td_TotalContriByValue', 'ItemPercent', true, true);
            $('#detailreporttableNew').DataTable({
                "fnInitComplete": function () {
                    // Disable TBODY scoll bars
                    $('.dataTables_scrollBodyNew').css({
                        'overflow': 'hidden',
                        'overflow-y': 'scroll',
                        'border': '0',
                    });

                    // Enable TFOOT scoll bars
                    $('.dataTables_scrollFootNew').css('overflow', 'auto');

                    // Sync TFOOT scrolling with TBODY
                    $('.dataTables_scrollFootNew').on('scroll', function () {
                        $('.dataTables_scrollHeadNew').scrollLeft($(this).scrollLeft());
                        $('.dataTables_scrollBodyNew').scrollLeft($(this).scrollLeft());
                    });
                },
                dom: 'Bfrtip',
                //pageLength: 10,
                bFilter: true,
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i> Excel',
                        className: 'excelTest',
                        autoFilter: true,
                        footer: true
                    }
                ],
                "searching": true,
                scrollY: 300,
                scrollX: true,
                scroller: true,
                scroll: true,
                scrollCollapse: true,
                fixedColumns: {
                    left: 2
                },
                fixedHeader: true,
                paging: false,
                responsive: true,

                order: [[0, 'asc']],
                rowGroup: {
                    startRender: null,
                    endRender: function (rows, group) {
                        var Target = rows
                            .data()
                            .pluck(4)
                            .reduce(function (a, b) {
                                return a + b.replace(/[^\d]/g, '') * 1;
                            }, 0);
                        Target = $.fn.dataTable.render.number(',', '.', 0, '').display(Target);
                        var MTDQuantity = rows
                            .data()
                            .pluck(5)
                            .reduce(function (a, b) {
                                return a + (parseFloat(b.replaceAll(',', '')));
                            }, 0);
                        var MTDValue = rows
                            .data()
                            .pluck(6)
                            .reduce(function (a, b) {
                                return a + (parseFloat(b.replaceAll(',', '')));
                            }, 0);
                        var Ach = rows
                            .data()
                            .pluck(7)
                            .reduce(function (a, b) {
                                if (parseFloat(Target.replaceAll(',', '')) > 0) {
                                    return Math.round((MTDQuantity / parseFloat(Target.replaceAll(',', ''))) * 100 , 0);
                                } else {
                                    return 0
                                }

                            }, 0);
                        var SPLMQuantity = rows
                            .data()
                            .pluck(8)
                            .reduce(function (a, b) {
                                return a + (parseFloat(b.replaceAll(',', '')));
                            }, 0);
                        var SPLMVALUE = rows
                            .data()
                            .pluck(9)
                            .reduce(function (a, b) {
                                return a + (parseFloat(b.replaceAll(',', '')));
                            }, 0);
                        var VarianceUnits = rows
                            .data()
                            .pluck(10)
                            .reduce(function (a, b) {
                                return a + (parseFloat(b.replaceAll(',', '')));
                            }, 0);
                        var GOLMValue = rows
                            .data()
                            .pluck(11)
                            .reduce(function (a, b) {
                                return Math.round(((MTDQuantity - SPLMQuantity) / SPLMQuantity) * 100, 0);
                            }, 0);
                        var GOLMUnit = rows
                            .data()
                            .pluck(12)
                            .reduce(function (a, b) {
                                return Math.round(((MTDValue - SPLMVALUE) / SPLMVALUE) * 100, 0);
                            }, 0);

                        return $('<tr style= background - color: #808080;id = "RowGroup"/>')
                            .append('<td/>')
                            .append('<td/>')
                            .append('<td>Values</td>')
                            .append('<td/>')
                            .append('<td>' + numberWithCommas(Target) + '</td>')
                            .append('<td>' + numberWithCommas(MTDQuantity) + '</td>')
                            .append('<td>' + numberWithCommas(MTDValue) + '</td>')
                            .append('<td>' + Ach + '%' + '</td>')
                            .append('<td>' + numberWithCommas(SPLMQuantity) + '</td>')
                            .append('<td>' + numberWithCommas(SPLMVALUE) + '</td>')
                            .append('<td>' + numberWithCommas(VarianceUnits) + '</td>')
                            .append('<td>' + GOLMValue + '%' + '</td>')
                            .append('<td>' + GOLMUnit + '%' + '</td>')

                    },
                    dataSrc: 0
                }

            });

        } else {
            $('#DailySalesReportNew').empty();
            $('#DailySalesReportNew').append("<div id='emptyDataElement' style='padding:10%;'><h3>Data Not Available...</h3></div>");
        }

        return;
    });

}


function calculateTotalOfDays(obj, ObjcolumnName1, elementID, ClassForLoop, Valueattribute, isSingleElementID = false,
    isShowPercentSign = false, ObjcolumnName2 = '', ObjcolumnName3 = '') {
    if (isSingleElementID == false) {
        for (var m = 0; m < obj.length; m++) {
            var TotalOfDay = 0
            if (isSingleElementID == false) {
                if (ObjcolumnName2 != "" && ObjcolumnName3 != "") {
                    $("." + ClassForLoop + obj[m][ObjcolumnName1] + "_" + obj[m][ObjcolumnName2] + "_" + obj[m][ObjcolumnName3]).each(function (i, e) {
                        TotalOfDay = parseFloat(TotalOfDay) + parseFloat($(this).attr(Valueattribute));
                    });

                    $("#" + elementID + obj[m][ObjcolumnName1] + "_" + obj[m][ObjcolumnName2] + "_" + obj[m][ObjcolumnName3]).html(numberWithCommas(TotalOfDay.toFixed(2).toString()));

                } else if (ObjcolumnName2 != "") {
                    $("." + ClassForLoop + obj[m][ObjcolumnName1] + "_" + obj[m][ObjcolumnName2]).each(function (i, e) {
                        TotalOfDay = parseFloat(TotalOfDay) + parseFloat($(this).attr(Valueattribute));
                    });

                    $("#" + elementID + obj[m][ObjcolumnName1] + "_" + obj[m][ObjcolumnName2]).html(numberWithCommas(TotalOfDay.toFixed(2).toString()));

                } else if (ObjcolumnName3 != "") {
                    $("." + ClassForLoop + obj[m][ObjcolumnName1] + "_" + obj[m][ObjcolumnName3]).each(function (i, e) {
                        TotalOfDay = parseFloat(TotalOfDay) + parseFloat($(this).attr(Valueattribute));
                    });

                    $("#" + elementID + obj[m][ObjcolumnName1] + "_" + obj[m][ObjcolumnName3]).html(numberWithCommas(TotalOfDay.toFixed(2).toString()));

                } else {
                    $("." + ClassForLoop + obj[m][ObjcolumnName1] + "").each(function (i, e) {
                        TotalOfDay = parseFloat(TotalOfDay) + parseFloat($(this).attr(Valueattribute));
                    });

                    $("#" + elementID + obj[m][ObjcolumnName1]).html(numberWithCommas(TotalOfDay.toFixed(2).toString()));
                }

            }
        }
    } else {
        var TotalOfDay = 0
        $("." + ClassForLoop).each(function (i, e) {
            TotalOfDay = parseFloat(TotalOfDay) + parseFloat($(this).attr(Valueattribute));
        });
        if (isShowPercentSign == false) {
            $("#" + elementID).html(numberWithCommas(TotalOfDay.toFixed(2).toString())).attr('Total', TotalOfDay.toFixed(2));
        } else {
            $("#" + elementID).html(TotalOfDay.toFixed(2).toString() + "%").attr('Total', TotalOfDay.toFixed(2));
        }

    }
}

function CalculatePercentage(obj, ObjcolumnName, TotalelementID, SelectElementID, Valueattribute, SetElementID, ObjcolumnName2='', ObjcolumnName3='') {
    var Total = $('#' + TotalelementID).attr('Total');
    for (var m = 0; m < obj.length; m++) {
        var colValue = $('#' + SelectElementID + obj[m][ObjcolumnName]).attr(Valueattribute);
        var percent = ((parseFloat(colValue) / parseFloat(Total)) * 100);
        $('#' + SetElementID + obj[m][ObjcolumnName]).html(numberWithCommas(percent.toFixed(2)) + "%").attr('ItemPercent', percent);
    }
}

//#endregion

//#region Extra
function checkNullOrNaNOrUndefined(value) {
    if (isNull(value) || isNaN(value)) {
        value = 0;
    }

    if (typeof value == "undefined") {
        value = 0;
    }

    return value;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//#endregion