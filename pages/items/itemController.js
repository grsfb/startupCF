(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('ItemController', ItemController);
    ItemController.$inject = ['CartManager', '$location', 'InventoryService', 'FlashService', '$routeParams', 'MappingService'];

    function ItemController(CartManager, $location, InventoryService, FlashService, $routeParams, MappingService) {
        var vm = this;
        vm.isLast = true;
        vm.currentPage = 0;
        vm.isLoadingMore = false;
        vm.addItemInCart = addItemInCart;
        vm.loadNextPage = loadNextPage;
        vm.buy = buy;
        vm.categoryName = $routeParams.categoryName == undefined ? all : $routeParams.categoryName;
        vm.chefLocation = $routeParams.chefLocation == undefined ? all : $routeParams.chefLocation;
        vm.actualCategory = MappingService.getCategory(vm.categoryName) == undefined ? vm.categoryName : MappingService.getCategory(vm.categoryName);

        //load initial items
        InventoryService.getAllItems(vm.currentPage, vm.actualCategory, vm.chefLocation, function (response) {
            if (response.success) {
                vm.items = response.data.items;
                vm.isLast = response.data.lastPage;
            } else {
                FlashService.Error("Something not working. Please try later");
            }
        });


        function loadNextPage() {
            vm.currentPage++;
            vm.isLoadingMore = true;
            InventoryService.getAllItems(vm.currentPage, vm.actualCategory, vm.chefLocation, function (response) {
                if (response) {
                    vm.items = vm.items.concat(response.data.items);
                    vm.isLast = response.data.lastPage;
                } else {
                    FlashService.Error("Something not working. Please try later");
                }
                vm.isLoadingMore = false;
            });
        }

        function buy(item) {
            CartManager.addOrUpdateItem(item, function () {
                $location.path("cart");
            });
        }

        //cart
        function addItemInCart(item) {
            showProgress(item.itemId);
            CartManager.addOrUpdateItem(item, function () {
                hideProgress(item.itemId)
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

    }
})();