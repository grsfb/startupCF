(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;
        vm.login = login;
        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
        function login() {
            vm.dataLoading = true;
            AuthenticationService.SetCredentials(vm.username, vm.password);
            $location.path('/item');
           /* AuthenticationService.Login(cm.username, cm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(cm.username, cm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    cm.dataLoading = false;
                }
            });*/
        };
    }

})();