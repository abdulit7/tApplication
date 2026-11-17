//getYearsArrayFromToNow(2010);
var isAnySelect2Open = true;
var FType = getParameterByName('FType');
FType = isNull(FType) ? 0 : FType.toLowerCase();

var filterData = [
    {
        ControlID: 'ddlYear',
        FilterTitle: 'Year',
        FromDB: false,
        P1: '',
        P2: '',
        P3: '',
        ClientData: getYearsArrayFromToNow(1998),
        Order: 0
    },
    {
        ControlID: 'ddlEmployee',
        FilterTitle: 'Employee',
        FromDB: true,
        P1: 'tblEmployee',
        P2: 'EmployeeID',
        P3: 'EmployeeName',
        ClientData: [],
        Order: 1
    },
    {
        ControlID: 'ddlBranch',
        FilterTitle: 'Branch',
        FromDB: true,
        P1: 'tblBranch',
        P2: 'BranchID',
        P3: 'BranchTitle',
        ClientData: [],
        Order: 1
    },
    {
        ControlID: 'ddlDivision',
        FilterTitle: 'Division',
        FromDB: true,
        P1: 'tblDivision',
        P2: 'DivisionID',
        P3: 'DivisionTitle',
        ClientData: [],
        Order: 2
    },
    {
        ControlID: 'ddlDepartment',
        FilterTitle: 'Department',
        FromDB: true,
        P1: 'tblDepartment',
        P2: 'DepartmentID',
        P3: 'DepartmentTitle',
        ClientData: [2, 2],
        Order: 3
    },
    {
        ControlID: 'ddlSubDepartment',
        FilterTitle: 'Sub Department',
        FromDB: true,
        P1: 'tblSubDepartment',
        P2: 'SubDepartmentID',
        P3: 'SubDepartmentTitle',
        ClientData: [],
        Order: 4
    },
    {
        ControlID: 'ddlGroupLevel',
        FilterTitle: 'Function',
        FromDB: true,
        P1: 'tblGroupLevel',
        P2: 'GroupLevelID',
        P3: 'GroupLevelTitle',
        ClientData: [],
        Order: 5
    },
    {
        ControlID: 'ddlDesignation',
        FilterTitle: 'Designation',
        FromDB: true,
        P1: 'tblDesignation',
        P2: 'DesignationID',
        P3: 'DesignationTitle',
        ClientData: [],
        Order: 6
    },
    {
        ControlID: 'ddlEmployeeCategory',
        FilterTitle: 'Employee Category',
        FromDB: true,
        P1: 'tblEmployeeCategory',
        P2: 'EmployeeCategoryID',
        P3: 'EmployeeCategoryTitle',
        ClientData: [],
        Order: 7
    },
    {
        ControlID: 'ddlGroup',
        FilterTitle: 'Group',
        FromDB: true,
        P1: 'tblGrade',
        P2: 'GradeID',
        P3: 'GradeTitle',
        ClientData: [],
        Order: 8
    },
    {
        ControlID: 'ddlEmployeeGrade',
        FilterTitle: 'Grade',
        FromDB: true,
        P1: 'tblEmployeeGrade',
        P2: 'EmployeeGradeID',
        P3: 'EmployeeGradeTitle',
        ClientData: [],
        Order: 9
    },
    {
        ControlID: 'ddlManagementLevel',
        FilterTitle: 'Management Level',
        FromDB: true,
        P1: 'tblManagementLevel',
        P2: 'ManagementLevelID',
        P3: 'ManagementLevelTitle',
        ClientData: [],
        Order: 10
    },
    {
        ControlID: 'ddlSubManagementLevel',
        FilterTitle: 'Sub-Management Level',
        FromDB: true,
        P1: 'tblSubManagementLevel',
        P2: 'SubManagementLevelID',
        P3: 'SubManagementLevelTitle',
        ClientData: [],
        Order: 11
    },
    {
        ControlID: 'ddlCustomer',
        FilterTitle: 'Customer',
        FromDB: true,
        P1: 'tblCustomer',
        P2: 'CustomerID',
        P3: 'CustomerTitle',
        ClientData: [],
        Order: 12
    },
    {
        ControlID: 'ddlProject',
        FilterTitle: 'Project',
        FromDB: true,
        P1: 'tblProject',
        P2: 'ProjectID',
        P3: 'ProjectTitle',
        ClientData: [],
        Order: 13
    },
    {
        ControlID: 'ddlTraining',
        FilterTitle: 'Training',
        FromDB: true,
        P1: 'tblTraining',
        P2: 'TrainingID',
        P3: 'TrainingTitle',
        ClientData: [],
        Order: 14
    },

    {
        ControlID: 'ddlCategory',
        FilterTitle: 'Item Category',
        FromDB: true,
        P1: 'tblCategory',
        P2: 'CategoryID',
        P3: 'CategoryTitle',
        ClientData: [],
        Order: 15
    },
];


