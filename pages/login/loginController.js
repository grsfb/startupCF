(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['SessionService', 'AuthenticationService', 'CartService', 'CommonService', '$location'];
    function LoginController(SessionService, AuthenticationService, CartService, CommonService,$location) {
        var vm = this;
        vm.login = login;
        vm.passwordReset = passwordReset;
        vm.resetSectionVisible = false;
        vm.isLogging = false;
        vm.isPasswordChanging = false;
        vm.showMblSignup = false;
        vm.reset = reset;
        vm.pageMsg = "";
        function login() {
            vm.isLogging = true;
            AuthenticationService.Login(vm.user.email, vm.user.password, function (response) {
                if (response.success) {
                    $('#myModal').modal('hide');
                    //for mobile view
                    $location.path("/home");
                    AuthenticationService.SetCredentials(response.data);
                    updateUserCart(response.data);
                } else {
                    vm.pageMsg = "User email or password is incorrect";
                }
                vm.isLogging = false;
            });
        }

        function updateUserCart(currentUser) {
            CartService.count(currentUser.userId, function (response) {
                if (response.success) {
                    SessionService.putInRootScope('cartItemCount', response.data.count);
                    SessionService.put(SessionService.Session.CartCount, response.data.count);
                }
            })
        }

        function passwordReset() {
            vm.resetSectionVisible = !vm.resetSectionVisible;

        }

        function reset() {
            vm.isPasswordChanging = true;
            CommonService.post("/user/" + vm.user.resetEmail + "/forgot-pwd", {}, function (response) {
                if (response.success) {
                    vm.message = "Password reset email sent.";
                } else {
                    vm.message = "Something is not working. Please try later.";
                }
                vm.user.resetEmail = "";
                vm.isPasswordChanging = false;
            })
        }
    }

})();