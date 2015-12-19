(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('ItemController', ItemController);
    ItemController.$inject = ['SessionService', '$location', 'InventoryService', 'CartService', 'FlashService', 'ImageService', '$routeParams'];

    function ItemController(SessionService, $location, InventoryService, CartService, FlashService, ImageService, $routeParams) {
        var vm = this;
        vm.addItemInCart = addItemInCart;
        vm.cart = [];
        vm.currentPage = 1;
        vm.totalPageAsArray = new Array(1);
        vm.loadNextPage = loadNextPage;
        vm.selectedIndex = 0;
        vm.isCartLoaded = false;
        vm.buy = buy;
        vm.getImageUri = getImageUri;
        vm.itemType = $routeParams.categoryName;
        //load initial items
        InventoryService.getAllItems(1, $routeParams.categoryName, function (response) {
            if (response.success) {
                vm.items = response.data.items;
                vm.totalPageAsArray = new Array(response.data.totalPages);
            } else {
                FlashService.Error("Something not working. Please try later");
            }
        });
        function getImageUri(chefName, category, itemName, size) {
            return ImageService.getUri(chefName, category, itemName, size);
        }

        //get all cart items
        var userId = SessionService.get(SessionService.Session.CurrentUser).userId;
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
            InventoryService.getAllItems(pageNumber + 1, $routeParams.categoryName, function (response) {
                if (response) {
                    vm.items = response.data.items;
                    vm.totalPageAsArray = new Array(response.data.totalPages);
                    vm.selectedIndex = pageNumber;
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
            });
        }

        function buy(item) {
            vm.addItemInCart(item);
            $location.path("/cart");
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