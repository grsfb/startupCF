(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CheckoutController', CheckoutController);
    CheckoutController.$inject = ['$rootScope', '$cookieStore', '$location', 'FlashService'];

    function CheckoutController($rootScope, $cookieStore, $location, FlashService) {
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
                $cookieStore.remove('shippingCost');
                $cookieStore.remove('cartTotal');
                $location.path('success');
            }
        }

        function removeErrorMsg() {
            FlashService.clear();
        }
    }
})();