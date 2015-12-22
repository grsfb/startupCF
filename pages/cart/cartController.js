(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CartController', CartController);
    CartController.$inject = ['SessionService', '$location', 'CartService', 'ImageService', 'FlashService'];

    function CartController(SessionService, $location, CartService, ImageService, FlashService) {
        var vm = this;
        vm.cartItems = [];
        vm.minusItemCount = minusItemCount;
        vm.plusItemCount = plusItemCount;
        vm.checkout = checkout;
        vm.enableCouponEditor = enableCouponEditor;
        vm.applyCoupon = applyCoupon;
        vm.cancelCoupon = cancelCoupon;
        vm.getImageUri = getImageUri;
        vm.removeItemFromCart = removeItemFromCart;
        vm.showCouponEditor = false;
        var currentUserId = SessionService.get(SessionService.Session.CurrentUser).userId;

        CartService.getCartItems(currentUserId, function (response) {
            if (response.success) {
                vm.cartItems = response.data;
                SessionService.put('cartItemCount', vm.cartItems.length);
                updateCartCost();
            } else {
                FlashService.Error("Something not working. Please try later");
            }
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
                if (vm.cartItems[i].itemId === cartItem.itemId) {
                    if (vm.cartItems[i].quantity > 1) {
                        vm.cartItems[i].quantity = vm.cartItems[i].quantity - 1;
                        var cartItem = new CartItem(currentUserId, vm.cartItems[i].itemId, vm.cartItems[i].quantity);
                        updateQuantity(cartItem);
                        break;
                    }
                }
            }

            updateCartCost();
        }

        function updateQuantity(cartItem) {
            CartService.update(cartItem, function (response) {
                if (!response.success) {
                    FlashService.Error("Unable to update quantity");
                }
            });
        }

        function plusItemCount(cartItem) {
            for (var i = 0; i < vm.cartItems.length; i++) {
                if (vm.cartItems[i].itemId === cartItem.itemId) {
                    if (vm.cartItems[i].quantity < 5) {
                        vm.cartItems[i].quantity = vm.cartItems[i].quantity + 1;
                        var cartItem = new CartItem(currentUserId, vm.cartItems[i].itemId, vm.cartItems[i].quantity);
                        updateQuantity(cartItem);
                        break;
                    }
                }
            }
            updateCartCost();
        }

        function getImageUri(chefName, category, itemName, size) {
            return ImageService.getUri(chefName, category, itemName, size);
        }

        function checkout() {
            //post checkout request and redirect to payment page
            SessionService.put('itemIds', getItemsIdArray(vm.cartItems));
            SessionService.put('cartTotal', vm.cartTotal);
            SessionService.put('shippingCost', vm.shippingCost);
            $location.path('checkout');
        }

        function getItemsIdArray(cartItems) {
            var itemIds = [];
            for (var item in cartItems) {
                if (cartItems.hasOwnProperty(item)) {
                    itemIds.push(cartItems[item].itemId);
                }
            }
            return itemIds;
        }

        function removeItemFromCart(item) {
            CartService.removeCartItem(currentUserId, item.itemId, function (response) {
                if (response.success) {
                    vm.cartItems = removeItem(vm.cartItems, item);
                    SessionService.put(SessionService.Session.CartCount, vm.cartItems.length);
                    SessionService.putInRootScope("cartItemCount", vm.cartItems.length);
                    var location= SessionService.get("location");
                    if (vm.cartItems.length == 0) {
                        $location.path('/item/All/'+location);
                    }
                }
                else {
                    FlashService.Error("Unable to remove cart item");
                }
            });
        }

        function removeItem(arr, item) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].itemId === item.itemId) {
                    arr.splice(i, 1);
                    break;
                }
            }
            return arr;
        }

        function CartItem(userId, itemId, quantity) {
            this.userId = userId;
            this.itemId = itemId;
            this.quantity = quantity;
        }
    }

})();