(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('AddressService', AddressService);
    AddressService.$inject = ['$http', '$rootScope'];
    function AddressService($http, $rootScope) {
        var service = {};
        service.create = create;
        service.remove=remove;
        service.getAllAddress=getAllAddress;

        return service;
        function create(itemId,userId,callback) {
            var response;
            $http.post('/api/users/userId/address', {"itemId":itemId,"userId":userId})
                .success(function (response) {
                    callback(response);
                })
                .error(function () {
                    response = {success: false, message: 'Username or password is incorrect'};
                    callback(response);
                });
        }

        function remove(itemId,userId,callback){
            var response;
            //TODO: delete method call
            $http.post('/api/users/delete', {"itemId":itemId,"userId":userId})
                .success(function (response) {
                    callback(response);
                })
                .error(function () {
                    response = {success: false, message: 'Username or password is incorrect'};
                    callback(response);
                });
        }

        function getAllAddress(userId,callback){
            var response;
            $http.get('/client/data/address.json')
                .success(function (response) {
                    callback(response);
                })
                .error(function () {
                    response = {success: false, message: 'Username or password is incorrect'};
                    callback(response);
                });
        }
    }
})();