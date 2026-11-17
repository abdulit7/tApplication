'use strict';

var d = new Date();
var month = d.getMonth() + 1;
var day = d.getDate();
var sysdate = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();

var varType;
var varUrl;
var varData;
var varContentType;
var varDataType;
var varProcessData;

var eid, uid, ecode, secKey, cid, lid, ename;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');

var _populateList = getParameterByName('populateList');
var _showMsg = getParameterByName('showMsg');

//Generic function to call AXMX/WCF  Service
jQuery(function ($) { //just like $(document).ready()
    var scheduleDate, dateformat;

    init();
    if (_showMsg === 'true') {
        toastr.success('Training Request Submitted Successfully!');
    }
});

function init() {
    populateList();
}

function populateList() {
    try {

        var Type, Url, Data, ContentType, DataType, ProcessData;
        Type = "POST";
        ContentType = "application/json; charset=utf-8";
        DataType = "json";
        ProcessData = true;
        Url = getBaseUrl() + "wsttmapp.asmx/GetAvailableTraining";
        Data = {
            pSecKey: secKey,
            pEmployeeID: eid,
            pEmployeeRefNo: ecode,
            pUserID: uid,
            pCompanyID: cid,
            pTrainingID: 0
        }
        Data = JSON.stringify(Data);

        $.ajax({
            type: Type, //GET or POST or PUT or DELETE verb
            url: Url, // Location of the service
            data: Data, //Data sent to server
            contentType: ContentType, // content type sent to server
            dataType: DataType, //Expected data format from server
            processdata: ProcessData, //True or False           
            success: function (result) {//On Successfull service call
                // console.log(result);
                var d = JSON.parse(result.d);
                // console.log(d);
                var html = '';
                var finalhtml = '';
                if (!isEmptyObj(d)) {
                    $.each(d, function (i) {
                        html = '';
                        var FromDate = getDateByASPNETTimeStamp(d[i].FromDate);
                        var ToDate = getDateByASPNETTimeStamp(d[i].ToDate);
                        var dateformat = getLocalStorageItem_String('dateformat');
                        FromDate = DTHelper.GetFormattedDate(FromDate, dateformat)
                        ToDate = DTHelper.GetFormattedDate(ToDate, dateformat)
                        var applied = d[i].IsApplied
                        var btnclass = "btn btn-sm btn-success btn-block";
                        var btnText = 'Apply Now';

                        if (applied === 'Yes') {
                            btnclass = "btn btn-sm btn-default btn-block disabled";
                            var btnText = 'Already applied';
                        }

                        var actionButtons = '<a href="TrainingRequest.html?trainingid=' + d[i].TrainingID + '"' +
                            'class="' + btnclass + '">' + btnText + '</a>';

                        html +=
                            '<tr><td>Training</td><td><span class="surveytitle">' + toTitleCase(d[i].TrainingTitle) + '</span></td></tr>' +
                            '<tr><td>From</td><td>' + FromDate + '</td></tr>' +
                            '<tr><td>To</td><td>' + ToDate + '</td></tr>' +
                            '<tr><td>Trainer</td><td>' + toTitleCase(d[i].TrainerName) + '</td></tr>' +
                            '<tr><td>Venue</td><td>' + toTitleCase(d[i].TrainingVenue) + '</td></tr>' +
                            '<tr><td colspan="2">' + actionButtons + '</td></tr>';
                        // '<li class="list-group-item assignmentlist">' +
                        // '<span class="EmployeeTitle">' + toTitleCase(d[i].TrainingTitle) + '</span>' +
                        // '<hr>' +
                        // '<span style="font-weight:bold;"> <small>From :</small> ' + FromDate + '</span>' +
                        // '<span style="font-weight:bold;"> <small>To :</small> ' + ToDate + '</span>' +
                        // '<br>' +
                        // '<span style="font-weight:bold;"> <small>Trainer :</small> ' + toTitleCase(d[i].TrainerName) + '</span>' +
                        // '<br>' +
                        // '<span style="font-weight:bold;"> <small>Venue :</small> ' + toTitleCase(d[i].TrainingVenue) + '</span>' +
                        // '<hr>' + actionButtons + '</li>'
                        // ;

                        html = '<div class="shadowbox"><table class="table table-bordered table-condensed">' + html + '</table></div><br>';
                        finalhtml += html;

                    });

                } else {
                    html = '<small style="font-size:11px;"> &nbsp;&nbsp;No Trainings Found!</small>';
                }

                $("#TrainingList").html(finalhtml);

            },
            error: OnWsError_Toaster,// When Service call fails            
        });


    } catch (error) {
        toastr.error('Something is wrong! ');
    }


}

function toTitleCase(str) {
    return str.replace(/(?:^|\s)\w/g, function (match) {
        return match.toUpperCase();
    });
}

function gotoTrainingRequest(trainingid) {
    window.location.replace("TrainingRequest.html?trainingid=" + trainingid);
}



