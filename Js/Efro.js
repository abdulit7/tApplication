
function extractNumber(obj, decimalPlaces, allowNegative, DecimalPlacesControlID) {

    if ((DecimalPlacesControlID != '') && (DecimalPlacesControlID != undefined)) {
        var DPControl = document.getElementById(DecimalPlacesControlID);
        decimalPlaces = DPControl.value;
    }

    var temp = obj.value;

    // avoid changing things if already formatted correctly
    var reg0Str = '[0-9]*';
    if (decimalPlaces > 0) {
        reg0Str += '\\.?[0-9]{0,' + decimalPlaces + '}';
    } else if (decimalPlaces < 0) {
        reg0Str += '\\.?[0-9]*';
    }
    reg0Str = allowNegative ? '^-?' + reg0Str : '^' + reg0Str;
    reg0Str = reg0Str + '$';
    var reg0 = new RegExp(reg0Str);
    if (reg0.test(temp)) return true;

    // first replace all non numbers
    var reg1Str = '[^0-9' + (decimalPlaces != 0 ? '.' : '') + (allowNegative ? '-' : '') + ']';
    var reg1 = new RegExp(reg1Str, 'g');
    temp = temp.replace(reg1, '');

    if (allowNegative) {
        // replace extra negative
        var hasNegative = temp.length > 0 && temp.charAt(0) == '-';
        var reg2 = /-/g;
        temp = temp.replace(reg2, '');
        if (hasNegative) temp = '-' + temp;
    }

    if (decimalPlaces != 0) {
        var reg3 = /\./g;
        var reg3Array = reg3.exec(temp);
        if (reg3Array != null) {
            // keep only first occurrence of . 
            //  and the number of places specified by decimalPlaces or the entire string if decimalPlaces < 0
            var reg3Right = temp.substring(reg3Array.index + reg3Array[0].length);
            reg3Right = reg3Right.replace(reg3, '');
            reg3Right = decimalPlaces > 0 ? reg3Right.substring(0, decimalPlaces) : reg3Right;
            temp = temp.substring(0, reg3Array.index) + '.' + reg3Right;
        }
    }

    obj.value = temp;
}

function blockNonNumbers(obj, e, allowDecimal, allowNegative, DecimalPlacesControlID) {
    var key;
    var isCtrl = false;
    var keychar;
    var reg;

    if ((DecimalPlacesControlID != '') && (DecimalPlacesControlID != undefined)) {
        var DPControl = document.getElementById(DecimalPlacesControlID);
        if (DPControl.value > 0) {
            allowDecimal = true;
        }
        else {
            allowDecimal = false;
        }
    }

    if (window.event) {
        key = e.keyCode;
        isCtrl = window.event.ctrlKey
    }
    else if (e.which) {
        key = e.which;
        isCtrl = e.ctrlKey;
    }

    if (isNaN(key)) return true;

    keychar = String.fromCharCode(key);

    // check for backspace or delete, or if Ctrl was pressed
    if (key == 8 || isCtrl) {
        return true;
    }
    reg = /\d/;
    var isFirstN = allowNegative ? keychar == '-' && obj.value.indexOf('-') == -1 : false;
    var isFirstD = allowDecimal ? keychar == '.' && obj.value.indexOf('.') == -1 : false;

    return isFirstN || isFirstD || reg.test(keychar);
}

