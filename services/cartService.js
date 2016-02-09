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
        service.remove = remove;
        service.removeCartItem = removeCartItem;
        service.count = count;
        service.saveGiftMessage=saveGiftMessage;
        return service;

        function getCartItems(userId, callback) {
            CommonService.get('/cart/' + userId + '/all', callback);
        }

        function count(userId, callback) {
            CommonService.get('/cart/' + userId + '/count', callback);
        }

        function add(cartItem, callback) {
            CommonService.post('/cart/add', cartItem, callback);
        }

        function update(cartItem, callback) {
            CommonService.update('/cart/update', cartItem, callback);
        }

        function removeCartItem(itemId, callback) {
            CommonService.delete('/cart/delete/' + itemId, callback);
        }

        function remove(userId, callback) {
            CommonService.delete("/cart/" + userId + '/delete-all', callback);
        }

        function saveGiftMessage(message,callback){
            CommonService.post('/gift-message/save', message, callback);
        }
    }

})();