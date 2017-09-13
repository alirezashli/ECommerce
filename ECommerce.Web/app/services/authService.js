(function () {
    'use strict';

    angular.module('EComApp').factory('authService', authService);

    authService.$inject = ['$http', '$q', 'localStorageService','ngAuthSettings'];

    function authService($http, $q, localStorageService, ngAuthSettings) {
        var serviceBase = 'http://localhost:51951/';
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: ""
        };
        var _externalAuthData = {
            provider: "",
            userName: "",
            externalAccessToken: ""
        };

        var _saveRegistration = function (registration) {
            _logOut();
            return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
                return response;
            });

        };

        var _registerExternal = function (registerExternalData) {
            var deferred = $q.defer();
            $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).then(function (response) {
                localStorageService.set('authorizationData', { token: response.data.access_token, userName: response.data.userName, refreshToken: "", useRefreshTokens: false });
                _authentication.isAuth = true;
                _authentication.userName = response.data.userName;
                _authentication.useRefreshTokens = false;

                deferred.resolve(response);

            },function (err, status) {
                _logOut();
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _login = function (loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
            if (loginData.useRefreshTokens) {
                data = data + "&client_id=" + ngAuthSettings.clientId;
            }
            var deferred = $q.defer();

            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function (response) { 
                    debugger;
                    if (loginData.useRefreshTokens) {
                        localStorageService.set('authorizationData', { token: response.data.access_token, userName: loginData.userName, refreshToken: response.data.refresh_token, useRefreshTokens: true });
                    }
                    else {
                        localStorageService.set('authorizationData', { token: response.data.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
                    }
                    _authentication.isAuth = true;
                    _authentication.userName = loginData.userName;
                    deferred.resolve(response);
                }, function (err, status) {
                    debugger;
                    _logOut();
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');
            _authentication.useRefreshTokens = false;
            _authentication.isAuth = false;
            _authentication.userName = "";

        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.useRefreshTokens = authData.useRefreshTokens;
            }
        }

        var _refreshToken = function () {
            var deferred = $q.defer();
            var authData = localStorageService.get('authorizationData');

            if (authData) {
                if (authData.useRefreshTokens) {
                    var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;
                    localStorageService.remove('authorizationData');
                    $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (response) {
                        localStorageService.set('authorizationData', { token: response.data.access_token, userName: response.userName, refreshToken: response.data.refresh_token, useRefreshTokens: true });
                        deferred.resolve(response);
                    },function (err, status) {
                        _logOut();
                        deferred.reject(err);
                    });
                }
            }

            return deferred.promise;
        };

        var _obtainAccessToken = function (externalData) {
            var deferred = $q.defer();
            $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).then(function (response) {
                localStorageService.set('authorizationData', { token: response.data.access_token, userName: response.data.userName, refreshToken: "", useRefreshTokens: false });
                _authentication.isAuth = true;
                _authentication.userName = response.data.userName;
                _authentication.useRefreshTokens = false;

                deferred.resolve(response);

            },function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.refreshToken = _refreshToken;

        authServiceFactory.obtainAccessToken = _obtainAccessToken;
        authServiceFactory.externalAuthData = _externalAuthData;
        authServiceFactory.registerExternal = _registerExternal;
        return authServiceFactory;
    }
})();