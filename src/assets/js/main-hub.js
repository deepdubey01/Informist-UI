/*!
 * ASP.NET SignalR JavaScript Library v2.2.0
 * http://signalr.net/
 *
 * Copyright Microsoft Open Technologies, Inc. All rights reserved.
 * Licensed under the Apache 2.0
 * https://github.com/SignalR/SignalR/blob/master/LICENSE.md
 *
 */

/// <reference path="jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
(function ($, window, undefined) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
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
                } else {
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

        proxies['InformistService'] = this.createHubProxy('InformistService');
        proxies['InformistService'].client = {};
        proxies['InformistService'].server = {
            heartBeat: function (strmessage) {
                return proxies['InformistService'].invoke.apply(proxies['InformistService'], $.merge(["HeartBeat"], $.makeArray(arguments)));
            },

            requestLogin: function (stremailid, strsessionid) {
                return proxies['InformistService'].invoke.apply(proxies['InformistService'], $.merge(["RequestLogin"], $.makeArray(arguments)));
            },

            requestMenuDetails: function (strUserID, strAccessToken, packageCode) {
                return proxies['InformistService'].invoke.apply(proxies['InformistService'], $.merge(["requestMenuDetails"], $.makeArray(arguments)));
            },

            requestNews: function (rwire) {
                return proxies['InformistService'].invoke.apply(proxies['InformistService'], $.merge(["requestNews"], $.makeArray(arguments)));
            },

            requestSearchNews: function (rwire, strkeyword) {
                return proxies['InformistService'].invoke.apply(proxies['InformistService'], $.merge(["requestSearchNews"], $.makeArray(arguments)));
            },

            requestSearchNewsOnFly: function (strwire, strquery) {
                return proxies['InformistService'].invoke.apply(proxies['InformistService'], $.merge(["requestSearchNewsOnFly"], $.makeArray(arguments)));
            },

            requestStory: function (strStoryID) {
                return proxies['InformistService'].invoke.apply(proxies['InformistService'], $.merge(["requestStory"], $.makeArray(arguments)));
            },

            requestUserDetaisl: function (strUserID, strAccessToken) {
                return proxies['InformistService'].invoke.apply(proxies['InformistService'], $.merge(["requestUserDetaisl"], $.makeArray(arguments)));
            },

            updatePreference: function (strPreference) {
                return proxies['InformistService'].invoke.apply(proxies['InformistService'], $.merge(["updatePreference"], $.makeArray(arguments)));
            }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/informist", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));