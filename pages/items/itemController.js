(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('ItemController', ItemController);
    ItemController.$inject = ['SessionService', '$location', 'InventoryService', 'CartService', 'FlashService', '$routeParams', '$window', 'MappingService'];

    function ItemController(SessionService, $location, InventoryService, CartService, FlashService, $routeParams, $window, MappingService) {
        var vm = this;
        vm.addItemInCart = addItemInCart;
        vm.totalPageAsArray = new Array(1);
        vm.loadNextPage = loadNextPage;
        vm.selectedIndex = 0;
        vm.buy = buy;
        vm.categoryName = $routeParams.categoryName == undefined ? all : $routeParams.categoryName;
        vm.chefLocation = $routeParams.chefLocation == undefined ? all : $routeParams.chefLocation;
        vm.actualCategory = MappingService.getCategory(vm.categoryName) == undefined ? vm.categoryName : MappingService.getCategory(vm.categoryName);
        var isCartLoaded = false;
        var cart = [];

        //load initial items
        InventoryService.getAllItems(0, vm.actualCategory, vm.chefLocation, function (response) {
            if (response.success) {
                vm.items = response.data.items;
                vm.totalPageAsArray = new Array(response.data.totalPages);
            } else {
                FlashService.Error("Something not working. Please try later");
            }
        });

        function isUserLoggedIn() {
            return SessionService.get(SessionService.Session.CurrentUser);
        }

        function getUserId() {
            return SessionService.get(SessionService.Session.CurrentUser).userId;
        }

        //get all cart items parallel
        if (isUserLoggedIn()) {
            loadCart(function () {
                //nothing to do
            });
        }
        function loadCart(callback) {
            CartService.getCartItems(getUserId(),
                function (response) {
                    if (response.success) {
                        cart = response.data;
                        isCartLoaded = true;
                        callback();
                    } else {
                        FlashService.Error("Something not working. Please try later");
                    }
                });
        }

        function loadNextPage(pageNumber) {
            InventoryService.getAllItems(pageNumber, vm.actualCategory, vm.chefLocation, function (response) {
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
            if (isUserLoggedIn()) {
                showProgress(item.itemId);
                if (isCartLoaded) {
                    updateCart(item, callback);
                } else {
                    loadCart(function () {
                        updateCart(item, callback);
                    });
                }
            } else {
                openLogin();
            }
        }

        function updateCart(item, callback) {
            var cartItem = getItem(item.itemId, item.weight);
            if (cartItem) {
                cartItem.quantity += 1;
                updateCartItem(cartItem, callback);
            } else {
                var newCartItem = new CartItem(getUserId(), item.itemId, 1, item.weight, item.price);
                addNewCartItem(newCartItem, callback);
            }
        }

        function addNewCartItem(cartItem, callback) {
            CartService.add(cartItem, function (response) {
                if (response.success) {
                    cart.push(response.data);
                    SessionService.putInRootScope("cartItemCount", cart.length);
                    SessionService.put("cartItemCount", cart.length);
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
                if (!response.success) {
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
            $('#button-' + id).addClass('disabled');
        }

        function hideProgress(id) {
            $('#' + id).css("visibility", "hidden");
            $('#button-' + id).removeClass('disabled');
            $('#' + id + '-done').show().fadeOut(3000);
        }

        function getItem(itemId, weight) {
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].itemId === itemId && cart[i].weight == weight) {
                    return cart[i];
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