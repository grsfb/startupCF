(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('PayURedirectController', PayURedirectController)
    PayURedirectController.$inject = ['CommonService', '$routeParams'];
    function PayURedirectController(CommonService, $routeParams) {
        CommonService.post("/payu/initiate-payment/" + $routeParams.orderId, {}, function (res) {
            if (res.success) {
                payUform(res.data);
            }
        });
        function payUform(data) {
            var form = $(document.createElement('form'));
            $(form).attr("action", "https://test.payu.in/_payment");
            $(form).attr("method", "POST");
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    $(form).append($("<input>").attr("type", "hidden").attr("name", key).val(data[key]));
                }
            }
            $(form).appendTo('body').submit();
        }
    }
})();