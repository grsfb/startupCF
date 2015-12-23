(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('RegisterController', RegisterController);
    RegisterController.$inject = ['UserService', 'AuthenticationService'];
    function RegisterController(UserService, AuthenticationService) {
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
                            AuthenticationService.SetCredentials(vm.user);
                            $('#myModal').modal('hide');
                            vm.isRegistering = false;
                        }
                    });
                } else {
                    vm.pageMsg = "Your are already registered.";
                }
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
