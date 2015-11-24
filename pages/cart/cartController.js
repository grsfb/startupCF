(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CartController', CartController);
    CartController.$inject = ['$cookieStore', '$location', 'CartService'];

    function CartController($cookieStore, $location, CartService) {
        var vm = this;
        vm.cartItems = [];
        vm.minusItemCount = minusItemCount;
        vm.plusItemCount = plusItemCount;
        vm.checkout=checkout;

        CartService.getCartItems("userId", function (response) {
            vm.cartItems = response;
            updateCartCost();
        });

        function updateCartCost() {
            vm.cartTotal = 0;
            vm.shippingCost = 0;

            for (var i = 0; i < vm.cartItems.length; i++) {
                vm.cartTotal += vm.cartItems[i].price * vm.cartItems[i].quantity;
            }
            if (vm.cartTotal < 200) {
                vm.shippingCost = 50;
            }
        }

        function minusItemCount(item) {
            for (var i = 0; i < vm.cartItems.length; i++) {
                if (vm.cartItems[i].id === item.id) {
                    if (vm.cartItems[i].quantity > 1) {
                        vm.cartItems[i].quantity = vm.cartItems[i].quantity - 1;
                        break;
                    }
                }
            }
            updateCartCost();
        }

        function plusItemCount(item) {
            for (var i = 0; i < vm.cartItems.length; i++) {
                if (vm.cartItems[i].id === item.id) {
                    if (vm.cartItems[i].quantity < 5) {
                        vm.cartItems[i].quantity = vm.cartItems[i].quantity + 1;
                        break;
                    }
                }
            }
            updateCartCost();
        }

        function checkout(){
            //post checkout request and redirect to payment page

            $cookieStore.put('cartTotal',vm.cartTotal);
            $cookieStore.put('shippingCost',vm.shippingCost);
            $location.path('checkout');
        }
    }

})();