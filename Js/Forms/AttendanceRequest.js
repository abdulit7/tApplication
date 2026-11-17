

var mod = (function init() {

    $(document).ready(function() {
        //bindMask();
    });

    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(function() {
        //bindMask();
    });

    function bindMask() {
        $ = jQuery.noConflict();
        var txtTimes = $('.txtTime');

        $.mask.definitions['H'] = '[0-2]';
        $.mask.definitions['h'] = '[0-9]';
        $.mask.definitions['g'] = '[0-3]';
        $.mask.definitions['M'] = '[0-5]';
        $.mask.definitions['m'] = '[0-9]';
        
        txtTimes.mask('Hh:Mm');

        txtTimes.on('blur', function() {
            var value = $(this).val();
            if (value.length > 0) {
                value = value.split(":");
                if (value[0] !== "" && parseInt(value[0]) > 23) {
                    value[0] = "23";
                }
                $(this).val(value.join(":"));
            }
        });
    }

    var EditAttendance = function(objchk,objtxtInDate,objtxtInTime,objtxtOutDate,objtxtOutTime,objimbDateIn,
                            objimbDateOut,objlblSchdInDate,objlblSchdOutDate)
    {
        //var rf_Remarks;
        var chkIsEdit=document.getElementById(objchk);
        var lblSchdInDate=document.getElementById(objlblSchdInDate);
        var lblSchdOutDate=document.getElementById(objlblSchdOutDate);
        var txtInDate=document.getElementById(objtxtInDate);
        var txtInTime=document.getElementById(objtxtInTime);
        var txtOutDate=document.getElementById(objtxtOutDate);
        var txtOutTime=document.getElementById(objtxtOutTime);
        var imbDateIn=document.getElementById(objimbDateIn);
        var imbDateOut=document.getElementById(objimbDateOut);
        //rf_Remarks = document.getElementById(rf_RemarksID);
        
        if (chkIsEdit.checked) {
            txtInDate.disabled=false;
            //txtInDate.value = lblSchdInDate.innerHTML;
            if (txtInDate.value == '01/01/1900') { txtInDate.value = lblSchdInDate.innerHTML };
            txtInTime.disabled=false;
            txtOutDate.disabled = false;
            if (txtOutDate.value == '01/01/1900') { txtOutDate.value = lblSchdOutDate.innerHTML };
            //txtOutDate.value=lblSchdOutDate.innerHTML;
            txtOutTime.disabled=false;
            imbDateIn.disabled=false;
            imbDateOut.disabled=false;
        }
        else{
            txtInDate.disabled=true;
            txtInTime.disabled=true;
            txtOutDate.disabled=true;
            txtOutTime.disabled=true;
            imbDateIn.disabled=true;
            imbDateOut.disabled=true;
        }
        //ValidatorEnable(rf_Remarks,chkIsEdit.checked);
    }

    return{
        EditAttendance : EditAttendance
    }

} ());