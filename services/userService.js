(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('UserService', UserService);

    UserService.$inject = ['CommonService'];
    function UserService(CommonService) {
        var service = {};
        service.create = create;
        return service;

        function create(user, callback) {
                CommonService.post("/user/register", user, callback);
        }

    }

})();