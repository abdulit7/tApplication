/* Event Functions */

// Add an event to the obj given
// event_name refers to the event trigger, without the "on", like click or mouseover
// func_name refers to the function callback when event is triggered
function addEvent(obj, event_name, func_name) {
    if (obj.attachEvent) {
        obj.attachEvent("on" + event_name, func_name);
    } else if (obj.addEventListener) {
        obj.addEventListener(event_name, func_name, true);
    } else {
        obj["on" + event_name] = func_name;
    }
}

// Removes an event from the object
function removeEvent(obj, event_name, func_name) {
    if (obj.detachEvent) {
        obj.detachEvent("on" + event_name, func_name);
    } else if (obj.removeEventListener) {
        obj.removeEventListener(event_name, func_name, true);
    } else {
        obj["on" + event_name] = null;
    }
}

// Stop an event from bubbling up the event DOM
function stopEvent(evt) {
    evt || window.event;
    if (evt.stopPropagation) {
        evt.stopPropagation();
        evt.preventDefault();
    } else if (typeof evt.cancelBubble != "undefined") {
        evt.cancelBubble = true;
        evt.returnValue = false;
    }
    return false;
}

// Get the obj that starts the event
function getElement(evt) {
    if (window.event) {
        return window.event.srcElement;
    } else {
        return evt.currentTarget;
    }
}
// Get the obj that triggers off the event
function getTargetElement(evt) {
    if (window.event) {
        return window.event.srcElement;
    } else {
        return evt.target;
    }
}
// For IE only, stops the obj from being selected
function stopSelect(obj) {
    if (typeof obj.onselectstart != 'undefined') {
        addEvent(obj, "selectstart", function() { return false; });
    }
}

/*    Caret Functions     */

// Get the end position of the caret in the object. Note that the obj needs to be in focus first
function getCaretEnd(obj) {
    if (typeof obj.selectionEnd != "undefined") {
        return obj.selectionEnd;
    } else if (document.selection && document.selection.createRange) {
        var M = document.selection.createRange();
        try {
            var Lp = M.duplicate();
            Lp.moveToElementText(obj);
        } catch (e) {
            var Lp = obj.createTextRange();
        }
        Lp.setEndPoint("EndToEnd", M);
        var rb = Lp.text.length;
        if (rb > obj.value.length) {
            return -1;
        }
        return rb;
    }
}
// Get the start position of the caret in the object
function getCaretStart(obj) {
    if (typeof obj.selectionStart != "undefined") {
        return obj.selectionStart;
    } else if (document.selection && document.selection.createRange) {
        var M = document.selection.createRange();
        try {
            var Lp = M.duplicate();
            Lp.moveToElementText(obj);
        } catch (e) {
            var Lp = obj.createTextRange();
        }
        Lp.setEndPoint("EndToStart", M);
        var rb = Lp.text.length;
        if (rb > obj.value.length) {
            return -1;
        }
        return rb;
    }
}
// sets the caret position to l in the object
function setCaret(obj, l) {
    obj.focus();
    if (obj.setSelectionRange) {
        obj.setSelectionRange(l, l);
    } else if (obj.createTextRange) {
        m = obj.createTextRange();
        m.moveStart('character', l);
        m.collapse();
        m.select();
    }
}
// sets the caret selection from s to e in the object
function setSelection(obj, s, e) {
    obj.focus();
    if (obj.setSelectionRange) {
        obj.setSelectionRange(s, e);
    } else if (obj.createTextRange) {
        m = obj.createTextRange();
        m.moveStart('character', s);
        m.moveEnd('character', e);
        m.select();
    }
}