//filterData = filterData.sort(function (a, b) { return a['Order'] - b['Order'] });

var template = '';
function populateCriteria() {
    var eid, uid, ecode, secKey, cid, lid, ename, Type, Url, Data, ContentType, DataType, ProcessData;
    eid = localStorage.getItem('eid');
    ename = localStorage.getItem('ename');
    uid = localStorage.getItem('uid');
    cid = localStorage.getItem('cid');
    lid = localStorage.getItem('lid');
    ecode = localStorage.getItem('ecode');
    secKey = localStorage.getItem('secKey');

    var filterarea = $('#filterarea');
    var criteriaWithDisplayOrder = [];

    var ddlPlaceholdertemplate = '';

    $.each(filterData, function (i, item) {

        if (item.ControlID === 'ddlYear') {
            ddlPlaceholdertemplate += '<div id="main' + item.ControlID + '" class="panel panel-default panelcustom">' +
                '<div style="font-size:12px;" class="panel-heading customfilterheading"><span class="fa fa-arrow-right"> </span> ' + item.FilterTitle + '</div>' +
                '<div class="panel-body" id="placeholder' + item.ControlID + '">' +
                '</div>' +
                '</div>';
        } else {
            ddlPlaceholdertemplate += '<div id="main' + item.ControlID + '"  class="panel panel-default panelcustom">' +
                '<div style="font-size:12px;"  class="panel-heading customfilterheading"><span class="fa fa-arrow-right"> </span> ' + item.FilterTitle + ' <select  onChange="OnFilterChange(this);" id="inornotin' + item.ControlID + '"><option>IN</option><option>NOT IN</option></select></div>' +
                '<div class="panel-body" id="placeholder' + item.ControlID + '">' +
                '</div>' +
                '</div>';
        }
    });
    filterarea.html(ddlPlaceholdertemplate);

    
    if (FType == "secondarysalesdata" || FType == "secondarysalesreports") {
        var item = filterData[16];
        options = '';
        var params = {
            PID1: item.P1,
            PID2: item.P2,
            PID3: item.P3,
            PID4: "AND 1 = 1 ",
        }



        // console.log(item);      
        postRequestD('FillDropDownGeneric', params, function (rdate) {
            var rd = JSON.parse(rdate.d);

            var t2 = '';
            $.each(rd, function (ij, itms) {
                options += '<option value=' + itms[params.PID2] + '>' + itms[params.PID3] + '</option>'
            });
            // console.log({ options });

            template = '<select name="" id="' + item.ControlID + '" multiple="multiple" class="select2ddl">' + options + '</select>';
            $('#placeholder' + item.ControlID).html(template);
            $('#' + item.ControlID).select2({ width: '100%', allowClear: true, });
            $('#' + item.ControlID).on('select2:closing', function (e) { OnFilterChange(); });

            $('.select2ddlAppraisal').select2({
                width: '100%',
                allowClear: true,
            });

        });

        return;
    }

    $.each(filterData, function (i, item) {


        var options = '';

        if (FType === 'hrdashboard' || FType === 'payrolldashboard' || FType === 'attendancedashboard' || FType === 'appraisaldashboard' || FType === 'trainingdashboard') {

            if (FType === 'trainingdashboard' || FType === 'hrdashboard' || FType === 'attendancedashboard' || FType === 'attendancetimeanalysisdashboard') {
                if (item.ControlID == 'ddlCustomer' || item.ControlID == 'ddlProject') {
                    $('#main' + item.ControlID + '').remove();
                    return;
                }

                if (FType === 'hrdashboard' || FType === 'attendancedashboard' || FType === 'attendancetimeanalysisdashboard') {
                    if (item.ControlID == 'ddlTraining') {
                        $('#main' + item.ControlID + '').remove();
                        return;
                    }
                }
            }
            if (FType != 'hrdashboard') {
                if (item.ControlID == 'ddlYear') {
                    $('#main' + item.ControlID + '').remove();
                    return;
                }
            }

        }

        if (FType === 'helpdeskdashboard') {
            //alert();
            if (item.ControlID == 'ddlCustomer' || item.ControlID == 'ddlProject') {

            } else {
                $('#main' + item.ControlID + '').remove();
                //alert(item.ControlID);
                return;
            }

        }

        if (item.FromDB === false) {

            $.each(item.ClientData, function (i, itm) {
                options += '<option value=' + itm + '>' + itm + '</option>'
            });

            template = '<select name="" id="' + item.ControlID + '" multiple="multiple" class="select2ddl">' + options + '</select>';
            $('#placeholder' + item.ControlID).html(template);
            $('#' + item.ControlID).select2({ width: '100%', allowClear: true, });
            $('#' + item.ControlID).on('select2:closing', function (e) { OnFilterChange(); });

            // template += '<div class="panel panel-default panelcustom">' +
            //     '<div style="font-size:12px;" class="panel-heading customfilterheading"><span class="fa fa-arrow-right"> </span> ' + item.FilterTitle + '</div>' +
            //     '<div class="panel-body">' +
            //     '<select name="" id="' + item.ControlID + '" multiple="multiple" class="select2ddl">' +
            //     options +
            //     '</select>' +
            //     '</div>' +
            //     '</div>';


            //filterarea.html(template);

            //criteriaWithDisplayOrder.push({ template: template, orderNo: item.Order });

        } else if (item.FromDB === true) { 
            options = '';
            var params = {
                PID1: item.P1,
                PID2: item.P2,
                PID3: item.P3,
                PID4: 'order by ' + item.P3
            }
            // console.log(item);     
            postRequestD('FillDropDownGeneric', params, function (rdate) {
                var rd = JSON.parse(rdate.d);

                var t2 = '';
                $.each(rd, function (ij, itms) {
                    options += '<option value=' + itms[params.PID2] + '>' + itms[params.PID3] + '</option>'
                });
                // console.log({ options });

                template = '<select name="" id="' + item.ControlID + '" multiple="multiple" class="select2ddl">' + options + '</select>';
                $('#placeholder' + item.ControlID).html(template);
                $('#' + item.ControlID).select2({ width: '100%', allowClear: true, });
                $('#' + item.ControlID).on('select2:closing', function (e) { OnFilterChange(); });


                // template += '<div class="panel panel-default panelcustom">' +
                //     '<div style="font-size:12px;"  class="panel-heading customfilterheading"><span class="fa fa-arrow-right"> </span> ' + item.FilterTitle + ' <select  onChange="OnFilterChange(this);" id="inornotin' + item.ControlID + '"><option>IN</option><option>NOT IN</option></select></div>' +
                //     '<div class="panel-body">' +
                //     '<select id="' + item.ControlID + '" multiple="multiple" class="select2ddl">' +
                //     options +
                //     '</select>' +
                //     '</div>' +
                //     '</div>';
                //filterarea.html(template);
                //criteriaWithDisplayOrder.push({ template: template, orderNo: item.Order });
                // $('.select2ddl').select2({
                //     width: '100%',
                //     allowClear: true,
                // });

                $('.select2ddlAppraisal').select2({
                    width: '100%',
                    allowClear: true,
                });


                // $('.select2ddl').on('select2:closing', function (e) {
                //     //var isdop = $(".select2-results").is(":visible");
                //     //isAnySelect2Open = isdop;
                //     //console.log('filter', isAnySelect2Open);
                //     OnFilterChange();
                //     //return false;
                // });

                //$('ddlYear').val([2019]);

                //criteriaWithDisplayOrder = criteriaWithDisplayOrder.sort(function (a, b) { return a['orderNo'] - b['orderNo'] });

                //console.log({ criteriaWithDisplayOrder });

                //$.each(criteriaWithDisplayOrder, function (ij, itm) {
                //  filterarea.append(itm.template);
                //});


            });


        }

    });





    //criteriaWithDisplayOrder = criteriaWithDisplayOrder.sort(function (a, b) { return a['orderNo'] - b['orderNo'] });

    //console.log({ criteriaWithDisplayOrder });

    // $.each(criteriaWithDisplayOrder, function (ij, itm) {
    //   filterarea.append(itm.template);
    // });



    //  filterarea.html(template);
}




