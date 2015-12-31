(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CartController', CartController);

    CartController.$inject = ['SessionService', '$location', 'CartService', 'FlashService','CampaignService'];

    function CartController(SessionService, $location, CartService, FlashService,CampaignService) {
        var vm = this;
        vm.cartItems = [];
        vm.minusItemCount = minusItemCount;
        vm.plusItemCount = plusItemCount;
        vm.checkout = checkout;
        vm.enableCouponEditor = enableCouponEditor;
        vm.applyCoupon = applyCoupon;
        vm.couponDiscount=0;
        vm.discountData=undefined;
        vm.couponCode=undefined;
        vm.cancelCoupon = cancelCoupon;
        vm.removeItemFromCart = removeItemFromCart;
        vm.showCouponEditor = false;
        vm.isChefFromPune=true;
        vm.disableApplyCoupon=false;
        vm.showAppliedCouponEditor=false;
        vm.couponMessage=undefined;
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
            var cartCoupon = new CartCoupon(vm.couponCode, vm.cartItems);
            CampaignService.applyCoupon(cartCoupon, function (response) {
                if (response.success) {
                    vm.discountData = response.data;
                    vm.couponMessage = vm.discountData.message;
                    vm.couponDiscount = vm.discountData.discount;
                    vm.cartTotal=vm.cartTotal-vm.couponDiscount;
                    vm.showCouponEditor = false;
                    vm.showAppliedCouponEditor = true;
                } else {
                    vm.discountData = response.data;
                    vm.couponMessage = vm.discountData.message;
                }
            });


        }

        function cancelCoupon() {
            CampaignService.cancelCoupon(vm.couponCode, function (response) {
                if (response.success) {
                    updateCartCost();
                  resetCoupon();
                }
                else {
                }
            });
        }

        function updateCartCost() {
            vm.cartTotal = 0;
            vm.cartItemTotal=0;
            vm.shippingCost = 0;

            for (var i = 0; i < vm.cartItems.length; i++) {
                vm.cartItemTotal += vm.cartItems[i].price * vm.cartItems[i].quantity;
                vm.cartTotal=vm.cartItemTotal;
            }
            if (vm.cartTotal < 200) {
                vm.shippingCost = 50;
            }
          resetCoupon();
        }
function resetCoupon(){

    vm.showAppliedCouponEditor = false;
    vm.showCouponEditor = true;
    vm.couponMessage = undefined;
    vm.couponCode = undefined;
    vm.couponDiscount = 0;
}
        function minusItemCount(cartItem) {
            for (var i = 0; i < vm.cartItems.length; i++) {
                if (vm.cartItems[i].itemId === cartItem.itemId&& vm.cartItems[i].weight === cartItem.weight) {
                    if (vm.cartItems[i].quantity > 1) {
                        vm.cartItems[i].quantity = vm.cartItems[i].quantity - 1;
                        var cartItem = new CartItem(currentUserId, vm.cartItems[i].itemId, vm.cartItems[i].quantity,vm.cartItems[i].weight,vm.cartItems[i].price);
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
                if (vm.cartItems[i].itemId === cartItem.itemId && vm.cartItems[i].weight === cartItem.weight) {
                    if (vm.cartItems[i].quantity < 5) {
                        vm.cartItems[i].quantity = vm.cartItems[i].quantity + 1;
                        var cartItem = new CartItem(currentUserId, vm.cartItems[i].itemId, vm.cartItems[i].quantity,vm.cartItems[i].weight,vm.cartItems[i].price);
                        updateQuantity(cartItem);
                        break;
                    }
                }
            }
            updateCartCost();
        }

        function checkout() {
            //post checkout request and redirect to payment page
            SessionService.put('itemIds', getItemsIdArray(vm.cartItems));
            SessionService.put('cartTotal', vm.cartTotal);
            SessionService.put('shippingCost', vm.shippingCost);
            SessionService.put('isChefFromPune', vm.isChefFromPune);
            $location.path('checkout');
        }

        function getItemsIdArray(cartItems) {
            var itemIds = [];
            for (var item in cartItems) {
                if (cartItems.hasOwnProperty(item)) {
                    itemIds.push(cartItems[item].itemId);
                    if(cartItems[item].chefLocation.toLowerCase()!='pune'){
                        vm.isChefFromPune=false;
                    }
                }
            }
            return itemIds;
        }

        function removeItemFromCart(item) {
            CartService.removeCartItem(currentUserId, item.itemId, function (response) {
                if (response.success) {
                    resetCoupon();
                    vm.cartItems = removeItem(vm.cartItems, item);
                    SessionService.put(SessionService.Session.CartCount, vm.cartItems.length);
                    SessionService.putInRootScope("cartItemCount", vm.cartItems.length);
                    var location = SessionService.get("location");
                    if (vm.cartItems.length == 0) {
                        $location.path('/item/All/' + location);
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

        function CartItem(userId, itemId, quantity,weight,price) {
            this.userId = userId;
            this.itemId = itemId;
            this.quantity = quantity;
            this.weight=weight;
            this.price=price;
        }
        function CartCoupon(coupon, cartItems, quantity) {
            this.couponCode = coupon;
            this.cartItems = cartItems;
        }
    }

})();