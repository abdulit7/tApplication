var varData;
var varContentType;
var varDataType;
var varProcessData;
var isAdmin = getLocalStorageItem_String('isAdmin');
//var varBaseUrl;
//varBaseUrl = "http://localhost:3560/TimeTraxWeb/"
//Generic function to call AXMX/WCF  Service
jQuery(function ($) { //just like $(document).ready()
    var dateformat;
    dateFormat = getLocalStorageItem_String("dateformat");
    GetObjectiveApprovalList();
});


$('#form1').submit(function (e) {
    e.preventDefault();

});

$('#btnRefresh').click(function (e) {
    GetObjectiveApprovalList();
});

function GetObjectiveApprovalList() {
    //var status = $('ddlStatus');
    var objList = $('#objList');
    var template = '';
    var sourcepage = location.href.split("/").slice(-1);
    postRequest('GetObjectiveApprovalList', { pStatus: 'Pending' }, function (res) {
        var data = JSON.parse(res.d);
        var head = data['Request'];
        var details = data['Detail'];
        var formEditor = data['FormEditor'];

        //console.log({ formEditor, details });
        if (formEditor == null || formEditor.length == 0) {

            formEditor = [
                {
                    DBValueField: 'StartDate',
                    IsRequired: true,
                    FieldTitle: 'Start Date'
                },
                {
                    DBValueField: 'TargetDate',
                    IsRequired: true,
                    FieldTitle: 'Target Date'
                },
                {
                    DBValueField: 'Weightage',
                    IsRequired: true,
                    FieldTitle: 'Weightage'
                },
                {
                    DBValueField: 'Priority',
                    IsRequired: true,
                    FieldTitle: 'Priority'
                },
                {
                    DBValueField: 'QuestionGroupID',
                    IsRequired: true,
                    FieldTitle: 'Question Group'
                },
                {
                    DBValueField: 'ObjectiveTitle',
                    IsRequired: true,
                    FieldTitle: 'Objective Title'
                },
                {
                    DBValueField: 'ObjectiveDetail',
                    IsRequired: true,
                    FieldTitle: 'Objective Detail'
                },
                {
                    DBValueField: 'ActionPlan',
                    IsRequired: true,
                    FieldTitle: 'Action Plan'
                },
                {
                    DBValueField: 'PerformanceIndicators',
                    IsRequired: true,
                    FieldTitle: 'Performance Indicators'
                }
            ]

            //toastr.error('Something went wrong! Form Editor not found!');
            //return;
        }

        if (!isEmptyObj(head)) {
            $.each(head, function (i, item) {
                var dtl = details.filter(function (value) { return item.RequestID === value.RequestID; });
                var ocount = 1;
                var objDetails = '';
                var FormField;
                var _priority = { H: 'Hight', M: 'Medium', L: 'Low' };
                //console.log(_priority);

                $.each(dtl, function (i, jitem) {

                    objDetails +=
                        '<div class="objectivebox objectiveboxapproval">' +
                        '<b>Objective No : ' + ocount + '</b>';

                    FormField = formEditor.filter(function (field) { return field.DBValueField == 'ObjectiveTitle' && field.IsRequired == true });
                    if (FormField.length > 0) {
                        objDetails += '<div onClick="toggleDesc(' + jitem.ObjectiveID + ');" class="pull-right toggleDesc"><i id="icon' + jitem.ObjectiveID + '" class="fa fa-chevron-down fa-chevron-up" aria-hidden="true"></i></div>' +
                            '<div>' + FormField[0]['FieldTitle'] + '</div>' +
                            '<p id="p' + jitem.ObjectiveID + '">' +
                            jitem.ObjectiveTitle +
                            '<p>';
                    }

                    objDetails += '<ul class="list-group clist" id="ul' + jitem.ObjectiveID + '">';

                    FormField = formEditor.filter(function (field) { return field.DBValueField == 'StartDate' && field.IsRequired == true });
                    if (FormField.length > 0) {
                        objDetails += '<li class="list-group-item">' + FormField[0]['FieldTitle'] + ' <span class="badge">' + getDateWithMonthName(getDateByASPNETTimeStamp(jitem.StartDate)) + '</span></li>';
                    }

                    FormField = formEditor.filter(function (field) { return field.DBValueField == 'TargetDate' && field.IsRequired == true });
                    if (FormField.length > 0) {
                        objDetails += '<li class="list-group-item">' + FormField[0]['FieldTitle'] + ' <span class="badge">' + getDateWithMonthName(getDateByASPNETTimeStamp(jitem.TargetDate)) + '</span></li>';
                    }

                    FormField = formEditor.filter(function (field) { return field.DBValueField == 'Weightage' && field.IsRequired == true });
                    if (FormField.length > 0) {
                        objDetails += '<li class="list-group-item">' + FormField[0]['FieldTitle'] + ' <span class="badge">' + jitem.Weightage + ' </span></li>';
                    }

                    FormField = formEditor.filter(function (field) { return field.DBValueField == 'Priority' && field.IsRequired == true });
                    if (FormField.length > 0) {
                        objDetails += '<li class="list-group-item">' + FormField[0]['FieldTitle'] + ' <span class="badge">' + _priority[jitem.Priority.toUpperCase()] + '</span></li>';
                    }

                    if (typeof jitem.QuestionGroupTitle != 'undefined') {
                        FormField = formEditor.filter(function (field) { return field.DBValueField == 'QuestionGroupID' && field.IsRequired == true });
                        if (FormField.length > 0) {
                            objDetails += '<li class="list-group-item">' + FormField[0]['FieldTitle'] + ' <div class=""><p>' + jitem.QuestionGroupTitle + '</p></div></li>';
                        }
                    }

                    FormField = formEditor.filter(function (field) { return field.DBValueField == 'ObjectiveDetail' && field.IsRequired == true });
                    if (FormField.length > 0) {
                        objDetails += '<li class="list-group-item">' + FormField[0]['FieldTitle'] + ' <div class=""><p>' + jitem.ObjectiveDetail + '</p></div></li>';
                    }

                    FormField = formEditor.filter(function (field) { return field.DBValueField == 'ActionPlan' && field.IsRequired == true });
                    if (FormField.length > 0) {
                        objDetails += '<li class="list-group-item">' + FormField[0]['FieldTitle'] + ' <div class=""><p>' + jitem.ActionPlan + '</p></div></li>';
                    }

                    FormField = formEditor.filter(function (field) { return field.DBValueField == 'PerformanceIndicators' && field.IsRequired == true });
                    if (FormField.length > 0) {
                        objDetails += '<li class="list-group-item">' + FormField[0]['FieldTitle'] + ' <div class=""><p>' + jitem.PerformanceIndicators + '</p></div></li>';

                    }


                    objDetails += '</ul>';
                    objDetails += '</div>';
                    ocount++;
                });



                var _approved = "'Approved'";
                var _reject = "'Reject'";
                var _return = "'Return'";

                template +=
                    '<div class="panel panelshadow">' +
                    '<div class="panel-body" id="pnl' + item.RequestID + '">' +
                    '<span id="surveyTitle" class="surveytitle"> <small> <i class="fa fa-user"> </i> </small><span onclick="gotoDetail(' + item.EmployeeID + ',\'' + sourcepage + '\');">' + item.EmployeeRefNo + ' | ' + item.EmployeeName + '</span><i onclick="toggleView(' + item.RequestID + ')" class="fa fa-chevron-down pull-right"></i></span>' +
                    '<div id="view' + item.RequestID + '">' +
                    '<div class="row">' +
                    '<div class="surveyinfo">' +
                    '<div class="col-xs-4"><span class="surveylbl">Status</span></div>' +
                    '<div class="col-xs-8"><span id="fromDate" class="surveytxt">' + item.Status + '</span></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="surveyinfo">' +
                    '<div class="col-xs-4"><span class="surveylbl">Req. Date</span></div>' +
                    '<div class="col-xs-8"><span id="toDate" class="surveytxt">' + getFormattedDateNew(item.RequestDate) + '</span></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="surveyinfo">' +
                    '<div class="col-xs-4"><span class="surveylbl">Req. ID</span></div>' +
                    '<div class="col-xs-8"><span id="toDate" class="surveytxt">' + item.RequestRefNo + '</span></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="surveyinfo">' +
                    '<div class="col-xs-4"><span class="surveylbl">Department</span></div>' +
                    '<div class="col-xs-8"><span id="toDate" class="surveytxt">' + item.DepartmentTitle + '</span></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="surveyinfo">' +
                    '<div class="col-xs-4"><span class="surveylbl">Designation</span></div>' +
                    '<div class="col-xs-8"><span id="toDate" class="surveytxt">' + item.DesignationTitle + '</span></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="surveyinfo">' +
                    '<div class="col-xs-4"><span class="surveylbl">Review Type</span></div>' +
                    '<div class="col-xs-8"><span id="toDate" class="surveytxt">' + item.ReviewTypeTitle + '</span></div>' +
                    '</div>' +
                    '</div>' +
                    '<hr>' +
                    '<div class="row" id="objDetails">' +
                    '' + objDetails + '' +
                    '</div>' +

                    '<hr>' +
                    '<div class="row">' +
                    '<div class="surveyinfo">' +
                    '<div class="col-xs-12">' +
                    '<textarea id="txt' + item.RequestID + '" class="form-control" rows="4"></textarea>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="col-xs-4">' +
                    '<button id="btnApp" onClick="Save(' + _approved + ',this.id,' + item.RequestID + ',' + item.RequestRefNo + ',' + item.ProcessID + ',' + item.TaskID + ',' + item.WorkFlowGroupID + ')" class="btn btn-success btn-block suverybtn btn-sm">Approve</button>' +
                    '</div>' +
                    '<div class="col-xs-4">' +
                    '<button id="btnRej" onClick="Save(' + _reject + ',this.id,' + item.RequestID + ',' + item.RequestRefNo + ',' + item.ProcessID + ',' + item.TaskID + ',' + item.WorkFlowGroupID + ')" class="btn btn-danger btn-block suverybtn btn-sm">Reject</button>' +
                    '</div>' +
                    '<div class="col-xs-4">' +
                    '<button id="btnRet" onClick="Save(' + _return + ',this.id,' + item.RequestID + ',' + item.RequestRefNo + ',' + item.ProcessID + ',' + item.TaskID + ',' + item.WorkFlowGroupID + ')" class="btn btn-default btn-block suverybtn btn-sm">Return</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +

                    '</div>' +
                    '</div>'
                    ;



            });
        } else {
            template = 'No Approvals Found!';
        }

        objList.html(template);

    });
}

