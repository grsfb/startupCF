(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CartController', CartController);

    CartController.$inject = ['SessionService', '$location', 'CartService', 'FlashService', 'CampaignService'];

    function CartController(SessionService, $location, CartService, FlashService, CampaignService) {
        var vm = this;
        vm.cartItems = [];
        vm.minusItemCount = minusItemCount;
        vm.plusItemCount = plusItemCount;
        vm.checkout = checkout;
        vm.enableCouponEditor = enableCouponEditor;
        vm.applyCoupon = applyCoupon;
        vm.couponDiscount = 0;
        vm.discountData = undefined;
        vm.couponCode = undefined;
        vm.cancelCoupon = cancelCoupon;
        vm.removeItemFromCart = removeItemFromCart;
        vm.showCouponEditor = false;
        vm.disableApplyCoupon = false;
        vm.showAppliedCouponEditor = false;
        vm.couponMessage = undefined;
        var currentUserId = SessionService.get(SessionService.Session.CurrentUser).userId;
        SessionService.put('userCouponId', undefined);

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
            var cartCoupon = new CartCoupon(null,vm.couponCode, currentUserId);
            CampaignService.applyCoupon(cartCoupon, function (response) {
                if (response.success) {
                    vm.discountData = response.data;
                    SessionService.put('userCouponId', vm.discountData.userCouponId);
                    vm.couponMessage = vm.discountData.message;
                    vm.couponDiscount = vm.discountData.discount;
                    vm.cartTotal = vm.cartTotal - vm.couponDiscount;
                    vm.showCouponEditor = false;
                    vm.showAppliedCouponEditor = true;
                } else {
                    vm.discountData = response.data;
                    vm.couponMessage = vm.discountData.message;
                }
            });


        }

        function cancelCoupon() {
            var cartCoupon = new CartCoupon(vm.discountData.userCouponId,vm.couponCode, currentUserId);
            CampaignService.cancelCoupon(cartCoupon, function (response) {
                if (response.success) {
                    SessionService.put('userCouponId', undefined);
                    updateCartCost();
                    resetCoupon();
                }
                else {
                    FlashService.Error("Something not working. Please try later.")
                }
            });
        }

        function updateCartCost() {
            vm.cartTotal = 0;
            vm.cartItemTotal = 0;
            vm.shippingCost = 0;

            for (var i = 0; i < vm.cartItems.length; i++) {
                vm.cartItemTotal += vm.cartItems[i].price * vm.cartItems[i].quantity;
                vm.cartTotal = vm.cartItemTotal;
            }
            if (vm.cartTotal < 200) {
                vm.shippingCost = 50;
            }
            resetCoupon();
        }

        function resetCoupon() {
            if(vm.discountData !=null) {
                cancelCoupon();
            }
            vm.showAppliedCouponEditor = false;
            vm.showCouponEditor = false;
            vm.couponMessage = undefined;
            vm.couponCode = undefined;
            vm.discountData = undefined;
            vm.couponDiscount = 0;
        }

        function minusItemCount(index) {
            vm.cartItems[index].quantity -= 1;
            //update cart async
            updateQuantity(vm.cartItems[index]);
            updateCartCost();
            resetCoupon();
        }

        function updateQuantity(cartItem) {
            CartService.update(cartItem, function (response) {
                if (!response.success) {
                    FlashService.Error("Unable to update quantity");
                }
                resetCoupon();
            });
        }

        function plusItemCount(index) {
            vm.cartItems[index].quantity += 1;
            //update cart async
            updateQuantity(vm.cartItems[index]);
            updateCartCost();
        }

        function checkout() {
            //post checkout request and redirect to payment page
            SessionService.put('cartTotal', vm.cartTotal);
            SessionService.put('shippingCost', vm.shippingCost);
            SessionService.putInRootScope('isOrderInProgress', true);
            $location.path('checkout');
        }

        function removeItemFromCart(item) {
            $('delete-' + item.cartItemId).addClass('disabled');
            CartService.removeCartItem(item.cartItemId, function (response) {
                if (response.success) {
                    vm.cartItems = removeItem(vm.cartItems, item);
                    SessionService.put(SessionService.Session.CartCount, vm.cartItems.length);
                    SessionService.putInRootScope("cartItemCount", vm.cartItems.length);
                    if (vm.cartItems.length == 0) {
                        $location.path('#/home');
                    }
                }
                else {
                    $('delete-' + item.cartItemId).removeClass('disabled');
                    FlashService.Error("Unable to remove cart item");
                }
                updateCartCost();
                resetCoupon();
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

        function CartCoupon(userCouponId,coupon, userId) {
            this.userCouponId = userCouponId;
            this.couponCode = coupon;
            this.userId = userId;
        }
    }

})();