function blockNonNumbers(obj, e, allowDecimal, allowNegative,allowColon, DecimalPlacesControlID) {
    var key;
    var isCtrl = false;
    var keychar;
    var reg;

    if ((DecimalPlacesControlID != '') && (DecimalPlacesControlID != undefined)) {
        var DPControl = document.getElementById(DecimalPlacesControlID);
        if (DPControl.value > 0) {
            allowDecimal = true;
        }
        else {
            allowDecimal = false;
        }
    }

    //Added by AbdulMoiz 2016-11-04
    if (allowColon) {allowDecimal = false;}
    //End

    if (window.event) {
        key = e.keyCode;
        isCtrl = window.event.ctrlKey
    }
    else if (e.which) {
        key = e.which;
        isCtrl = e.ctrlKey;
    }

    if (isNaN(key)) return true;

    keychar = String.fromCharCode(key);

    // check for backspace or delete, or if Ctrl was pressed
    if (key == 8 || isCtrl) {
        return true;
    }
    reg = /\d/;
    var isFirstN = allowNegative ? keychar == '-' && obj.value.indexOf('-') == -1 : false;
    var isFirstD = allowDecimal ? keychar == '.' && obj.value.indexOf('.') == -1 : false;
    var IsColonFirst = allowColon ? keychar == ':' && obj.value.indexOf(':') == -1 : false;

    return isFirstN || isFirstD || IsColonFirst || reg.test(keychar);
}

var Efro = {};

Efro.Round = function(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};

Efro.printDiv = function(divPrint) {
    //console.log('1');
    var printContents = document.getElementById(divPrint).innerHTML;
    //console.log('printContents : ', printContents);
    var originalContents = document.body.innerHTML;
    //console.log('originalContents : ', originalContents);
    
    document.body.innerHTML = printContents;
    
    window.print();

    //console.log('3');
    document.body.innerHTML = originalContents;
}

//Added by AbdulMoiz 2017-01-16
function CloseModalWindow() {
    function funcCloseWindow() {
        try {
            if (typeof parent.closeDialog === 'function') {
                parent.closeDialog();
            }
            else {
                window.close();
            }   
        }
        catch (e) {
            throw e;
        }
    }

    funcCloseWindow();
}

var DTHelper = {};

DTHelper.GetFormattedDate = function(date, format) {
    var dd, mm, yyyy, result = date;
    dd = date.getDate();
    mm = date.getMonth() + 1;   //January is 0
    yyyy = date.getFullYear();

    dd = dd < 10 ? '0' + dd.toString() : dd.toString();
    mm = mm < 10 ? '0' + mm.toString() : mm.toString();

    if (format.toLowerCase() == 'dd/mm/yyyy') {
        result = dd + '/' + mm + '/' + yyyy;
    }
    else if (format.toLowerCase() == 'mm/dd/yyyy') {
        result = mm + '/' + dd + '/' + yyyy;
    }

    return result;
}

DTHelper.GetFormattedTime = function (date, format) {
    var hours, mins, secs, result = date;
    hours = date.getHours();
    mins = date.getMinutes();
    secs = date.getSeconds();

    hours = hours < 10 ? "0" + hours.toString() : hours.toString();
    mins = mins < 10 ? "0" + mins.toString() : mins.toString();
    secs = secs < 10 ? "0" + secs.toString() : secs.toString();

    if (format.toLowerCase() === "hh:mm:ss") {
        result = hours + ":" + mins + ":" + secs;
    }
    else if (format.toLowerCase() === "hh:mm") {
        result = hours + ":" + mins;
    }

    return result;
}

DTHelper.GetNativeDate = function (date, format) {

    var dd, mm, yyyy, result = new Date();
    var datearr = date.split('/');
    var date, month, year;

    if (format.toLowerCase() == 'yyyy/mm/dd') {
        year = datearr[0];
        month = datearr[1];
        date = datearr[2];
        result = new Date(year + '/' + month + '/' + date);
    }

    else if (format.toLowerCase() == 'dd/mm/yyyy') {
        date = datearr[0];
        month = datearr[1];
        year = datearr[2];
        result = new Date(year + '/' + month + '/' + date);
    }
    else if (format.toLowerCase() == 'mm/dd/yyyy') {
        month = datearr[0];
        date = datearr[1];
        year = datearr[2];
        result = new Date(year + '/' + month + '/' + date);
    }

    return result;
}

DTHelper.getMonthName = function (date) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[date.getMonth()];
}

