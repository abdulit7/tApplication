
//this can be optimized
function getClientID(pID) {
    var hidContentPlaceHolderID;
    hidContentPlaceHolderID = document.getElementById('hidContentPlaceHolderID');
    return 'ctl00_' + hidContentPlaceHolderID.value + '_' + pID;
}

$(document).ready(function () {

    try {
    $ = jQuery.noConflict();
    var $ddlCriteria2,hidIsAdmin;
    var hidIsLeaveApprover = document.getElementById(getClientID('hidIsLeaveApprover'));
    hidIsAdmin = document.getElementById(getClientID('hidIsAdmin'));
    var ddlCriteria = document.getElementById(getClientID('ddlCriteria'));

    $ddlCriteria2 = $('#' + getClientID('ddlCriteria2'));

    //disabled the sub criteria dropdowns
    $('#' + getClientID('ddlCriteria1')).prop("disabled", true);
    $ddlCriteria2.prop('disabled', true);
    disableddlCriteria3();
    disableddlCriteria4();

    handle_ddlCriteria3_changed();
    handle_ddlCriteria4_changed();

    // if (hidIsLeaveApprover.value == 0) {
    if (hidIsAdmin.value.toLowerCase() === 'true') {

        //disabled the sub criteria from and to dropdowns
            if (ddlFrom1Client == null) { return; }
        ddlFrom1Client.SetEnabled(false);
        ddlTo1Client.SetEnabled(false);
        ddlFrom2Client.SetEnabled(false);
        ddlTo2Client.SetEnabled(false);

        if (ddlCriteria != null) {
            if (ddlCriteria.selectedIndex > 0) {
                ddlFromClient.SetEnabled(true);
                ddlToClient.SetEnabled(true);
                $('#' + getClientID('ddlCriteria1')).prop("disabled", false);
            }
            else {
                ddlFromClient.SetEnabled(false);
                ddlToClient.SetEnabled(false);
                $('#' + getClientID('ddlCriteria1')).prop("disabled", true);
            }
        }
        else {
            ddlFromClient.SetEnabled(false);
            ddlToClient.SetEnabled(false);
            $('#' + getClientID('ddlCriteria1')).prop("disabled", true);
        }
    }
    } catch (e) {
        console.log('Error on criteria load.');
    }    
}); 

var nullText = "- select -";

function OnLostFocus(s, e) {
    //console.log({s});
    if (s.GetValue() != "" && s.GetValue() != null)
        return;

    var input = s.GetInputElement();
    //input.style.color = "gray";
    input.value = nullText;
}

function OnLostFocus_1stLevelCriteria(s, e) {    
    var ddlCriteria,defaultText;   
        
    if (s.GetValue() != "" && s.GetValue() != null)
        return;
        
    ddlCriteria = document.getElementById(getClientID('ddlCriteria'));

    defaultText = ddlCriteria.value.toLowerCase() === 'activeandleftemployee' || ddlCriteria.value.toLowerCase() === 'left employees' ? '- All -' : 
                    nullText;        

    var input = s.GetInputElement();
    //input.value = nullText;
    input.value = defaultText;
}

function OnLostFocus_2ndLevelCriteria(s, e) {
    var ddlCriteria1, defaultText;

    if (s.GetValue() != "" && s.GetValue() != null)
        return;

    ddlCriteria1 = document.getElementById(getClientID('ddlCriteria1'));

    defaultText = ddlCriteria1.value.toLowerCase() === 'activeandleftemployee' || ddlCriteria1.value.toLowerCase() === 'left employees' ? '- All -' :
                    nullText;

    var input = s.GetInputElement();
    //input.value = nullText;
    input.value = defaultText;
}

function OnGotFocus(s, e) {
    var input = s.GetInputElement();
    if (input.value == nullText) {
        input.value = "";
        //input.style.color = "black";
    }
}

function OnInit(s, e) {
    var hidIsAdmin;
    var hidIsLeaveApprover = document.getElementById(getClientID('hidIsLeaveApprover'));
    hidIsAdmin =  document.getElementById(getClientID('hidIsAdmin'));
    var ddlCriteria1 = document.getElementById(getClientID('ddlCriteria1'));
    var ddlCriteria = document.getElementById(getClientID('ddlCriteria'));
    
    // if (hidIsLeaveApprover.value == 0) {
    if (hidIsAdmin.value.toLowerCase() === 'true') {
        if (ddlCriteria != null) {
            if (ddlCriteria.selectedIndex > 0) {
                ddlFromClient.SetEnabled(true);
                ddlToClient.SetEnabled(true);
            }
            else {
                ddlFromClient.SetEnabled(false);
                ddlToClient.SetEnabled(false);
            }
        }
        else {
            if (ddlFrom1Client == null) { return; }
            ddlFromClient.SetEnabled(false);
            ddlToClient.SetEnabled(false);
        }

        if (ddlCriteria1 != null) {
            if (ddlCriteria1.selectedIndex > 0) {
                ddlFrom1Client.SetEnabled(true);
                ddlTo1Client.SetEnabled(true);
            }
            else {
                ddlFrom1Client.SetEnabled(false);
                ddlTo1Client.SetEnabled(false);
            }
        }
        handle2ndLevelEnability();

    }
    OnLostFocus(s, e);
}

