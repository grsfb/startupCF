(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('WishListService', WishListService);
    WishListService.$inject = ['$http', '$rootScope'];
    function WishListService($http, $rootScope) {
        var service = {};
        service.create = create;
        service.remove=remove;

        return service;
        function create(itemId,userId,callback) {
            var response;
            $http.post('/api/users', {"itemId":itemId,"userId":userId})
                .success(function (response) {
                    callback(response);
                })
                .error(function () {
                    response = {success: false, message: 'Username or password is incorrect'};
                    callback(response);
                });
        }

        function remove(itemId,userId,callback){
            var response;
            //TODO: delete method call
            $http.post('/api/users/delete', {"itemId":itemId,"userId":userId})
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