//$(function(){

function initChart() {
    $(function() {

        var oc = $('#chart-container').orgchart({
            'data': $('#ul-data'),
            depth: 999,
            'verticalDepth': 3,
            'draggable': true

        });

    });
}

//Sys.Application.add_init(function() {
//    var prm = Sys.WebForms.PageRequestManager.getInstance();
//    prm.add_endRequest(function() {
//    var oc = $('#chart-container').orgchart({
//        'data': $('#ul-data'),
//        depth: 999,
//        'verticalDepth': 3,
//        'draggable': true

//    });
//    });
//});


initChart();