var prm = Sys.WebForms.PageRequestManager.getInstance();
prm.add_endRequest(RefreshCriteria);

/**Called on change event of ddlCriteria */
function CriteriaChanged(ddl, event) {
    RefreshCriteria(true);
    RefreshSubCriteria();
}

function RefreshCriteria(isRefresh) {
    //console.log(RefreshCriteria);
    $ = jQuery.noConflict();
    var defaultText;
    var hidIsLeaveApprover = document.getElementById(getClientID('hidIsLeaveApprover'));
    var ddlCriteria1 = document.getElementById(getClientID('ddlCriteria1'));
    var ddlCriteria = document.getElementById(getClientID('ddlCriteria'));

    if (ddlCriteria1 != null) {
        //if something is selected in first criteria dropdown                
        if (ddlCriteria.selectedIndex > 0) {
            if (arguments.length > 0 && arguments[0] === true) {
                ddlFromClient.PerformCallback();
                ddlToClient.PerformCallback();
                ddlFromClient.SetEnabled(true);
                ddlToClient.SetEnabled(true);

                ddlCriteria1.selectedIndex = 0;
                $('#' + getClientID('ddlCriteria1')).prop("disabled", false);
            }
            enableddlCriteria2();
            enableddlCriteria3();
            enableddlCriteria4();
        }
        else {
            //if nothing is selected in first criteria dropdown
            ddlCriteria1.selectedIndex = 0;                     //reset the 2nd Criteria dropdown
            $('#' + getClientID('ddlCriteria1')).prop("disabled", true);        //disable the 2nd Criteria dropdown

            disableddlCriteria2();
            disableddlCriteria3();
            disableddlCriteria4();

            //if logged in user is not a leave approver, disable the from and to dropdowns
            if (hidIsLeaveApprover.value == 0 && arguments.length > 0 && arguments[0] === true) {
                ddlFromClient.SetEnabled(false);
                ddlToClient.SetEnabled(false);
            }
        }
    }

    /*
    Calling change handlers of 3rd,4th and 5th level criterias on 1st level criteria change, so that it should check the value of the 3rd,4th and 5th
    level criteria dropdowns and handle enablity of 3rd,4th and 5th level from and to dropdowns accordingly. 
    Handling of Enablity of 3rd,4th and 5th level Criteria dropdown has already been done above
    */
    handle_ddlCriteria2_changed();
    handle_ddlCriteria3_changed();
    handle_ddlCriteria4_changed();

    //console.log({arguments});
    if (arguments.length > 0 && arguments[0] === true) {
        defaultText = ddlCriteria.value.toLowerCase() === 'activeandleftemployee' || ddlCriteria.value.toLowerCase() === 'left employees' ? '- All -' : 
                    nullText;        
        var inputTo = ddlToClient.GetInputElement();
        //inputTo.value = nullText;
        inputTo.value = defaultText;
        var input = ddlFromClient.GetInputElement();
        //input.value = nullText;
        input.value = defaultText;
    }
}

function Criteria1Changed(ddl, event) {
    $ = jQuery.noConflict();
    var ddlCriteria2;

    RefreshSubCriteria();

    ddlCriteria2 = $('#' + getClientID('ddlCriteria2'));
    //if there is anything selected in 2nd level criteria dropdown, then enable the 3rd level criteria dropdown            
    if (typeof ddl.value !== 'undefined' && ddl.value !== null && ddl.value.toLowerCase() !== 'all') {
        ddlCriteria2.prop('disabled', false);
    }
    else {
        //else make it disabled
        ddlCriteria2.prop('disabled', true);
    }
}

//Ad - AbdulMoiz 2018-12-18
function handle2ndLevelEnability() {
    var ddlCriteria2, isSelected;
    ddlCriteria2 = document.getElementById(getClientID('ddlCriteria2'));
    if (ddlCriteria2) {
        isSelected = ddlCriteria2.selectedIndex > 0;
        ddlFrom2Client.SetEnabled(isSelected);
        ddlTo2Client.SetEnabled(isSelected);
    }
}

