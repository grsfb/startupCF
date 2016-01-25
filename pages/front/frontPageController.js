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
    FrontPageController.$inject = ['SessionService', 'CartService', '$http', '$location', '$window', '$document', 'FlashService', 'MappingService'];

    function FrontPageController(SessionService, CartService, $http, $location, $window, $document, FlashService, MappingService) {
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
        var cart = [];

        function isUserLoggedIn() {
            return SessionService.get(SessionService.Session.CurrentUser);
        }

        function getUserId() {
            return SessionService.get(SessionService.Session.CurrentUser).userId;
        }

        $http.get('data/items.json').success(function (data) {
            vm.slides = data;

        });
        $http.get('data/categories.json').success(function (data) {
            vm.categories = data;

        });
        function cityChange(city) {
            $location.path('item/all'  + '/' + city.toLowerCase());
        }

        function foodChange(snack) {
            $location.path('item/' + snack + '/' + vm.city.toLowerCase());
        }

        function allCategories() {
            $location.path('categories');
        }

        vm.foodList = MappingService.getAllOptions();
        vm.popularFoodList = ['Chocolate', 'Bakery'];
        vm.newFoodList = ['Mouth Freshner'];
        function loadItems() {
            $location.path('item/' + 'all/' + vm.city.toLowerCase());
        }

        $document.find("#popularowlNext").click(function () {
            $("#owl-demo").trigger('owl.next');
        });
        $document.find("#popularowlPrev").click(function () {
            $("#owl-demo").trigger('owl.prev');
        });

        if (isUserLoggedIn()) {
            loadCart(function () {
                //do nothing
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