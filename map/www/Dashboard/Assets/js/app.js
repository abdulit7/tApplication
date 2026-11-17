//var baseURL = 'http://localhost:3580/TimeTraxWeb/wsttdashboard.asmx?op=';
//clearAllConsolelogs(); // pass true as arg if want to show console msgs
var bgColors = [];
var borderColor = [];
var FType = getParameterByName('FType');
FType = isNull(FType) ? 0 : FType.toLowerCase();
var globalFilter = [];
var globalpayrrolFilter = {
    Years: [sysdate.toString().split('/')[2]],
    Months: [sysdate.toString().split('/')[1]],
};
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var isnewmethod = false;
$(function () {
    
    jQuery('body #main').hide();
    checkRights('DashboardNew.html?FType=' + FType + '', function () {
        jQuery('body #main').show();
        jQuery('#initLoader').remove();

        if (isnewmethod) {
            //populateCriteria_optimized1();
            populateCriteria_optimized_and_get_string();
        }
        else {
            populateCriteria();
        }
        
        var date = new Date();
        $('#ddlYear').val([date.getFullYear(), date.getFullYear() - 1]);
        $('#ddlYear').trigger('change');
        createPayrollFilter();
        main([], 1);
		 hideSideMenu();



        
    });
});



function checkRights(pObject, callback) {

    postRequestD('wsttmapp.asmx/GetMenuRightsWeb', { pPages: pObject, pModules: "'test'" }, function (response) {
        var res1 = JSON.parse(response.d);
        res = res1.Menu;
        try {
            
            var isnewmethod1 = res1.Flag;
            isnewmethod = isnewmethod1[0].IsNewMethod;
        } catch (error) {}
        pObject = pObject.toLowerCase();
        var IsRightsAvailable = res.filter(function (value) {
            return value.ObjectName.toLowerCase() === pObject;  //&& value.Allowed === true;
        });
        //////console.log({ IsRightsAvailable });
        if (IsRightsAvailable.length > 0) {
            jQuery('#' + FType).removeClass('hide');
            jQuery('#' + FType).addClass('active');
            jQuery('#' + FType).addClass('in');
            callback();
        } else {
            jQuery('body').html('<br><br><center>No Permission!</center>');
            jQuery('body').show();
        }

    });

}

function OnFilterChange(evt) {

    //    //////console.log('oc', isAnySelect2Open);
    if (isAnySelect2Open == 'true') {
        return;
    }

    // main($( '#ddlYear').val());
    var filters = [];
    if (isNull($('#ddlYear').val())) {
        //alert('Select Year!');
        //$('#ddlYear').val([date.getFullYear()]);
        //main([], 1);
        //return;
    }
    $.each(filterData, function (i, item) {
        var _control = $('#' + item.ControlID);
        var _inornotin = $('#inornotin' + item.ControlID);

        var filterrow = {
            FilterType: item.ControlID,
            FilterIDColumn: item.P2,
            InOrNotIn: _inornotin.val(),
            FilterIDs: !isNull(_control.val()) ? _control.val().join() : 0,
        };
        filters.push(filterrow);
    });
    ////////console.log({ filters });
    globalFilter = filters;


    //$("#foo").select2("isOpen")
    //var isdop = $(".select2-results").is(":visible");
    ////////console.log(isdop);

    main(filters);
}


var __Month;
function main(filterc, pFirstLoad) {
    var vyears;
    if (pFirstLoad) {
        vyears = '2019'
    }

	window['valuedivider'] = jQuery('#valuedivider').val();
    //var criteria0 = { pYears: vyears, pMonths: __Month, pFilterCriteria: filterc };
    __Month = typeof globalpayrrolFilter.Months === 'object' ? globalpayrrolFilter.Months.join(',') : '';//globalpayrrolFilter.Months[0];
    window['criteria0'] = { pYears: vyears, pMonths: __Month, pFilterCriteria: filterc };

    if (FType == 'hrdashboard') {
        renderHRDashboard(pFirstLoad, filterc);
    } else if (FType === 'trainingdashboard') {
        renderTrainingDashboard();
    } else if (FType === 'attendancedashboard') {
        
        renderAttendanceDashboard(pFirstLoad, filterc);
    }
    else if (FType === 'payrolldashboard') {
        renderPayrollDashboard(pFirstLoad, filterc);
    }
    else if (FType === 'payrollrdashboard') {
        renderPayrollrDashboard(pFirstLoad, filterc);
    }
    else if (FType === 'appraisaldashboard') {
        renderAppraisalDashboard(pFirstLoad, filterc);
    } else if (FType === 'helpdeskdashboard') {
        renderHelpdeskDashboard(pFirstLoad, filterc);
    } else if (FType === 'secondarysalesdata') {
        renderSecondarySalesDashboard(pFirstLoad, filterc);
    }
    else if (FType === 'secondarysalesreports') {
        renderSecondarySalesReport(pFirstLoad, filterc);
    }
    else if (FType === 'attendancetimeanalysisdashboard') {
        renderAttendanceTimeAnalysisDashboard(pFirstLoad, filterc)
    }
}



