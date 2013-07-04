/**
 * Appcelerator Titanium Mobile Modules
 * Copyright (c) 2010-2013 by Appcelerator, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */

var Q = require('q');

module.exports = (function defineModule() {


    function crmOnlineLogin(connection) {
        var  deferred = Q.defer();

        deferred.resolve({
            token: {user: connection.user, password: connection.password},
            expires: new Date() + 24*60*60*1000
        });

        return deferred.promise;
    }

    function _testAuthToken(token) {
        var service = serviceFactory(token);

        return service.whoAmI()
            .then(function onSuccess(userInfo) {
                return true;
            });
    }

    function verifySession(authToken) {
        return _testAuthToken(authToken);
    }

    function deserializeAuthToken(authToken) {
        return JSON.parse(new Buffer(authToken, 'base64').toString('utf8'));
    }

    function serializeAuthToken(authToken) {
        return new Buffer(JSON.stringify(authToken)).toString("base64");
    }

    function getTokenFromRequestHeaders(requestHeaders) {
        if (requestHeaders == null || !requestHeaders['x-session']) {
            return;
        }

        return deserializeAuthToken(requestHeaders['x-session']);
    }

    return {
        verifySession: verifySession,
        deserializeAuthToken: deserializeAuthToken,
        serializeAuthToken: serializeAuthToken,
        crmOnlineLogin: crmOnlineLogin,
        getTokenFromRequestHeaders: getTokenFromRequestHeaders
    };

}());