/*    Escape function   */
String.prototype.addslashes = function() {
    return this.replace(/(["\\\.\|\[\]\^\*\+\?\$\(\)])/g, '\\$1');
}
String.prototype.trim = function() {
    return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
};
/* --- Escape --- */

/* Offset position from top of the screen */
function curTop(obj) {
    toreturn = 0;
    while (obj) {
        toreturn += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return toreturn;
}
function curLeft(obj) {
    toreturn = 0;
    while (obj) {
        toreturn += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    return toreturn;
}
/* ------ End of Offset function ------- */

/* Types Function */

// is a given input a number?
function isNumber(a) {
    return typeof a == 'number' && isFinite(a);
}

/* Object Functions */

function replaceHTML(obj, text) {
    while (el = obj.childNodes[0]) {
        obj.removeChild(el);
    };
    obj.appendChild(document.createTextNode(text));
}





/***********************************************************************************/
/*******************************  Select All for any GridView  *********************/
/***********************************************************************************/

function selectAll(chk, columnIndex, gvwID) {
    var $ = jQuery.noConflict();
    $("#" + gvwID + " tr").each(function() {
        var tdChk = $(this).find("td").eq(columnIndex);
        $(tdChk).find("input[type=checkbox]").each(function() {
            this.checked = chk.checked;
        });
    });
}

/***********************************************************************************/
/****************  Verify at least one row selected in any GridView  ***************/
/***********************************************************************************/

function IsAtLeastOneRowSelected(columnIndex, gvwID, lblErrID, msg) {
    var IsSelected = "false";
    var _lblErr = document.getElementById(lblErrID);

    //    if ($("#"+gvwID+" tr").length > 0){

    $("#" + gvwID + " tr").each(function() {
        var tdChk = $(this).find("td").eq(columnIndex);
        $(tdChk).find("input[type=checkbox]").each(function() {
            if (this.checked) {
                IsSelected = "true";
                return false;
            }
        });
    });

    if (IsSelected == "true") {
        _lblErr.innerHTML = "";
        return true;
    }
    else {
        _lblErr.innerHTML = msg;
        alert(msg);
        return false;
    }

    //    }
    //    else
    //        return true;
}


/***********************************************************************************/
/***************************  Calculate Grand Total  *******************************/
/***********************************************************************************/
var masterPageId = "ctl00_ContentPlaceHolder1_";
var masterPageName = "ctl00$ContentPlaceHolder1$";

function calculateGrandTotal(txtObj, gvwId, lbltotalId) {
    txtId = txtObj.id;
    var IdFirstPart = masterPageId + gvwId + "_ctl";
    var NameFirstPart = masterPageName + "gvwList$ctl";
    var gvListID = masterPageId + "gvwList";

    var o_gvList = document.getElementById(gvListID);
    var o_lblGrandTotal = document.getElementById(masterPageId + lbltotalId);

    if (o_lblGrandTotal == null) return;

    txtId = txtId.substring(txtId.lastIndexOf('_'), txtId.length);

    var RowNo = o_gvList.rows.length;
    var tempRowID = "";
    var grandTotal = parseFloat("0.00");

    for (i = 2; i < RowNo + 1; i++) {
        if (i < 10)
            tempRowID = "0" + i;
        else
            tempRowID = i;

        var o_txtId = document.getElementById(IdFirstPart + tempRowID + txtId);
        var val = o_txtId.value;

        if (val.length == 0) {
            val = '0';
        }
        grandTotal = grandTotal + parseFloat(val);
    }

    o_lblGrandTotal.innerHTML = RoundOffNumber(grandTotal);

}

function RoundOffNumber(num) {
    ans = num.toString();
    indexOfDecimal = ans.lastIndexOf('.');
    ans = indexOfDecimal > 0 ? ans.substring(0, indexOfDecimal + 3) : ans;
    return ans;
}

/***********************************************************************************/
/************************  Disable TextBox Except One  *****************************/
/***********************************************************************************/

function disable_tbox_except_one(octl_trgt, ctrls) {
    var ctl = ctrls.split(",");
    for (i = 0; i < ctl.length; i++) {
        if (octl_trgt.id != ctl[i]) {
            if (parseFloat(octl_trgt.value) > 0)
                document.getElementById(ctl[i]).value = 0;
        }
    }
}


/***********************************************************************************/
/********************  Fills any DropDown through Web Service  *********************/
/***********************************************************************************/

// cmnt by jameel on 6-DEC-2021 - PEPSI 
//function FillDropDown(URL, MethodName, ddlTarget, pNames, pValues) {
//    try {
//        // removing all value from ddlTarget and add default value
//        ddlTarget.innerHTML = "";
//        ddlTarget.options[0] = new Option("-- select one --", "0", false, false)

//        // preparing parameters for function to be called
//        var pl = new SOAPClientParameters();
//        for (i = 0; i < pNames.length; i++) {
//            pl.add(pNames[i], pValues[i]);
//        }

//        // calling a function
//        var r = SOAPClient.invoke(URL, MethodName, pl, false);
//        if (r == null) return false;
//        if (r != "") {
//            var pRows = r.split('^');
//            for (i = 1; i < pRows.length; i++) {
//                var pID = pRows[i].split('~')[0];
//                var pTitle = pRows[i].split('~')[1];
//                ddlTarget.options[i] = new Option(pTitle, pID, true, false);
//            }
//        }
//    }
//    catch (err) {
//        alert('Error! : ' + err.message);
//    }
//}

function postRequest_useinthisfileonly(pUrl, params, pSuccessCallback, pAdditionalParams) {
    alert(123);
    var $ = jQuery.noConflict();
    var Type, Url, ContentType, DataType, ProcessData;

    Type = "POST";
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    Url = pUrl;

    //var newparams = Object.assign({},params,data)
    //newparams = JSON.stringify(newparams);    

    $.ajax({
        type: Type, //GET or POST or PUT or DELETE verb
        url: Url, // Location of the service
        data: params, //Data sent to server
        contentType: ContentType, // content type sent to server
        dataType: DataType, //Expected data format from server
        processdata: ProcessData, //True or False
        beforeSend: function (request) {
            request.setRequestHeader("ZCI6efrovMLFOQsystem", localStorage.getItem('ZCI6efrovMLFOQsystem'));
            request.setRequestHeader("XN4Jaib00XIsystem", localStorage.getItem('XN4Jaib00XIsystem'));
            request.setRequestHeader("9ygzefro1ppU70system", localStorage.getItem('9ygzefro1ppU70system'));
            request.setRequestHeader("SuevSwzqwJosystem", localStorage.getItem('SuevSwzqwJosystem'));
            request.setRequestHeader("UzegQQ2qG3gsystem", localStorage.getItem('UzegQQ2qG3gsystem'));
            request.setRequestHeader("IRObRaCqfjOV3tkEYhffNA", localStorage.getItem('IRObRaCqfjOV3tkEYhffNA'));
        },
        success: function (res) {
            if (pAdditionalParams) {
                pSuccessCallback(res, pAdditionalParams);
            }
            else {
                pSuccessCallback(res);
            }
        },
        error: function (result) {
            //alert(result.responseJSON.Message);
            try {
                alert(result.responseJSON.Message);
            }
            catch (e) {
                alert('Something went wrong! Please contact you administrator.');
            }
        }
    });
}

// ad by jameel on 6-DEC-2021 - PEPSI 
function FillDropDown(URL, MethodName, ddlTarget, pNames, pValues) {
    try {
        // removing all value from ddlTarget and add default value
        ddlTarget.innerHTML = "";
        ddlTarget.options[0] = new Option("-- select one --", "0", false, false)

        // preparing parameters for function to be called
        var payLoad = {};
        for (i = 0; i < pNames.length; i++) {            
            payLoad[pNames[i]] = pValues[i];
        }

        postRequest_useinthisfileonly(URL + "/" + MethodName, JSON.stringify(payLoad), function (r) {
            if (r == null) return false;
            r = r.d;
            if (r != "") {
                var pRows = r.split('^');
                for (i = 1; i < pRows.length; i++) {
                    var pID = pRows[i].split('~')[0];
                    var pTitle = pRows[i].split('~')[1];
                    ddlTarget.options[i] = new Option(pTitle, pID, true, false);
                }
            }
        });
   
    }
    catch (err) {
        alert('Error! : ' + err.message);
    }
}




/***********************************************************************************/
/********  Update status of numbers of Shops selected out of total shops  **********/
/***********************************************************************************/

function UpdateSelectionStatusOutOfTotal(columnIndex, gvwID, lblStatusID, msg) {
    var _lblStatus = document.getElementById(lblStatusID);
    var total = 0;
    var selected = 0;

    $("#" + gvwID + " tr").each(function() {
        var tdChk = $(this).find("td").eq(columnIndex);
        $(tdChk).find("input[type=checkbox]").each(function() {
            if (this.checked) {
                selected = selected + 1;
            }
            total = total + 1;
        });
    });
    msg = msg.format([selected, total]);
    _lblStatus.innerHTML = msg;
}


/***********************************************************************************/
/****************  Calculate Grand Total of Columns in a GridView   ****************/
/***********************************************************************************/

var IdFirstPart = masterPageId + "gvwList_ctl";
var NameFirstPart = masterPageName + "gvwList$ctl";
var gvListID = masterPageId + "gvwList";

function CalculateGrandTotal(txtGrandTotalID, txtAmountID, chkIsIncludeID, typeof_ctl, typeof_ctl_total) {
    var _gvList = document.getElementById(gvListID);
    var _txtGrandTotal = document.getElementById(txtGrandTotalID);

    //    var o_chkInclude = document.getElementById(chkIsIncludeID);
    //    var o_txtBudgetAmount = document.getElementById(txtAmountID);
    //    o_txtBudgetAmount.value = o_chkInclude.checked ? o_txtBudgetAmount.value : '0';

    var txtAmountID = txtAmountID.substring(txtAmountID.lastIndexOf('_'), txtAmountID.length);
    var chkIsIncludeID = chkIsIncludeID.substring(chkIsIncludeID.lastIndexOf('_'), chkIsIncludeID.length);

    var RowNo = _gvList.rows.length;
    var tempRowID = "";
    var grandTotal = parseFloat("0.00");

    for (i = 2; i < RowNo + 1; i++) {
        if (i < 10)
            tempRowID = "0" + i;
        else
            tempRowID = i;

        var _txtAmount = document.getElementById(IdFirstPart + tempRowID + txtAmountID);
        var _chkIsIncludeID = document.getElementById(IdFirstPart + tempRowID + chkIsIncludeID);

        if (_chkIsIncludeID.checked)
            if (typeof_ctl == 'textbox')
            grandTotal = grandTotal + parseFloat(_txtAmount.value);
        else if (typeof_ctl == 'label')
            grandTotal = grandTotal + parseFloat(_txtAmount.innerHTML);
    }

    if (typeof_ctl_total == 'textbox')
        _txtGrandTotal.value = grandTotal;
    else if (typeof_ctl_total == 'label')
        _txtGrandTotal.innerHTML = grandTotal;
}


/***********************************************************************************/
/**********     Add Max Serial # in EfroGridView - Inline grid only    *************/
/***********************************************************************************/

function addSNo(hidTranID) {
    var _gvList = document.getElementById(gvListID);
    hidTranID = hidTranID.substring(hidTranID.lastIndexOf('_'), hidTranID.length);
    var lstSNo = new Array;
    var RowNo = _gvList.rows.length;
    var tempRowID = "";
    var i = 0;

    for (i = 2; i < RowNo; i++) {
        if (i < 10)
            tempRowID = "0" + i;
        else
            tempRowID = i;

        var _hidTranID = document.getElementById(IdFirstPart + tempRowID + hidTranID);
        lstSNo.push(parseInt(_hidTranID.value));
    }
    if (i < 10)
        tempRowID = "0" + i;
    else
        tempRowID = i;

    var _hidTranID = document.getElementById(IdFirstPart + tempRowID + hidTranID);
    var maxNo = lstSNo.max().value;
    _hidTranID.value = maxNo + 1;
}


/***********************************************************************************/
/*************     Enable/Disable Target Control on CheckBox Change   **************/
/***********************************************************************************/

function ToggleEnablingOnCheckBox(_chk, _targetCtlID) {
    var _ctl = document.getElementById(_targetCtlID);
    _ctl.disabled = !_chk.checked;
}


/***********************************************************************************/
/***************************  Usage of String.Format  ******************************/
/***********************************************************************************/

String.prototype.format = function(args) {
    var str = this;
    return str.replace(String.prototype.format.regex, function(item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");


/***************    Getting the Base Page (Domain) URL     ************************/

function getBaseURL() {
    var url = location.href;  // entire url including querystring - also: window.location.href;
    var baseURL = url.substring(0, url.indexOf('/', 14));


    if (baseURL.indexOf('http://localhost') != -1) {
        // Base Url for localhost
        var url = location.href;  // window.location.href;
        var pathname = location.pathname;  // window.location.pathname;
        var index1 = url.indexOf(pathname);
        var index2 = url.indexOf("/", index1 + 1);
        var baseLocalUrl = url.substr(0, index2);

        return baseLocalUrl + "/";
    }
    else {
        // Root Url for domain name (on live server)
        return baseURL + "/";
    }

}


/**************************  Show More / Less  ************************/
window.onload = function() {
    var showChar = 100;
    var ellipsestext = "...";
    var moretext = "more";
    var lesstext = "less";

    if (typeof $ != 'undefined') {

        if ($('.more') != null) {
            $('.more').each(function() {
                var content = $(this).html();
                if (content.length > showChar) {

                    var c = content.substr(0, showChar);
                    var h = content.substr(showChar - 1, content.length - showChar);

                    var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

                    $(this).html(html);
                }
            });
        }

        if ($('.morelink') != null) {
            $(".morelink").click(function() {
                if ($(this).hasClass("less")) {
                    $(this).removeClass("less");
                    $(this).html(moretext);
                }
                else {
                    $(this).addClass("less");
                    $(this).html(lesstext);
                }
                $(this).parent().prev().toggle();
                $(this).prev().toggle();
                return false;
            });
        }
    }
}

/**************************  Used to call Print from Orbitrax  ************************/

function callOrbiTraxPrintNew(poid, OrbiTraxURL, OrbiTraxObjectIDs) {

    var url = OrbiTraxURL;
    var objectid = OrbiTraxObjectIDs;

    var aryObjectID = objectid.split(",");
    for (x = 0; x < aryObjectID.length; x++) {

        objectid = aryObjectID[x];
        //window.open(url + '&pagename=ReportViewer.aspx' + '&pkid1=' + poid, '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no scrollbars=yes, resizable=yes, copyhistory=yes, width=1020px, height=675px');
        window.open(url + '&id=' + objectid + '&pagename=ReportViewer.aspx' + '&pkid1=' + poid, '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no scrollbars=yes, resizable=yes, copyhistory=yes, width=1020px, height=675px');
    }
}