(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('ItemController', ItemController);
    ItemController.$inject = ['SessionService','AuthenticationService', '$location', 'InventoryService', 'CartService', 'FlashService', '$routeParams', '$window', 'MappingService'];

    function ItemController(SessionService,AuthenticationService, $location, InventoryService, CartService, FlashService, $routeParams, $window, MappingService) {
        var vm = this;
        vm.isLast = true;
        vm.currentPage = 0;
        vm.isLoadingMore=false;
        vm.addItemInCart = addItemInCart;
        vm.loadNextPage = loadNextPage;
        vm.buy = buy;
        vm.categoryName = $routeParams.categoryName == undefined ? all : $routeParams.categoryName;
        vm.chefLocation = $routeParams.chefLocation == undefined ? all : $routeParams.chefLocation;
        vm.actualCategory = MappingService.getCategory(vm.categoryName) == undefined ? vm.categoryName : MappingService.getCategory(vm.categoryName);
        var isCartLoaded = false;
        vm.cart = undefined;

        loadCart(function () {
            //do nothing
        });
        //load initial items
        InventoryService.getAllItems(vm.currentPage, vm.actualCategory, vm.chefLocation, function (response) {
            if (response.success) {
                vm.items = response.data.items;
                vm.isLast = response.data.lastPage;
            } else {
                FlashService.Error("Something not working. Please try later");
            }
        });

        function isUserLoggedIn() {
            return SessionService.get(SessionService.Session.CurrentUser);
        }

        function getUserId() {
            if (isUserLoggedIn()) {
                return SessionService.get(SessionService.Session.CurrentUser).userId;
            }
            else {
                return null;
            }
        }

        function getBagId() {
            return SessionService.get('bagId');
        }

        function loadNextPage() {
            vm.currentPage++;
            vm.isLoadingMore=true;
            InventoryService.getAllItems(vm.currentPage, vm.actualCategory, vm.chefLocation, function (response) {
                if (response) {
                    vm.items = vm.items.concat(response.data.items);
                    vm.isLast = response.data.lastPage;
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
                vm.isLoadingMore=false;
            });
        }
        function loadCart(callback) {
            if (getBagId() != null || getUserId() !=null) {
                CartService.getCartItems(getBagId(),
                    function (response) {
                        if (response.success) {
                            vm.cart = response.data;
                            vm.isCartLoaded = true;
                            SessionService.putInRootScope("cartItemCount", vm.cart.length);
                            callback();
                        } else {
                            FlashService.Error("Something not working. Please try later");
                        }
                    });
            }
            else {
                vm.isCartLoaded = true;
                callback();
            }
        }

        function buy(item) {
            addItemInCart(item, function () {
                $location.path("cart");
            });
        }

        //cart
        function addItemInCart(item, callback) {

            addToCart(item, callback);


        }

        function addToCart(item, callback) {
            showProgress(item.itemId);
            updateCart(item, callback);

        }

        function updateCart(item, callback) {
            if (getBagId() == null) {
                var newCartItem = new CartItem(getBagId(), getUserId(), item.itemId, 1, item.weight, item.price);
                addNewCartItem(newCartItem, callback);

            }
            else {
                cartUpdation(item, callback);
            }
        }
        function cartUpdation(item,callback)
        {
            var cartItem = getItem(item.itemId, item.weight);
            if (cartItem) {
                cartItem.quantity += 1;
                updateCartItem(cartItem, callback);
            } else {
                var newCartItem = new CartItem(getBagId(), getUserId(), item.itemId, 1, item.weight, item.price);
                addNewCartItem(newCartItem, callback);
            }
        }
        function addNewCartItem(cartItem, callback) {
            CartService.add(cartItem, function (response) {
                if (response.success) {
                    vm.cart.push(response.data);
                    if (getBagId() == null) {
                        SessionService.put("bagId", response.data.bagId);
                        SessionService.putInRootScope("cartItemCount", 1);
                    }
                    SessionService.putInRootScope("cartItemCount", vm.cart.length);
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
            for (var i = 0; i < vm.cart.length; i++) {
                if (vm.cart[i].itemId === itemId && vm.cart[i].weight == weight) {
                    return vm.cart[i];
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
        function CartItem(bagId,userId, itemId, quantity, weight, price) {
            this.bagId = bagId;
            this.userId = userId;
            this.itemId = itemId;
            this.weight = weight;
            this.price = price;
            this.quantity = quantity;
        }
    }
})();