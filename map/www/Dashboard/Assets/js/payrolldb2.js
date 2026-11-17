function renderPayrollrDashboard(pFirstLoad, filterc) {

    //vyears = pFirstLoad == 1 ? '2019' : vyears.split(',')[0];
    //var pdata4 = { pYears: vyears, pFilterCriteria: filterc };

    //////console.log({ globalpayrrolFilter });

    //var __Years = typeof globalpayrrolFilter.Years === 'object' ? globalpayrrolFilter.Years.join(',') : globalpayrrolFilter.Years[0];
    //var __Month = typeof globalpayrrolFilter.Months === 'object' ? globalpayrrolFilter.Months.join(',') : '';//globalpayrrolFilter.Months[0];

    var _FromYear = jQuery('#ddlRFromYear').val();
    var _pFromMonth = jQuery('#ddlRFromMonth').val();

    var _ToYear = jQuery('#ddlRToYear').val();
    var _ToMonth = jQuery('#ddlRToMonth').val();

    var _FromTitle = monthNames[_pFromMonth].substring(0,3) + ' ' +_FromYear ;
    var _ToTitle = ' - ' + monthNames[_ToMonth].substring(0, 3) + ' ' + _ToYear;

    if (_FromYear == _ToYear && _pFromMonth == _ToMonth) { _ToTitle = ''; }

    var _reqParams = {       
        pFromYear: _FromYear,
        pFromMonth:_pFromMonth,
        pToYear: _ToYear,
        pToMonth : _ToMonth,
        pFilterCriteria: filterc,
        From: _FromTitle,
        To: _ToTitle,
    };

    var pChartOptions = {
        labelColor: '#555',
        //labelBackgroungColor: 'rgba(0,0,0,0.1)',
        labelBackgroungColor: 'transparent',
        labelBorderRadius: 10,
        labelAnchor: 'end',
        labelClamp: true,
        labelAlign: 'top',
        DistinctColorForEachGroup: true,
        excludeColumns : ['Month']
    }    

    GetGrossSalaryAndNonGrossComp('grossSalaryAndNonGrossComp', _reqParams, pChartOptions);

    GetTotalSalvsTax('totalsalvstaxComp', _reqParams, pChartOptions)

    GetAllowancevsDeductions('allowancevsdeductionsComp', _reqParams, pChartOptions);

    //GetGradeWiseGrossvsNonGross('gradewisepayoutandbenifitsComp', _reqParams, pChartOptions);
 
    //GetGradeWisePayrollHeadCount('gradewisepayrollheadcountComp', _reqParams, pChartOptions);

    //GetGradeWiseNonGrossRatio('GradeWiseNonGrossRatioComp', _reqParams, pChartOptions)

    GetNetSalaryvsTaxRatio('NetSalaryVsTaxRationComp', _reqParams, pChartOptions)
}

function applyOverlay(ctx) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
}

function removeOverlay(ctx) {
    $('#' + ctx + 'progress').remove();
}

