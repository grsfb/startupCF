(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('CartManager', CartManager);

    CartManager.$inject = ['CartService', 'SessionService', 'FlashService'];

    function CartManager(CartService, SessionService, FlashService) {
        var service = {};
        service.cartItems = [];
        service.addOrUpdateItem = addOrUpdateItem;
        service.remove = remove;
        service.loadUserBag = loadUserBag;
        service.cartSumTotal = cartSumTotal;
        service.getUserCart = getUserCart;
        service.minusOneItemCount = minusOneItemCount;
        service.plusOneItemCount = plusOneItemCount;
        //always eagerly load cart
        loadUserBag(undefined);
        return service;
        function addOrUpdateItem(item, callback) {
            var cartItem = getItem(item.itemId, item.weight);
            if (cartItem) {
                cartItem.quantity++;
                update(cartItem, callback);
            } else {
                var newCartItem = new CartItem(getBagId(), getUserId(), item.itemId, 1, item.weight, item.price);
                add(newCartItem, callback);
            }
        }

        function remove(cartItemId, callback) {
            CartService.removeCartItem(cartItemId, function (response) {
                if (response.success) {
                    service.cartItems = removeItem(service.cartItems, cartItemId);
                    updateCartItemCount();
                } else {
                    FlashService.Error("Something not working. Please try later.")
                }
            });

            invokeCallback(callback);
        }

        function removeItem(arr, cartItemId) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].cartItemId === cartItemId) {
                    arr.splice(i, 1);
                    break;
                }
            }
            return arr;
        }

        function minusOneItemCount(cartItemId, callback) {
            var index = getCartItemIndex(cartItemId);
            if (index) {
                service.cartItems[index].quantity -= 1;
                update(service.cartItems[index], callback);
                return;
            }
            FlashService.Error("Something not working. Please try later")
        }

        function plusOneItemCount(cartItemId, callback) {
            var index = getCartItemIndex(cartItemId);
            if (index) {
                service.cartItems[index].quantity += 1;
                update(service.cartItems[index], callback);
                invokeCallback(callback);
                return;
            }
            FlashService.Error("Something not working. Please try later")
        }

        function getCartItemIndex(cartItemId) {
            for (var i = 0; i < service.cartItems.length; i++) {
                if (service.cartItems[i].cartItemId === cartItemId) {
                    return i;
                }
            }
            return undefined;
        }

        function loadUserBag(callback) {
            if (getBagId()) {
                CartService.getCartItems(getBagId(), function (response) {
                    if (response.success) {
                        service.cartItems = response.data;
                    } else {
                        FlashService.Error("Something not working. Please try later");
                    }
                    updateCartItemCount();
                    invokeCallback(callback);
                });
            }
        }

        function getUserCart() {
            return service.cartItems;
        }

        function cartSumTotal() {
            var cartSubtotal = 0;
            for (var i = 0; i < service.cartItems.length; i++) {
                cartSubtotal += service.cartItems[i].price * service.cartItems[i].quantity;
            }
            return cartSubtotal;
        }

        function add(cartItem, callback) {
            CartService.add(cartItem, function (response) {
                if (response.success) {
                    SessionService.put("bagId", response.data.bagId);
                    service.cartItems.push(response.data);
                } else {
                    FlashService.Error("Something is not working. Please try later", true);
                }
                invokeCallback(callback);
            });
        }


        function update(cartItem, callback) {
            CartService.update(cartItem, function (response) {
                if (!response.success) {
                    FlashService.Error("Something not working. Please try later");
                }
                invokeCallback(callback);
            });
        }

        function getItem(itemId, weight) {
            for (var i = 0; i < service.cartItems.length; i++) {
                if (service.cartItems[i].itemId === itemId && service.cartItems[i].weight == weight) {
                    return service.cartItems[i];
                }
            }
            return undefined;
        }

        //cartItem class
        function CartItem(bagId, userId, itemId, quantity, weight, price) {
            this.bagId = bagId;
            this.userId = userId;
            this.itemId = itemId;
            this.weight = weight;
            this.price = price;
            this.quantity = quantity;
        }

        function getBagId() {
            return SessionService.get('bagId');
        }

        function isUserLoggedIn() {
            return SessionService.get(SessionService.Session.CurrentUser);
        }

        function getUserId() {
            if (isUserLoggedIn()) {
                return SessionService.get(SessionService.Session.CurrentUser).userId;
            }
            return undefined;
        }

        function updateCartItemCount() {
            SessionService.putInRootScope("cartItemCount", service.cartItems.length);
        }

        function invokeCallback(callback) {
            if (callback) {
                callback();
            }
        }
    }
})();