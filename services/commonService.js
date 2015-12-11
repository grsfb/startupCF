(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('CommonService', CommonService);
    CommonService.$inject = ['$http'];

    function CommonService($http) {
        var service = {};
        $http.defaults.headers.common['Content-Type'] = 'application/json';
        //$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
        var baseURL = "http://localhost:8080";
        //var baseURL = "http://localhost:63342/client/";
        service.get = getCall;
        service.post = postCall;
        service.delete = deleteCall;
        service.update = update;
        service.setAuth = setAuth;
        service.removeAuth = removeAuth;
        return service;
        function setAuth(authdata) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
        }

        function removeAuth() {
            $http.defaults.headers.common['Authorization'] = 'Basic ';
        }

        function getCall(relativeUrl, callback) {
            var response;
            $http.get(baseURL + relativeUrl)
                .success(function (res) {
                    response = {success: true, data: res};
                    callback(response);
                })
                .error(function (res) {
                    response = {success: false, data: res};
                    callback(response);
                });
        }

        function postCall(relativeUrl, data, callback) {
            var response;
            $http.post(baseURL + relativeUrl, data)
                .success(function (res) {
                    response = {success: true, data: res};
                    callback(response);
                })
                .error(function (res) {
                    response = {success: false, data: res};
                    callback(response);
                });
        }

        function deleteCall(relativeUrl, callback) {
            var response;
            $http.delete(baseURL + relativeUrl)
                .success(function (res) {
                    response = {success: true, data: res};
                    callback(response);
                })
                .error(function (res) {
                    response = {success: false, data: res};
                    callback(response);
                });
        }

        function update(relativeUrl, data, callback) {
            var response;
            $http.put(baseURL + relativeUrl, data)
                .success(function (res) {
                    response = {success: true, data: res};
                    callback(response);
                })
                .error(function (res) {
                    response = {success: false, data: res};
                    callback(response);
                });
        }

    }
})();