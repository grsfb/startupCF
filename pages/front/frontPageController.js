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
    ;
    FrontPageController.$inject = ['SessionService', 'CartService', '$http', '$location', '$window', '$document', 'FlashService', 'MappingService'];

    function FrontPageController(SessionService, CartService, $http, $location, $window, $document, FlashService, MappingService) {
        var vm = this;
        vm.cityChange = cityChange;
        vm.foodChange = foodChange;
        vm.addItemInCart = addItemInCart;
        vm.cart = [];
        vm.isCartLoaded = false;
        vm.city = 'All';
        vm.loadItems = loadItems;
        vm.slides = undefined;
        vm.newSlides = undefined;
        vm.cityList = ['Pune', 'Nasik', 'Mumbai', 'Jaipur'];
        vm.userId = undefined;
        vm.snack = undefined;
        vm.categories = undefined;
        vm.buy = buy;
        vm.allCategories = allCategories;
        if (SessionService.get('location') != null) {
            cityChange(SessionService.get('location'));
        }
        else {
            SessionService.put('location', vm.city);
        }
        $http.get('/client/data/items.json').success(function (data) {
            vm.slides = data;

        });
        $http.get('/client/data/categories.json').success(function (data) {
            vm.categories = data;

        });
        $http.get('/client/data/popularItems.json').success(function (data) {
            vm.newSlides = data;
        });
        function cityChange(city) {
            if (vm.city == 'All') {
                vm.cityList.unshift(vm.city);
            }
            else {
                vm.cityList.push(vm.city);
            }
            vm.city = city;
            var index = vm.cityList.indexOf(city);
            vm.cityList.splice(index, 1);
            SessionService.put('location', vm.city);
        }

        function foodChange(snack) {
            $location.path('item/' + snack + '/' + vm.city.toLowerCase());
        }

        function allCategories() {
            $location.path('categories');
        }

        vm.foodList = MappingService.getAllOptions();
        vm.popularFoodList = ['Chocolate', 'Chatani'];
        vm.newFoodList = ['Cake', 'MouthFreshners'];
        function loadItems() {
            $location.path('item/' + 'all/' + vm.city.toLowerCase());
        }

        $document.find("#popularowlNext").click(function () {
            $("#owl-demo").trigger('owl.next');
        });
        $document.find("#popularowlPrev").click(function () {
            $("#owl-demo").trigger('owl.prev');
        });

        if (SessionService.get(SessionService.Session.CurrentUser) != null) {
            vm.userId = SessionService.get(SessionService.Session.CurrentUser).userId;
            loadCart(vm.userId);
        }
        function loadCart(userId) {
            CartService.getCartItems(userId,
                function (response) {
                    if (response.success) {
                        vm.cart = response.data;
                        vm.isCartLoaded = true;
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

        function addItemInCart(item, callback) {
            if (SessionService.get(SessionService.Session.CurrentUser)) {
                var userId = SessionService.get(SessionService.Session.CurrentUser).userId;
                if (vm.isCartLoaded) {
                    updateCart(userId, item, callback);
                } else {
                    loadCart(function () {
                        updateCart(userId, item, callback);
                    });
                }
            } else {
                //mobile view
                if ($window.innerWidth < 420) {
                    $location.path("/login-mble");
                } else {
                    $("#myModal").modal();
                }
            }
        }

        function updateCart(userId, item, callback) {
            var cartItem = getCartItem(vm.cart, item.itemId);
            if (cartItem) {
                cartItem.quantity += 1;
                updateCartItem(cartItem, callback);
            } else {
                var newCartItem = new CartItem(userId, item.itemId, 1);
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
                    FlashService.Error("Something not working. Please try later");
                }
                callback();
            });
        }

        function updateCartItem(cartItem, callback) {
            CartService.update(cartItem, function (response) {
                if (response.success) {
                    vm.cart = updateCartItemCount(vm.cart, cartItem.itemId);
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
                callback();
            });
        }

        function updateCartItemCount(arr, itemId) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].itemId === itemId) {
                    return arr[i].quantity + 1;
                }
            }
            return undefined;
        }

        //private function
        function addItem(arr, item) {
            arr.push(item);
            return arr;
        }

        function getCartItem(arr, itemId) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].itemId === itemId) {
                    return arr[i];
                }
            }
            return undefined;
        }

        //cartItem class
        function CartItem(userId, itemId, quantity) {
            this.userId = userId;
            this.itemId = itemId;
            this.quantity = quantity;
        }

    }

})();