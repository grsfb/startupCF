(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CheckoutController', CheckoutController);
    CheckoutController.$inject = ['$rootScope','$cookieStore', '$location'];

    function CheckoutController($rootScope,$cookieStore, $location) {
        var vm = this;
        vm.enableCouponEditor=enableCouponEditor;
        vm.applyCoupon=applyCoupon;
        vm.cancelCoupon=cancelCoupon;
        vm.shippingCost=$cookieStore.get('shippingCost');
        vm.cartTotal=$cookieStore.get('cartTotal');
        vm.showCouponEditor=false;
        vm.selectedAddress=undefined;
        vm.checkAndPlaceOrder=checkAndPlaceOrder;

        function enableCouponEditor(){
            vm.showCouponEditor=true;
        }

        function applyCoupon(){
            vm.showCouponEditor=false;
        }

        function cancelCoupon(){
            vm.showCouponEditor=false;
        }

        function checkAndPlaceOrder(){
            if($rootScope.selectedAddress){
                console.log("slected address is "+ String.stringify(vm.selectedAddress));
            }
        }
    }
})();