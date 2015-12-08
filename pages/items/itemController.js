(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('ItemController', ItemController);
    ItemController.$inject = ['$rootScope', '$location', '$cookieStore', 'InventoryService', 'WishListService', 'CartService', 'FlashService'];

    function ItemController($rootScope, $location, $cookieStore, InventoryService, CartService, FlashService) {
        var vm = this;
        vm.addItemInCart = addItemInCart;
        vm.removeItemFromCart = removeItemFromCart;
        vm.cart = [];
        vm.currentPage = 1;
        vm.totalPageAsArray = new Array(1);
        vm.loadNextPage = loadNextPage;
        vm.selectedIndex = 0;

        if ($cookieStore.get('cart')) {
            vm.cart = $cookieStore.get('cart');
        }

        //load initial items
        InventoryService.getAllItems(1, function (response) {
            if (response.success) {
                vm.items = response.data.items;
                vm.totalPageAsArray = new Array(response.data.totalPages);
            } else {
                FlashService.Error("Something not working. Please try later");
            }
        });

        function loadNextPage(pageNumber) {
            InventoryService.getAllItems(pageNumber+1, function (response) {
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
            if ($cookieStore.get('currentUser')) {
                var cartItem = new CartItem($cookieStore.get('currentUser').userId,
                    item.id, item.name, item.category, 1, item.price);

                if (!isItemExistsInCart(item.id)) {
                    CartService.create(cartItem, function (response) {
                        //TODO: Should wait for response?
                        vm.cart = addItem(vm.cart, cartItem);
                        $cookieStore.put('cart', vm.cart);
                        $rootScope.cartItemCount = vm.cart.length;
                    });
                }

            } else {
                $location.path('/login');
            }
        }

        function removeItemFromCart(item) {
            vm.cart = removeItem(vm.cart, item);
            $cookieStore.put('cart', vm.cart);


            $rootScope.cartItemCount = vm.cart.length;
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

        function removeItem(arr, item) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].id === item.id) {
                    arr.splice(i, 1);
                    break;
                }
            }
            return arr;
        }

        //cartItem class
        function CartItem(userId, itemId, itemName, category, quantity, price) {
            this.userId = userId;
            this.itemId = itemId;
            this.itemName = itemName;
            this.category = category;
            this.quantity = quantity;
            this.price = price;
        }
    }
})();