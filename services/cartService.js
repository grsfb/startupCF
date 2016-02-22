(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('CartService', CartService);

    CartService.$inject = ['CommonService','SessionService'];
    function CartService(CommonService,SessionService) {
        var service = {};
        service.getCartItems = getCartItems;
        service.add = add;
        service.update = update;
        service.remove = remove;
        service.removeCartItem = removeCartItem;
        service.count = count;
        service.saveGiftMessage=saveGiftMessage;
        return service;
        function isUserLoggedIn() {
            return SessionService.get(SessionService.Session.CurrentUser);
        }

        function getUserId() {
            if (isUserLoggedIn()) {
                return SessionService.get(SessionService.Session.CurrentUser).userId;
            }
            else {
                return null;
            }
        }

        function getCartItems(bagId, callback) {
            var bagId = SessionService.get('bagId');
            CommonService.get('/cart/' + getUserId() + '/all/'+bagId, callback);
        }

        function count(userId, callback) {
            CommonService.get('/cart/' + bagId + '/count', callback);
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