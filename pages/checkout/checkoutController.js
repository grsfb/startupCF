(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CheckoutController', CheckoutController);
    CheckoutController.$inject = ['SessionService', '$location', 'CartService', 'FlashService', 'OrderService', 'CommonService'];

    function CheckoutController(SessionService, $location, CartService, FlashService, OrderService, CommonService) {
        var vm = this;
        vm.shippingCost = SessionService.get('shippingCost');
        vm.cartTotal = SessionService.get('cartTotal');
        vm.checkAndPlaceOrder = checkAndPlaceOrder;
        vm.order = {};
        vm.isPlacingOrder = false;
        vm.usePayMethod = usePayMethod;
        vm.paymentType = "PAYU";
        function usePayMethod(method) {
            vm.paymentType = method;
        }

        function checkAndPlaceOrder() {
            /* var userId = SessionService.get(SessionService.Session.CurrentUser).userId;
            CommonService.post("/payu/initiate-payment", {"userId": userId, "totalAmount": 12.42}, function (res) {
                if (res.success) {
                    payUform(res.data);

                }

            });

            function payUform(data) {
                var form = $(document.createElement('form'));
                $(form).attr("action", "https://test.payu.in/_payment");
                $(form).attr("method", "POST");
                $(form).append($("<input>").attr("type", "hidden").attr("name", "key").val(data.key));
                $(form).append($("<input>").attr("type", "hidden").attr("name", "hash").val(data.hash));
                $(form).append($("<input>").attr("type", "hidden").attr("name", "txnid").val(data.txnid));
                $(form).append($("<input>").attr("type", "hidden").attr("name", "service_provider").val(data.service_provider));
                $(form).append($("<input>").attr("type", "hidden").attr("name", "amount").val(data.amount));
                $(form).append($("<input>").attr("type", "hidden").attr("name", "firstname").val(data.firstname));
                $(form).append($("<input>").attr("type", "hidden").attr("name", "email").val(data.email));
                $(form).append($("<input>").attr("type", "hidden").attr("name", "phone").val(data.phone));
                $(form).append($("<input>").attr("type", "hidden").attr("name", "productinfo").val(data.productinfo));
                $(form).append($("<input>").attr("type", "hidden").attr("name", "surl").val(data.surl));
                $(form).append($("<input>").attr("type", "hidden").attr("name", "furl").val(data.furl));
                //$(form).append($("<input>").attr("type", "hidden").attr("name", "curl").val(data.curl));
                $(form).appendTo('body').submit();

            }
*/
             vm.order.address = SessionService.get('deliverAddress');
             vm.order.paymentMethod = "COD";
             if (vm.order.address == undefined) {
             FlashService.Error("Delivery address is not selected");
             }
             if (vm.order.paymentMethod == undefined) {
             FlashService.Error("Payment method is not selected");
             }
             if (vm.order.address != undefined && vm.order.paymentMethod != null) {
             var order = new Order(SessionService.get('currentUser').userId,
             vm.order.address.addressId, SessionService.get('itemIds'), vm.order.paymentMethod
             );
             vm.isPlacingOrder=true;
             OrderService.create(order, function (response) {
             if (response.success) {
             cleanUpOnOrderSuccess();
             //SessionService.put('orderId', response.data.orderId);
             $location.path('orderDetail/'+response.data.orderId);
             } else {
             FlashService.Error("Something not working. Please try later");
             }
             vm.isPlacingOrder=false;
             });

             }
        }
        function checkIfOrderBelongToPune(address) {
            if(address.city.toLowerCase()=='pune' || address.zip.slice(0,3)=='411' ){
                return true;
            }
            return false;
        }
        function cleanUpOnOrderSuccess() {
            CartService.remove(SessionService.get('currentUser').userId,
                function (response) {
                    if (!response.success) {
                        FlashService.Error("Something is not working. Please try later", true);
                    }
                });
            SessionService.remove('shippingCost');
            SessionService.remove('cartTotal');
            SessionService.remove('itemIds');
            SessionService.remove('userCart');
            SessionService.putInRootScope('cartItemCount',0);
            SessionService.remove('deliverAddress');
            SessionService.remove('isAnyBakeryItem');
        }

        function Order(userId, addressId, items, paymentType) {
            this.userId = userId;
            this.deliveryAddress = {"addressId": addressId};
            this.items = [];
            for (var item in items) {
                this.items.push({'itemId': items[item]})
            }
            this.paymentType = paymentType;
            this.estimateDeliveryTime=SessionService.get('EstimateDeliveryTime');
        }
    }
})();