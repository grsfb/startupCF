(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;
        vm.login = login;
        vm.passwordReset=passwordReset;
        vm.user=undefined;
        vm.resetSectionVisible=false;
        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.user, function (response){
                if(response.success){
                    AuthenticationService.SetCredentials(vm.user.email, vm.user.password,response.data.userId,response.data.userName);
                }else{
                   vm.message=response.errorMessage;
                }

            });

        };
        function passwordReset() {
   vm.resetSectionVisible=true;

        };
    }

})();