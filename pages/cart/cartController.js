(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CartController', CartController);
    CartController.$inject = ['$cookieStore', '$location', 'CartService', 'ImageService', 'FlashService'];

    function CartController($cookieStore, $location, CartService, ImageService, FlashService) {
        var vm = this;
        vm.cartItems = [];
        vm.minusItemCount = minusItemCount;
        vm.plusItemCount = plusItemCount;
        vm.checkout = checkout;
        vm.enableCouponEditor = enableCouponEditor;
        vm.applyCoupon = applyCoupon;
        vm.cancelCoupon = cancelCoupon;
        vm.getImageUri = getImageUri;
        vm.remove = remove;
        vm.showCouponEditor = false;

        CartService.getCartItems("userId", function (response) {
            vm.cartItems = response.data;
            updateCartCost();
        });

        function enableCouponEditor() {
            vm.showCouponEditor = !vm.showCouponEditor;
        }

        function applyCoupon() {
            vm.showCouponEditor = false;
        }

        function cancelCoupon() {
            vm.showCouponEditor = false;
        }

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

        function minusItemCount(cartItem) {
            for (var i = 0; i < vm.cartItems.length; i++) {
                if (vm.cartItems[i].id === cartItem.id) {
                    if (vm.cartItems[i].quantity > 1) {
                        vm.cartItems[i].quantity = vm.cartItems[i].quantity - 1;
                        updateQuantity({"itemId": vm.cartItems[i].itemId, "quantity": vm.cartItems[i].quantity});
                        break;
                    }
                }
            }

            updateCartCost();
        }

        function updateQuantity(cartItem) {
            CartService.updateItems(cartItem, function (response) {
                if (!response.success) {
                    FlashService.Error("Unable to update quantity");
                }
            });
        }

        function plusItemCount(item) {
            for (var i = 0; i < vm.cartItems.length; i++) {
                if (vm.cartItems[i].id === item.id) {
                    if (vm.cartItems[i].quantity < 5) {
                        vm.cartItems[i].quantity = vm.cartItems[i].quantity + 1;
                        updateQuantity({"itemId": vm.cartItems[i].itemId, "quantity": vm.cartItems[i].quantity});
                        break;
                    }
                }
            }
            updateCartCost();
        }

        function getImageUri(name) {
            return ImageService.getUri(name, ImageService.Size.SMALL);
        }

        function remove(cartItemId) {
            CartService.remove(cartItemId, function (response) {
                if (!response.success) {
                    FlashService.Error("Unable to remove cart item");
                }
            })

        }

        function checkout() {
            //post checkout request and redirect to payment page
            $cookieStore.put('itemIds', getItemsIdArray(vm.cartItems));
            $cookieStore.put('cartTotal', vm.cartTotal);
            $cookieStore.put('shippingCost', vm.shippingCost);
            $location.path('checkout');
        }

        function getItemsIdArray(cartItems) {
            var itemIds = [];
            for (var item in cartItems) {
                if (cartItems.hasOwnProperty(item)) {
                    var lineItem = {"itemId": item.itemId};
                    itemIds.push(lineItem);
                }
            }
            return itemIds;
        }
    }

})();