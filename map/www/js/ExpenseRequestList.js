
jQuery(function () {
    fillPayrollYear();


    jQuery('#btnShow').click(function (e) {
        fillGrid();
    });

});


var expDetail = [];
function fillGrid() {
    var year = jQuery('#ddlYear').val();
    postRequest('GetExpenseList', { pYear: year }, function (r) {
        var res = JSON.parse(r.d);
        var status = res['result'];
        var msg = res['msg'];

        if (status == 'error') { toastr.error(msg); return; }

        var template = '';

        if (res['Head'].length == 0) {
            jQuery('#expenseList').html(data404());
            return;
        }

        expDetail = res['Detail'];
        jQuery.each(res['Head'], function (i, item) {
            template += '<li class="list-group-item">' +
                '<table class="table table-condensed borderless">' +
                '<tr>' +
                '<td style="width:150px;">Requistion ID</td>' +
                '<td>' + item.ReferenceNo + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Requistion Date</td>' +
                '<td>' + getFormattedDateNew(item.ValueDate) + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Requistioner</td>' +
                '<td>' + item.EmployeeName + '</td>' +
                '</tr>' +
                '<td>Expense Detail</td>' +
                '<td>' + item.Detail + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Total Amount</td>' +
                '<td>' + item.TotalAmount + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Status</td>' +
                '<td>' + item.Status + '</td>' +
                '</tr>' +
                '<tr><td colspan="2">' +
                '<button onClick="viewDetail(' + item.TranID + ',\'' + item.ReferenceNo + '\')" class="btn btn-primary btn-xs btn-block">View Detail ' + getIcon('list') + '</button>' +
                '</td></tr>' +
                '</table>' +
                '</li>';
        });

        jQuery('#expenseList').html(template);



    }, OnPostRequestError)

}

function fillPayrollYear() {
    postRequest('GetPayrollYear', {}, function (r) {

        var res = JSON.parse(r.d);
        var status = res['result'];
        var msg = res['msg'];
        if (status == 'error') { toastr.error(msg); return; }
        var ddlYear = document.getElementById('ddlYear');
        _fillDropDown(res, ddlYear, 'PayrollYear', 'PayrollYear', false);
        fillGrid();
    });
}

function viewDetail(pTranID, pRefNo) {
    var template = '';
    var data = expDetail.filter(function (value) {
        return value.TranID == pTranID;
    });

    template += '<tr style="background:#ddd;">' + col('Expense Type') + col('Route') + col('Claim Date') + col('Expense Date') + col('Rate') + col('Qty') + col('Amount') + col('Description') + col('Location') + '</tr>';
    jQuery.each(data, function (i, item) {
        template += '<tr>' + col(item.AllowanceTitle) + col(item.RouteTitle) + col(getFormattedDateNew(item.ClaimDate)) + col(getFormattedDateNew(item.ExpenseDate)) + col(item.Rate) + col(item.Quantity) + col(item.Amount) + col(item.Remarks) + col(item.Location) + '</tr>';
    });

    doModal('Expense Detail (' + pRefNo + ')', '<div class="table-responsive"><table class="table table-bordered">' + template + '</table></div>');
}

function col(pValue) {
    return '<td>' + pValue + '</td>';
}