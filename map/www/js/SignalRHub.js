/*!
 * ASP.NET SignalR JavaScript Library v1.1.4
 * http://signalr.net/
 *
 * Copyright Microsoft Open Technologies, Inc. All rights reserved.
 * Licensed under the Apache 2.0
 * https://github.com/SignalR/SignalR/blob/master/LICENSE.md
 *
 */

// /// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
// /// <reference path="jquery.signalR.js" />
(function ($, window) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/hubs.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                }
                else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies.accessControlHub = this.createHubProxy('accessControlHub');
        proxies.accessControlHub.client = {};
        proxies.accessControlHub.server = {
            delete: function (pEnrollments, pDeviceID, pSource, pTarget, pTargetDeviceID, pCompanyID) {
                return proxies.accessControlHub.invoke.apply(proxies.accessControlHub, $.merge(["Delete"], $.makeArray(arguments)));
            },

            saveDeviceToDatabase: function (pEnrollments, pDeviceID, pSource, pTarget, pTargetDeviceID, pCompanyID) {
                return proxies.accessControlHub.invoke.apply(proxies.accessControlHub, $.merge(["SaveDeviceToDatabase"], $.makeArray(arguments)));
            }
        };

        proxies.chatHub = this.createHubProxy('chatHub');
        proxies.chatHub.client = {};
        proxies.chatHub.server = {
            connect: function (userName) {
                return proxies.chatHub.invoke.apply(proxies.chatHub, $.merge(["Connect"], $.makeArray(arguments)));
            },

            sendMessageToAll: function (userName, message) {
                return proxies.chatHub.invoke.apply(proxies.chatHub, $.merge(["SendMessageToAll"], $.makeArray(arguments)));
            },

            sendPrivateMessage: function (toUserId, message) {
                return proxies.chatHub.invoke.apply(proxies.chatHub, $.merge(["SendPrivateMessage"], $.makeArray(arguments)));
            }
        };

        proxies.communicationHub = this.createHubProxy('communicationHub');
        proxies.communicationHub.client = {};
        proxies.communicationHub.server = {
            getUpdate: function (pSecKey, pEmployeeID, pEmployeeRefNo, pUserID, pCompanyID, ConversationId, LastUpdateId, ReceiverID, IsNewChat, LastTranID, ReferenceType, ReferenceID) {
                return proxies.communicationHub.invoke.apply(proxies.communicationHub, $.merge(["GetUpdate"], $.makeArray(arguments)));
            },

            getUserList: function (pReferenceType) {
                return proxies.communicationHub.invoke.apply(proxies.communicationHub, $.merge(["GetUserList"], $.makeArray(arguments)));
            },

            onConnecte: function (pName) {
                return proxies.communicationHub.invoke.apply(proxies.communicationHub, $.merge(["OnConnecte"], $.makeArray(arguments)));
            },

            send: function (pName) {
                return proxies.communicationHub.invoke.apply(proxies.communicationHub, $.merge(["Send"], $.makeArray(arguments)));
            },

            sendUpdate: function (pSecKey, pEmployeeID, pEmployeeRefNo, pUserID, pCompanyID, ConversationId, update, ReceiverID, ReferenceType, ReferenceID, ReferenceProcessID, ReplyReferenceTranID) {
                return proxies.communicationHub.invoke.apply(proxies.communicationHub, $.merge(["SendUpdate"], $.makeArray(arguments)));
            }
        };

        return proxies;
    };

    //signalR.hub = $.hubConnection("/TimeTraxWeb/signalr", { useDefaultPath: false }); ---- OLD

    var signalRPath = '';//window.location.href.toLowerCase().indexOf('timetraxweb') > -1 ? '/TimeTraxWeb/signalr' : getBaseUrl() + 'signalr';
    //alert(signalRPath);
    signalRPath = localStorage.getItem('baseurl') + 'signalr'; //'http://localhost:3582/signalr'; //'http://localhost:3580/TimeTraxWeb/signalr';
    //signalRPath = 'http://ttserver:8888/signalr';

    signalR.hub = $.hubConnection(signalRPath, { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));