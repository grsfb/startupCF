(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('RegisterController', RegisterController);
    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function RegisterController(UserService, $location, $rootScope, FlashService) {
        var cm = this;
        cm.register = register;
        function register() {
            cm.dataLoading = true;
            UserService.Create(cm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        cm.dataLoading = false;
                    }
                });
        }
    }
})();