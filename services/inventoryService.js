(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('InventoryService', InventoryService);
    InventoryService.$inject = ['$http'];
    function InventoryService($http) {
        var service = {};
        service.getAllItems = getAllItems;

        return service;
        function getAllItems(callback) {
            var response;
            $http.get('/client/data/items.json')
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