(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('OrderService', OrderService);

    OrderService.$inject = ['CommonService'];
    function OrderService(CommonService) {
        var service = {};
        service.create = create;
        service.getAllOrder = getAllOrder;

        return service;
        function create(order, callback) {
            CommonService.post('/order/add', order, callback);
        }

        function getAllOrder(userId, callback) {
            CommonService.get('/order/' + userId + '/all', callback);
        }
    }
})();