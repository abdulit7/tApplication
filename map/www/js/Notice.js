
'use strict';

var eid, uid, ecode, secKey, cid, lid, ename;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');

var _IsFlashOnly = getParameterByName('IsFlashOnly');
var _showMsg = getParameterByName('showMsg');


jQuery(function ($) { //just like $(document).ready()
    var scheduleDate, dateformat;

    init();
    if (_showMsg === 'true') {
        //toastr.success('Survey Submitted Succesfully!');
    }
});

function init() {
    populateNoticeList();
}

function populateNoticeList() {
    try {
        var pIsGetFlashNoticesOnly_ = false;
        _IsFlashOnly === 'true' ? pIsGetFlashNoticesOnly_ = true : pIsGetFlashNoticesOnly_ = false;
        postRequest('GetNotices', { pIsGetFlashNoticesOnly: pIsGetFlashNoticesOnly_, pIsShowTotalCountOnly: false }, populateNoticeList_Callback);
    } catch (error) {
        toastr.error('Something is wrong! ');
    }
}


function populateNoticeList_Callback(res) {
    var json = JSON.parse(res.d);
    var NoticeHead = json['Notice'];
    var NoticeDetail = json['NoticeDetail'];
    //console.log(NoticeDetail);
    var template = '';
    //var surveyTitle = $('#surveyTitle');
    var fromDate;
    var toDate;
    var SurveyList = $('#SurveyList');
    var d = NoticeHead;
    //console.log(d);
    if (!isEmptyObj(d)) {
        $('#pnlHeading').html('Announcement <span class="badge">' + d.length + '</span>');

        var db = localStorage.getItem('noticeChecker');
        db = JSON.parse(db);

        $.each(d, function (i) {
            //var db = localStorage.getItem('noticeChecker');
            fromDate = getFormattedDateNew(d[i].FromDate, false);
            toDate = getFormattedDateNew(d[i].ToDate, false);

            var attachmentTemplate = '';
            var thisNoticeDetail = NoticeDetail.filter(function (item) {
                return item.NoticeID === d[i].NoticeID;
            });
            var AttachmentBaseUrl = getBaseUrl() + 'Noticefiles/';
            if (!isEmptyObj(thisNoticeDetail)) {
                $.each(thisNoticeDetail, function (j) {
                    var AttachmentUrl = AttachmentBaseUrl + encodeURIComponent(thisNoticeDetail[j].FileName.trim());
                    var fileType = thisNoticeDetail[j].FileType.toLowerCase();
                    if (fileType.indexOf('image') > -1) {
                        fileType = ' (Image)';
                    } else if (fileType.indexOf('video') > -1) {
                        fileType = ' (Video)';
                    } else if (fileType.indexOf('application') > -1) {
                        fileType = ' (Document)';
                    } else {
                        fileType = '';
                    }
                    attachmentTemplate += "<li class='list-group-item'><a href=" + AttachmentUrl + "><i class='fa fa-paperclip'></i><span style='font-weightnormal;'> " + thisNoticeDetail[j].FileName.substr(2) + "</span></a><span style='color:#ddd;' class='pull-right'><small>" + fileType + "</small></span><br></li>";
                });
            } else {
                attachmentTemplate = '<small>No Attachment(s) Found!</small>';
            }

            template +=

                '<div class="panel panelshadow">' +
                '<div class="panel-body">' +
                '<span id="surveyTitle" class="surveytitle"> <small><i style="font-size:18px" class="fa fa-bell"></i></small> ' + d[i].NoticeTitle + ' </span>' +
                '<div class="row">' +
                '<div class="objectivebox">' +
                '<b>Description ...</b>' +
                '<div onClick="toggleDesc(' + d[i].NoticeID + ');" class="pull-right toggleDesc"><i id="icon' + d[i].NoticeID + '" class="fa fa-chevron-down fa-chevron-up" aria-hidden="true"></i></div>' +
                '<hr>' +
                '<div id="p' + d[i].NoticeID + '" style="display:none;">' + d[i].Description + '</div>' +
                '</div>' +
                '<div class="objectivebox">' +
                '<b>Attachment(s) ...</b>' +
                '<div onClick="toggleDesc(' + d[i].NoticeID + 7860010 + ',0);" class="pull-right toggleDesc"><i id="icon' + d[i].NoticeID + 7860010 + '" class="fa fa-chevron-down fa-chevron-up" aria-hidden="true"></i></div>' +
                '<hr>' +
                '<div id="p' + d[i].NoticeID + 7860010 + '" style="display:none;">' + attachmentTemplate + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';


            // <span style="display:${display};" class="pull-right markread">Read <input id="${d[i].NoticeID}" ${isChecked} onclick="handleClick(this);" type="checkbox" class="chkread"></input></span>
        });
        SurveyList.html(template);
    } else {
        SurveyList.html('<small style="font-size:11px;"> &nbsp;&nbsp;No Announcement(s) Found!</small>');
    }

}