function ViewModal(url, width, height) {
    var config = 'dialogHeight:' + height + 'px;dialogWidth:' + width + 'px;center:yes;help:no;resizable:no;status:no';
    window.showModalDialog(url, window, config);

    /*
    Commented by AbdulMoiz - 2019-01-26 - causing error' Illegal return statement at HTMLDialogElement.<anonymous>' at Dialog close event, 
    also there is no need to return false at the show of modals, it should be done in plain html anchor<a> tag, they won't cause any postback
    */
    //return false;
    if (isNull($)) {$ = jQuery.noConflict();}
}

function ShowModal(url, width, height) {
    ViewModal(url, width, height);
}

function ShowDialog(url, width, height) {
    var config = "height="+ height +"px,width="+ width +"px,toolbar=no, menubar=no, scrollbars=yes,resizable=no,location=center, status=no,top=120,left=320";
    window.open(url, '_blank', config);
    return false;
}

function openListWindow(pageurl, pagetitle) {
    var tabtitle = pagetitle;
    pagetitle = pagetitle.replace(/ /g, "_");
    var str = pagetitle;
    str = str.replace(/[(]/g, "_");
    pagetitle = str;
    str = pagetitle;
    str = str.replace(/[)]/g, "");
    pagetitle = str;
    parent.add_tab(pageurl, pagetitle, pagetitle);
}


function openListWindowOld(pageurl, pagetitle) {
    var node = {
        attributes: {
            href: pageurl
        },
        text: pagetitle,
        id: pagetitle
    };
    parent.addExampleTab.apply(parent, [node]);
}

function openTab(pUrl, pTitle) {
    //var node = {
    //    attributes: {
    //        href: pUrl
    //    },
    //    text: pTitle,
    //    id: pTitle
    //};    
    //parent.addExampleTab.apply(parent, [node]);
    openListWindow(pUrl, pTitle);
}

function isNull (obj) {
    return typeof obj === 'undefined' || obj === null;
}

