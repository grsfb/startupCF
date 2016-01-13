(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('PayURedirectController', PayURedirectController)
    PayURedirectController.$inject = ['CommonService', '$routeParams','$window'];
    function PayURedirectController(CommonService, $routeParams,$window) {
        CommonService.post("/payu/initiate-payment/" + $routeParams.orderId, {}, function (res) {
            $window.location.href=res.data.location;
        });
    }
})();