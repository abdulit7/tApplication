function handleChange(e) {
    var sender, txtPickingQty;

    sender = $('#' + e.target.id);
    txtPickingQty = sender.closest('tr').find('[id$="txtPickingQty"]');
    enableDisablePickingQty(sender, txtPickingQty);
}

function handleDisability(pDdlPickingMethodID, pTxtPickingQtyID) {
    var ddlPickingMethod, txtPickingQty;

    ddlPickingMethod = $('#' + pDdlPickingMethodID); 
    txtPickingQty =  $('#' + pTxtPickingQtyID);

    if (!isNull(ddlPickingMethod) && !isNull(txtPickingQty)) {
        enableDisablePickingQty(ddlPickingMethod, txtPickingQty);
    }
}

function enableDisablePickingQty(ddlPickingMethod, txtPickingQty) {
    var disabled;
    //disabled = ddlPickingMethod.value.trim().toLowerCase() === "all";
    disabled = ddlPickingMethod.val().trim().toLowerCase() === "all";

    if (disabled) {
        txtPickingQty.val("0");
    }
    txtPickingQty.prop('disabled', disabled);
}

function isNull(obj) {
    return typeof obj === 'undefined' || obj === null;
}