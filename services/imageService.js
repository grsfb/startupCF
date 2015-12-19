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

        function getUri(chefName,category,itemName,size) {
            if (size=="md") {
                return getMediumImgUri(chefName,category,itemName);
            }
        }
        function getMediumImgUri(chefName,category,itemName) {
            var defaultImg = "img/"+chefName+"/"+category+"/"+itemName+"/"+"md/"+itemName+".png";
            return defaultImg;
        }

    }
})();
