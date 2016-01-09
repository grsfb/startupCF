(function () {
    'use strict';
    angular.module('Chefonia').factory('SessionService', SessionService);
    SessionService.$inject = ['$rootScope', '$cookieStore'];
    function SessionService($rootScope, $cookieStore) {
        var service = {};
        service.create = create;
        service.destroy = destroy;
        service.get = get;
        service.put = put;
        service.remove = remove;
        service.putInRootScope = putInRootScope;
        service.deleteFromRootScope = deleteFromRootScope;
        service.Session = {'CartCount': 'cartItemCount', 'CurrentUser': 'currentUser'};
        var cookieStore = new CookieStore();
        var rootScope = new RootScope();
        if (cookieStore.get(service.Session.CurrentUser)) {
            create(cookieStore.get(service.Session.CurrentUser));
        }
        return service;
        function create(currentUser) {
            rootScope.put('isLoggedIn', true);
            rootScope.put('currentUser', currentUser);
            var cartCount = cookieStore.get(service.Session.CartCount);
            rootScope.put('cartItemCount', cartCount != undefined ? cartCount : 0);
            cookieStore.put(service.Session.CurrentUser, currentUser);
        }

        function destroy() {
            rootScope.put('isLoggedIn', false);
            rootScope.put('cartItemCount', 0);
            rootScope.put('currentUser', undefined);
            remove("currentUser");
            remove("cartItemCount");
        }

        function get(key) {
            if (rootScope.get(key)) {
                return rootScope.get(key);
            }
            return cookieStore.get(key);
        }

        function put(key, value) {
            cookieStore.put(key, value);
        }

        function putInRootScope(key, value) {
            rootScope.put(key, value);
            cookieStore.put(key, value);
        }

        function deleteFromRootScope(key) {
            rootScope.remove(key);
        }

        function remove(key) {
            cookieStore.put(key, undefined);
            cookieStore.remove(key);
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
                delete $rootScope[key];
            }
        }

        function CookieStore() {
            var cookie = {'put': put, 'get': get, 'remove': remove};
            return cookie;
            function put(key, value) {
                $cookieStore.put(key, value);
            }

            function get(key) {
                try {
                    return $cookieStore.get(key);
                }
                catch (e) {
                    return undefined;
                }
            }

            function remove(key) {
                $cookieStore.remove[key];
            }
        }
    }
})();