function populateCriteria_optimized1() {
    //var eid, uid, ecode, secKey, cid, lid, ename, Type, Url, Data, ContentType, DataType, ProcessData;
    //eid = localStorage.getItem('eid');
    //ename = localStorage.getItem('ename');
    //uid = localStorage.getItem('uid');
    //cid = localStorage.getItem('cid');
    //lid = localStorage.getItem('lid');
    //ecode = localStorage.getItem('ecode');
    //secKey = localStorage.getItem('secKey');

    var filterarea = $('#filterarea');
    var criteriaWithDisplayOrder = [];

    var ddlPlaceholdertemplate = '';

    filterData.forEach(function (item) {
    //$.each(filterData, function (i, item) {

        if (item.ControlID === 'ddlYear') {
            ddlPlaceholdertemplate += '<div id="main' + item.ControlID + '" class="panel panel-default panelcustom">' +
                '<div style="font-size:12px;" class="panel-heading customfilterheading"><span class="fa fa-arrow-right"> </span> ' + item.FilterTitle + '</div>' +
                '<div class="panel-body" id="placeholder' + item.ControlID + '">' +
                '</div>' +
                '</div>';
        } else {
            ddlPlaceholdertemplate += '<div id="main' + item.ControlID + '"  class="panel panel-default panelcustom">' +
                '<div style="font-size:12px;"  class="panel-heading customfilterheading"><span class="fa fa-arrow-right"> </span> ' + item.FilterTitle + ' <select  onChange="OnFilterChange(this);" id="inornotin' + item.ControlID + '"><option>IN</option><option>NOT IN</option></select></div>' +
                '<div class="panel-body" id="placeholder' + item.ControlID + '">' +
                '</div>' +
                '</div>';
        }
    });
    filterarea.html(ddlPlaceholdertemplate);

    filterData.forEach(function (item) {
//    $.each(filterData, function (i, item) {


        var options = '';

        if (FType === 'hrdashboard' || FType === 'payrolldashboard' || FType === 'attendancedashboard' || FType === 'appraisaldashboard' || FType === 'trainingdashboard') {

            if (FType === 'trainingdashboard' || FType === 'hrdashboard' || FType === 'attendancedashboard') {
                if (item.ControlID == 'ddlCustomer' || item.ControlID == 'ddlProject') {
                    $('#main' + item.ControlID + '').remove();
                    return;
                }

                if (FType === 'hrdashboard' || FType === 'attendancedashboard') {
                    if (item.ControlID == 'ddlTraining') {
                        $('#main' + item.ControlID + '').remove();
                        return;
                    }
                }
            }
            if (FType != 'hrdashboard') {
                if (item.ControlID == 'ddlYear') {
                    $('#main' + item.ControlID + '').remove();
                    return;
                }
            }

        }

        if (FType === 'helpdeskdashboard') {
            //alert();
            if (item.ControlID == 'ddlCustomer' || item.ControlID == 'ddlProject') {

            } else {
                $('#main' + item.ControlID + '').remove();
                //alert(item.ControlID);
                return;
            }

        }

        if (item.FromDB === false) {

            item.ClientData.forEach(function (itm) {
            //$.each(item.ClientData, function (i, itm) {
                options += '<option value=' + itm + '>' + itm + '</option>'
            });

            template = '<select name="" id="' + item.ControlID + '" multiple="multiple" class="select2ddl">' + options + '</select>';
            $('#placeholder' + item.ControlID).html(template);
            $('#' + item.ControlID).select2({ width: '100%', allowClear: true, });
            $('#' + item.ControlID).on('select2:closing', function (e) { OnFilterChange(); });

          

        }
        //else if (item.FromDB === true) { ///filling in combobox
        //    options = '';
        //    var params = {
        //        PID1: item.P1,
        //        PID2: item.P2,
        //        PID3: item.P3,
        //        PID4: 'order by ' + item.P3
        //    }
            


        //}

    });
}

