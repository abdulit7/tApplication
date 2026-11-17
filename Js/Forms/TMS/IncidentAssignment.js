
//$(document).ready(documentReady);

//function documentReady() {
//    var $hidDdlIncidentTypeValue = $('#ctl00_ContentPlaceHolder1_hidDdlIncidentTypeValue');
//    $('#ctl00_ContentPlaceHolder1_ddlIncidentType').change(function() {
//        $hidDdlIncidentTypeValue.val($(this).val());
//    });
//}

function ddlIncidentType_change() {
    var ddlIncidentType, hidDdlIncidentTypeValue;
    ddlIncidentType = document.getElementById(getClientID('ddlIncidentType'));
    hidDdlIncidentTypeValue = document.getElementById(getClientID('hidDdlIncidentTypeValue'));        
    hidDdlIncidentTypeValue.value = ddlIncidentType.value;    
}
