(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['SessionService', 'CommonService'];
    function AuthenticationService(SessionService, CommonService) {
        var service = {};
        service.Login = Login;
        service.GuestLogin = GuestLogin;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        return service;
        function Login(email, pasword, callback) {
           var bagId = SessionService.get('bagId');
            var user = {"email": email, "password": pasword,"bagId":bagId};
            CommonService.post('/authenticate/user', user, callback);
        }
        function GuestLogin(email, callback) {
            var bagId = SessionService.get('bagId');
            var user = {"email": email, "bagId":bagId};
            CommonService.post('/authenticate/guestLogin',user, callback);
        }
        function SetCredentials(user) {
            var currentUser = {
                'userId': user.userId,
                'userName': user.name,
                'email':user.email
            };
            SessionService.create(currentUser);
            SessionService.put('bagId',user.bagId);
        }

        function ClearCredentials() {
            SessionService.destroy();
            SessionService.put('bagId',undefined);
        }
    }
})();