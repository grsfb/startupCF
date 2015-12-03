(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('CartService', CartService);

    CartService.$inject = ['CommonService'];
    function CartService(CommonService) {
        var service = {};
        service.getCartItems = getCartItems;
        service.add = add;

        return service;

        function getCartItems(userId, callback) {
            //'/cart/'+userId+'all'
            CommonService.get('/data/cart.json', callback);
        }


        function add(cartItem, callback) {
            CommonService.post('/cart/add', cartItem, callback);
        }
    }

})();