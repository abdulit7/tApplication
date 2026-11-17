'use strict';


var eid, uid, ecode, secKey, cid, lid, ename, isAdmin;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');
isAdmin = getLocalStorageItem_String('isAdmin');

var SenderID, ReferenceType, ReferenceID, ReferenceProcessID, TranID;
SenderID = getParameterByName('SenderID');
ReferenceType = getParameterByName('ReferenceType');
ReferenceType = ReferenceType == null ? 'Communication' : ReferenceType;
ReferenceID = getParameterByName('ReferenceID');
ReferenceProcessID = getParameterByName('ReferenceProcessID');
TranID = getParameterByName('TranID');



var _ReferenceType = ReferenceType;
var communicationHub;
var globalUserList = [];

$(function () {
    init();
    getUserList();
    $('#loginUser').html('<i class="fa fa-user"></i>&nbsp;' + ename);
    var docHeight = $(window).height() - 100;
    $('.chatPage').css('height', docHeight + 'px');
    $('#chatResult').css('height', docHeight - 120 + 'px');
    $('#userList').css('height', docHeight - 120 + 'px');
});


function openChat(pEid, pEname) {

    $('#curentActiveUserTitle').html('&nbsp;&nbsp;' + pEname);
    $('#currentEmpID').val(pEid);
    getUserChat(0, 0, 0, pEid, true, _ReferenceType, 0);

    $('#mainPage').slideUp();
    $('#chatPage').slideDown();
    $('#unread' + pEid).remove();
    //$('#chatResult').append(template);
    //doModal('Eployee 12', template);
}

function closeChat() {
    $('#mainPage').slideDown();
    $('#chatPage').slideUp();
    $('#chatResult').html('');
}

function init() {
    communicationHub = $.connection.communicationHub;
    $.connection.hub.start().done(function () { });
    registerClientMethods(communicationHub);
}



function registerClientMethods(communicationHub) {
    communicationHub.client.Refresh = function () {
        if (jQuery('#currentEmpID').val() > 0) {
            var _lstTranID = "0"; //jQuery('#ctl00_ContentPlaceHolder1_hidLastTranID').val();
            //alert(_lstTranID);
            getUserChat(0, _lstTranID, 0, jQuery('#currentEmpID').val(), true, _ReferenceType, 0);
        }
        getUserList();


    }
}


function getUserList() {
    //alert();
    var data = {
        pReferenceType: _ReferenceType
    }
    postRequest('GetUserList', data, function (r) {
        globalUserList = JSON.parse(r.d);
        var res = JSON.parse(r.d);
        var template = '';

        renderUserList(globalUserList);

        ////console.log(res);
    });
}

function renderUserList(pData) {
    var template = '';
    if (pData.length <= 0) {
        template = '<br><center>No User Found!</center>';
        $('#userList').html(template);
        return;
    }


    var finalData = [];
    var senderEmployee;
    var senderEmployeename;
    senderEmployee = SenderID;
    if (SenderID > 0) {
        var _data = pData.filter(function (value) { return value.EmployeeID == senderEmployee; })
        if (_data.length > 0) {
            jQuery.each(_data, function (i, item) { item.bg = '#000'; finalData.push(item); });
            senderEmployeename = _data[0].EmployeeName;
            _data = pData.filter(function (value) { return value.EmployeeID != senderEmployee; })
            jQuery.each(_data, function (i, item) { finalData.push(item); });
        } else {
            SenderID = -1;
            finalData = pData;
        }
    } else {
        finalData = pData;
    }

    $.each(finalData, function (i, item) {

        var para = item.EmployeeID + '^' + item.EmployeeName;
        var unRead = item.UnreadMsg > 0 ? '<span id="unread' + item.EmployeeID + '" class="badge pull-right">' + item.UnreadMsg + '</span>' : '';
        var lastMsg = item.LastMessage !== '' ? item.LastMessage.split('^')[0] : '';  //.length > 0 ? item.LastMessage : '';
        var lastMsgDate = item.LastMessage !== '' ? item.LastMessage.split('^')[1] : '';
        var tdate = item.LastMessage !== '' ? new Date(item.LastMessage.split('^')[1]) : '';
        var today = new Date();
        if (tdate !== '') {

            if (tdate.getDay() === today.getDay() && tdate.getMonth() === today.getMonth() && tdate.getFullYear() === today.getFullYear()) {
                //tdate = tdate.getHours() + ':' + tdate.getMinutes();
                tdate = formatAMPM(tdate);
            } else {
                tdate = tdate.getDay() + '/' + tdate.getMonth() + '/' + tdate.getFullYear();
            }
        }
        if (isHTML(lastMsg)) {
            lastMsg = 'can\'t preview this message.';
        }

        template += '<li class="item" style="border-left:2px solid ' + item.bg + ';padding: 6px;" onclick="openChat(' + item.EmployeeID + ' ,\'' + item.EmployeeName + '\');">' +
            '<div class="product-img">' +
            '<img class="img img-responsive img-circle img-thumbnail"  src="https://cdn3.iconfinder.com/data/icons/linecons-interface/512/user_avatar-128.png" alt="Product Image" style="width:45px;height: 45px;">' +
            '</div>' +
            '<div class="product-info">' +
            '<a href="javascript:void(0)" class="product-title">' + item.EmployeeName +
            '<span class="label pull-right">' + tdate + '</span></a>' +
            '<span class="product-description">' +
            lastMsg.substr(0, 30) + '...' +
            '<span class="pull-right">' +
            '<div class="">' + unRead + '</div>' +
            '</span>' +
            '</span>' +
            '</div>' +
            '</li>';
    })

    $('#userList').html(template);

    if (SenderID != -1 && SenderID > 0) {
        openChat(SenderID, senderEmployeename);
    }

    //$('.usritm' + $('#currentEmpID').val()).addClass('selectedUser');
}


