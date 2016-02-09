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
        vm.applyCoupon = applyCoupon;
        vm.coupon = {};
        vm.cancelCoupon = cancelCoupon;
        vm.removeItemFromCart = removeItemFromCart;
        vm.showCouponEditor = false;
        vm.showAppliedCouponEditor = false;
        vm.showMessageEditor = false;
        vm.isGiftMessageAdded=false;
        vm.saveMessage = saveMessage;
        vm.enableMsgEditor = enableMsgEditor;
        vm.editMessage=editMessage;
        vm.removeMessage=removeMessage;

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

        function applyCoupon() {
            var cartCoupon = new CouponDTO(currentUserId, vm.couponCode);
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
            vm.cartItemTotal = 0;
            vm.shippingCost = 0;

            for (var i = 0; i < vm.cartItems.length; i++) {
                vm.cartItemTotal += vm.cartItems[i].price * vm.cartItems[i].quantity;
            }
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
            SessionService.put('cartTotal', vm.cartItemTotal);
            SessionService.put('shippingCost', vm.shippingCost);
            SessionService.putInRootScope('isOrderInProgress', true);
            SessionService.put('discount', vm.coupon.discount);
            SessionService.put('couponCode', vm.coupon.couponCode);
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

        function saveMessage() {
            var message={"uniqueId":currentUserId,"message": vm.giftMessage};
            CartService.saveGiftMessage(message, function(response){
                if (response.success) {
                    vm.isGiftMessageAdded=true;
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
            });
        }

        function removeMessage(){
            vm.giftMessage="";
            vm.isGiftMessageAdded=!vm.isGiftMessageAdded;
            vm.checkbox=false;
            vm.showMessageEditor=false;
        }

        function editMessage(){
            vm.isGiftMessageAdded=!vm.isGiftMessageAdded;
        }

        function enableMsgEditor() {
            vm.showMessageEditor=!vm.showMessageEditor;
        }

        function CouponDTO(userId, couponCode) {
            this.userId = userId;
            this.couponCode = couponCode;
        }
    }

})();