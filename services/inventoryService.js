(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('InventoryService', InventoryService);
    InventoryService.$inject = ['CommonService'];
    function InventoryService(CommonService) {
        var service = {};
        service.getAllItems = getAllItems;
        service.getAllCategories=getAllCategories;

        return service;
        function getAllItems(pageNumber,categoryName,chefLocation, callback) {
            var response;
            CommonService.get('/items/'+categoryName+'/'+chefLocation+'/' + pageNumber, function (res) {
                if (res.success) {
                    var items = res.data.page.content;
                    var lastPage = res.data.page.last;
                    var firstPage = res.data.page.first;
                    var totalPages = res.data.totalPageCount;
                    response = {
                        "success": true,
                        "data": {
                            "items": items, "lastPage": lastPage, "firstPage": firstPage,
                            "totalPages": totalPages
                        }
                    };
                    callback(response);
                } else {
                    callback(response);
                }

            });
        }
        function getAllCategories(pageNumber,chefLocation, callback) {
            var response;
            CommonService.get('/categories/All/' + pageNumber, function (res) {
                if (res.success) {
                    var categories = res.data.page.content;
                    var lastPage = res.data.page.last;
                    var firstPage = res.data.page.first;
                    var totalPages = res.data.totalPageCount;
                    response = {
                        "success": true,
                        "data": {
                            "items": categories, "lastPage": lastPage, "firstPage": firstPage,
                            "totalPages": totalPages
                        }
                    };
                    callback(response);
                } else {
                    callback(response);
                }

            });
        }
    }
})();