/** */
function RefreshSubCriteria() {
    var defaultText;
    var hidIsLeaveApprover = document.getElementById(getClientID('hidIsLeaveApprover'));
    var ddlCriteria1 = document.getElementById(getClientID('ddlCriteria1'));
    if (ddlCriteria1 != null) {
        //if there is something selected in ddlCriteria1
        if (ddlCriteria1.selectedIndex > 0) {
            //fire CallBack event of level 2 from and to criteria dropdowns and enable them
            ddlFrom1Client.PerformCallback();
            ddlFrom1Client.SetEnabled(true);
            ddlTo1Client.PerformCallback();
            ddlTo1Client.SetEnabled(true);

            //Enable the 3rd, 4th and 5th level criteria dropdowns
            enableddlCriteria2();
            enableddlCriteria3();
            enableddlCriteria4();
        }
        else {
            //if there is nothing selected in ddlCriteria1
            //if logged in user is not leave approver, i.e if he is Admin
            if (hidIsLeaveApprover.value == 0) {
                ddlFrom1Client.SetEnabled(false);
                ddlTo1Client.SetEnabled(false);
            }

            //Disable the 3rd, 4th and 5th level criteria dropdowns
            disableddlCriteria2();
            disableddlCriteria3();
            disableddlCriteria4();
        }
    }

    /*
    Calling change handlers of 3rd,4th and 5th level criterias on 1st level criteria change, so that it should check the value of the 3rd,4th and 5th
    level criteria dropdowns and handle enablity of 3rd,4th and 5th level from and to dropdowns accordingly. 
    Handling of Enablity of 3rd,4th and 5th level Criteria dropdown has already been done above
    */
    handle_ddlCriteria2_changed();
    handle_ddlCriteria3_changed();
    handle_ddlCriteria4_changed();

    defaultText = ddlCriteria1.value.toLowerCase() === 'activeandleftemployee' || ddlCriteria1.value.toLowerCase() === 'left employees' ? '- All -' : 
                    nullText;    
    var inputFrom = ddlFrom1Client.GetInputElement();
    //inputFrom.value = nullText;
    inputFrom.value = defaultText;
    var inputTo = ddlTo1Client.GetInputElement();
//    inputTo.value = nullText;
    inputTo.value = defaultText;
}

/* 3rd Level Criteria coding start */

function enableddlCriteria2() {
    $ = jQuery.noConflict();
    var ddlCriteria2;
    ddlCriteria2 = $('#' + getClientID('ddlCriteria2'));
    ddlCriteria2.prop("disabled", false);
    //ddlCriteria2.val('All');
}

function disableddlCriteria2() {
    $ = jQuery.noConflict();
    var ddlCriteria2;
    ddlCriteria2 = $('#' + getClientID('ddlCriteria2'));
    ddlCriteria2.val('All');
    ddlCriteria2.prop("disabled", true);
}

/**Fires on change event of  ddlCriteria2*/
function ddlCriteria2_changed(sender, event) {
    handle_ddlCriteria2_changed(true);
}

function handle_ddlCriteria2_changed(isReset) {
    var ddlCriteria2;
    ddlCriteria2 = document.getElementById(getClientID('ddlCriteria2'));

    if (ddlCriteria2.selectedIndex > 0) {
        //fire CallBack event of level 3 from and to criteria dropdowns and enable them
        if (isReset && isReset === true) {
            ddlFrom2Client.PerformCallback();
            ddlTo2Client.PerformCallback();
        }
        ddlFrom2Client.SetEnabled(true);
        ddlTo2Client.SetEnabled(true);

        //Enable the 4th and 5th level criteria dropdowns
        enableddlCriteria3();
        enableddlCriteria4();
    }
    else {
        //disable from and to dropdown if nothing is selected                
        ddlFrom2Client.SetEnabled(false);
        ddlTo2Client.SetEnabled(false);

        //Disable the 4th and 5th level criteria dropdowns
        disableddlCriteria3();
        disableddlCriteria4();
    }
    /*
    Calling change handlers of 4th and 5th level criterias on 1st level criteria change, so that it should check the value of the 4th and 5th
    level criteria dropdowns and handle enablity of 4th and 5th level from and to dropdowns accordingly. 
    Handling of Enablity of 4th and 5th level Criteria dropdown has already been done above
    */
    handle_ddlCriteria3_changed();
    handle_ddlCriteria4_changed();

    //if isReset param is true or criteria dropdown is set to 'All', reset values of ddlFrom2 and ddlTo2
    if ((isReset && isReset === true) || ddlCriteria2.selectedIndex === 0) {
        ddlFrom2Client.GetInputElement().value = nullText
        ddlTo2Client.GetInputElement().value = nullText
    }
}