function populateCriteria_optimized_and_get_string() {
    var eid, uid, ecode, secKey, cid, lid, ename, Type, Url, Data, ContentType, DataType, ProcessData;
    var myArray = new Array();
    eid = localStorage.getItem('eid');
    ename = localStorage.getItem('ename');
    uid = localStorage.getItem('uid');
    cid = localStorage.getItem('cid');
    lid = localStorage.getItem('lid');
    ecode = localStorage.getItem('ecode');
    secKey = localStorage.getItem('secKey');
    var filterarea = $('#filterarea');
    var criteriaWithDisplayOrder = [];
    var ddlPlaceholdertemplate = '';
    $.each(filterData, function (i, item) {
        if (item.ControlID === 'ddlYear') {
            ddlPlaceholdertemplate += '<div id="main' + item.ControlID + '" class="panel panel-default panelcustom">' +
                '<div style="font-size:12px;" class="panel-heading customfilterheading"><span class="fa fa-arrow-right"> </span> ' + item.FilterTitle + '</div>' +
                '<div class="panel-body" id="placeholder' + item.ControlID + '">' +
                '</div>' +
                '</div>';
        } else {
            ddlPlaceholdertemplate += '<div id="main' + item.ControlID + '"  class="panel panel-default panelcustom">' +
                '<div style="font-size:12px;"  class="panel-heading customfilterheading"><span class="fa fa-arrow-right"> </span> ' + item.FilterTitle + ' <select  onChange="OnFilterChange(this);" id="inornotin' + item.ControlID + '"><option>IN</option><option>NOT IN</option></select></div>' +
                '<div class="panel-body" id="placeholder' + item.ControlID + '">' +
                '</div>' +
                '</div>';
        }
    });
    filterarea.html(ddlPlaceholdertemplate);
    $.each(filterData, function (i, item) {
        var options = '';
        if (FType === 'hrdashboard' || FType === 'payrolldashboard' || FType === 'attendancedashboard' || FType === 'appraisaldashboard' || FType === 'trainingdashboard') {
            if (FType === 'trainingdashboard' || FType === 'hrdashboard' || FType === 'attendancedashboard') {
                if (item.ControlID == 'ddlCustomer' || item.ControlID == 'ddlProject') {
                    $('#main' + item.ControlID + '').remove();
                    return;
                }

                if (FType === 'hrdashboard' || FType === 'attendancedashboard') {
                    if (item.ControlID == 'ddlTraining') {
                        $('#main' + item.ControlID + '').remove();
                        return;
                    }
                }
            }
            if (FType != 'hrdashboard') {
                if (item.ControlID == 'ddlYear') {
                    $('#main' + item.ControlID + '').remove();
                    return;
                }
            }
        }
        if (FType === 'helpdeskdashboard') {
            if (item.ControlID == 'ddlCustomer' || item.ControlID == 'ddlProject') {

            } else {
                $('#main' + item.ControlID + '').remove();
                //alert(item.ControlID);
                return;
            }

        }
        if (item.FromDB === false) {
            $.each(item.ClientData, function (i, itm) {
                options += '<option value=' + itm + '>' + itm + '</option>'
            });
            template = '<select name="" id="' + item.ControlID + '" multiple="multiple" class="select2ddl">' + options + '</select>';
            $('#placeholder' + item.ControlID).html(template);
            $('#' + item.ControlID).select2({ width: '100%', allowClear: true, });
            $('#' + item.ControlID).on('select2:closing', function (e) { OnFilterChange(); });
        } else if (item.FromDB === true) { ///filling in combobox
            options = '';
            var params = {
                PID1: item.P1,
                PID2: item.P2,
                PID3: item.P3,
                PID4: 'order by ' + item.P3
            }
            myArray.push(params);
        }
    });

    var t123 = JSON.stringify(myArray);
    var rd;
    postRequestDWithcomplete('FillDropDownGeneric_optimize', t123, function (rdate) {
        rd = JSON.parse(rdate.d);
    }, function () {
            var i1 = 0;
            //rd.forEach(function (item) { //farhan commented on 4:16 pm on 1 jun 2023
            filterData.forEach(function (item) {
                
                var options = '';
                if (item.FromDB === true) { ///filling in combobox
                    try {
                        var f111 = rd[i1];
                        options = '';
                        
                        var tttt = JSON.parse(f111);
                        template = '<select name="" id="' + item.ControlID + '" multiple="multiple" class="select2ddl"></select>';
                        $('#placeholder' + item.ControlID).html(template);
                        $('#' + item.ControlID).select2({ width: '100%', allowClear: true, });
                        const selectElement = document.getElementById(item.ControlID);
                        tttt.forEach(function (object) {
                            const option = document.createElement("option");
                            option.value = object[myArray[i1].PID2];
                            option.text = object[myArray[i1].PID3];
                            selectElement.appendChild(option);
                        });


                        $('#' + item.ControlID).on('select2:closing', function (e) { OnFilterChange(); });
                        $('.select2ddlAppraisal').select2({
                            width: '100%',
                            allowClear: true,
                        });
                        i1 = i1 + 1;
                    }
                    catch (err) {}
                }
            });
        //}); //farhan commented on 4:16 pm on 1 jun 2023

    });




    
}

function getYearsArrayFromToNow(pYearFrom) {

    var years = [];
    var currentYears = new Date().getFullYear();
    var loopCOunter = currentYears - pYearFrom;
    for (var i = 0; i <= loopCOunter; i++) {
        years.push(pYearFrom++);
    }
    return years.reverse();
}

