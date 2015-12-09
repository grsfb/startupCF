(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('NavbarController', NavbarController)

    NavbarController.$inject = ['$rootScope', '$cookieStore', 'AuthenticationService'];

    function NavbarController($rootScope, $cookieStore, AuthenticationService) {
        var vm = this;
        vm.login = login;
        vm.logout = logout;

        $rootScope.currentUser = $cookieStore.get('currentUser');
        $rootScope.cartItemCount = 0;
        $rootScope.isLoggedIn = false;

        if ($rootScope.currentUser != undefined) {
            $rootScope.isLoggedIn = true;
        }
        if ($cookieStore.get("userCart")) {
            $rootScope.cartItemCount = $cookieStore.get("userCart").length;
        }
        function login() {
            $("#myModal").modal();
        }

        function logout() {
            AuthenticationService.ClearCredentials();
        }
    }
})();
