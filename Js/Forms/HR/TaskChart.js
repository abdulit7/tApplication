
var url = document.getElementById('ctl00_ContentPlaceHolder1_hidWSPath').value;
var CompanyId = document.getElementById('ctl00_ContentPlaceHolder1_hidCompanyID').value;
var CompanyIDEnc = document.getElementById('ctl00_ContentPlaceHolder1_hidCompanyIDEnc').value;
var EmployeeId = document.getElementById('ctl00_ContentPlaceHolder1_hidEmployeeid').value;
var _EmployeeId1 = document.getElementById('ctl00_ContentPlaceHolder1_hidEmployeeid1').value;
var xmlfilename = './ftpupload/' + document.getElementById('ctl00_ContentPlaceHolder1_hidxmlfilename').value;
var isChartViewEnableOnTaskChart = document.getElementById('ctl00_ContentPlaceHolder1_hidisChartViewEnableOnTaskChart').value;

var _projectID = 0;
var _customerID = 0;
var _employeeID = 0;
var _taskStatusID = 0;
var _taskTypeID = 0;
var _fromDate = '';
var _toDate = '';
var _pHelpDesk = '';
var _ItemCategoryID = 0;
var _ItemGroupID = 0;
var _ItemID = 0;

_projectID = jQuery('#ctl00_ContentPlaceHolder1_ddlProject');
_customerID = jQuery('#ctl00_ContentPlaceHolder1_ddlCustomer');
_employeeID = jQuery('#ctl00_ContentPlaceHolder1_ddlEmployee');
_taskStatusID = jQuery('#ctl00_ContentPlaceHolder1_ddlStatus');
_taskTypeID = jQuery('#ctl00_ContentPlaceHolder1_ddlTaskType');
_fromDate = jQuery('#ctl00_ContentPlaceHolder1_txtStartDate');
_toDate = jQuery('#ctl00_ContentPlaceHolder1_txtEndDate');
_pHelpDesk = jQuery('#ctl00_ContentPlaceHolder1_ddlHelpDesk');
_ItemCategoryID = jQuery('#ctl00_ContentPlaceHolder1_ddlCategoryID');
_ItemGroupID = jQuery('#ctl00_ContentPlaceHolder1_ddlGroupID');
_ItemID = jQuery('#ctl00_ContentPlaceHolder1_ddlItemID');

jQuery(function () {

    jQuery.curCSS = function (element, prop, val) {
        return jQuery(element).css(prop, val);
    };

    //jQuery('#datepickertxtFromDate').val(sysdate);
    jQuery('#datepickertxtFromDate,#datepickertxtToDate').datetimepicker({
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
    })

    jQuery('#btnShow').click(function (e) {
        localStorage.setItem("Type", "btn");
        getBoardView();
    });


    jQuery('#ctl00_ContentPlaceHolder1_ddlTaskType').change(function (e) {
        fillStatus(jQuery(this).val());
    });

    jQuery('.input-group-btn button').click(function (e) {
        var type = jQuery(this).attr('data-type');
        jQuery('#ctl00_ContentPlaceHolder1_' + type).val(0).trigger('change');
    });


    jQuery('.btnToggleView').click(function (e) {
        var view = jQuery(this).attr('data-view');

        if (!jQuery(this).hasClass('btn-primary')) {

            jQuery('.btnToggleView').removeClass('btn-primary');
            jQuery('.btnToggleView').addClass('btn-default');
            jQuery(this).addClass('btn-primary');
            toogleViewVisibility(view);
        }
        localStorage.setItem('lastview', view);
    });

    localStorage.setItem("Type", "load");
    getBoardView();
    //reinit();
});

function toogleViewVisibility(view) {

    jQuery('.btnToggleView').removeClass('btn-primary');
    jQuery('.btnToggleView').addClass('btn-default');

    if (view == 'chartview') {
        jQuery('.btnToggleChart').addClass('btn-primary');
        jQuery('#' + view).fadeIn();
        jQuery('#boardview').slideUp();
        jQuery('#CurrentViewTitle').html(getIcon('chevron-right') + ' Chart View');
        reInitGantt();
        jQuery('.gantt_container').css('height', '100vh');
    } else {
        jQuery('.btnToggleBoard').addClass('btn-primary');
        jQuery('#' + view).slideDown();
        jQuery('#chartview').fadeOut();
        jQuery('#CurrentViewTitle').html(getIcon('chevron-right') + ' Board View');
    }
}


function fillStatus(id) {
    var status = window.taskTypeStatus;
    var statusAll = window.taskTypeStatusAll;

    status = status.filter(function (item) { return item.TaskTypeID == id; });

    if (status.length == 0) {
        status = statusAll;
    }

    var temp = '<option value="0">All</option><option value="-100">All Pending</option><option value="-200">All Close</option>';
    if (status.length > 0) {
        jQuery.each(status, function (i, item) {
            temp += '<option value="' + item.TaskStatusID + '">' + item.TaskStatusTitle + '</option>';
        });
        jQuery('#ctl00_ContentPlaceHolder1_ddlStatus').html(temp);
    }

}

