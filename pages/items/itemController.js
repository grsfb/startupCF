(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('ItemController', ItemController);
    ItemController.$inject = ['SessionService', '$location', 'InventoryService', 'CartService', 'FlashService', '$routeParams', '$window','MappingService'];

    function ItemController(SessionService, $location, InventoryService, CartService, FlashService, $routeParams, $window,MappingService) {
        var vm = this;
        vm.addItemInCart = addItemInCart;
        vm.cart = [];
        vm.currentPage = 1;
        vm.totalPageAsArray = new Array(1);
        vm.loadNextPage = loadNextPage;
        vm.selectedIndex = 0;
        vm.isCartLoaded = false;
        vm.buy = buy;
        vm.categoryName = $routeParams.categoryName == undefined ? all : $routeParams.categoryName;
        vm.chefLocation = $routeParams.chefLocation == undefined ? all : $routeParams.chefLocation;
        vm.actualCategory=MappingService.getCategory(vm.categoryName)==undefined ?vm.categoryName:MappingService.getCategory(vm.categoryName);

        //load initial items
        InventoryService.getAllItems(1,vm.actualCategory, vm.chefLocation, function (response) {
            if (response.success) {
                vm.items = response.data.items;
                vm.totalPageAsArray = new Array(response.data.totalPages);
            } else {
                FlashService.Error("Something not working. Please try later");
            }
        });

        //get all cart items parallel
        if (SessionService.get(SessionService.Session.CurrentUser)) {
            loadCart(function () {
                //nothing to do
            });
        }
        function loadCart(callback) {
            var userId = SessionService.get(SessionService.Session.CurrentUser).userId;
            CartService.getCartItems(userId,
                function (response) {
                    if (response.success) {
                        vm.cart = response.data;
                        vm.isCartLoaded = true;
                        callback();
                    } else {
                        FlashService.Error("Something not working. Please try later");
                    }
                });
        }

        function loadNextPage(pageNumber) {
            InventoryService.getAllItems(pageNumber + 1, vm.categoryName, vm.chefLocation, function (response) {
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
            addItemInCart(item, function () {
                $location.path("/cart");
            });
        }

        //cart
        function addItemInCart(item, callback) {
            //don't show progress if user not logged in
            if (SessionService.get(SessionService.Session.CurrentUser)) {
                showProgress(item.itemId);
                var userId = SessionService.get(SessionService.Session.CurrentUser).userId;
                if (vm.isCartLoaded) {
                    updateCart(userId, item, callback);
                } else {
                    loadCart(function () {
                        updateCart(userId, item, callback);
                    });
                }
            } else {
                openLogin();
            }
        }

        function updateCart(userId, item, callback) {
            var cartItem = getCartItem(vm.cart, item.itemId, item.weight);
            if (cartItem) {
                cartItem.quantity += 1;
                updateCartItem(cartItem, callback);
            } else {
                var newCartItem = new CartItem(userId, item.itemId, 1, item.weight, item.price);
                addNewCartItem(newCartItem, callback);
            }
        }

        function addNewCartItem(cartItem, callback) {
            CartService.add(cartItem, function (response) {
                if (response.success) {
                    vm.cart = addItem(vm.cart, cartItem);
                    SessionService.putInRootScope("cartItemCount", vm.cart.length);
                    SessionService.put("cartItemCount", vm.cart.length);
                } else {
                    FlashService.Error("Something not working. Please try later", true);
                }
                hideProgress(cartItem.itemId);
                if (callback) {
                    callback();
                }
            });
        }

        function updateCartItem(cartItem, callback) {
            CartService.update(cartItem, function (response) {
                if (response.success) {
                    vm.cart = updateCartItemCount(vm.cart, cartItem.itemId);
                } else {
                    FlashService.Error("Something not working. Please try later", true);
                }
                hideProgress(cartItem.itemId);
                if (callback) {
                    callback();
                }
            });
        }

        function showProgress(id) {
            $('#' + id).css("visibility", "visible");
            $('#button-' + id).prop('disabled', true);
        }

        function hideProgress(id) {
            $('#' + id).css("visibility", "hidden");
            $('#button-' + id).prop('disabled', false);
            $('#' + id + '-done').show().fadeOut(3000);
        }

        //private function
        function addItem(arr, item) {
            arr.push(item);
            return arr;
        }

        function getCartItem(arr, itemId, weight) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].itemId === itemId && arr[i].weight == weight) {
                    return arr[i];
                }
            }
            return undefined;
        }

        function updateCartItemCount(arr, itemId) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].itemId === itemId) {
                    return arr[i].quantity + 1;
                }
            }
            return undefined;
        }

        function openLogin() {
            //mobile view
            if ($window.innerWidth < 420) {
                $location.path("/login-mble");
            } else {
                $("#myModal").modal();
            }
        }

        //cartItem class
        function CartItem(userId, itemId, quantity, weight, price) {
            this.userId = userId;
            this.itemId = itemId;
            this.weight = weight;
            this.price = price;
            this.quantity = quantity;
        }
    }
})();