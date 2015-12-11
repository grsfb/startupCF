(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['SessionService', 'AuthenticationService', 'CartService', 'FlashService'];
    function LoginController(SessionService, AuthenticationService, CartService, FlashService) {
        var vm = this;
        vm.login = login;
        vm.passwordReset = passwordReset;
        vm.resetSectionVisible = false;

        function login() {
            AuthenticationService.Login(vm.user.email, vm.user.password, function (response) {
                if (response.success) {
                    $('#myModal').modal('hide');
                    AuthenticationService.SetCredentials(response.data, vm.user.password);
                    updateUserCart(response.data);
                } else {
                    vm.message = "User email or password is incorrect";
                }

            });
        }

        function updateUserCart(currentUser) {
                CartService.getCartItems(currentUser.userId, function (response) {
                    if (response.success) {
                        var cart = response.data;
                        SessionService.putInRootScope('cartItemCount', cart.length);
                        SessionService.put('userCart', cart);
                    } else {
                        FlashService.Error("Something not working, Please try later");
                    }
                })
        }

        function passwordReset() {
            vm.resetSectionVisible = true;

        }
    }

})();