function init$($){
    if (isNull($)) {$ = jQuery.noConflict();}
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function postRequest(pUrl, params, pSuccessCallback, pAdditionalParams) {
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
        success : function(res){
            if(pAdditionalParams){
                pSuccessCallback(res,pAdditionalParams);
            }
            else{
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

function postRequest(pUrl, params, pSuccessCallback,pErrorCallback, pAdditionalParams) {
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
            //try {
            //    alert(result.responseJSON.Message);
            //}
            //catch (e) {
            //    alert('Something went wrong! Please contact you administrator.');
            //}
            if (pErrorCallback != null) {
                pErrorCallback(result);
            }
            
        }
    });
}

function postRequest_Sync(pUrl, params, pSuccessCallback, pAdditionalParams) {
    var $ = jQuery.noConflict();
    var Type, Url, ContentType, DataType, ProcessData;

    //params = JSON.stringify(params);

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
        async: false, // frezze UI
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

function postRequest_Web(pUrl, payLoad, pSuccessCallback, pAdditionalParams) {
    var $ = jQuery.noConflict();
    var Type, Url, ContentType, DataType, ProcessData;

    Type = "POST";
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    Url = pUrl;

    var eid, uid, cid, ecode, secKey
    eid = localStorage.getItem('9ygzefro1ppU70system');    
    uid = localStorage.getItem('ZCI6efrovMLFOQsystem');
    cid = localStorage.getItem('XN4Jaib00XIsystem');    
    ecode = localStorage.getItem('SuevSwzqwJosystem');
    secKey = localStorage.getItem('UzegQQ2qG3gsystem');

    var params = {
        pSecKey: secKey,
        pEmployeeIDEncode: eid,
        pEmployeeRefNoEncode: ecode,
        pUserIDEncode: uid,
        pCompanyIDEncode: cid,
    }

    var newparams = Object.assign({}, params, payLoad)
    newparams = JSON.stringify(newparams);

    $.ajax({
        type: Type, //GET or POST or PUT or DELETE verb
        url: Url, // Location of the service
        data: newparams, //Data sent to server
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

/**
 * Added by AbdulMoiz 2019-04-02
 * Source : https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript 
 * */
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}


/**
 * Added by Jameel
 * Source : https://stackoverflow.com/questions/51259830/exporting-image-element-to-word-document-using-javascript
 * */
function Export2Doc(element, filename) {
    //  _html_ will be replace with custom html
    var meta = "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>";
    //  _styles_ will be replaced with custome css
    var head = "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n";
    //  _body_ will be replaced with custome body html
    var body = "<body>_body_</body>";
    //var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    //var postHtml = "</body></html>";

    //var html = preHtml + document.getElementById(element).innerHTML + postHtml;
    var html = document.getElementById(element).innerHTML;

    var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });

    var css = (
           '<style>' +
           'img{width:100%;height:100%}' +
           '</style>'
          );
    //  Image Area %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    var options = { maxWidth: 624 };
    var images = Array();
    var img = jQuery("#" + element).find("img");
    for (var i = 0; i < img.length; i++) {
        // Calculate dimensions of output image
        var w = Math.min(img[i].width, options.maxWidth);
        var h = img[i].height * (w / img[i].width);
        // Create canvas for converting image to data URL
        var canvas = document.createElement("CANVAS");
        canvas.width = w;
        canvas.height = h;
        // Draw image to canvas
        var context = canvas.getContext('2d');
        context.drawImage(img[i], 0, 0, w, h);
        // Get data URL encoding of image
        var uri = canvas.toDataURL("image/png");
        jQuery(img[i]).attr("src", img[i].src);
        img[i].width = w;
        img[i].height = h;
        // Save encoded image to array
        images[i] = {
            type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
            encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
            location: jQuery(img[i]).attr("src"),
            data: uri.substring(uri.indexOf(",") + 1)
        };
    }

    // Prepare bottom of mhtml file with image data
    var imgMetaData = "\n";
    for (var i = 0; i < images.length; i++) {
        imgMetaData += "--NEXT.ITEM-BOUNDARY\n";
        imgMetaData += "Content-Location: " + images[i].location + "\n";
        imgMetaData += "Content-Type: " + images[i].type + "\n";
        imgMetaData += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
        imgMetaData += images[i].data + "\n\n";

    }
    imgMetaData += "--NEXT.ITEM-BOUNDARY--";
    // end Image Area %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    var output = meta.replace("_html_", head.replace("_styles_", css) + body.replace("_body_", html)) + imgMetaData;

    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(output);


    filename = filename ? filename + '.doc' : 'document.doc';


    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {

        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.click();
    }

    document.body.removeChild(downloadLink);
}

function SelectionValidation_DevExpress(GridViewID, ColIndex, Action) {
    var checkbox, tbl, message, count = 0, result, cell,classList;;
    tbl = document.getElementById(GridViewID);
    message = "Are you sure you want to " + Action + " ?"

    for (i = 1; i < tbl.rows.length; i++) {
        cell = tbl.rows[i].cells[ColIndex];        
        if (isNull(cell)) { continue; }

        checkbox = cell.getElementsByTagName("span")[0];
        if (isNull(checkbox)) { continue; }        
        
        classList = checkbox.classList;        
        
        if (!isNull(classList) && classList.contains('dxWeb_edtCheckBoxChecked') === true) {
            count += 1;
        }        
    }

    //console.log({count});

    result = count > 0;   
    if (!result) {
        alert("Select at least one Line");
        return result;
    }

    result = confirm(message);

    return result;
}

//Javascript implemention of Excel's "PMT" function
//source https://stackoverflow.com/questions/2094967/excel-pmt-function-in-js/6088618
//AbdulMoiz 2019-12-19
function pmt(rate_per_period, number_of_payments, present_value, future_value, type) {
    if (rate_per_period != 0.0) {
        // Interest rate exists
        var q = Math.pow(1 + rate_per_period, number_of_payments);
        return -(rate_per_period * (future_value + (q * present_value))) / ((-1 + q) * (1 + rate_per_period * (type)));

    } else if (number_of_payments != 0.0) {
        // No interest rate, but number of payments exists
        return -(future_value + present_value) / number_of_payments;
    }

    return 0;
}

// Added By Jameel

function showProgressCustom(pIsValidatePageFirst) {
    
    if (pIsValidatePageFirst == null) {
        pIsValidatePageFirst = true;
    }    

    if (pIsValidatePageFirst == true) {
        if (typeof (Page_ClientValidate) == 'function') {
            Page_ClientValidate();
        }
        if (Page_IsValid) {
            _showProgressInner();
        }
    } else {
        _showProgressInner();
    }

    function _showProgressInner() {
        jQuery.blockUI({
            centerY: 0,
            css: {
                width: '180px', top: '40px', left: '', right: '10px', border: 'none', padding: '5px', backgroundColor: '#000'
                , '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: .6, color: '#fff'
            }
        });
    }
}


function getFormattedDateNew(dt, fullMonthName) {
    if (!isNull(dt)) {
        // dt = Date From Web Service which is unformatted    
        var dateformat = localStorage.getItem('dateformat') == null ? 'dd/mm/yyyy' : localStorage.getItem('dateformat')
        //console.log(dateformat);
        if (fullMonthName) {
            return getDateWithMonthName(DTHelper.GetFormattedDate(getDateByASPNETTimeStamp(dt), dateformat));
        }
        return DTHelper.GetFormattedDate(getDateByASPNETTimeStamp(dt), dateformat)
    }
    return ''
}


function getFormattedTimeNew(dt) {
    // dt = Date From Web Service which is unformatted    
    var dateformat = 'hh:mm:ss'
    return DTHelper.GetFormattedTime(getDateByASPNETTimeStamp(dt), dateformat)
}


function getDateByASPNETTimeStamp(pASPNETDate) {
    return new Date(parseInt(/\d+/.exec(pASPNETDate)[0]));
}


function getDateWithMonthName(dt) {


    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = dt.getDate();
    var monthIndex = dt.getMonth();
    var year = dt.getFullYear();
    day = day < 9 ? '0' + day : day
    return day + '/' + monthNames[monthIndex] + '/' + year;
}

function data404() {
    return '<div class="text-center"><small>No Data to Display!</small></div>';
}

function center(pText) {
    return '<center style="color:#777;">' + pText + '</center>';
}
function progress(optinalText) {
    if (!optinalText) { optinalText = ''; }
    //fa-hourglass-start
    //fa-spinner fa-spin
    return '<div class="text-center">' + optinalText + '<i class="fa fa-spinner fa-spin"></i></div>';
}
function progress2(optinalText) {
    if (!optinalText) { optinalText = ''; }
    //fa-hourglass-start
    //fa-spinner fa-spin
    return '<div class="text-center">' + optinalText + '&nbsp; <i class="fa fa-hourglass-start fa-spin"></i></div>';
}
function getSum(obj, item) {
    var total = 0;
    $.each(obj, function (i, value) {
        total += value[item];
    });
    return total;
}

function doModal(heading, formContent, pModalWidth, pstrCloseBtnID, customEvt, mainid, callback) {
    if (isNull($)) { $ = jQuery.noConflict(); }
    var html = '';
    if (pModalWidth == null || pModalWidth == undefined || !pModalWidth) {
        pModalWidth = '90%';
        html += "<style> .modal { text-align: center; padding: 0!important; } .modal:before { content: ''; display: inline-block; height: 100%; vertical-align: middle; margin-right: -4px; /* Adjusts for spacing */ } .modal-dialog { display: inline-block; text-align: left; vertical-align: middle; }</style>";
    }
    

    html += '<div id="dynamicModal" class="modal dynamicModal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
    html += '<div class="modal-dialog" style="width:' + pModalWidth + ';">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header" style="padding: 2px 15px 2px 15px;">';
    html += '<a class="close" data-dismiss="modal">×</a>';
    html += '<h4>' + heading + '</h4>'
    html += '</div>';
    html += '<div class="modal-body" style="overflow:auto;">';
    html += formContent;
    html += '</div>';


    html += '<style>@media only screen and (max-width: 760px) { .modal-dialog { width:90% !important; } </style>'

    if (pModalWidth != null || pModalWidth != undefined || pModalWidth) {
        html += "<style> .modal { text-align: center; padding: 0!important; } .modal:before { content: ''; display: inline-block; height: 100%; vertical-align: middle; margin-right: -4px; /* Adjusts for spacing */ } .modal-dialog { display: inline-block; text-align: left; vertical-align: middle; }</style>";
    }


    //html += '<div class="modal-footer">';
    //html += '<span class="btn btn-primary" data-dismiss="modal">Close</span>';
    //html += '</div>';  // content
    if (gModal) {
        gModal = null;
    }
    html += '</div>';  // dialog
    html += '</div>';  // footer
    html += '</div>';  // modalWindow
    $('body').append(html);
    $("#dynamicModal .close").css('line-height', 2);
    $("#dynamicModal").modal({ backdrop: 'static', keyboard: false });

    var gModal = $("#dynamicModal").modal('show');


    $('.dynamicModal').on('hidden.bs.modal', function (e) {
        $(this).remove();
        jQuery('.dynamicModal').remove();
        jQuery('#dynamicModal').remove();
        jQuery('.modal-backdrop').remove();
    });

    jQuery('.dynamicModal').on('hidden', function (e) {
        jQuery(this).remove();
    });

    if (pstrCloseBtnID != null || pstrCloseBtnID !== undefined) {
        $(pstrCloseBtnID).on('click', function (e) {
            function closeModal() {
                $('#dynamicModal').modal('hide', null);
            }
            callback(closeModal);

        });
    }

    if (customEvt != null) {
        customEvt(mainid);
    }



}

function doModal(heading, formContent, pModalWidth,pHideCloseButton) {    
    if (pModalWidth == null || pModalWidth == undefined || !pModalWidth) {
        pModalWidth = '';
    } else {
        pModalWidth = 'style="width : ' + pModalWidth + '"';
    }

    var closebtnhtml = '';
    if (pHideCloseButton == null || pHideCloseButton == undefined) {
        pHideCloseButton = false;
    }

    if (pHideCloseButton == false) {
        closebtnhtml += '<span class="btn btn-primary btn-xs" data-dismiss="modal">Close <i class="fa fa-times"></i></span>';
    }

    //formContent = formContent.replace(/'/g, "\\'");
    html = '<div id="dynamicModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';    
    html += '<div class="modal-dialog" ' + pModalWidth + '>';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    html += '<a class="close" data-dismiss="modal">×</a>';
    html += '<h4>' + heading + '</h4>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += formContent;
    html += '</div>';
    html += '<div class="modal-footer">';
    html += closebtnhtml;
    html += '</div>';  // content
    html += '</div>';  // dialog
    html += '</div>';  // footer
    html += '</div>';  // modalWindow
    jQuery('body').append(html);
    jQuery("#dynamicModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    jQuery("#dynamicModal").modal('show');

    jQuery('#dynamicModal').on('hidden.bs.modal', function (e) {
        jQuery(this).remove();
    });

}

function getIcon(pIconName, pColor) {
    //pColor = !pColor ? '#888' : pColor;
    if (!pColor) { pColor = 'inherit';}
    return '<i class="fa fa-' + pIconName + '" style="color:' + pColor + '" ></i>&nbsp;';
}

function EnableDisableButtonSpin(btn, d, txt, showSpinner) {


    if (showSpinner == undefined || showSpinner == '') {
        showSpinner = '&nbsp;<span class="fa fa-spinner fa-spin"> <span>';
    } else {
        showSpinner = '&nbsp;<span class="fa ' + showSpinner + '"> <span>';
    }
    if (d.toLowerCase() === 'd') {
        if (!txt || txt == undefined || txt === '') {
            txt = ''
        } else {
            txt = txt + showSpinner;
        }
        DisableButton(btn, txt);
    } else {
        if (!txt || txt == undefined || txt === '') {
            txt = ''
        } else {
            txt = txt + showSpinner;
        }
        EnableButton(btn, txt);
    }

    function EnableButton(pBtn, pText) {
        if (pText != '') {
            pBtn.html(pText);
        }

        pBtn.prop('disabled', false);
    }

    function DisableButton(pBtn, pText) {
        if (pText != '') {
            pBtn.html(pText);
        }
        pBtn.prop('disabled', true);
    }
}

function doModalProgress2(pContextID, heading, pMethod, params) {

    html = '<div id="dynamicModal' + pContextID + '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
    html += '<div class="modal-dialog" style="width:60%;">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header" style="padding: 2px 15px 2px 15px;">';
    html += '<a class="close" data-dismiss="modal">×</a>';
    html += '<h4>' + heading + '</h4>'
    html += '</div>';
    html += '<div class="modal-body" style="overflow:auto;">';
    html += '<div id="modal' + pContextID + '"><center> Loading <i class="fa fa-spinner fa-spin"></i></center></div>';
    html += '</div>';
    //html += '<div class="modal-footer">';
    //html += '<span class="btn btn-primary" data-dismiss="modal">Close</span>';
    //html += '</div>';  // content
    html += '</div>';  // dialog
    html += '</div>';  // footer
    html += '</div>';  // modalWindow
    jQuery('body').append(html);
    jQuery('#dynamicModal' + pContextID + ' .close').css('line-height', 2);
    jQuery('#dynamicModal' + pContextID + '').modal();
    jQuery('#dynamicModal' + pContextID + '').modal('show');
    jQuery('#dynamicModal' + pContextID + '').on('hidden.bs.modal', function (e) {
        jQuery(this).remove();
    });

    postRequest(pMethod, params, function (r) {
        r = JSON.parse(r.d);
        var temp = '';
        if (r.length <= 0) {
            temp = data404();
        } else {
            temp = CreateTableFromJSON(r);
        }
        jQuery('#modal' + pContextID).html(temp);
        //var table = $('.drillTable').DataTable({ responsive: true, bDestroy: true, });
        //$('.dataTables_filter input').addClass('show');
    });

}

function CreateTableFromJSON(mydata) {
    ////console.log({ mydata });
    var table = '';
    var thead = '<th>Sno</th>';
    var tbody = '';
    var key = Object.keys(mydata[0]);
    jQuery.each(key, function (i, item) {
        thead += '<th>' + item + '</th>';
    });
    thead = '<thead><tr class="bg-primary">' + thead + '</tr></thead>';

    var temp = '';
    jQuery.each(mydata, function (j, jitem) {
        var sno = j + 1;
        temp = '<td>' + sno + '</td>';
        jQuery.each(Object.keys(jitem), function (i, item) {
            var _value_ = '';
            if (item.toLowerCase() === 'month') {
                _value_ = monthNames[jitem[item] - 1];
            } else {
                _value_ = jitem[item];
            }
            temp += '<td>' + _value_ + '</td>';
        });
        tbody += '<tr>' + temp + '</tr>';
    });
    tbody = '<tbody>' + tbody + '</tbody>';
    table = '<table class="table table-sm compact nowrap table-responsve table-condensed table-bordered table-hover drillTable" style="width="100%;">' + thead + tbody + '</table>';
    return table;
}
// Added By Jameel - END

function roundBy2Precision(num) {
    //https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary

    return Math.round((num + Number.EPSILON) * 100) / 100
}

function roundByDigitsPrecision(num, dp) {
    var numToFixedDp = Number(num).toFixed(dp);
    return Number(numToFixedDp);
}