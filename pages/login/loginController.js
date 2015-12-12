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
                CartService.count(currentUser.userId, function (response) {
                    if (response.success) {
                        SessionService.putInRootScope('cartItemCount', response.data.count);
                        SessionService.put('userCart', response.data.count);
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