function getUserChat(pConversationID, pLastTranID, pLastUpdateID, pReciverID, pIsNewChat, pReferenceType, pReferenceID) {
    var data =
    {
        ConversationId: pConversationID,
        LastUpdateId: pLastUpdateID,
        ReceiverID: pReciverID,
        IsNewChat: pIsNewChat,
        LastTranID: pLastTranID,
        ReferenceType: pReferenceType,
        ReferenceID: pReferenceID
    }

    // if (chatInterval) {
    //     chatInterval = clearInterval(chatInterval);
    // }


    //jQuery('#chatResult').html('<center>Loading <i class="fa fa-spinner fa-spin"></i></center>');
    $('#lblProgress').html(progress('<br>Loading '));
    postRequest('GetUpdates', data, function (r) {
        r.d = JSON.parse(r.d);
        ////console.log(r.d);
        $('#lblProgress').html('');
        if (r.d.length <= 0) {
            if (pIsNewChat) {
                jQuery('#chatResult').html('<center>Chat not start yet!</center>');
            } else {
                jQuery('#chatResult').append('');
            }
            return;
        }

        if (r.d.length > 0) {
            var template = '';
            jQuery.each(r.d, function (i, item) {
                var isRead = '';
                if (item.IsRead === true) {
                    isRead = ' &nbsp;<i class="fa fa-check" style="color:#80D8FF;"></i>';
                } else {
                    isRead = ' &nbsp;<i class="fa fa-check" style="color:#ddd;"></i>';
                }


                var senderDiv = '';
                //var reciverDiv = '';
                if (item.CssClass.indexOf('Sender') > -1) {
                    isRead = '';
                }

                //senderDiv = '<div style="text-align:right;" ><div class="panel ' + item.CssClass + '"><p>' + item.MessageText + '</p> <span class="pull-right itemdate">' + item.TranDate + isRead + '</span> </div></div>';
                var lblPositionReceiver = item.CssClass === 'Receiver' ? 'right' : 'left';
                var lblPositionSender = lblPositionReceiver === 'left' ? 'right' : 'left';
                var messageBoxShadow = '';
                messageBoxShadow = item.CssClass === 'Receiver' ? 'background:#f1f1f1;' : 'background:#ffffff;'
                senderDiv =

                    '<div class="direct-chat-msg ' + lblPositionReceiver + '">' +
                    '<div class="direct-chat-info clearfix">' +
                    '<span class="direct-chat-name pull-' + lblPositionReceiver + '">' + item.Author + '</span>' +
                    '<span class="direct-chat-timestamp pull-' + lblPositionSender + '">' + isRead + item.TranDate + '</span>' +
                    '</div>' +
                    '<img class="direct-chat-img" src="https://cdn3.iconfinder.com/data/icons/linecons-interface/512/user_avatar-128.png" alt="message user image">' +
                    '<div class="direct-chat-text" style="' + messageBoxShadow + '" >' +
                    item.MessageText +
                    '</div>' +
                    '</div>';

                //} else {
                //senderDiv = '<div style="text-align:left;"><div class="panel ' + item.CssClass + '"><p>' + item.MessageText + '</p> <span class="pull-right itemdate">' + item.TranDate + '</span> </div></div>';
                //}
                template += senderDiv;
                //$("#contentarea").scrollTop($("#contentarea")[0].scrollHeight);
                //scrollToBottom('result');

                if (i === r.d.length - 1) {
                    //alert(item.TranID);
                    //jQuery('#ctl00_ContentPlaceHolder1_hidLastTranID').val(item.TranID);
                }

            });

            if (pIsNewChat) {
                jQuery('#chatResult').html(template);
            } else {
                jQuery('#chatResult').append(template);
            }
            scrollToBottom('chatResult');
        } else {
            template = '';
            jQuery('#chatResult').html('');
        }

    });

}

function searchUser(pUser) {

    var filterData = globalUserList.filter(function (value) {
        return value.EmployeeData.toLowerCase().indexOf(pUser.toLowerCase()) > -1;
    });

    renderUserList(filterData);
}

$('#clearSearch').click(function (e) {
    $('#txtSearch').val('');
    renderUserList(globalUserList);
});

$('#btnSend').click(function (e) {

    var _msg = jQuery('#txtinput').val();
    if (_msg === '') { return; }

    var data = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        pCompanyID: cid,
        ConversationId: 0,
        update: _msg,
        ReceiverID: jQuery('#currentEmpID').val(),
        ReferenceType: _ReferenceType,
        ReferenceID: ReferenceID,
        ReferenceProcessID: ReferenceProcessID,
        ReplyReferenceTranID: 0
    };

    jQuery('#txtinput').val('');
    communicationHub.server.sendUpdate(data.pSecKey, data.pEmployeeID, data.pEmployeeRefNo, data.pUserID, data.pCompanyID, data.ConversationId, data.update, data.ReceiverID, data.ReferenceType, data.ReferenceID, data.ReferenceProcessID, data.ReplyReferenceTranID);

});

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function isHTML(str) {
    var a = document.createElement('div');
    a.innerHTML = str;

    for (var c = a.childNodes, i = c.length; i--;) {
        if (c[i].nodeType == 1) return true;
    }

    return false;
}

function scrollToBottom(pstrID) {
    var objDiv = document.getElementById(pstrID);
    objDiv.scrollTop = objDiv.scrollHeight;
}