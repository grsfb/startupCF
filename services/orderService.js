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
        service.getAllItemForOrder = getAllItemForOrder;
        service.sendInvoice = sendInvoice;
        return service;
        function create(order, callback) {
            CommonService.post('/order/add', order, callback);
        }

        function getAllOrder(userId, callback) {
            CommonService.get('/order/userOrder/' + userId + '/all', callback);
        }

        function getAllItemForOrder(orderId, callback) {
            CommonService.get('/order/' + orderId + '/all', callback);
        }

        function sendInvoice(request, callback) {
            CommonService.post('/invoice/send', request, callback);
        }
    }
})();