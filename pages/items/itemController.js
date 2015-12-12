(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('ItemController', ItemController);
    ItemController.$inject = ['SessionService', '$location', 'InventoryService', 'CartService', 'FlashService'];

    function ItemController(SessionService, $location, InventoryService, CartService, FlashService) {
        var vm = this;
        vm.addItemInCart = addItemInCart;
        vm.cart = [];
        vm.currentPage = 1;
        vm.totalPageAsArray = new Array(1);
        vm.loadNextPage = loadNextPage;
        vm.selectedIndex = 0;
        vm.isCartLoaded = false;

        //load initial items
        InventoryService.getAllItems(1, function (response) {
            if (response.success) {
                vm.items = response.data.items;
                vm.totalPageAsArray = new Array(response.data.totalPages);
            } else {
                FlashService.Error("Something not working. Please try later");
            }
        });
        //get all cart items
        var userId=SessionService.get(SessionService.Session.CurrentUser).userId;
        CartService.getCartItems(userId,
            function (response) {
                if (response.success) {
                    vm.cart = response.data;
                    vm.isCartLoaded = true;
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
            });

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
            if (vm.isCartLoaded) {
                var cartItem = new CartItem(userId, item.itemId);
                if (!isItemExistsInCart(vm.cart, item.itemId)) {
                    CartService.add(cartItem, function (response) {
                        if (response.success) {
                            vm.cart = addItem(vm.cart, cartItem);
                            SessionService.putInRootScope("cartItemCount", vm.cart.length);
                            SessionService.put("cartItemCount", vm.cart.length);
                        } else {
                            FlashService.Error("Something not working. Please try later");
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
                if (arr[i].itemId === itemId) {
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