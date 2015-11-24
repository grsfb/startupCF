(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('CommunicationService', CommunicationService);
    CommunicationService.$inject = ['$http', '$rootScope'];
    function CommunicationService($http, $rootScope, UserService) {
        var service = {};
        service.create = create;

        return service;
        function create(userId, address, callback) {
            var response;
            $http.post('/api/users/userId/address',
                {"address": address, "userId": userId})
                .success(function (response) {
                    callback(response);
                })
                .error(function () {
                    response = {success: false, message: 'Username or password is incorrect'};
                    callback(response);
                });
        }

    }
})();