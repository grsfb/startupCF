(function () {
    'use strict';

    angular
        .module('Chefonia')
        .factory('ImageService', ImageService);
    function ImageService() {
        var service = {};
        service.getUri = getUri;
        service.Size = {
            SMALL: 1,
            MEDIUM: 2,
            LARGE: 3
        };

        service.Products = {
            ACHAR: "achar",
            CHAKLI: "chakli"
        };
        return service;

        function getUri(name, type) {
            if (type == service.Size.SMALL) {
                return getSmallImgUri(name);
            }
        }


        function getSmallImgUri(name) {
            var defaultImg = "";
            var smallSizeMap = {
                "achar": "img/choco.jpg",
                "chakli": "img/choco.jpg"
            };

            for (var img in smallSizeMap) {
                if (img == name && smallSizeMap.hasOwnProperty(img)) {
                    return smallSizeMap[img];
                }
            }
            return defaultImg;
        }

    }
})();