function GetGrossSalaryAndNonGrossComp(ctx, data, pChartOptions) {
    
    var ctx2 = 'gradewisepayoutandbenifitsComp';
    var ctx3 = 'GradeWiseNonGrossRatioComp';
    var ctx4 = 'employeegradewisegrossratioComp';
    var ctx5 = 'functionwisegrossratioComp';
    var ctx6 = 'gradewisepayrollheadcountComp';
    var ctx7 = 'functionwisepayrollheadcountComp';

    applyOverlay(ctx);
    applyOverlay(ctx2);
    applyOverlay(ctx3);
    applyOverlay(ctx4);
    applyOverlay(ctx5);
    applyOverlay(ctx6);
    applyOverlay(ctx7);

    postRequestD('GetGrossvsNonGrossSalary', data, function (response) {
        removeOverlay(ctx);
        removeOverlay(ctx2);
        removeOverlay(ctx3);
        removeOverlay(ctx4);
        removeOverlay(ctx5);
        removeOverlay(ctx6);
        removeOverlay(ctx7);

        var res = JSON.parse(response.d);
      
         // 1
        DrillDownChart2(ctx, res, false, "BaseAmount", "Year", "BaseAmount", "sum", "Type", "bar", 'string', 2, window['valuedivider'].toString(), pChartOptions);
       
        //2
        
        pChartOptions.isPercentage = true;
        DrillDownChart2(ctx2, res, false, "BaseAmount", "Type", "BaseAmount", "sum", "EmployeeGrade", "bar", 'string', 2, '%', pChartOptions);
        pChartOptions.isPercentage = false;


        //3

        var dataA = res.filter(function (item, i) {
            return item.Type == 'Non-Gross';
        });

        pChartOptions.isPercentage = true;
        pChartOptions.isUseGroupByColumnFiledToCalculatePercentage = true;
        pChartOptions.fieldToCalculatePercentage = 'Year';

        DrillDownChart2(ctx3, dataA, false, "BaseAmount", "Year", "BaseAmount", "sum", "EmployeeGrade", "bar", 'string', 2, '%', pChartOptions);

        pChartOptions.isPercentage = false;
        pChartOptions.isUseGroupByColumnFiledToCalculatePercentage = false;
        pChartOptions.fieldToCalculatePercentage = null;

        //4

        var dataB = res.filter(function (item, i) {
            return item.Type == 'Gross';
        });

        

        pChartOptions.isPercentage = true;
        pChartOptions.isUseGroupByColumnFiledToCalculatePercentage = true;
        pChartOptions.fieldToCalculatePercentage = 'Year';
        
        DrillDownChart2(ctx4, dataB, false, "EmployeeRefNo", "Year", "BaseAmount", "sum", "EmployeeGrade", "bar", 'string', 2, '%', pChartOptions);
        DrillDownChart2(ctx5, dataB, false, "EmployeeRefNo", "Year", "BaseAmount", "sum", "EmployeeFunction", "bar", 'string', 2, '%', pChartOptions);

        pChartOptions.isPercentage = false;
        pChartOptions.isUseGroupByColumnFiledToCalculatePercentage = false;
        pChartOptions.fieldToCalculatePercentage = null;

        //5                
        var dataC = alasql('select distinct EmployeeRefNo,Designation,Department,Branch,Division,EmployeeGrade,EmployeeFunction,Year from ? ', [res])
        DrillDownChart2(ctx6, dataC, false, "EmployeeRefNo", "Year", "EmployeeRefNo", "count", "EmployeeGrade", "horizontalStackBar", 'string', 2, '', pChartOptions);

        //6
        DrillDownChart2(ctx7, dataC, false, "EmployeeRefNo", "Year", "EmployeeRefNo", "count", "EmployeeFunction", "bar", 'string', 2, '', pChartOptions);

    });

}

function GetAllowancevsDeductions(ctx, data, pChartOptions) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetAllowancevsDeductions', data, function (response) {
        $('#' + ctx + 'progress').remove();        
        var res = JSON.parse(response.d);
        DrillDownChart2(ctx, res, false, "BaseAmount", "Year", "BaseAmount", "sum", "Type", "bar", 'string', 2, window['valuedivider'].toString(), pChartOptions);

    });

}

//function GetGradeWiseGrossvsNonGross(ctx, data, pChartOptions) {

//    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');    
//    postRequestD('GetGrossvsNonGrossSalary', data, function (response) {
//        $('#' + ctx + 'progress').remove();        
       
//        var res = JSON.parse(response.d);

        
//        pChartOptions.isPercentage = true;
//        DrillDownChart2(ctx, res, false, "BaseAmount", "Type", "BaseAmount", "sum", "EmployeeGrade", "bar", 'string', 2, window['valuedivider'].toString(), pChartOptions);
//        pChartOptions.isPercentage = false;
//    });

//}

//function GetGradeWiseNonGrossRatio(ctx, data, pChartOptions) {

//    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
//    postRequestD('GetGradeWiseNonGrossRatio', data, function (response) {
//        $('#' + ctx + 'progress').remove();
//        var res = JSON.parse(response.d);

//        pChartOptions.isPercentage = true;
//        pChartOptions.isUseGroupByColumnFiledToCalculatePercentage = true;
//        pChartOptions.fieldToCalculatePercentage = 'Year';

//        DrillDownChart2(ctx, res, false, "BaseAmount", "Year", "BaseAmount", "sum", "EmployeeGrade", "bar", 'string', 2, window['valuedivider'].toString(), pChartOptions);

