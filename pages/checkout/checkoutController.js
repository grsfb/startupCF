(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CheckoutController', CheckoutController);
    CheckoutController.$inject = ['SessionService', '$location', 'FlashService', 'OrderService'];

    function CheckoutController(SessionService, $location, FlashService, OrderService) {
        var vm = this;
        if (!SessionService.get('isOrderInProgress')) {
            FlashService.ClearAllFlashMessage();
            $location.path('#/home');
            return;
        }
        vm.shippingCost = SessionService.get('shippingCost');
        vm.cartTotal = SessionService.get('cartTotal');
        vm.checkAndPlaceOrder = checkAndPlaceOrder;
        vm.isPlacingOrder = false;
        vm.paymentType = "COD";
        vm.setPaymentType = setPaymentType;
        function setPaymentType(method) {
            vm.paymentType = method;
        }

        function verifyDeliveryAddress(address) {
            if (address == undefined) {
                FlashService.Error("Delivery address is not selected");
                return false;
            }
            return true;
        }

        function checkAndPlaceOrder() {
            var address = SessionService.get('deliverAddress');
            var estimatedDelivery = SessionService.get('estimatedDeliveryTime');
            if (verifyDeliveryAddress(address)) {
                var userOrder = new Order(SessionService.get('currentUser').userId,
                    address.addressId, vm.paymentType, estimatedDelivery);
                vm.isPlacingOrder = true;
                OrderService.create(userOrder, function (response) {
                    if (response.success) {
                        if (vm.paymentType == 'COD') {
                            $location.path('/orderDetail/' + response.data.orderId);
                        } else {
                            $location.path('/payu-redirect/' + response.data.orderId)
                        }
                    } else {
                        FlashService.Error("Something not working. Please try later");
                    }
                    vm.isPlacingOrder = false;
                });
            }
        }

        function Order(userId, addressId, paymentType, estimateDeliveryTime) {
            this.userId = userId;
            this.deliveryAddress = {"addressId": addressId};
            this.paymentType = paymentType;
            this.userCouponId=SessionService.get('userCouponId');
        }
    }
})();