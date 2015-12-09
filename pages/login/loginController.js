(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['$rootScope','$cookieStore', 'AuthenticationService', 'CartService','FlashService'];
    function LoginController($rootScope,$cookieStore, AuthenticationService, CartService,FlashService) {
        var vm = this;
        vm.login = login;
        vm.passwordReset = passwordReset;
        vm.resetSectionVisible = false;

        function login() {
            AuthenticationService.Login(vm.user.email, vm.user.password, function (response) {
                if (response.success) {
                    $('#myModal').modal('hide');
                    $rootScope.isLoggedIn=true;
                    AuthenticationService.SetCredentials(response.data, vm.user.password);
                } else {
                    vm.message = "User email or password is incorrect";
                }

            });

            var currentUser = $cookieStore.get('currentUser');
            if (currentUser != undefined) {
                CartService.getCartItems(currentUser.userId, function (response) {
                    if (response.success) {
                        var cart = response.data;
                        $rootScope.cartItemCount = cart.length;
                        $cookieStore.put('userCart', cart);
                    }else{
                        FlashService.Error("Something not working, Please try later");
                    }
                })
            }

        }

        function passwordReset() {
            vm.resetSectionVisible = true;

        }
    }

})();