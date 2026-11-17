function getShortCuts(pOnlyVersionNo) {
    var str, version;
    version = '4.0.11'
    if (pOnlyVersionNo == null || pOnlyVersionNo == false) {
        str = '<footer style="" class="main-footer navbar-fixed-bottom">' +
            ' <div class="pull-right"> ' + version + ' </div> <strong> &copy; <span id="copyrightyear">' + new Date().getFullYear() + '</span> <a href="http://www.efroTech.com">EfroTech</a>.</strong> All rights reserved.' +
            '</footer>';
    } else {
        str = version;
    }

    return str;
}