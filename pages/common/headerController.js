(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('NavbarController', NavbarController)

    NavbarController.$inject = ['AuthenticationService'];

    function NavbarController(AuthenticationService) {
        var vm = this;
        vm.login = login;
        vm.logout = logout;
        function login() {
            $("#myModal").modal();
        }
        function logout() {
            AuthenticationService.ClearCredentials();
        }
    }
})();
