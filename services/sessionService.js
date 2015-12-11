(function () {
    'use strict';
    angular.module('Chefonia').factory('SessionService', SessionService);
    SessionService.$inject = ['$rootScope', '$cookieStore', 'CartService', 'FlashService'];
    function SessionService($rootScope, $cookieStore) {
        var service = {};
        service.create = create;
        service.destroy = destroy;
        service.get = get;
        service.put=put;
        service.putInRootScope=putInRootScope;
        service.Session = {'UserCart': 'userCart', 'CurrentUser': 'currentUser'};
        var cookieStore=new CookieStore();
        var rootScope = new RootScope();
        if(cookieStore.get(service.Session.CurrentUser)){
            create(cookieStore.get(service.Session.CurrentUser));
        }
        return service;
        function create(currentUser) {
            rootScope.put('isLoggedIn', true);
            rootScope.put('currentUser',currentUser);
            cookieStore.put(service.Session.CurrentUser, currentUser);
        }
        function destroy() {
            rootScope.put('isLoggedIn', false);
            rootScope.put('cartItemCount', 0);
            cookieStore.remove(service.Session.CurrentUser);
            cookieStore.remove(service.Session.UserCart);
        }
        function get(key) {
            cookieStore.get(key);
        }
        function put(key,value) {
            cookieStore.put(key,value);
        }
        function putInRootScope(key,value){
            rootScope.put(key,value);
        }
        function RootScope() {
            var root = {'put': put, 'get': get, 'remove': remove};
            return root;
            function put(key, value) {
                $rootScope[key] = value;
            }

            function get(key) {
                return $rootScope[key];
            }

            function remove(key) {
                return $rootScope[key] = undefined;
            }
        }
        function CookieStore() {
            var cookie = {'put': put, 'get': get, 'remove': remove};
            return cookie;
            function put(key, value) {
                $cookieStore.put(key, value);
            }
            function get(key) {
                return $cookieStore.get(key);
            }
            function remove(key) {
                return $cookieStore.remove(key);
            }
        }
    }
})();