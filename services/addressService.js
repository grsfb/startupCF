(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('AddressService', AddressService);
    AddressService.$inject = ['$http', '$rootScope'];
    function AddressService($http, $rootScope) {
        var baseURL="http://localhost:8080";
        var service = {};
        service.create = create;
        service.remove=remove;
        service.getAllAddress=getAllAddress;

        return service;
        function create(address,callback) {
            var response;
            $http.post(baseURL+'/address/add', {"address":address})
                .success(function (res) {
                    response={success:true,data:res};
                    callback(response);
                })
                .error(function (res) {
                    response = {success: false, data:res};
                    callback(response);
                });
        }

        function remove(addressId,callback){
            var response;
            //TODO: delete method call
            $http.delete(baseURL+'/address/delete/'+addressId)
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
            $http.get(baseURL+'/address/'+userId+'/all')
                .success(function (res) {
                    response={success:true,data:res};
                    callback(response);
                })
                .error(function (res) {
                    response = {success: false, data: res};
                    callback(response);
                });
        }
    }
})();