function Save(pStatus, btnid, id, pRefNo, pProcessID, pTaskID, pWorkFlowGroupID) {

    var btnText = '';
    btnid === 'btnApp' ? btnText = 'Approving ...' : 'Approve' && DisableButton($('#btnApp'), 'Approve');
    btnid === 'btnRej' ? btnText = 'Rejecting ...' : 'Reject' && DisableButton($('#btnRej'), 'Reject');
    btnid === 'btnRet' ? btnText = 'Returning ...' : 'Return' && DisableButton($('#btnRet'), 'Return');

    DisableButton($('#' + btnid), btnText);
    //  DisableButton($('#btnApp'),btnText);
    // DisableButton($('#btnRej'),btnText);
    // DisableButton($('#btnRet'),btnText);


    var RequestID = id;
    var RefNo = pRefNo;
    var ProcessID = pProcessID;
    var TaskID = pTaskID;
    var WorkFlowGroupID = pWorkFlowGroupID;
    var Status = pStatus;
    var rid = 'txt' + RequestID;
    var Remakrs = $('#' + rid).val();
    //console.log(rid + Remakrs);


    var params = {
        pRequestID: RequestID,
        pRefNo: RefNo,
        pProcessID: ProcessID,
        pTaskID: TaskID,
        pWorkFlowGroupID: WorkFlowGroupID,
        pRemakrs: '',//Remakrs,
        pApprovalStatus: Status
    }

    postRequest('SaveObjectiveApproval', params, function (res) {
        var data = JSON.parse(res.d);
        var result = data.result;
        var msg = data.msg;

        if (result === 'fail') {
            toastr.error(msg);
        } else if (result === 'success') {
            toastr.success(msg);
            GetObjectiveApprovalList();
        }

    });




}





function toggleView(id) {

    //var pnl = $('#pnl' + id);
    var pnl2 = $('#view' + id);
    //pnl.slideToggle();
    pnl2.slideToggle();


}


function toggleDesc(id) {
    $('#p' + id).slideToggle();
    $('#ul' + id).slideToggle();
    $('#icon' + id).toggleClass('fa-chevron-down');
}

function gotoDetail(pEmpID, sourcePage) {
    if (isAdmin === '1') {
        window.location.href = 'ViewProfileCompany.html?eid=' + pEmpID + '&source=' + sourcePage + '';
    }
}