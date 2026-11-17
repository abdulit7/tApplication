// Imported from Projec One
// Modified by Abdul Moiz
// Dated : 2016-03-03


var windowUrl = '';      // window's url
function printPreviewDiv(elementId) {

    var printContent = document.getElementById(elementId);
    //var windowUrl = 'about:blank';      // window's url
    if (windowUrl == '') {
        windowUrl = 'about:blank';
    }
    var uniqueName = new Date();        // unique name
    var windowName = 'Print' + uniqueName.getTime();        // window's complete name
    var printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0,');  //
    var printPreviewObject = '<' + 'object id="printPreviewElement" width="0" height="0" classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"' + '><' + '/object' + '>';

    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write(printPreviewObject);

    //printWindow.document.write('<link href=../testprint.css rel=stylesheet type=text/css />');
    printWindow.document.write('<' + 'scr' + 'ipt language=JavaScript>');
    printWindow.document.write('printPreviewElement.ExecWB(7, 2);');
    printWindow.document.write('printPreviewElement.outerHTML = "";');
    printWindow.document.write("<" + "/scr" + "ipt>");

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    return false;
}

function printdiv(printpage, pStyleElementID) { // Copied from SAPT - Its working and showing backgrounf graphics in print.- Jameel 27-JAN-2021

    if (!pStyleElementID || pStyleElementID == undefined) {
        pStyleElementID = '';
    }

    var oldHead = document.head.innerHTML;
    //console.log(oldHead);
    var oldContent = document.body.innerHTML;
    var newContent = document.getElementById(printpage).innerHTML;

    document.head.innerHTML = "<style>" + pStyleElementID + " p{margin:0 !important;}</style>";
    document.body.innerHTML = newContent
    window.print();
    document.head.innerHTML = oldHead;
    document.body.innerHTML = oldContent;
    return false;

}

function printdiv_OLD(printpage, pStyleElementID) { // Its is not showing background graphics in print - Jameel 27-JAN-2021

    if (!pStyleElementID || pStyleElementID == undefined) {
        pStyleElementID = '';
    }

    var oldHead = document.head.innerHTML;
    //console.log(oldHead);
    var oldContent = document.body.innerHTML;
    var newContent = document.getElementById(printpage).innerHTML;

    //document.head.innerHTML = oldHead; //"<style>" + pStyleElementID + " p{margin:0 !important;}</style>";
    document.body.innerHTML = newContent    
    window.print();
    document.head.innerHTML = oldHead;
    document.body.innerHTML = oldContent;
    return false;

}


//OLD
function printdiv2(printpage, pStyleElementID) {
    var styleElement, styles;
    var headstr = "<html><head><title></title></head><body>";
    var footstr = "</body>";
    
    if (typeof pStyleElementID !== 'undefined' && pStyleElementID !== null) {
        styleElement = document.getElementById(pStyleElementID);
        if (typeof styleElement !== 'undefined' && styleElement !== null) {
            styles = styleElement.innerHTML;
            headstr = "<html><head><style>" + styles + "</style><title></title></head><body>";
        }
    }

    var newstr = document.all.item(printpage).innerHTML;
    var oldstr = document.body.innerHTML;

    document.body.innerHTML = headstr + newstr + footstr;
    window.print();
    document.body.innerHTML = oldstr;
    return false;
}