//        pChartOptions.isPercentage = false;
//        pChartOptions.isUseGroupByColumnFiledToCalculatePercentage = false;
//        pChartOptions.fieldToCalculatePercentage = null;
//    });

//}



function GetGradeWisePayrollHeadCount(ctx, data, pChartOptions) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    $('#functionwisepayrollheadcountComp').closest('div').before('<div class="progressdiv" id="functionwisepayrollheadcountCompprogress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetGradeWisePayrollHeadCount', data, function (response) {
        $('#' + ctx + 'progress').remove();
        var res = JSON.parse(response.d);

        DrillDownChart2(ctx, res, false, "EmployeeRefNo", "Year", "EmployeeRefNo", "count", "EmployeeGrade", "horizontalStackBar", 'string', 2, window['valuedivider'].toString(), pChartOptions);
        GetFunctionWisePayrollHeadCount('functionwisepayrollheadcountComp', res, pChartOptions)
    });

}

//function GetFunctionWisePayrollHeadCount(ctx, res, pChartOptions) {

//    var ctx2 = 'employeegradewisegrossratioComp';
//    var ctx3 = 'functionwisegrossratioComp';

//    $('#' + ctx + 'progress').remove();  
//    DrillDownChart2(ctx, res, false, "EmployeeRefNo", "Year", "EmployeeRefNo", "count", "EmployeeFunction", "bar", 'string', 2, window['valuedivider'].toString(), pChartOptions);

    
//    pChartOptions.isPercentage = true;
//    pChartOptions.isUseGroupByColumnFiledToCalculatePercentage = true;
//    pChartOptions.fieldToCalculatePercentage = 'Year';

//    console.log(res);
//    DrillDownChart2('employeegradewisegrossratioComp', res, false, "EmployeeRefNo", "Year", "EmployeeRefNo", "sum", "EmployeeGrade", "bar", 'string', 2, window['valuedivider'].toString(), pChartOptions);
//    DrillDownChart2('functionwisegrossratioComp', res, false, "EmployeeRefNo", "Year", "EmployeeRefNo", "sum", "EmployeeFunction", "bar", 'string', 2, window['valuedivider'].toString(), pChartOptions);

//    pChartOptions.isPercentage = false;
//    pChartOptions.isUseGroupByColumnFiledToCalculatePercentage = false;
//    pChartOptions.fieldToCalculatePercentage = null;

//}

function GetTotalSalvsTax(ctx, data, pChartOptions) {

    var ctx2 = 'GradeWiseTaxRatioComp';

    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');

    $('#' + ctx2).closest('div').before('<div class="progressdiv" id="' + ctx2 + 'progress" style="position:absolute;left:45%;"></div>');

    postRequestD('GetTotalSalvsTax', data, function (response) {
        $('#' + ctx + 'progress').remove();
        $('#' + ctx2 + 'progress').remove();
        var res = JSON.parse(response.d);
       
        DrillDownChart2(ctx, res, false, "BaseAmount", "Year", "BaseAmount", "sum", "Type", "bar", 'string', 2, window['valuedivider'].toString(), pChartOptions);

        res = res.filter(function (item, i) {
            return item.Type == 'Tax';
        });

        //
        pChartOptions.isPercentage = true;
        pChartOptions.isUseGroupByColumnFiledToCalculatePercentage = true;
        pChartOptions.fieldToCalculatePercentage = 'Year';

        DrillDownChart2(ctx2, res, false, "BaseAmount", "Year", "BaseAmount", "sum", "EmployeeGrade", "bar", 'string', 2, '%', pChartOptions);
        
        pChartOptions.isPercentage = false;
        pChartOptions.isUseGroupByColumnFiledToCalculatePercentage = false;
        pChartOptions.fieldToCalculatePercentage = null;

    });

}

function GetNetSalaryvsTaxRatio(ctx, data, pChartOptions) {
    $('#' + ctx).closest('div').before('<div class="progressdiv" id="' + ctx + 'progress" style="position:absolute;left:45%;"></div>');
    postRequestD('GetNetSalaryvsTaxRatio', data, function (response) {
        $('#' + ctx + 'progress').remove();        
        var res = JSON.parse(response.d);

        DrillDownChart2(ctx, res, false, "Percentage", "Year", "Percentage", "sum", "Type", "horizontalbar", 'string', 2, window['valuedivider'].toString(), pChartOptions);

    });

}