(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('ResetPasswordController', ResetPasswordController);

    ResetPasswordController.$inject = ['CommonService', '$routeParams', '$location', 'FlashService', 'AuthenticationService', 'CartService', 'SessionService'];

    function ResetPasswordController(CommonService, $routeParams, $location, FlashService, AuthenticationService, CartService, SessionService) {
        var vm = this;
        vm.password = {};
        vm.reset = reset;
        function reset() {
            if (vm.password.newPWD !== vm.password.cnfPWD) {
                FlashService.Error("New password and confirm password are not same");
                return;
            }
            var user = {"newPassword": vm.password.newPWD, "notificationId": $routeParams.notificationId};
            FlashService.Success("Re-setting your password. Please wait...");
            CommonService.post('/user/reset/password', user, function (response) {
                if (response.success) {
                    FlashService.Success("Password re-set has been successful. Login is in progress...");
                    login(response.data.email, vm.password.newPWD);
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
            });
        }

        function login(email, password) {
            AuthenticationService.Login(email, password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(response.data, password);
                    updateUserCart(response.data);
                    $location.path("home");
                } else {
                    FlashService.Error("Something not working.Please try later");
                }

            });
        }

        function updateUserCart(currentUser) {
            CartService.count(currentUser.userId, function (response) {
                if (response.success) {
                    SessionService.putInRootScope('cartItemCount', response.data.count);
                    SessionService.put(SessionService.Session.CartCount, response.data.count);
                } else {
                    FlashService.Error("Something not working, Please try later");
                }
            })
        }
    }
})();
