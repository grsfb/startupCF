(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('CartService', CartService);

    CartService.$inject = ['$http'];
    function CartService($http) {
        var service = {};
        service.addItem = addItem;
        service.removeItem = removeItem;
        service.updateItem = updateItem;
        service.Create = Create;
        service.Update = Update;

        return service;
        function addItem(userId,item) {
            return $http.post('/api/users', item).then(handleSuccess, handleError('Error adding item'));
        }

        function removeItem(userId,) {
            return $http.delete('/endpoint/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function updateItemInCart(item) {
            return $http.put('/api/users/' + item.id, item).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }
    }

})();