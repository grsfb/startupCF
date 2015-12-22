(function () {
    'use strict';

    angular
        .module('Chefonia')
        .factory('ImageService', ImageService);
    function ImageService() {
        var service = {};
        service.getUri = getUri;
        service.getCategoryUri = getCategoryUri;
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

        function getUri(chefName,category,itemName,size) {
            if (size=="md") {
                return getMediumImgUri(chefName,category,itemName);
            }
        }
        function getCategoryUri(category,size) {
            if (size=="md") {
                return "img/Categories/"+category+"/md/"+category+".png";
            }
        }
        function getMediumImgUri(chefName,category,itemName) {
            var defaultImg = "img/"+chefName+"/"+category+"/"+itemName+"/"+"md/"+itemName+".png";
            return defaultImg;
        }

    }
})();
