(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CheckoutController', CheckoutController);
    CheckoutController.$inject = ['SessionService', '$location', 'CartService', 'FlashService', 'OrderService'];

    function CheckoutController(SessionService, $location, CartService, FlashService, OrderService) {
        var vm = this;
        vm.shippingCost = SessionService.get('shippingCost');
        vm.cartTotal = SessionService.get('cartTotal');
        vm.checkAndPlaceOrder = checkAndPlaceOrder;
        vm.order = {};
        vm.isPlacingOrder=false;
        function checkAndPlaceOrder() {
            vm.order.address = SessionService.get('deliverAddress');
            vm.order.paymentMethod = "COD";
            if (vm.order.address == undefined) {
                FlashService.Error("Delivery address is not selected");
            }
            if (vm.order.paymentMethod == undefined) {
                FlashService.Error("Payment method is not selected");
            }
            if (vm.order.address != undefined && vm.order.paymentMethod != null) {
                var order = new Order(SessionService.get('currentUser').userId,
                    vm.order.address.addressId, SessionService.get('itemIds'), vm.order.paymentMethod
                );
                vm.isPlacingOrder=true;
                OrderService.create(order, function (response) {
                    if (response.success) {
                        cleanUpOnOrderSuccess();
                        //SessionService.put('orderId', response.data.orderId);
                        $location.path('orderDetail/'+response.data.orderId);
                    } else {
                        FlashService.Error("Something not working. Please try later");
                    }
                    vm.isPlacingOrder=false;
                });

            }
        }

        function cleanUpOnOrderSuccess() {
            CartService.remove(SessionService.get('currentUser').userId,
                function(response){
                    if(!response.success){
                        FlashService.Error("Something is not working. Please try later",true);
                    }
                });
            SessionService.remove('shippingCost');
            SessionService.remove('cartTotal');
            SessionService.remove('itemIds');
            SessionService.remove('userCart');
            SessionService.putInRootScope('cartItemCount',0);
        }

        function Order(userId, addressId, items, paymentType) {
            this.userId = userId;
            this.deliveryAddress = {"addressId": addressId};
            this.items = [];
            for (var item in items) {
                this.items.push({'itemId': items[item]})
            }
            this.paymentType = paymentType;
        }
    }
})();