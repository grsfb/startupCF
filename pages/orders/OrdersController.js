(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('OrdersController', OrdersController);
    OrdersController.$inject = ['SessionService','$location', 'OrderService', 'ImageService', 'FlashService'];

    function OrdersController(SessionService,$location, OrderService, ImageService, FlashService) {
        var vm = this;
        vm.orders = undefined;
        OrderService.getAllOrder(SessionService.get('currentUser').userId, function (response) {
            if (response.success) {
                vm.orders = response.data;
            } else {
                FlashService.error("Something not working. Please try later");
            }
        });

    }

})();