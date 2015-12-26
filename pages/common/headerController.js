(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('NavbarController', NavbarController)

    NavbarController.$inject = ['AuthenticationService', '$location'];

    function NavbarController(AuthenticationService, $location) {
        var vm = this;
        vm.login = login;
        vm.logout = logout;
        vm.mobileLogin = mobileLogin;
        vm.mobileLogout = mobileLogout;
        vm.home = home;
        function login() {
            $("#myModal").modal();
        }

        function logout() {
            AuthenticationService.ClearCredentials();
        }

        function mobileLogin() {
            $location.path("/login-mble");
        }

        function mobileLogout() {
            AuthenticationService.ClearCredentials();
            $location.path("/home");
        }

        function home() {
            $location.path("#home");
        }
    }
})();
