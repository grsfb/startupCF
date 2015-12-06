(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CheckoutController', CheckoutController);
    CheckoutController.$inject = ['$rootScope', '$cookieStore', '$location', 'FlashService', 'OrderService'];

    function CheckoutController($rootScope, $cookieStore, $location, FlashService, OrderService) {
        var vm = this;
        vm.shippingCost = $cookieStore.get('shippingCost');
        vm.cartTotal = $cookieStore.get('cartTotal');
        vm.removeErrorMsg = removeErrorMsg;
        vm.checkAndPlaceOrder = checkAndPlaceOrder;
        vm.order = {};

        function checkAndPlaceOrder() {
            vm.order.address = $rootScope.deliverAddress;
            vm.order.paymentMethod = "COD";
            if (vm.order.address == undefined) {
                FlashService.Error("Delivery address is not selected");
            }
            if (vm.order.paymentMethod == undefined) {
                FlashService.Error("Payment method is not selected");
            }
            if (vm.order.address != undefined && vm.order.paymentMethod != null) {
                var order = new Order($cookieStore.get('currentUser').userId,
                    vm.order.address.deliverAddress, $cookieStore.get('itemIds'), vm.order.paymentMethod
                );
                OrderService.create(order, function (response) {
                    if (response.success) {
                        $cookieStore.remove('shippingCost');
                        $cookieStore.remove('cartTotal');
                        $cookieStore.remove('itemIds');
                        $location.path('success');
                    } else {
                        FlashService.Error("Something not working. Please try later");
                    }
                });

            }
        }

        function removeErrorMsg() {
            FlashService.clear();
        }

        function Order(userId, addressId, items, paymentType) {
            this.userId = userId;
            this.deliveryAddress = {"addressId": addressId};
            this.items = items;
            this.paymentType = paymentType;
        }
    }
})();