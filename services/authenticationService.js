(function () {
    'use strict';

    angular
        .module('Chefonia')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['SessionService', 'CommonService'];
    function AuthenticationService(SessionService, CommonService) {
        var service = {};
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        return service;
        function Login(email, pasword, callback) {
            var user = {"email": email, "password": pasword};
            CommonService.post('/authenticate/user', user, callback);
        }
        function SetCredentials(user) {
            var currentUser = {
                'userId'  : user.userId,
                'userName': user.name
            };
            SessionService.create(currentUser);
        }

        function ClearCredentials() {
            SessionService.destroy();
            CommonService.removeAuth();
        }
    }
})();