function toggleDesc(id, Attachement) {
    var state = $('#p' + id).css("display");
    $('#p' + id).slideToggle();
    $('#icon' + id).toggleClass('fa-chevron-down');

    if (state === 'none') {
        if (!Attachement) {
            handleClick(id);
        }
    }
}


function handleClick(id) {
    var db = localStorage.getItem('noticeChecker');
    //if (!db) { db = localStorage.setItem('noticeChecker', '[{}]'); }
    // var isChecked = cb.checked;
    var NoticeID = id;
    var dtExist = {};
    var db = JSON.parse(db);
    var newRow;
    dtExist = $(db).filter(function (i) {
        return db[i].NoticeID === NoticeID;
    });
    if (dtExist.length > 0) {
        //isChecked === true ? dtExist[0].IsRead = true : dtExist[0].IsRead = false
        //localStorage.setItem('noticeChecker', JSON.stringify(db));
    } else {
        //isChecked === true ? newRow = { NoticeID: NoticeID, IsRead: true } : newRow = { NoticeID: NoticeID, IsRead: false }
        newRow = { NoticeID: NoticeID, IsRead: true }
        db.push(newRow);
        localStorage.setItem('noticeChecker', JSON.stringify(db));
    }

    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: cid,
        pNoticeID: NoticeID,
        pIP: getLocalStorageItem_String('DeviceID')
    }
    //console.log(params);
    $.post(getBaseUrl() + "wsttmapp.asmx/" + 'SaveNoticeReadLog', params, function (data) {
        // console.log(data);
    });

}



function markRead(id) {
    var db = localStorage.getItem('noticeChecker');
    if (!db) {
        db = localStorage.setItem('noticeChecker', '[]');
    }
    //console.log(db);
    db = JSON.parse(db);

    var dtExist = $(db).filter(function (i) {
        return db[i].NoticeID === id;
    });
    // console.log(dtExist);
    var newData;
    if (dtExist.length > 0) {
        dtExist[0].IsRead === false;

        //dtExist = js
        db = JSON.stringify(db);
        db = localStorage.setItem('noticeChecker', db);

    } else {
        newData = {
            NoticeID: id,
            IsRead: true
        }
        db.push(newData);
        db = JSON.stringify(db);
        db = localStorage.setItem('noticeChecker', db);
    }




    //localStorage.setItem('myCat', 'Tom');
    //var cat = localStorage.getItem('myCat');
}


 // var a = 'a';
            // var isChecked = 'unchecked';
            // var display = 'block';
            // if (_IsFlashOnly === 'true') {
            //     display = 'block';
            // }

            // var isRead;
            // var arr;
            // arr = db.filter(function(item){
            //     console.log( item.NoticeID , d[i].NoticeID);
            //     return  parseInt( item.NoticeID) === parseInt( d[i].NoticeID);
            // });
            // console.log({arr});
            // if (arr.length > 0){
            //     isChecked = arr[0].IsRead === true ? 'checked' : '';
            // }

            // console.log(isChecked);


// function IsReaded(arr, currentId) {

//     $.each(arr, function (i) {
//         if (arr[i].NoticeID === currentId) {
//             return true;
//         }
//     });
//     return false;
// }