function getBoardView() {
    //jQuery('#chartview').hide();
    //jQuery('#boardview').hide();
    if (localStorage.getItem("LocalTaskType") == null) {
        localStorage.setItem("LocalTaskType", _taskTypeID.val());
    }
    else if (localStorage.getItem("Type") == "btn") {
        localStorage.setItem("LocalTaskType", _taskTypeID.val());
    }
    if (localStorage.getItem("LocalTaskStatus") == null) {
        localStorage.setItem("LocalTaskStatus", _taskStatusID.val());
    }
    else if (localStorage.getItem("Type") == "btn") {
        localStorage.setItem("LocalTaskStatus", _taskStatusID.val());
    }
    if (localStorage.getItem("LocalStartDate") == null) {
        localStorage.setItem("LocalStartDate", _fromDate.val());
    }
    else if (localStorage.getItem("Type") == "btn") {
        localStorage.setItem("LocalStartDate", _fromDate.val());
    }

    var para = {
        pEmployeeID: _EmployeeId1,
        pProjectIDs: _projectID.val() != null ? _projectID.val() : 0,
        pCustomerIDs: _customerID.val() != null ? _customerID.val() : 0,
        pEmployeeIDs: _employeeID.val() != null ? _employeeID.val() : 0,
        pStatusIDs: _taskStatusID.val(),
        pTaskTypeIDs: _taskTypeID.val(),
        pFromDate: _fromDate.val(),
        pToDate: _toDate.val(),
        pCompanyID: CompanyId,
        pOperation: "all",
        pHelpDesk: _pHelpDesk.val() != null ? _pHelpDesk.val() : 'All',
        pItemCategoryIDs: _ItemCategoryID.val() != null ? _ItemCategoryID.val() : 0,
        pItemGroupIDs: _ItemGroupID.val() != null ? _ItemGroupID.val() : 0,
        pItemIDs: _ItemID.val() != null ? _ItemID.val() : 0
    }
    para = JSON.stringify(para);
    var placeholder = jQuery('#boardContent');
    placeholder.html(progress('Loading '));
    jQuery('#gantt_here').html(progress('Loading '));
    postRequest('TaskChart.aspx/GetTaskChartBoard', para, function (r) {
        r = JSON.parse(r.d);

        var template = '';

        //var status = r['result'];
        //r = r['msg'];
        //console.log(r);



        var taskStatus = r['TaskStatus'];
        var taskAssignemnt = r['TaskAssignment'];
        var _chart = r['Chart'];
        var taskTypeStatus = r['TaskTypeStatus']
        if (window.taskTypeStatus == null) {
            window.taskTypeStatus = taskTypeStatus;
        }
        if (window.taskTypeStatusAll == null) {
            window.taskTypeStatusAll = taskStatus;
        }
        //var tdWidth = 100 / taskStatus.length;

        jQuery.each(taskStatus, function (i, item) {

            var assignments = taskAssignemnt.filter(function (value) { return value.TaskStatusID == item.TaskStatusID })

            //template += '<td style="width:' + tdWidth + '%;">' +
            //                        '<div class="taskstatustilte">' + item.TaskStatusTitle + '</div>' +
            //                        '<ul id="' + item.TaskStatusID + '" class="listSortable">';

            // template += '<div class="listSortable">';

            template += '<div class="col-sm-2">';
            if (item.FType.toLowerCase() == 'pro') {
                template += '<div class="tasktitle" style="background-color:' + item.Color + ';"> ' + item.TaskStatusTitle + '<span class="pull-right label label-primary" id="boardcount' + item.TaskStatusID + '" >' + assignments.length + '</span></div>';
            }
            else {
                template += '<div class="tasktitle" style="background-color:' + item.Color + ';"><span class="btnAddNew" data-taskstatusid="' + item.TaskStatusID + '" ><i class="fa fa-plus"></i></span> ' + item.TaskStatusTitle + '<span class="pull-right label label-primary" id="boardcount' + item.TaskStatusID + '" >' + assignments.length + '</span></div>';
            }
            template += '<div id="' + item.TaskStatusID + '" class="listSortable">'

            jQuery.each(assignments, function (j, jitem) {
                //template += '<li class="itemSort2 boxdrag" id="' + jitem.TranID + '">' +
                //    '<span class="tasktitle">' + jitem.TaskSummary + '<small><a style="cursor: pointer;" onclick="callTaskDetailPopup(' + jitem.TranID + ',' + jitem.TaskStatusID + ',\'TaskDetailPopup.aspx\')">Detail</a></small>' + '</span>' +

                //  '<div class="taskextra" dragable="false">' +
                //    '<span classs="">' + getIcon('flag') + jitem.TaskPriorityTitle + '</span>' +
                //    //'<span class="">' + getIcon('tag') + jitem.TaskTypeTitle + '</span>' +
                //   '<span class="">' + getIcon('clock') + '20-APR-2020</span>' +                   
                //   '</div>' +
                //    '</li>';
                var color = "", complain = "", complainhide = "";
                if (jitem.TaskPriorityTitle.toLowerCase() == "high") {
                    color = "background-color : red"
                }
                else if (jitem.TaskPriorityTitle.toLowerCase() == "medium") {
                    color = "background-color :#f2cb1b"
                }
                else if (jitem.TaskPriorityTitle.toLowerCase() == "low") {
                    color = "background-color :#3dbd0f"
                }
                else {
                    color = "background-color : grey"
                }
                if (jitem.ComplainRefNo != "") {
                    complain = "<p class=clsPriority style=background-color:#4e363626;Color:black;float:right;width:80px;>HD : " + jitem.ComplainRefNo + "</p>"
                }
                if (jitem.HideEmployeeAndBranchFromTaskChart.toLowerCase() == "true") {
                    complainhide = '<span title="' + jitem.AssignBy + '">' + getIcon('user') + 'Assign By: ' + jitem.AssignBy + '</span>' +
                        '<span title="' + jitem.CustomerTitle + '">' + getIcon('user-ninja') + 'Customer: ' + jitem.CustomerTitle + '</span>'
                }
                else {
                    if (jitem.ComplainRefNo != "") {
                        complainhide = '<span title="' + jitem.OwnerName + '">' + getIcon('user') + 'Employee Name : ' + jitem.OwnerName + '</span>' +
                            '<span title="' + jitem.OwnerBranch + '">' + getIcon('code-branch') + 'Branch : ' + jitem.OwnerBranch + '</span>'
                    }
                }

                //Update By Muhammad Dilshad

                if (item.FType.toLowerCase() == 'pro') {
                    template += '<div style=" border-top: 4px inset ' + item.Color + ';font-size:10px;overflow-x: auto;" id="' + jitem.TranID + '" class="sortbox"><div><p class="clsPriority" style="float:left;' + color + ';">' + jitem.TaskPriorityTitle + '</p>' + complain + '</div><h5 style="font-size: 12px;text-align:center;font-weight: bold;margin:3px 0px;padding-top:15px;"><button type="button" class="btn btnHead" data-toggle="collapse"  data-target="#a' + jitem.TranID + '">' + jitem.TaskSummary + '<br>' + jitem.WONo + '</button></h5>' +
                        '<div class="taskextra collapse" id="a' + jitem.TranID + '" style=" font-size: 12px;font-weight: 200;" dragable="false">' +
                        '<span title="' + jitem.EmployeeName + '">' + getIcon('user') + 'Assign To : ' + jitem.EmployeeName + '</span>' + complainhide +
                        '<span >' + getIcon('calendar') + 'Start Date : ' + getFormattedDateNew(jitem.StartDate) + '</span>' +
                        '<span >' + getIcon('calendar') + 'End Date : ' + getFormattedDateNew(jitem.EndDate) + '</span>' +
                        '<span >' + getIcon('clone') + 'W.O : ' + jitem.WONo + '</span>' +
                        '<span >' + getIcon('list-alt') + 'Product : ' + jitem.ItemTitle + '</span>' +
                        '<span >' + getIcon('list-alt') + 'Category : ' + jitem.CategoryTitle + '</span>' +
                        '<span >' + getIcon('ticket') + 'Batch No : ' + jitem.BatchID + '</span>' +
                        '<span >' + getIcon('ticket') + 'Batch Qty : ' + jitem.MainPOQuantity + '</span>' +
                        '<span >' + getIcon('ticket') + 'Produced Qty : ' + jitem.MainQuantity + '</span>' +
                        '<span >' + getIcon('ticket') + 'Already Prod. Qty : ' + jitem.AlreadyProducedQuantity + '</span>' +
                        '</div>';
                    if (item.ActionName == 'SampleQCAndTime') {
                        template += '<div class="rowmore">' +
                            '<i title="view" class="fa fa-eye btnView btnTaskEdit" data-mode="view" data-taskstatusid="' + jitem.TaskStatusID + '" data-taskassignmentid_="' + jitem._id + '" data-taskassignmentid="' + jitem.TranID + '" data-refno="' + jitem.ReferenceNo + '"></i>' +
                            '<i title="Add Time Entry" class="fa fa-plus-square btnTaskTransactionPRO" data-mode="Time Entry" data-qcresultid_="' + jitem._QCRequestID + '" data-nextaction="' + item.NextAction + '" data-taskassignmentid_="' + jitem._id + '" data-taskassignmentid="' + jitem.TranID + '" data-woid="' + jitem.WOID + '" data-itemid="' + jitem.ItemID + '" data-refno="' + jitem.ReferenceNo + '"></i>' +
                            '<i title="QC Result" class="fa fa-plus-square btnQCResult" data-mode="QC Result"  data-qcresultid_="' + jitem._QCRequestID + '"  data-qcresultid="' + jitem._QCRequestID + '" data-qcresultitemid="' + jitem._ItemID + '" ></i>' +
                            '<i title="Sampling Request" class="fa fa-plus-square btnSamplingRequest" data-mode="Sampling Request" data-ProducedQty_="' + jitem.MainQuantity + '" data-samplingrequestid_="' + jitem._QCRequestID + '" data-samplingrequestid="' + jitem._QCRequestID + '" data-SamplingRequestItemID="' + jitem._ItemID + '" data-woid="' + jitem.WOID + '" ></i>' +
                            '</div>' +
                            '</div>';
                    }
                    else if (item.ActionName == 'QCResultWithTimeEntry') {
                        template += '<div class="rowmore">' +
                            '<i title="view" class="fa fa-eye btnView btnTaskEdit" data-mode="view" data-taskstatusid="' + jitem.TaskStatusID + '" data-taskassignmentid_="' + jitem._id + '" data-taskassignmentid="' + jitem.TranID + '" data-nextaction="' + item.NextAction + '" data-refno="' + jitem.ReferenceNo + '"></i>' +
                            '<i title="QCResult With Time Entry" class="fa fa-plus-square QCResultWithTimeEntry" data-mode="QCResult With Time Entry" data-taskassignmentid_="' + jitem._id + '" data-taskassignmentid="' + jitem.TranID + '" data-WOID="' + jitem.WOID + '" data-WOItemID="' + jitem._ItemID + '" data-nextaction="' + item.NextAction + '"></i>' +
                            '</div>' +
                            '</div>';
                    }
                    else if (item.ActionName == 'NoAction') {
                        template += '<div class="rowmore">' +
                            '<i title="view" class="fa fa-eye btnView btnTaskEdit" data-mode="view" data-taskstatusid="' + jitem.TaskStatusID + '" data-taskassignmentid_="' + jitem._id + '" data-taskassignmentid="' + jitem.TranID + '" data-refno="' + jitem.ReferenceNo + '"></i>' +
                            '</div>' +
                            '</div>';
                    }
                    else {
                        template += '<div class="rowmore">' +
                            '<i title="view" class="fa fa-eye btnView btnTaskEdit" data-mode="view" data-taskstatusid="' + jitem.TaskStatusID + '" data-taskassignmentid_="' + jitem._id + '" data-taskassignmentid="' + jitem.TranID + '" data-refno="' + jitem.ReferenceNo + '"></i>' +
                            '<i title="Add Time Entry" class="fa fa-plus-square btnTaskTransactionPRO" data-mode="Time Entry" data-nextaction="' + item.NextAction + '" data-taskassignmentid_="' + jitem._id + '" data-taskassignmentid="' + jitem.TranID + '" data-woid="' + jitem.WOID + '" data-itemid="' + jitem.ItemID + '" data-refno="' + jitem.ReferenceNo + '"></i>' +
                            '</div>' +
                            '</div>';
                    }
                }
                else {
                    template += '<div style=" border-top: 4px inset ' + item.Color + ';font-size:10px;overflow-x: auto;" id="' + jitem.TranID + '" class="sortbox"><div><p class="clsPriority" style="float:left;' + color + ';">' + jitem.TaskPriorityTitle + '</p>' + complain + '</div><h5 style="font-size: 12px;text-align:center;font-weight: bold;margin:3px 0px;padding-top:15px;"><button type="button" class="btn btnHead" data-toggle="collapse"  data-target="#a' + jitem.TranID + '">' + jitem.TaskSummary + '</button></h5>' +
                        '<div class="taskextra collapse" id="a' + jitem.TranID + '" style=" font-size: 12px;font-weight: 200;" dragable="false">' +
                        '<span title="' + jitem.ReferenceNo + '">' + getIcon('key') + 'Task ID : ' + jitem.ReferenceNo + '</span>' +
                        '<span title="' + jitem.EmployeeName + '">' + getIcon('user') + 'Assign To : ' + jitem.EmployeeName + '</span>' +
                        complainhide +
                        '<span >' + getIcon('calendar') + 'Start Date : ' + getFormattedDateNew(jitem.StartDate) + '</span>' +
                        '<span >' + getIcon('calendar') + 'End Date : ' + getFormattedDateNew(jitem.EndDate) + '</span>' +
                        '</div>' +
                        '<div class="rowmore">' +
                        '<i title="view" class="fa fa-eye btnView btnTaskEdit" data-mode="view" data-taskstatusid="' + jitem.TaskStatusID + '" data-taskassignmentid_="' + jitem._id + '" data-taskassignmentid="' + jitem.TranID + '" data-refno="' + jitem.ReferenceNo + '"></i>' +
                        '<i title="edit" class="fa fa-edit btnEditTask btnTaskEdit" data-mode="edit" data-taskassignmentid_="' + jitem._id + '" data-taskassignmentid="' + jitem.TranID + '" data-refno="' + jitem.ReferenceNo + '"></i>' +
                        '<i title="Add Time Entry" class="fa fa-plus-square btnTaskTransaction" data-mode="Time Entry" data-taskassignmentid_="' + jitem._id + '" data-taskassignmentid="' + jitem.TranID + '" data-refno="' + jitem.ReferenceNo + '"></i>' +
                        '<i title="copy" class="fa fa-clone btnCopy btnTaskEdit" data-mode="copy" data-taskstatusid="' + jitem.TaskStatusID + '" data-taskassignmentid_="' + jitem._id + '" data-taskassignmentid="' + jitem.TranID + '" data-refno="' + jitem.ReferenceNo + '"></i>' +
                        '<i title="delete" class="fa fa-trash btnDelete_ btnTaskEdit" data-mode="delete" data-taskstatusid="' + jitem.TaskStatusID + '" data-taskassignmentid_="' + jitem._id + '" data-taskassignmentid="' + jitem.TranID + '" data-refno="' + jitem.ReferenceNo + '"></i>' +
                        '</div>' +
                        '</div>';
                }
            });

            //template += "</ul>"
            // template += "</td>"
            //template += "</td>"
            template += '</div>';
            template += '</div>';
        });

        //template += '<div class="col-md-12">' + template + '</div>';
        //template = "<table class='table'><tr>" + template + "</tr></table>";
        //template = '<div class="column"></div>'
        //alert(template);
        placeholder.html(template);
        initDrag();
        if (gantt.$container == null) {
            initGantt();
        } else {
            reInitGantt();
        }

        var lastView = localStorage.getItem('lastview');
        if (lastView != null) { toogleViewVisibility(lastView); }
        //jQuery('#chartview').show();
        //jQuery('#boardview').show();

        //var data =  { data : _chart};

        //console.log(data);
        ////if (anew == true) {
        //gantt.init("gantt_here");
        //gantt.clearAll();
        ////}
        //anew = false;

        //// gantt.load(_chart);
        //gantt.parse(data);

    });
}

