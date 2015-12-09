(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('ItemController', ItemController);
    ItemController.$inject = ['$rootScope', '$location', '$cookieStore', 'InventoryService', 'CartService', 'FlashService'];

    function ItemController($rootScope, $location, $cookieStore, InventoryService, CartService, FlashService) {
        var vm = this;
        vm.addItemInCart = addItemInCart;
        vm.cart = [];
        vm.currentPage = 1;
        vm.totalPageAsArray = new Array(1);
        vm.loadNextPage = loadNextPage;
        vm.selectedIndex = 0;
        vm.currentUserId = undefined;
        vm.isUserLoggedIn = undefined;

        //load initial items
        InventoryService.getAllItems(1, function (response) {
            if (response.success) {
                vm.items = response.data.items;
                vm.totalPageAsArray = new Array(response.data.totalPages);
                updateUserDetails();
            } else {
                FlashService.Error("Something not working. Please try later");
            }
        });

        function updateUserDetails() {
            var currentUser = $cookieStore.get('currentUser');
            if (currentUser != undefined) {
                vm.isUserLoggedIn = true;
                vm.currentUserId = currentUser.userId;
                vm.cart = $cookieStore.get('userCart');
                $rootScope.cartItemCount = vm.cart.length;
            }
        }

        function loadNextPage(pageNumber) {
            InventoryService.getAllItems(pageNumber + 1, function (response) {
                if (response) {
                    vm.items = response.data.items;
                    vm.totalPageAsArray = new Array(response.data.totalPages);
                    vm.selectedIndex = pageNumber;
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
            });
        }

        //cart
        function addItemInCart(item) {
            updateUserDetails();
            if (vm.isUserLoggedIn) {
                var cartItem = new CartItem(vm.currentUserId, item.itemId);

                if (!isItemExistsInCart(vm.cart, item.id)) {
                    CartService.add(cartItem, function (response) {
                        if (response.success) {
                            vm.cart = addItem(vm.cart, cartItem);
                            $cookieStore.put('userCart', vm.cart);
                            $rootScope.cartItemCount = vm.cart.length;
                        }
                    });
                } else {
                    FlashService.Success("Item already added in your cart");
                }

            } else {
                $location.path('/login');
            }
        }

        //private function
        function addItem(arr, item) {
            arr.push(item);
            return arr;
        }

        function isItemExistsInCart(arr, itemId) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].id === itemId) {
                    return true;
                }
            }

            return false;
        }

        //cartItem class
        function CartItem(userId, itemId) {
            this.userId = userId;
            this.itemId = itemId;
        }
    }
})();