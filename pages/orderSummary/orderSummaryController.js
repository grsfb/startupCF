(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('OrderSummaryController', OrderSummaryController);
    OrderSummaryController.$inject = ['OrderService', 'FlashService', '$routeParams', 'SessionService'];

    function OrderSummaryController(OrderService, FlashService, $routeParams, SessionService) {
        var vm = this;
        vm.orderItem = undefined;
        vm.printOrder = printOrder;
        vm.showEmail = showEmail;
        vm.sendEmail = false;
        vm.showContact = showContact;
        vm.contactDetail = false;
        vm.localize = localize;
        vm.sendInvoice = sendInvoice;
        FlashService.ClearAllFlashMessage();
        OrderService.getAllItemForOrder($routeParams.orderId, function (response) {
            if (response.success) {
                vm.orderItem = response.data;
            } else {
                FlashService.error("Something not working. Please try later");
            }
        });

        function printOrder() {
            window.print();
        }

        function localize(status) {
            var lz = {"IN_PROGRESS": "In progress", "FAILED": "Failed", "COMPLETED": "Completed"};
            return lz[status];
        }

        function showEmail() {
            vm.contactDetail = false;
            vm.sendEmail = true;
        }

        function showContact() {
            vm.sendEmail = false;
            vm.contactDetail = true;

        }

        function cleanUpOnOrderSuccess() {
            SessionService.remove('shippingCost');
            SessionService.remove('cartTotal');
            SessionService.remove('discount');
            SessionService.remove('couponCode');
            SessionService.putInRootScope('cartItemCount', 0);
            SessionService.putInRootScope('isOrderInProgress', false);
            SessionService.putInRootScope('deliverAddress', undefined);
            SessionService.deleteFromRootScope('deliverAddress');
            SessionService.deleteFromRootScope('isOrderInProgress');
        }

        cleanUpOnOrderSuccess();
        function sendInvoice() {
            var currentUserId = SessionService.get(SessionService.Session.CurrentUser).userId;
            var request = {"orderId": $routeParams.orderId, "userId": currentUserId, "invoiceEmail": vm.invoiceEmail};
            OrderService.sendInvoice(request, function (response) {
                if (response.success) {
                    vm.invoiceMsg = "Invoice sent successfully";
                } else {
                    vm.invoiceMsg = "Please try later";
                }
                vm.invoiceEmail = "";
            });

        }
    }
})();