function initDrag() {
    var condition;

    jQuery('.btnAddNew').click(function (e) {
        var _taskStatusId = jQuery(this).attr('data-taskstatusid');
        var _taskTypeId = jQuery('#' + getClientID('ddlTaskType')).val();
        var _url = 'HR/TaskAssignment.aspx?statusid=' + _taskStatusId + '&tasktypeid=' + _taskTypeId + "&isfrombaord=1";
        //ViewModal(_url,1200,500);
        openListWindow(_url, _taskStatusId + " Task Assignment");

    });

    jQuery('.btnTaskEdit').click(function (e) {
        var _taskassignmentidenc = jQuery(this).attr('data-taskassignmentid_');
        var _taskassignmentid = jQuery(this).attr('data-taskassignmentid');
        var _taskStatusID = jQuery(this).attr('data-taskstatusid');

        var _mode = jQuery(this).attr('data-mode');
        var _refno = jQuery(this).attr('data-refno');
        var strLinkEditTitle = _refno + " Task Assignment";
        strLinkEdit = 'HR/TaskAssignment.aspx?ID=' + _taskassignmentidenc + '&isfrombaord=1&emID=' + EmployeeId + '&cID=' + CompanyIDEnc;
        if (_mode == 'edit') {
            strLinkEdit = "" + strLinkEdit
            //ViewModal(strLinkEdit + "",1200,500);
            openListWindow(strLinkEdit, strLinkEditTitle);
        }
        else if (_mode == 'copy') {
            // ViewModal(strLinkEdit + "&mode=copy&statusid="+_taskStatusID,1200,500);
            openListWindow(strLinkEdit + "&mode=copy&statusid=" + _taskStatusID, strLinkEditTitle + "_Copy");

        }
        else if (_mode == 'view') {
            strLinkEdit = '../ViewGeneralList.aspx?type=viewassignmentdetail&aid=' + _taskassignmentidenc;
            ViewModal(strLinkEdit + "", 1200, 500);
        }
        else if (_mode == 'delete') {
            if (confirm('Are you sure to delete this assignment ?')) {
                var para = {
                    pEmployeeID: _EmployeeId1,
                    pTranID: _taskassignmentid,
                    pCompanyID: CompanyId
                }
                para = JSON.stringify(para);
                postRequest('TaskChart.aspx/DeleteTaskAssignment', para, function (r) {
                    var msg = r.d;
                    if (msg == 'Data Deleted Successfully!') {
                        toastr.success(msg);
                        getBoardView();
                    } else {
                        toastr.error(msg);
                    }
                });
            }
        }


    });

    //Add By Muhammad Dilshad  (12/3/2021)
    jQuery('.btnTaskTransaction').click(function (e) {

        var _taskassignmentidenc = jQuery(this).attr('data-taskassignmentid_');
        var _taskassignmentid = jQuery(this).attr('data-taskassignmentid');
        var _taskStatusID = jQuery(this).attr('data-taskstatusid');

        var _mode = jQuery(this).attr('data-mode');
        var _refno = jQuery(this).attr('data-refno');
        var strLinkEditTitle = _refno + " Task Transaction";
        strLinkEdit = 'HR/TaskTransactionsEntry.aspx?TaskID=' + _taskassignmentidenc;
        openListWindow(strLinkEdit, strLinkEditTitle);
    });

    jQuery('.btnTaskTransactionPRO').click(function (e) {

        var _taskassignmentidenc = jQuery(this).attr('data-taskassignmentid_');
        var _taskassignmentid = jQuery(this).attr('data-taskassignmentid');
        var _WOID = jQuery(this).attr('data-woid');
        var _itemid = jQuery(this).attr('data-itemid');
        var _nextaction = jQuery(this).attr('data-nextaction');
        var SamplingRequestID = jQuery(this).attr('data-qcresultid_');

        $.ajax({
            type: "POST",
            url: "TaskChart.aspx/ValidateTaskEntry",
            data: "{pTranID:'" + SamplingRequestID + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (String(response.d).includes("true") == true) {
                    toastr.error("QC Result is pending.");
                }
                else {
                    var _refno = jQuery(this).attr('data-refno');
                    var strLinkEditTitle = _WOID + "_" + _taskassignmentid + " Task Transaction";
                    strLinkEdit = 'HR/TaskTransactionsEntry.aspx?TaskID=' + _taskassignmentidenc + '&WOID=' + _WOID + '&ItemID=' + _itemid + '&NextAction=' + _nextaction;
                    //console.log(strLinkEditTitle);
                    //console.log(strLinkEdit);
                    openListWindow(strLinkEdit, strLinkEditTitle);
                }
            },
            error: function (msg) {
                toastr.error('Error! Something went wrong.');
            }
        });
    });


    //Add By Muhammad Dilshad  (12/3/2021)
    jQuery('.btnQCResult').click(function (e) {
        var SamplingRequestID = jQuery(this).attr('data-qcresultid_');
        var SamplingRequestItemID = jQuery(this).attr('data-qcresultitemid');

        $.ajax({
            type: "POST",
            url: "TaskChart.aspx/ValidateResult",
            data: "{pTranID:'" + SamplingRequestID
                + "',pItemID:'" + SamplingRequestItemID + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (String(response.d).includes("true") == true) {
                    toastr.error("Sample Item has not issued yet");
                }
                else {
                    var strLinkEditTitle = "QC Result";
                    strLinkEdit = 'BT_QC/QCResult.aspx?FType=A&ItemID=' + SamplingRequestItemID + '&ID=' + SamplingRequestID;
                    console.log(strLinkEdit);
                    openListWindow(strLinkEdit, strLinkEditTitle);
                }
            },
            error: function (msg) {
                toastr.error('Error! Something went wrong.');
            }
        });
    });

    jQuery('.QCResultWithTimeEntry').click(function (e) {
        var WOID = jQuery(this).attr('data-WOID');
        var WOItemID = jQuery(this).attr('data-WOItemID');
        var _taskassignmentidenc = jQuery(this).attr('data-taskassignmentid_');
        var _taskassignmentid = jQuery(this).attr('data-taskassignmentid');
        var _nextaction = jQuery(this).attr('data-nextaction');
        
        strLinkEdit = 'BT_QC/QCResult.aspx?FType=A&FormType=QCResultWithTimeEntry&TaskID=' + _taskassignmentidenc + '&WOID=' + WOID + '&ItemID=' + WOItemID + '&NextAction=' + _nextaction;
        var strLinkEditTitle = "QCResult With Time Entry " + WOID + "_" + _taskassignmentid;
        openListWindow(strLinkEdit, strLinkEditTitle);
    });

    jQuery('.btnSamplingRequest').click(function (e) {
        var SamplingRequestID = jQuery(this).attr('data-samplingrequestid_');
        var SamplingRequestItemID = jQuery(this).attr('data-samplingrequestitemid');

        var SamplingRequestID = jQuery(this).attr('data-samplingrequestid_');
        var SamplingRequestItemID = jQuery(this).attr('data-samplingrequestitemid');
        var ProducedQty = jQuery(this).attr('data-ProducedQty_');
        var _WOID = jQuery(this).attr('data-woid');

        //console.log(SamplingRequestID);
        //console.log(SamplingRequestItemID);
        console.log('_WOID', _WOID);
        var strLinkEditTitle = "Sampling Request";
        strLinkEdit = 'BT_Inventory/IssueRequisition.aspx?FType=QCR&ItemID=' + SamplingRequestItemID + '&QCID=' + SamplingRequestID + '&ptitle=Sampling Request&ProducedQty=' + ProducedQty + '&WOID=' + _WOID; //&rID=xav4hefroeGacgsystem&uID=xav4hefroeGacgsystem&cID=M40FsPplus6CcIsystem&emID=fffBWCcscVUsystem'
        console.log(strLinkEdit);
        openListWindow(strLinkEdit, strLinkEditTitle);
    });

    jQuery(".listSortable").draggable("disable");


    jQuery(".listSortable").sortable({
        connectWith: ".listSortable",
        // handle : 'boxdrag',
        receive: function (event, ui) {
            console.log({ event, ui });
            $('#msg').html('Updating List...');
            $.ajax({
                type: "POST",
                url: "../TMSUploadData.asmx/UpdateTaskStatus",
                data: "{pWhereTaskId:'" + $(ui.item).attr('id')
                    + "',pStatus: '" + $(event.target).attr('id')
                    + "',pcompanyID:'" + CompanyId + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    //$('#msg').html(response.d);
                    if (response.d == 'Task Status Update!') {
                        var _statusID = $(event.target).attr('id');
                        var _senderStatusID = $(ui.sender).attr('id');

                        var _senderBaord = jQuery('#boardcount' + _senderStatusID);
                        var _boardCount = jQuery('#boardcount' + _statusID);

                        var _currentBoardCount = _boardCount.html();
                        var _currentSenderBoardCount = _senderBaord.html();

                        _boardCount.html(parseInt(_currentBoardCount) + 1);
                        _senderBaord.html(parseInt(_currentSenderBoardCount) - 1);
                        toastr.success(response.d);
                    } else {
                        toastr.error(response.d);
                    }


                },
                error: function (msg) {
                    toastr.error('Error! Something went wrong.');
                    // $('#msg').html("Error while calling web service")
                }
            });
        }
    }).disableSelection();
    jQuery(".listSortable").sortable({
        connectWith: '.listSortable',
        update: function (event, ui) {
            console.log('update: ' + ui.item.index())
            var parameters = 0;
            if (condition > ui.item.index()) {
                console.log('ok: ' + $(ui.item.next()).attr('id'))
                if (typeof $(ui.item.next()).attr('id') !== 'undefined') {
                    parameters = "{pWhereTaskId:'" + $(ui.item.next()).attr('id')
                        + "',pStatus: '" + $(event.target).attr('id')
                        + "',Taskidupdate: '" + $(ui.item).attr('id')
                        + "',upanddown: '" + 1
                        + "',pcompanyID:'" + CompanyId + "'}";
                }
            }
            else {
                console.log('ok2: ' + $(ui.item.prev()).attr('id'))
                if (typeof $(ui.item.prev()).attr('id') !== 'undefined') {
                    parameters = "{pWhereTaskId:'" + $(ui.item.prev()).attr('id')
                        + "',pStatus: '" + $(event.target).attr('id')
                        + "',Taskidupdate: '" + $(ui.item).attr('id')
                        + "',upanddown: '" + 0
                        + "',pcompanyID:'" + CompanyId + "'}";
                }
            }
            if (parameters !== 0) {
                $.ajax({
                    type: "POST",
                    url: "../TMSUploadData.asmx/UpdateTaskPriorityOrder",
                    data: parameters,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        //$('#msg').html(response.d);
                        if (response.d == 'Task Status Update!') {
                            var _statusID = $(event.target).attr('id');
                            var _senderStatusID = $(ui.sender).attr('id');

                            var _senderBaord = jQuery('#boardcount' + _senderStatusID);
                            var _boardCount = jQuery('#boardcount' + _statusID);

                            var _currentBoardCount = _boardCount.html();
                            var _currentSenderBoardCount = _senderBaord.html();

                            _boardCount.html(parseInt(_currentBoardCount) + 1);
                            _senderBaord.html(parseInt(_currentSenderBoardCount) - 1);
                            toastr.success(response.d);
                        } else {
                            //toastr.error(response.d);
                        }


                    },
                    error: function (msg) {
                        //toastr.error('Error! Something went wrong.');
                    }
                });
            }

        },
        start: function (event, ui) {
            console.log('start: ' + ui.item.index())
            condition = ui.item.index();
        }
    });


}

