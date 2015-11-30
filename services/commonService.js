(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('CommonService', CommonService);
    CommonService.$inject = ['$http'];

    function CommonService($http) {
        var service = {};
        var baseURL = "http://localhost:8080";
        service.get = getCall;
        service.post = postCall;
        service.delete = deleteCall;
        return service;

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

    }
})();