function clearFilter() {

    $.each(filterData, function (i, item) {
        var _control = $('#' + item.ControlID);
        //_control.val([]);
        //_control.select2('val', '');
        _control.val("");
        _control.trigger("change");
        //console.log(_control);
    });
    $('#ddlYear').val(new Date().getFullYear().toString());
    $('#ddlYear').trigger("change");

    globalpayrrolFilter = {
        Years: [sysdate.split('/')[2]],
        Months: [sysdate.split('/')[1]],
    }
    createPayrollFilter();

    closeNav();
    main([], 1);
}

function getCheckedCheckboxesFor(checkboxName) {
    var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked'), values = [];
    Array.prototype.forEach.call(checkboxes, function (el) {
        values.push(el.value);
    });
    return values;
}

function createPayrollFilter() {


    var placeholder = $('#' + FType + 'FilterDiv');
    //console.log(placeholder);
    //placeholder.html('dfsdgdgfdg');    
    if (FType == 'payrolldashboard' || FType == 'attendancedashboard' || FType == 'helpdeskdashboard' || FType == 'trainingdashboard' || FType == 'secondarysalesdata' || FType == 'secondarysalesreports' || FType == 'attendancetimeanalysisdashboard') {

        var template = '';

        var years_ = getYearsArrayFromToNow('2012');
        
        $.each(years_, function (i, item) {
            var checkedYr = '';
            if (item == sysdate.split('/')[2]) { checkedYr = 'checked' }
            //template += '<span> <input name="payrollYears" type="checkbox" value="' + item + '" class="chk" /> <label for=""' + item + '"">' + item + '</label> </span>';
            template += '<label><input ' + checkedYr + ' name="payrollYears" type="checkbox" value="' + item + '" class="chk"> <span></span>&nbsp;' + item + '</label>';
        });
        template += '<span class="payrollFitlerDivider"></span>';

        $.each(monthNames, function (i, items) {
            var monthNo = i + 1;
            var checkedMonth = '';
            if (monthNo == sysdate.split('/')[1]) { checkedMonth = 'checked' }
            //template += '<span> <input name="payrollMonths" type="checkbox" value="' + monthNo + '" class="chkm" /> <label for=""' + items + '"">' + items + '</label> </span>';
            template += '<label><input ' + checkedMonth + ' name="payrollMonths" type="checkbox" value="' + monthNo + '" class="chk"> <span></span>&nbsp;' + items + '</label>    ';
        });

        template += '<button class="btn btn-xs btn-primary" onClick="ShowPayrollDashboard();">Show</button>';
        placeholder.html(template);

        $('.chk,.chkm').change(function () {
            //alert(getCheckedCheckboxesFor('payrollYears'));
            var _resYears = getCheckedCheckboxesFor('payrollYears');
            var _resMonths = getCheckedCheckboxesFor('payrollMonths');
            globalpayrrolFilter =
                {
                    Years: _resYears,
                    Months: _resMonths
                }
            //////console.log({ _resYears, _resMonths });
            //        main(globalFilter);
        });

    } else if (FType == 'payrollrdashboard') {
        var placeholder = $('#' + FType + 'FilterDiv');
        placeholder.show();
        var template = '';

        var years_ = getYearsArrayFromToNow('2012');

        $.each(years_, function (i, item) {
            var checkedYr = '';
            if (item == sysdate.split('/')[2]) { checkedYr = 'checked' }            
            template += '<option value="' + item + '">' + item + '</option>';
        });
        jQuery('#ddlRFromYear,#ddlRToYear').html(template);
        
        //placeholder.html(template);

        //$('.chk,.chkm').change(function () {
        //    //alert(getCheckedCheckboxesFor('payrollYears'));
        //    var _resYears = getCheckedCheckboxesFor('payrollYears');
        //    var _resMonths = getCheckedCheckboxesFor('payrollMonths');
        //    globalpayrrolFilter =
        //        {
        //            Years: _resYears,
        //            Months: _resMonths
        //        }
        //    //////console.log({ _resYears, _resMonths });
        //    //        main(globalFilter);
        //});

    } else if (FType == 'appraisaldashboard') {

        var template = '';
        var params = { PID1: 'tblReviewYear', PID2: 'ReviewYear', PID3: "ReviewYear", PID4: '' }
        var paramsReviewType = { PID1: 'tblReviewType', PID2: 'ReviewTypeID', PID3: "ReviewTypeTitle", PID4: '' }
        fillDD('ddlReviewYear', params);
        fillDD('ddlReviewType', paramsReviewType);
        //fillDD('ddlReviewType2', paramsReviewType);
        $('.mbox').closest('td').css('width', '180px');

    }



}
function ShowPayrollDashboard() {
    main(globalFilter);
}

