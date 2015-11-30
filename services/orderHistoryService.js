(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('OrderHistoryService', OrderHistoryService);
    OrderHistoryService.$inject = ['$http'];
    function OrderHistoryService($http) {
        var baseURL = "http://localhost:8080";
        var service = {};
        service.create = create;
        service.remove = remove;
        service.getAllAddress = getAllAddress;

        return service;
        function create(order, callback) {
            var response;
            $http.post(baseURL + '/address/add', {"address": address})
                .success(function (res) {
                    response = {success: true, data: res};
                    callback(response);
                })
                .error(function (res) {
                    response = {success: false, data: res};
                    callback(response);
                });
        }

        function remove(addressId, callback) {
            var response;
            $http.delete(baseURL + '/address/delete/' + addressId)
                .success(function (res) {
                    response = {success: true, data: res};
                    callback(response);
                })
                .error(function (res) {
                    response = {success: false, data: res};
                    callback(response);
                });
        }

        function getAllAddress(userId, callback) {
            var response;
            $http.get(baseURL + '/address/' + userId + '/all')
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