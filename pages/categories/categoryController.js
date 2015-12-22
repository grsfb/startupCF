(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CategoryController', CategoryController);
    CategoryController.$inject = ['SessionService', '$location', 'InventoryService', 'CartService', 'FlashService', 'ImageService', '$routeParams'];

    function CategoryController(SessionService, $location, InventoryService, CartService, FlashService, ImageService, $routeParams) {
        var vm = this;
        vm.currentPage = 1;
        vm.totalPageAsArray = new Array(1);
        vm.loadNextPage = loadNextPage;
        vm.getImageUri = getImageUri;
        vm.getCategoryImageUri = getCategoryImageUri;
        vm.location =SessionService.get('location');
        vm.categories=undefined;
        vm.foodChange=foodChange;
        //load initial items
        InventoryService.getAllCategories(1,vm.location, function (response) {
            if (response.success) {
                vm.categories = response.data.items;
                vm.totalPageAsArray = new Array(response.data.totalPages);
            } else {
                FlashService.Error("Something not working. Please try later");
            }
        });
        function getImageUri(chefName, category, itemName, size) {
            return ImageService.getUri(chefName, category, itemName, size);
        }
        function foodChange(snack) {
            $location.path('item/'+snack+'/'+vm.location);
        };
        function getCategoryImageUri(category,size) {
            return ImageService.getCategoryUri(category,size);
        }
        //get all cart items
        var userId = SessionService.get(SessionService.Session.CurrentUser).userId;
        CartService.getCartItems(userId,
            function (response) {
                if (response.success) {
                    vm.cart = response.data;
                    vm.isCartLoaded = true;
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
            });
        function loadNextPage(pageNumber) {
            InventoryService.getAllCategories(pageNumber + 1,$routeParams.chefLocation, function (response) {
                if (response) {
                    vm.categories = response.data.items;
                    vm.totalPageAsArray = new Array(response.data.totalPages);
                    vm.selectedIndex = pageNumber;
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
            });
        }
    }
})();