function ShowPayrollrDashboard() {
    main(globalFilter);
}

function controlWidth(ctx, ptype, _d) {
    var cntz = $('#' + ctx);

    // if (cntz.closest('div').hasClass('WithApplied')) {
    //     cntz.closest('div').css('width', 'auto');
    //     cntz.closest('div').removeClass('WithApplied');
    //     //var typec = ptype + '' + ctx;
    // } else {

    //     if (_d.length > 10) {
    //         var totalWidth = _d.length * 80;
    //         cntz.closest('div').css('width', totalWidth + 'px');
    //         cntz.closest('div').addClass('WithApplied');
    //     } else {
    //         //cntz.closest('div').css('width', 'auto');
    //     }
    // }
    if (cntz.closest('div').hasClass('WithApplied')) {

        cntz.closest('div').css('width', 'auto');
        cntz.closest('div').removeClass('WithApplied');


    } else {
        var totalWidth = 20 * _d.length;
        cntz.closest('div').css('width', totalWidth + 'px');
        cntz.closest('div').addClass('WithApplied');
    }




    //$('#' + ctx).closest('.cardheading').hide(); //append('<span style="font-size: 15px;" class="pull-right"><i class="fa fa-expand"></i></span>');

}

function getColumnDataArrayFromObject(pObject, pColumn) {
    var arr = [];
    $.each(pObject, function (i, item) {
        arr.push(item[pColumn]);
    });
    return arr;
}

function progress() {
    return '<i class="fa fa-spinner fa-spin"></i>';
}

function hideSideMenu() {
    if (FType == "secondarysalesdata" || FType=="secondarysalesreports") {
        document.getElementById('mainddlYear').style.display = 'none';
        document.getElementById('mainddlEmployee').style.display = 'none';
        document.getElementById('mainddlBranch').style.display = 'none';
        document.getElementById('mainddlDivision').style.display = 'none';
        document.getElementById('mainddlDepartment').style.display = 'none';
        document.getElementById('mainddlSubDepartment').style.display = 'none';
        document.getElementById('mainddlGroupLevel').style.display = 'none';
        document.getElementById('mainddlDesignation').style.display = 'none';
        document.getElementById('mainddlEmployeeCategory').style.display = 'none';
        document.getElementById('mainddlGroup').style.display = 'none';
        document.getElementById('mainddlEmployeeGrade').style.display = 'none';
        document.getElementById('mainddlManagementLevel').style.display = 'none';
        document.getElementById('mainddlSubManagementLevel').style.display = 'none';
        document.getElementById('mainddlCustomer').style.display = 'none';
        document.getElementById('mainddlProject').style.display = 'none';
        document.getElementById('mainddlTraining').style.display = 'none';
    }
}

jQuery('#txtDashboardDate,#txtFromHelpdesk,#txtToHelpdesk,#txtFromSS,#txtToSS,#txtFromSSR,#txtToSSR').val(sysdate1);
jQuery('#datepickertxtFromSS').datetimepicker({
    format: 'MM/DD/YYYY',
    ignoreReadonly: true
});
jQuery('#datepickertxtDashboardDate,#datepickertxtFromHelpdesk,#datepickertxtToHelpdesk,#datepickertxtToSS,#datepickertxtFromSS,#datepickertxtToSSR,#datepickertxtFromSSR').datetimepicker({
    format: 'MM/DD/YYYY',
    ignoreReadonly: true,
}).on('dp.change', function (e) {
    e.preventDefault();
    //console.log(window['criteria0']);
    if (FType == 'helpdeskdashboard' || FType == 'secondarysalesdata') {
        main(globalFilter);
    } else if (FType == 'attendancedashboard') {
        GetAttendanceSummary(window['criteria0']);
    }

    //console.log(jQuery('#txtDashboardDate').val());

});



function sum(obj, prop) {
    var sum = 0;
    $.each(obj, function (i, item) {

        if (!isNull(item[prop])) {
            sum += parseFloat(item[prop]);
        }

    });
    return sum;
}

function createRandomColor(data) {

    var i;
    for (i = 0; i < 5; i++) {
        var strcolor = renderColor();
        bgColors.push(strcolor += '0.25)');
        borderColor.push(strcolor += '1)');
    }
}

        // datasets: [{
            //     label: '2018',
            //     data: [11,44,20,34,19],
            //     fill: false,
            //     lineTension : 0,            
            //     backgroundColor :bgColors,
            //     borderColor : borderColor,
            //     fill:true
            // },{            
            //     label: '2018',
            //     data: [12,34,10,24,29],
            //     fill: false,
            //     type: 'line',
            //     lineTension : 0,            
            //     backgroundColor : bgColors,
            //     borderColor : borderColor,
            //     fill:true
            // }],