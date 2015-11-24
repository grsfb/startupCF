(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('ItemController', ItemController);
    ItemController.$inject = ['$rootScope', '$location', '$cookieStore', 'InventoryService', 'WishListService', 'CartService'];

    function ItemController($rootScope, $location, $cookieStore, InventoryService, WishListService, CartService) {
        var vm = this;
        vm.addItemInWishList = addItemInWishList;
        vm.removeItemFromWishList = removeItemFromWishList;
        vm.addItemInCart = addItemInCart;
        vm.removeItemFromCart = removeItemFromCart;
        vm.wishList = [];
        vm.cart = [];

        //initialize all
        if ($cookieStore.get('wishList')) {
            vm.wishList = $cookieStore.get('wishList');
        }
        if ($cookieStore.get('cart')) {
            vm.cart = $cookieStore.get('cart');
        }

        //load initial items
        InventoryService.getAllItems(function (response) {
            if (response) {
                vm.items = response;
            } else {
                //display error
            }
        });

        //wishlist
        function addItemInWishList(item) {
            if ($cookieStore.get('globals')) {
                vm.wishList = addItem(vm.wishList, item);
                $cookieStore.put('wishList', vm.wishList);
                WishListService.create("userId", item.id, function (response) {
                    //TODO:create wishlist in server
                });
                //update count
                $rootScope.wishListCount = vm.wishList.length;
            } else {
                $location.path('/login');
            }
            console.log(vm.wishList.toString());
        }

        function removeItemFromWishList(item) {
            vm.wishList = removeItem(vm.wishList, item);
            $cookieStore.put('wishList', vm.wishList);
            WishListService.remove("userId", item.id, function (response) {
                //remove item from wish list
            });

            //update count
            $rootScope.wishListCount = vm.wishList.length;
        }

        //cart
        function addItemInCart(item) {
            if ($cookieStore.get('currentUser')) {
                var cartItem = new CartItem($cookieStore.get('currentUser').userId,
                    item.id, item.name, item.category, 1, item.price);

                if(!isItemExistsInCart(item.id)){
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
            WishListService.remove("username", item.id, function (response) {
            });

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