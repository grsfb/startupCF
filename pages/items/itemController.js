(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('ItemController', ItemController);
    ItemController.$inject = ['SessionService', '$location', 'InventoryService', 'CartService', 'FlashService','$routeParams', '$window'];

    function ItemController(SessionService, $location, InventoryService, CartService, FlashService, $routeParams, $window) {
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

        //load initial items
        InventoryService.getAllItems(1, vm.categoryName, vm.chefLocation, function (response) {
            if (response.success) {
                vm.items = response.data.items;
                vm.totalPageAsArray = new Array(response.data.totalPages);
            } else {
                FlashService.Error("Something not working. Please try later");
            }
        });

        //get all cart items
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
            vm.addItemInCart(item);
            $location.path("/cart");
        }

        //cart
        function addItemInCart(item) {
            showProgress(item.itemId);
            if (SessionService.get(SessionService.Session.CurrentUser)) {
                var userId = SessionService.get(SessionService.Session.CurrentUser).userId;
                if (vm.isCartLoaded) {
                    updateCart(userId, item);
                } else {
                    loadCart(function () {
                        updateCart(userId, item);
                    });
                }
            } else {
                hideProgress(item.itemId);
                //mobile view
                if ($window.innerWidth < 420) {
                    $location.path("/login-mble");
                } else {
                    $("#myModal").modal();
                }
            }
        }

        function updateCart(userId, item) {
            var cartItem = getCartItem(vm.cart, item.itemId,item.weight);
            if (cartItem) {
                cartItem.quantity += 1;
                updateCartItem(cartItem);
            } else {
                var newCartItem = new CartItem(userId, item.itemId, 1,item.weight,item.price);
                addNewCartItem(newCartItem);
            }
        }

        function addNewCartItem(cartItem) {
            CartService.add(cartItem, function (response) {
                if (response.success) {
                    vm.cart = addItem(vm.cart, cartItem);
                    SessionService.putInRootScope("cartItemCount", vm.cart.length);
                    SessionService.put("cartItemCount", vm.cart.length);
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
                hideProgress(cartItem.itemId);
            });
        }

        function updateCartItem(cartItem) {
            CartService.update(cartItem, function (response) {
                if (response.success) {
                    vm.cart = updateCartItemCount(vm.cart, cartItem.itemId);
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
                hideProgress(cartItem.itemId);
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

        function getCartItem(arr, itemId,weight) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].itemId === itemId && arr[i].weight ==weight) {
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

        //cartItem class
        function CartItem(userId, itemId, quantity,weight,price) {
            this.userId = userId;
            this.itemId = itemId;
            this.weight=weight;
            this.price=price;
            this.quantity = quantity;
        }
    }
})();