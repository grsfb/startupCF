(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CategoryController', CategoryController);
    CategoryController.$inject = ['$location', 'FlashService', 'CommonService'];

    function CategoryController($location, FlashService, CommonService) {
        var vm = this;
        vm.categories = [];
        vm.loadCategoryItems = loadCategoryItems;
        CommonService.get('/categories/all', function (response) {
            if (response.success) {
                vm.categories = response.data;
            } else {
                FlashService.Error("Something is not working please try after some time");
            }
        });

        function loadCategoryItems(category) {
            $location.path("/item/" + category.toLowerCase() + "/all");
        }

    }
})();