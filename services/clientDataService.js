(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('ClientDataService', ClientDataService);
    ClientDataService.$inject = ['$http'];

    function ClientDataService($http) {
        var service = {};
        $http.defaults.headers.common['Content-Type'] = 'application/json';
        service.get = getCall;
        return service;
        function getCall(relativeUrl, callback) {
            var response;
            $http.get(relativeUrl)
                .success(function (res) {
                    response = {success: true, data: res};
                    callback(response);
                })
                .error(function (res) {
                    response = {success: false, data: res};
                    callback(response);
                });
        }
    }
})();