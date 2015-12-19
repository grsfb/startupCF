(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('InventoryService', InventoryService);
    InventoryService.$inject = ['CommonService'];
    function InventoryService(CommonService) {
        var service = {};
        service.getAllItems = getAllItems;

        return service;
        function getAllItems(pageNumber,categoryName, callback) {
            var response;
            CommonService.get('/items/'+categoryName+'/' + pageNumber, function (res) {
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

    }
})();