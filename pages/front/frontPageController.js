(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('FrontPageController', FrontPageController)
        .directive("owlCarousel", function () {
            return {
                restrict: 'E',
                transclude: false,
                link: function (scope) {
                    scope.initCarousel = function (element) {
                        // provide any default options you want
                        var defaultOptions = {
                            items: 4, //10 items above 1000px browser width
                            itemsDesktop: [1000, 5], //5 items between 1000px and 901px
                            itemsDesktopSmall: [900, 3], // betweem 900px and 601px
                            itemsTablet: [600, 2], //2 items between 600 and 0
                            itemsMobile: false, // itemsMobile disabled - inherit from itemsTablet option
                            autoPlay: false,
                            slideSpeed: 200,
                            navigationText: false,
                            pagination: false,
                            stopOnHover: true
                            // Custom Navigation Events
                        };
                        var customOptions = scope.$eval($(element).attr('data-options'));
                        // combine the two options objects
                        for (var key in customOptions) {
                            defaultOptions[key] = customOptions[key];
                        }
                        // init carousel
                        $(element).owlCarousel(defaultOptions);
                    };
                }
            };
        })
        .directive('owlCarouselItem', [function () {
            return {
                restrict: 'A',
                transclude: false,
                link: function (scope, element) {
                    // wait for the last item in the ng-repeat then call init
                    if (scope.$last) {
                        scope.initCarousel(element.parent());
                    }
                }
            };
        }]);
    FrontPageController.$inject = ['SessionService','AuthenticationService', 'CartService', '$http', '$location', '$rootScope', '$document', 'FlashService', 'MappingService','$scope'];

    function FrontPageController(SessionService,AuthenticationService, CartService, $http, $location, $rootScope, $document, FlashService, MappingService,$scope) {
        var vm = this;
        vm.cityChange = cityChange;
        vm.foodChange = foodChange;
        vm.addItemInCart = addItemInCart;
        vm.city = 'All';
        vm.loadItems = loadItems;
        vm.slides = undefined;
        vm.newSlides = undefined;
        vm.cityList = ['All', 'Pune', 'Mumbai', 'Delhi', 'Hyderabad', 'Ahemdabad', 'Nandurbar'];
        vm.userId = undefined;
        vm.snack = undefined;
        vm.categories = undefined;
        vm.buy = buy;
        vm.allCategories = allCategories;
        var isCartLoaded = false;
        vm.cart = undefined;
        loadCart(function () {
            //do nothing
        });
        $scope.$on('handleBagUpdate', function() {
            loadCart(function () {
                //do nothing
            });
        });
       //if(SessionService.get("cartItemCount"))
       //{
       //    return SessionService.get("cartItemCount");
       //}
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

        $http.get('data/items.json').success(function (data) {
            vm.slides = data;

        });
        $http.get('data/categories.json').success(function (data) {
            vm.categories = data;

        });
        function cityChange(city) {
            $location.path('item/all' + '/' + city.toLowerCase());
        }

        function foodChange(snack) {
            $location.path('item/' + snack + '/' + vm.city.toLowerCase());
        }

        function allCategories() {
            $location.path('categories');
        }

        vm.foodList = MappingService.getAllOptions();
        function loadItems() {
            $location.path('item/' + 'all/' + vm.city.toLowerCase());
        }

        $document.find("#popularowlNext").click(function () {
            $("#owl-demo").trigger('owl.next');
        });
        $document.find("#popularowlPrev").click(function () {
            $("#owl-demo").trigger('owl.prev');
        });

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
                isCartLoaded = true;
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
            if(vm.cart==undefined) {
                loadCart(function () {
                    addToCart(item, callback);
                });
            }
            else {
                addToCart(item, callback);
            }

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
                    if (getBagId() == null) {
                        SessionService.put("bagId", response.data.bagId);
                        SessionService.putInRootScope("cartItemCount", 1);
                    }
                    else {
                        SessionService.putInRootScope("cartItemCount", vm.cart.length+1);
                    }
                } else {
                    FlashService.Success("Item Already added.", true);
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


        //cartItem class
        function CartItem(bagId, userId, itemId, quantity, weight, price) {
            this.bagId = bagId;
            this.userId = userId;
            this.itemId = itemId;
            this.weight = weight;
            this.price = price;
            this.quantity = quantity;
        }
    }
})();