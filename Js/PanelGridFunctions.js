/*
Created by AbdulMoiz, May,2016
*/

//returns true if the gridview having the supplied ID has rows, false if it is empty.
//<parameter name="gvwID">takes the client id of the gridview</parameter>
function DoGridViewHasRows(gvwID) {
    var gridView = $('#' + gvwID);
    var firstRow = gridView.find('tr:eq(1)');
    var FirstColumn = firstRow.children('td:eq(0)');
    var hiddenValue = FirstColumn.children('input[type="hidden"]').val();

    if (hiddenValue == null || hiddenValue == "" || parseInt(hiddenValue) == 0) {
        return false;
    }
    return true;
}

function GetNumberOfRows(gvwID) {
    var gridView, NoOfRows;
    gridView = $('#' + gvwID);    
    NoOfRows = gridView.children('tbody').children("tr").length;
    return NoOfRows > 0 ? NoOfRows - 1 : -NoOfRows;
}

function ClearGridView(GridViewClientID) {
    var gridview = $('#' + GridViewClientID);
    var HeadingRow = gridview.find('tr:eq(0)');
    var tbody = gridview.children('tbody');
    tbody.empty();
    tbody.prepend(HeadingRow);
}

//takes the maximum TranID in the gridview and assign the TranID to txtSno and hidSno with an increment
//<parameter name="txtSNoID">ID of the txtSNo</parameter>
//<parameter name="hidSNoID">ID of the hidSNo</parameter>
//<parameter name="gvwDetailID">ID of the Panel Grid</parameter>
//<parameter name="TranIDColumnIndex">Index of the column of TranID in GridView</parameter>
function addSNoGeneral(txtSNoID, hidSNoID, gvwDetailID, TranIDColumnIndex) {
    if (Page_IsValid) {
        var maxTranID = 0; var TranIDCell; var TranID;
        var txtSNo = document.getElementById(txtSNoID);
        var hidSNo = document.getElementById(hidSNoID);
        var gridView = jQuery('#' + gvwDetailID);
        var Rows = gridView.children('tbody').children('tr');

        if (txtSNo.value.trim() == "0" || txtSNo.value.trim() == "") {    //if it is insert case
            Rows.each(function(index) {
                if (index > 0) {
                    TranIDCell = jQuery(this).children('td:eq(' + TranIDColumnIndex + ')');
                    TranID = TranIDCell.children('input[type="hidden"]').val();
                    TranID = parseInt(TranID);
                    if (TranID > maxTranID) { maxTranID = TranID }
                }
            });

            txtSNo.value = maxTranID + 1;
            hidSNo.value = txtSNo.value;
        }
    }
}

