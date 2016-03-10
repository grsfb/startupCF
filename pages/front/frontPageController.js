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
    FrontPageController.$inject = ['CartManager', 'ClientDataService', '$location', 'MappingService'];

    function FrontPageController(CartManager, ClientDataService, $location, MappingService) {
        var vm = this;
        vm.cityChange = cityChange;
        vm.foodChange = foodChange;
        vm.city = 'All';
        vm.loadItems = loadItems;
        vm.slides = undefined;
        vm.newSlides = undefined;
        vm.cityList = ['All', 'Pune', 'Mumbai', 'Delhi', 'Hyderabad', 'Ahemdabad', 'Nandurbar'];
        vm.snack = undefined;
        vm.categories = undefined;
        vm.buy = buy;
        vm.allCategories = allCategories;

        function cityChange(city) {
            $location.path('item/all' + '/' + city.toLowerCase());
        }

        function foodChange(snack) {
            $location.path('item/' + snack + '/' + vm.city.toLowerCase());
        }

        function allCategories() {
            $location.path('categories');
        }

        function buy(item) {
            CartManager.addOrUpdateItem(item, function () {
                $location.path("cart");
            });
        }

        ClientDataService.get('data/items.json', function (res) {
            vm.slides = res.data;
        });

        ClientDataService.get('data/categories.json', function (res) {
            vm.categories = res.data;
        });


        vm.foodList = MappingService.getAllOptions();
        function loadItems() {
            $location.path('item/' + 'all/' + vm.city.toLowerCase());
        }


        $("#popularowlNext").click(function () {
            $("#owl-demo").trigger('owl.next');
        });

        $("#popularowlPrev").click(function () {
            $("#owl-demo").trigger('owl.prev');
        });
        $('#homeCarousel').carousel({
            interval:5000,
            pause: "false"
    });
    }
})();