function reInitGantt() {
    if (isChartViewEnableOnTaskChart == 'True') {
        gantt.init("gantt_here");
        gantt.clearAll();
        gantt.load(xmlfilename, "xml");
    }
}

function initGantt() {
    //gantt.init("gantt_here");

    gantt.config.date_grid = "%d-%m-%Y";
    gantt.config.xml_date = "%Y-%m-%d %H:%i:%s";
    gantt.config.scale_unit = "month";
    gantt.config.date_scale = "%F, %Y";

    gantt.config.scale_height = 50;

    gantt.config.subscales = [
        { unit: "day", step: 1, date: "%j, %D" }
    ];

    gantt.templates.scale_cell_class = function (date) {
        if (date.getDay() == 0 || date.getDay() == 6) {
            return "weekend";
        }
    };
    gantt.templates.task_cell_class = function (item, date) {
        if (date.getDay() == 0 || date.getDay() == 6) {
            return "weekend";
        }
    };
    gantt.templates.progress_text = function (start, end, task) {
        return "<span style='text-align:left;'>" + Math.round(task.progress * 100) + "% </span>";
    };


    gantt.config.order_branch = true;

    //console.log(gantt);

    gantt.config.columns = [
        { name: "text", label: "Task", tree: true, width: "*", align: "left" },
        { name: "employee", label: "Employee", width: 100, align: "left" },
        { name: "start_date", label: "Start Date", align: "center", width: 70 },
        { name: "duration", label: "Task Duration", width: "*", align: "center", width: 40 },
        { name: "add", label: "", width: 35 }
    ];
    gantt.templates.task_class = function (start, end, task) {
        switch (task.priority) {
            case "1":
                return "high";
                break;
            case "2":
                return "medium";
                break;
            case "3":
                return "low";
                break;
        }
    };

    gantt.attachEvent("onTaskCreated", function (item) {
        var task = item;
        //var item = { text: gantt.locale.labels.new_task, start_date: this.templates.xml_format(startDate), duration: 1, progress: 0, parent: id };
        //this.addTask(item);
        //this.showLightbox(item.id);

        var parentid = task.parent;

        //Md - AbdulMoiz 2018-10-03
        //            window.showModalDialog('TaskAssignment.aspx?ispopup=1&ParentId=' + parentid + '&emID=' + EmployeeId,
        //                window, 'dialogHeight:500px;dialogWidth:850px;center:yes;help:no;resizable:no;status:no');

        ShowDialog('TaskAssignment.aspx?ispopup=1&ParentId=' + parentid + '&emID=' + EmployeeId, 850, 500);
        //window.location.reload();
        //            if (IsIE() === true) {
        //                window.location.reload();
        //            }
    });

    gantt.attachEvent("onLightboxSave", function () {
        var task = this.getLightboxValues();
        var s = convert(task.start_date);
        var e = convert(task.end_date);
        var r = SaveNewTask(task.text, s, e);
        //dhtmlx.message(task.text + " starts at " + s + " and ends at " + e);
        dhtmlx.message(r);
        alert(task.users + ',' + task.text);
        //alert(id);
    });
    gantt.attachEvent("onTaskDblClick", function (id) {

        var _task = Object.values(gantt._pull).filter(function (t) { return t.id == id; });
        ViewModal('../ViewGeneralList.aspx?type=viewassignmentdetail&aid=' + _task[0].enctask + '', 1000, 500);
        return false;
        //            var task = gantt.getTask(id);
        //            //alert("before " + id);
        //            window.showModalDialog('TaskAssignment.aspx?ID=' + id + '&ispopup=1&emID=' + EmployeeId,
        //                window, 'dialogHeight:800px;dialogWidth:850px;center:yes;help:no;resizable:no;status:no');
        //            window.location.reload();
        //            //callTaskDetailPopup(id, 0, 'TaskAssignment.aspx');
        //            //alert(id);
    });
    gantt.config.details_on_create = true;
    gantt.config.grid_width = 390;
    gantt.locale.labels["section_priority"] = "Priority";

    gantt.config.lightbox.sections = [
        { name: "summary", height: 38, map_to: "text", type: "textarea", focus: true },
        { name: "description", height: 38, map_to: "text", type: "textarea", focus: true },
        {
            name: "users", height: 38, map_to: "users", type: "select", options: [
                { key: "1", label: "HMN" },
                { key: "0", label: "STA" },
                { key: "2", label: "SA" }]
        },
        {
            name: "priority", height: 22, map_to: "priority", type: "select", options: [
                { key: "1", label: "Low" },
                { key: "0", label: "Normal" },
                { key: "2", label: "High" }]
        },
        { name: "time", height: 72, type: "duration", map_to: "auto", time_format: ["%d", "%m", "%Y", "%H:%i"] }
    ];
    gantt.attachEvent("onAfterTaskDrag", function (id, mode) {
        var task = gantt.getTask(id);
        console.log(task);
        if (mode == gantt.config.drag_mode.progress) {
            var pr = Math.floor(task.progress * 100 * 10) / 10;
            toastr.info(task.text + " is now " + pr + "% completed!");
            //var r = UpdateTaskProgress(id, pr, s, e);
        } else {
            var convert = gantt.date.date_to_str("%Y-%m-%d");
            var s = convert(task.start_date);
            var e = convert(task.end_date);
            var dur = task.duration;
            var r = UpdateTaskDates(id, task.text, s, e, dur);
            //dhtmlx.message(task.text + " starts at " + s + " and ends at " + e);
            toastr.info(r);
        }
    });
    gantt.attachEvent("onBeforeTaskChanged", function (id, mode, old_event) {
        var task = gantt.getTask(id);
        if (mode == gantt.config.drag_mode.progress) {
            if (task.progress < old_event.progress) {
                //dhtmlx.message(task.text + " progress can't be undone!");
                toastr.info(task.text + " progress can't be undone!");
                return false;
            }

        }

        return true;
    });

    gantt.attachEvent("onBeforeTaskDrag", function (id, mode) {
        var task = gantt.getTask(id);
        var message = task.text + " ";

        if (mode == gantt.config.drag_mode.progress) {
            message += "progress is being updated";
            return false;
        } else {
            message += "is being ";
            if (mode == gantt.config.drag_mode.move)
                message += "moved";
            else if (mode == gantt.config.drag_mode.resize)
                message += "resized";
        }

        //dhtmlx.message(message);
        toastr.info(message);
        return true;
    });

    // jQuery('#gantt_here').html('');
    if (isChartViewEnableOnTaskChart == 'True') {
        gantt.init("gantt_here");
        gantt.clearAll();
        gantt.load(xmlfilename, "xml");
    }
    //console.log(gantt)

    var menu = new dhtmlXMenuObject();
    menu.setIconsPath("../js/menuimages/");
    menu.renderAsContextMenu();
    menu.setSkin("dhx_terrace");
    menu.loadXML("../js/dhxmenu.xml?e=" + new Date().getTime());

    gantt.attachEvent("onContextMenu", function (taskId, linkId, event) {
        var x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;


        var _task = Object.values(gantt._pull).filter(function (t) { return t.id == taskId; });


        console.log(_task);

        if (taskId) {
            menu.taskid = taskId;
            menu.etaskid = _task[0].enctask;
            menu.showContextMenu(x, y);

        } else if (linkId) {
            menu.showContextMenu(x, y);
        }

        if (taskId || linkId) {
            return false;
        }

        return true;
    });

    menu.attachEvent("onClick", function (id, zoneId, casState) {
        //dhtmlx.message(id + '-' + zoneId + menu.taskid);
        switch (id) {
            case "tstatus":

                //Md - AbdulMoiz 2018-10-03
                //                    window.showModalDialog('UpdateTaskStatus.aspx?taskid=' + menu.taskid + '&ispopup=1&emID=' + EmployeeId + '&CID=' + CompanyId,
                //                window, 'dialogHeight:200px;dialogWidth:500px;center:yes;help:no;resizable:no;status:no');
                ShowDialog('UpdateTaskStatus.aspx?taskid=' + menu.taskid + '&ispopup=1&emID=' + EmployeeId + '&CID=' + CompanyId, 500, 200);
                //                    if (IsIE() === true) {
                //                        window.location.reload();
                //                    }
                break;
            case "edit":
                //Md - AbdulMoiz 2018-10-03
                //                    window.showModalDialog('TaskAssignment.aspx?ID=' + menu.taskid + '&ispopup=1&emID=' + EmployeeId,
                //                window, 'dialogHeight:500px;dialogWidth:950px;center:yes;help:no;resizable:no;status:no');
                ShowDialog('TaskAssignment.aspx?ID=' + menu.taskid + '&ispopup=1&emID=' + EmployeeId, 950, 500);
                //                    if (IsIE() === true) {
                //                        window.location.reload();
                //                    }
                break;
            case "timeadd":
                console.log(menu);
                //Md - AbdulMoiz 2018-10-03
                //                    window.showModalDialog('TaskTransactionsEntry.aspx?ispopup=1&taskid=' + menu.taskid + '&emID=' + EmployeeId,
                //                        window, 'dialogHeight:500px;dialogWidth:980px;center:yes;help:no;resizable:no;status:no');
                ShowDialog('TaskTransactionsEntry.aspx?ispopup=1&taskid=' + menu.etaskid + '&emID=' + EmployeeId, 980, 500);
                //                    if (IsIE() === true) {
                //                        window.location.reload();
                //                    }
                break;
            case "delete":
                if (confirm("Are you sure to Delete?")) {
                    var r = DeleteTask(menu.taskid)
                    dhtmlx.message(r);
                    if (r == 'Task Deleted Successfully!') {
                        window.location.reload();
                    }

                }
                break;
        }


        //document.getElementById("ta").innerHTML += "<b>onClick</b> '" + menu.getItemText(id) + "' was clicked, ctrl: " + (casState["ctrl"] ? "<b>true</b>" : "false") + ", alt: " + (casState["alt"] ? "<b>true</b>" : "false") + ", shift: " + (casState["shift"] ? "<b>true</b>" : "false") + "<br>";
    });

}

function IsIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    return (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
}

function UpdateTaskProgress(id, pr, s, e) {
    //alert(id + tasktext + " starts at " + s + " and ends at " + e);   
    //lblLoading.style.display = '';
    //alert(url);
    var pl = new SOAPClientParameters();
    pl.add("pTaskId", id);
    pl.add("pStartDate", s);
    pl.add("pEndDate", e);
    pl.add("pCompanyID", CompanyId);
    var r = SOAPClient.invoke(url, "UpdateTaskProgress", pl, false);
    if (r != null) {

    }
    //lblLoading.style.display = 'none';
    return r;

}
function UpdateTaskDates(id, tasktext, s, e, dur) {
    //alert(id + tasktext + " starts at " + s + " and ends at " + e);
    //lblLoading.style.display = '';
    //alert(url);
    var pl = new SOAPClientParameters();
    pl.add("pTaskId", id);
    pl.add("pStartDate", s);
    pl.add("pEndDate", e);
    pl.add("pCompanyID", CompanyId);
    pl.add("pDuration", dur);
    var r = SOAPClient.invoke(url, "UpdateTaskDates", pl, false);
    if (r != null) {

    }
    //lblLoading.style.display = 'none';
    return r;

}
function DeleteTask(id) {
    //alert(id + tasktext + " starts at " + s + " and ends at " + e);
    //lblLoading.style.display = '';
    //alert(url);
    var pl = new SOAPClientParameters();
    pl.add("pTaskId", id);
    pl.add("pCompanyID", CompanyId);
    var r = SOAPClient.invoke(url, "DeleteTask", pl, false);
    if (r != null) {

    }
    //lblLoading.style.display = 'none';
    return r;

}



function toggleCriteriaPanel() {
    jQuery('#panelToggle').toggleClass("fa fa-chevron-up");
    jQuery('#panelToggle').toggleClass("fa fa-chevron-down");
    jQuery('#collapsecriteria').slideToggle();
}

function callTaskDetailPopup(TranID, TaskStatusID, url) {
    window.showModalDialog(url + '?ID=' + TranID + "&SID=" + TaskStatusID + "&type=View",
        window, 'dialogHeight:800px;dialogWidth:850px;center:yes;help:no;resizable:no;status:no');
    return false;
}