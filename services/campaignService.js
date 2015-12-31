(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('CampaignService', CampaignService);

    CampaignService.$inject = ['CommonService'];
    function CampaignService(CommonService) {
        var service = {};

        service.applyCoupon = applyCoupon;
        service.cancelCoupon = cancelCoupon;
        return service;

        function applyCoupon(cartCoupon, callback) {
            CommonService.post('/campaign/apply', cartCoupon, callback);
        }
        function cancelCoupon(couponCode, callback) {
            CommonService.post('/campaign/cancel' , couponCode , callback);
        }
    }

})();