/* 3rd Level Criteria coding end */

/* 4th Level Criteria coding start */

/**Fires on change event of  ddlCriteria3*/
function ddlCriteria3_changed(sender, event) {
    handle_ddlCriteria3_changed(true);
}

function handle_ddlCriteria3_changed(isReset) {
    var ddlCriteria3;
    ddlCriteria3 = document.getElementById(getClientID('ddlCriteria3'));
    if (ddlCriteria3 == null) {        
        return;
    }
    if (ddlCriteria3.selectedIndex > 0) {
        //fire CallBack event of level 3 from and to criteria dropdowns and enable them
        if (isReset && isReset === true) {
            ddlFrom3Client.PerformCallback();
            ddlTo3Client.PerformCallback();
        }
        ddlFrom3Client.SetEnabled(true);
        ddlTo3Client.SetEnabled(true);

        //Enable the 5th level criteria dropdowns                
        enableddlCriteria4();
    }
    else {
        //disable from and to dropdown if nothing is selected
        ddlFrom3Client.SetEnabled(false);
        ddlTo3Client.SetEnabled(false);

        //Disable the 5th level criteria dropdowns                
        disableddlCriteria4();
    }

    /*
    Calling change handlers of 5th level criterias on 1st level criteria change, so that it should check the value of the 5th
    level criteria dropdowns and handle enablity of 5th level from and to dropdowns accordingly. 
    Handling of Enablity of 5th level Criteria dropdown has already been done above
    */
    handle_ddlCriteria4_changed();

    //if isReset param is true or criteria dropdown is set to 'All', reset values of ddlFrom3 and ddlTo3
    if ((isReset && isReset === true) || ddlCriteria3.selectedIndex === 0) {
        ddlFrom3Client.GetInputElement().value = nullText
        ddlTo3Client.GetInputElement().value = nullText
    }
}

function disableddlCriteria3() {
    $ = jQuery.noConflict();
    var ddlCriteria3;
    ddlCriteria3 = $('#' + getClientID('ddlCriteria3'));
    ddlCriteria3.val('All');
    ddlCriteria3.prop("disabled", true);
}

function enableddlCriteria3() {
    $ = jQuery.noConflict();
    var ddlCriteria3;
    ddlCriteria3 = $('#' + getClientID('ddlCriteria3'));
    //ddlCriteria3.val('All');
    ddlCriteria3.prop("disabled", false);
}
/* 4th Level Criteria coding end */

/* 5th Level Criteria coding start */

/**Fires on change event of  ddlCriteria4*/
function ddlCriteria4_changed(sender, event) {
    handle_ddlCriteria4_changed(true);
}

function handle_ddlCriteria4_changed(isReset) {
    var ddlCriteria4;
    ddlCriteria4 = document.getElementById(getClientID('ddlCriteria4'));
    if (ddlCriteria4 == null) {
        return;
    }
    if (ddlCriteria4.selectedIndex > 0) {
        //fire CallBack event of level 3 from and to criteria dropdowns and enable them
        if (isReset && isReset === true) {
            ddlFrom4Client.PerformCallback();
            ddlTo4Client.PerformCallback();
        }

        ddlFrom4Client.SetEnabled(true);
        ddlTo4Client.SetEnabled(true);
    }
    else {
        //disable from and to dropdown if nothing is selected
        ddlFrom4Client.SetEnabled(false);
        ddlTo4Client.SetEnabled(false);
    }

    //if isReset param is true or criteria dropdown is set to 'All', reset values of ddlFrom4 and ddlTo4
    if ((isReset && isReset === true) || ddlCriteria4.selectedIndex === 0) {
        ddlFrom4Client.GetInputElement().value = nullText
        ddlTo4Client.GetInputElement().value = nullText
    }
}

function disableddlCriteria4() {
    $ = jQuery.noConflict();
    var ddlCriteria4;
    ddlCriteria4 = $('#' + getClientID('ddlCriteria4'));
    ddlCriteria4.val('All');
    ddlCriteria4.prop("disabled", true);
}

function enableddlCriteria4() {
    $ = jQuery.noConflict();
    var ddlCriteria4;
    ddlCriteria4 = $('#' + getClientID('ddlCriteria4'));
    //ddlCriteria4.val('All');
    ddlCriteria4.prop("disabled", false);
}
/* 5th Level Criteria coding end */