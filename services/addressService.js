(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('AddressService', AddressService);
    AddressService.$inject = ['CommonService'];
    function AddressService(CommonService) {

        var service = {};
        service.create = create;
        service.remove = remove;
        service.getAllAddress = getAllAddress;

        return service;
        function create(address, callback) {
            CommonService.post('/address/add', address, callback);
        }

        function remove(addressId, callback) {
            CommonService.delete('/address/delete/' + addressId, callback);
        }

        function getAllAddress(userId, callback) {
            CommonService.get('/address/' + userId + '/all', callback);
        }
    }
})();