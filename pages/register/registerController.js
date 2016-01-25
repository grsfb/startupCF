(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('RegisterController', RegisterController);
    RegisterController.$inject = ['UserService', 'AuthenticationService','$location'];
    function RegisterController(UserService, AuthenticationService,$location) {
        var vm = this;
        vm.user = {};
        vm.isRegistering = false;
        vm.messsage = "";
        vm.register = register;
        vm.pageMsg = "";
        function register() {
            if (vm.user.password != vm.user.cnfrmPswd) {
                vm.pageMsg = "Your password and confirm password is not same.";
                return;
            }
            vm.isRegistering = true;
            var user = new User(vm.user.name, vm.user.password, vm.user.mobile, vm.user.email);
            UserService.create(user, function (response) {
                if (response.success) {
                    AuthenticationService.Login(vm.user.email, vm.user.password, function (response) {
                        if (response.success) {
                            AuthenticationService.SetCredentials(response.data);
                            $('#myModal').modal('hide');
                            $location.path('#!home');
                        }
                    });
                } else {
                    vm.pageMsg = "You are already registered.";
                }
                vm.isRegistering = false;
            });
        }

        function User(name, password, mobile, email) {
            this.name = name;
            this.password = password;
            this.mobile = mobile;
            this.email = email;
        }
    }
})();
