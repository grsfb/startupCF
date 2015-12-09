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
        service.update = update;
        service.remove=remove;
        return service;

        function getCartItems(userId, callback) {
            CommonService.get('/cart/'+userId+'/all', callback);
        }


        function add(cartItem, callback) {
            CommonService.post('/cart/add', cartItem, callback);
        }

        function update(cartItem, callback) {
            CommonService.update('/cart/update', cartItem, callback);
        }

        function remove(userId,itemId, callback) {
            CommonService.delete("/cart/"+userId +'/delete/'+ itemId, callback);
        }
    }

})();