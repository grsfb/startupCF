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
    FrontPageController.$inject = ['SessionService', 'CartService', '$http', '$location', '$rootScope', '$document', 'FlashService'];

    function FrontPageController(SessionService, CartService, $http, $location, $rootScope, $document, FlashService) {
        var vm = this;
        vm.cityChange = cityChange;
        vm.foodChange = foodChange;
        vm.addItemInCart = addItemInCart;
        vm.cart = [];
        vm.isCartLoaded = false;
        vm.city = 'Pune';
        vm.loadItems = loadItems;
        vm.slides = undefined;
        vm.newSlides = undefined;
        vm.cityList = ['Pune', 'Nasik', 'Mumbai'];
        vm.userId = undefined;
        $http.get('/client/data/items.json').success(function (data) {
            vm.slides = data;

        });
        $http.get('/client/data/popularItems.json').success(function (data) {
            vm.newSlides = data;
        });
        function cityChange() {
            vm.cityList = ['Pune', 'Nasik', 'Mumbai'];
        };
        function foodChange() {
            vm.snack = snack;
        };
        vm.foodList = ['Achar', 'Papad', 'Snacks'];
        vm.popularFoodList = ['Ice Cream', 'Biryani'];
        vm.newFoodList = ['Khakhra', 'Chakli'];
        function loadItems() {
            $location.path('item');
        };
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

        function addItemInCart(item) {
            if (SessionService.get(SessionService.Session.CurrentUser) != null) {
                vm.userId = SessionService.get(SessionService.Session.CurrentUser).userId;
                if (!vm.isCartLoaded){
                    loadCart(vm.userId);
                }
                var cartItem = new CartItem(vm.userId, item.itemId);
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
                $("#myModal").modal();
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