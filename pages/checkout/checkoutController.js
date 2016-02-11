(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CheckoutController', CheckoutController);
    CheckoutController.$inject = ['$rootScope','SessionService', '$location', 'FlashService', 'OrderService',];

    function CheckoutController($rootScope,SessionService, $location, FlashService, OrderService) {
        var vm = this;
        if (!SessionService.get('isOrderInProgress')) {
            FlashService.ClearAllFlashMessage();
            $location.path('#!home');
            return;
        }
        vm.shippingCost = SessionService.get('shippingCost');
        vm.cartTotal = SessionService.get('cartTotal');
        vm.discount = SessionService.get('discount');
        vm.checkAndPlaceOrder = checkAndPlaceOrder;
        vm.isPlacingOrder = false;
        vm.paymentType = "PAYU";
        vm.setPaymentType = setPaymentType;
        function setPaymentType(method) {
            vm.paymentType = method;
        }

        function verifyDeliveryAddress(address) {
            if (address == undefined) {
                FlashService.Error("Delivery address is not selected");
                return false;
            }
            if (vm.paymentType == 'COD') {
                if (!("pune"==address.city.toLowerCase() && "411"==(address.zip.substring(0, 3)))) {
                    FlashService.Error("Cash on Delivery is only available in pune");
                    return false;
                }
            }
            return true;
        }

        function checkAndPlaceOrder() {
            var address = SessionService.get('deliverAddress');
            if (verifyDeliveryAddress(address)) {
                var userOrder = new Order(SessionService.get('currentUser').userId,
                    address.addressId, vm.paymentType, SessionService.get("couponCode"));
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

        function Order(userId, addressId, paymentType, couponId) {
            this.userId = userId;
            this.deliveryAddress = {"addressId": addressId};
            this.paymentType = paymentType;
            if (couponId) {
                this.couponId = couponId;
            }
        }
    }
})();