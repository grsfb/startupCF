(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('CartService', CartService);

    CartService.$inject = ['$http'];
    function CartService($http) {
        var service = {};
        service.getCartItems = getCartItems;
        service.add = add;

        return service;

        function getCartItems(userId, callback) {
            var response;
            $http.get('/cart/'+userId+'all')
                .success(function (response) {
                    callback(response);
                })
                .error(function () {
                    response = {success: false, message: 'No item found'};
                    callback(response);
                });
        }


        function add(cartItem, callback) {
            var response;
            $http.post('/cart/add', cartItem)
                .success(function (response) {
                    callback(response);
                })
                .error(function () {
                    response = {success: false, message: 'Unable to add item in cart'};
                    callback(response);
                });
        }
    }

})();