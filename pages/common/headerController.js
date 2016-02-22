(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('NavbarController', NavbarController)

    NavbarController.$inject = ['AuthenticationService', '$location','CartService','SessionService'];

    function NavbarController(AuthenticationService, $location,CartService,SessionService) {
        var vm = this;
        vm.login = login;
        vm.logout = logout;
        vm.mobileLogin = mobileLogin;
        vm.mobileLogout = mobileLogout;
        vm.getItems=getItems;
        vm.home = home;
        vm.itemAdded = false;
        vm.viewBag=viewBag;
        vm.viewcart=viewcart;
        var cart = [];
        function login() {
            $("#myModal").modal();
        }

        function logout() {
            AuthenticationService.ClearCredentials();
            $location.path("/home");
        }

        function mobileLogin() {
            $location.path("/login-mble");
        }

        function mobileLogout() {
            AuthenticationService.ClearCredentials();
            $location.path("home");
        }

        function home() {
            $location.path("home");
        }
        function viewBag(){
            vm.itemAdded=false;
            $location.path('cart');
        }
        function isUserLoggedIn() {
            return SessionService.get(SessionService.Session.CurrentUser);
        }

        function getUserId() {
            if (isUserLoggedIn()) {
                return SessionService.get(SessionService.Session.CurrentUser).userId;
            }
            else {
                return null;
            }
        }
        function getBagId() {
            return SessionService.get('bagId');
        }
        function viewcart(){
            getItems(function () {
                //do nothing
            });
            vm.itemAdded=true;
        }
        function getItems(callback){
            if(getBagId()!=null || getUserId()!=null){
            CartService.getCartItems(getBagId(), function (response) {
                if (response.success) {
                    vm.cart = response.data;
                    SessionService.putInRootScope("cartItemCount", vm.cart.length);
                    updateCartCost();
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
            });
            }
            else{
                SessionService.putInRootScope("cartItemCount", 0);
                callback();
            }
        }
        function updateCartCost() {
            vm.cartItemTotal = 0;
            vm.shippingCost = 0;

            for (var i = 0; i < vm.cart.length; i++) {
                vm.cartItemTotal += vm.cart[i].price * vm.cart[i].quantity;
            }
            if (vm.cartItemTotal < 200) {
                vm.shippingCost = 50;
            }
        }
    }
})();
