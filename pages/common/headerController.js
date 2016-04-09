(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('NavbarController', NavbarController)

    NavbarController.$inject = ['AuthenticationService', '$location', 'CartService', 'SessionService'];

    function NavbarController(AuthenticationService, $location, CartService, SessionService) {
        var vm = this;
        vm.login = login;
        vm.logout = logout;
        vm.mobileLogin = mobileLogin;
        vm.mobileLogout = mobileLogout;
        vm.getItems = getItems;
        vm.home = home;
        vm.itemAdded = false;
        vm.viewBag = viewBag;
        vm.viewcart = viewcart;
        var cart = [];

        function login() {
            SessionService.put('mobileLogin', false);
            $("#myModal").modal();
        }

        function logout() {
            AuthenticationService.ClearCredentials();
            $location.path("home");
        }

        function mobileLogin() {
            SessionService.put('mobileLogin', true);
            $location.path("login-mble");
        }

        function mobileLogout() {
            AuthenticationService.ClearCredentials();
            $location.path("home");
        }

        function home() {
            $location.path("home");
        }

        function viewBag() {
            vm.itemAdded = false;
            $location.path('cart-details');
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

        function viewcart() {
            getItems(function () {
                //do nothing
            });

        }

        function getItems(callback) {
            if (getBagId() != null || getUserId() != null) {
                CartService.getCartItems(getBagId(), function (response) {
                    if (response.success) {
                        vm.cart = response.data;
                        SessionService.putInRootScope("cartItemCount", vm.cart.length);
                        updateCartCost();
                        vm.itemAdded = true;
                    } else {
                        FlashService.Error("Something not working. Please try later");
                    }
                });
            }
            else {
                vm.itemAdded = false;
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
