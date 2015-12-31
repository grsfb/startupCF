(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('OrderSummaryController', OrderSummaryController);
    OrderSummaryController.$inject = [ 'OrderService', 'FlashService','$routeParams'];

    function OrderSummaryController(OrderService, FlashService,$routeParams) {
        var vm = this;
        vm.orderItem = undefined;
        vm.printOrder=printOrder;
        vm.showEmail=showEmail;
        vm.sendEmail=false;
        vm.showContact=showContact;
        vm.contactDetail=false;
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
        function showEmail() {
            vm.sendEmail=true;
        }
        function showContact(){
            vm.contactDetail=true;
        }
    }

})();