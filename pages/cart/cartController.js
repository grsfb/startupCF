(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CartController', CartController);

    CartController.$inject = ['SessionService', 'CartManager', '$location', 'CartService', 'FlashService', 'CampaignService'];

    function CartController(SessionService, CartManager, $location, CartService, FlashService, CampaignService) {
        var vm = this;
        vm.cartItems = [];
        vm.minusItemCount = minusItemCount;
        vm.plusItemCount = plusItemCount;
        vm.checkout = checkout;
        vm.applyCoupon = applyCoupon;
        vm.coupon = {};
        vm.cancelCoupon = cancelCoupon;
        vm.removeItemFromCart = removeItemFromCart;
        vm.showCouponEditor = false;
        vm.showAppliedCouponEditor = false;
        vm.showMessageEditor = false;
        vm.isGiftMessageAdded = false;
        vm.saveMessage = saveMessage;
        vm.enableMsgEditor = enableMsgEditor;
        vm.editMessage = editMessage;
        vm.removeMessage = removeMessage;

        updateCartCost();
        if (!SessionService.get('bagId')) {
            $location.path('home');
        }
        CartManager.loadUserBag(function () {
            vm.cartItems = CartManager.getUserCart();
        });

        function applyCoupon() {
            var cartCoupon = new CouponDTO("user-id", vm.couponCode);
            CampaignService.applyCoupon(cartCoupon, function (response) {
                if (response.success) {
                    vm.coupon = response.data;
                    vm.showCouponEditor = false;
                    vm.showAppliedCouponEditor = true;
                } else {
                    vm.discountData = response.data;
                }
            });
        }

        function cancelCoupon() {
            updateCartCost();
            resetCoupon();
        }

        function updateCartCost() {
            vm.cartItemTotal = CartManager.cartSumTotal();
            vm.shippingCost = 0;

            if (vm.cartItemTotal < 200) {
                vm.shippingCost = 50;
            }
            resetCoupon();
        }

        function resetCoupon() {
            vm.showAppliedCouponEditor = false;
            vm.showCouponEditor = false;
            vm.coupon = {};
        }

        function minusItemCount(index) {
            vm.cartItems[index].quantity -= 1;
            //update cart async
            CartManager.minusOneItemCount(vm.cartItems[index].cartItemId, undefined);
            updateCartCost();
        }


        function plusItemCount(index) {
            vm.cartItems[index].quantity += 1;
            //update cart async
            CartManager.plusOneItemCount(vm.cartItems[index].cartItemId, undefined);
            updateCartCost();
        }

        function checkout() {
            //post checkout request and redirect to payment page
            SessionService.put('cartTotal', vm.cartItemTotal);
            SessionService.put('shippingCost', vm.shippingCost);
            SessionService.putInRootScope('isOrderInProgress', true);
            SessionService.put('discount', vm.coupon.discount);
            SessionService.put('couponCode', vm.coupon.couponCode);
            $location.path('checkout');
        }

        function removeItemFromCart(item) {
            $('delete-' + item.cartItemId).addClass('disabled');
            CartManager.remove(item.cartItemId, function () {
                vm.cartItems = CartManager.getUserCart();
                if (vm.cartItems.length == 0) {
                    $location.path('#/home');
                }
                updateCartCost();
            });
        }

        function saveMessage() {
            var message = {"uniqueId": "user-id", "message": vm.giftMessage};
            CartService.saveGiftMessage(message, function (response) {
                if (response.success) {
                    vm.isGiftMessageAdded = true;
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
            });
        }

        function removeMessage() {
            vm.giftMessage = "";
            vm.isGiftMessageAdded = !vm.isGiftMessageAdded;
            vm.checkbox = false;
            vm.showMessageEditor = false;
        }

        function editMessage() {
            vm.isGiftMessageAdded = !vm.isGiftMessageAdded;
        }

        function enableMsgEditor() {
            vm.showMessageEditor = !vm.showMessageEditor;
        }

        function CouponDTO(userId, couponCode) {
            this.userId = userId;
            this.couponCode = couponCode;
        }
    }

})();