
var defaultMenu =
    '<ul class="sidebar-menu">' +
    '<li id="mnuHome"><a href="main.html"> <i class="fa fa-dashboard fa-fw"></i><span> Home</span></a></li>';


jQuery(function () {
    GenerateMenu(defaultMenu);
});


// ------------ 31-MAR-2020 START
// var defaultMenu =
// '<ul class="sidebar-menu">' +
// '<li id="mnuHome"><a href="main.html"> <i class="fa fa-dashboard fa-fw"></i><span> Home</span></a></li>' +
// '<li id="mnuAttendance" class="treeview" ><a href="#"><i class="fa fa-clock-o fa-fw"></i> <span>Attendance</span><i class="fa fa-angle-left pull-right"></i></a>' +
// '<ul class="treeview-menu">' +
// '<li><a href="markattendance.html"><i class="fa fa-circle-o"></i> Mark Attendance</a></li>' +
// '<li><a href="viewattendance.html"><i class="fa fa-circle-o"></i> View Attendance</a></li>' +
// '<li><a href="AttendanceApproval.html"><i class="fa fa-circle-o"></i> Attendance Approval</a></li>' +
// '<li><a href="AttendanceRequest.html"><i class="fa fa-circle-o"></i> Attendance Request</a></li>' +
// '<li><a href="ViewEditSchedule.html"><i class="fa fa-circle-o"></i> View Schedule</a></li>' +
// '</ul>' +
// '</li>' +

// '<li  class="treeview" id="mnuLeave"><a href="#"><i class="fa fa-edit fa-fw"></i> <span>Leave</span><i class="fa fa-angle-left pull-right"></i></a>' +
// '<ul class="treeview-menu">' +
// '<li><a href="LeaveApproval.html"><i class="fa fa-circle-o"></i> Leave Approval</a></li>' +
// '<li><a href="Leave.html"><i class="fa fa-circle-o"></i> Leave Request</a></li>' +
// '<li><a href="LeaveRequestList.html"><i class="fa fa-circle-o"></i> Leave Request List</a></li>' +
// '<li><a href="CompensatoryLeaveClaimRequest.html"><i class="fa fa-circle-o"></i>Compensatory Leave Request</a></li>' +
// '<li><a href="CompensatoryLeaveApproval.html"><i class="fa fa-circle-o"></i>Compensatory Leave Approval</a></li>' +
// '<li><a href="LeaveBalance.html"><i class="fa fa-circle-o"></i> Leave Balance(s)</a></li>' +
// '</ul>' +
// '</li>' +

// '<li  class="treeview" id="mnuPayroll"><a href="#"><i class="fa fa-money fa-fw"></i> <span>Payroll</span><i class="fa fa-angle-left pull-right"></i></a>' +
// '<ul class="treeview-menu">' +
// '<li><a href="Payslip.html"><i class="fa fa-circle-o"></i> View Payslip</a></li>' +
// '<li><a href="LoanSummary.html"><i class="fa fa-circle-o"></i> Loan Summary</a></li>' +
// '<li><a href="TaxDeduction.html"><i class="fa fa-circle-o"></i> Tax Deductions</a></li>' +
// '</ul>' +
// '</li>';
// ------------ 31-MAR-2020 END

// var pages = '';
// var modules = '';

// $.each(arr, function (i) {
//     modules += ',\'' + arr[i].flagName + '\'';
//     var child_ = arr[i]['children'];
//     $.each(child_, function (j) {
//         var delim = ',\'';
//         var delim2 = '\'';
//         if (pages !== '') {
//             pages += delim + child_[j].formName + delim2
//         } else {
//             pages += '\"' + child_[j].formName + delim2
//         }

//     });
// });

// //console.log(pages);
// pages = pages.substring(0, pages.length - 1) + '';
// //modules = '\'' + modules.substring(1) + '\'';
// modules = modules.substring(1);

// //console.log(modules);
// //console.log(pages);
// pages = pages.slice(1);
//console.log(pages);