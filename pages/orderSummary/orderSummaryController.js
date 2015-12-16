(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('OrderSummaryController', OrderSummaryController);
    OrderSummaryController.$inject = ['SessionService','$location', 'OrderService', 'ImageService', 'FlashService'];

    function OrderSummaryController(SessionService,$location, OrderService, ImageService, FlashService) {
        var vm = this;
        vm.getImageUri=getImageUri;
        vm.orderItem = undefined;
        vm.printOrder=printOrder;
        vm.showEmail=showEmail;
        vm.sendEmail=false;
        vm.showContact=showContact;
        vm.contactDetail=false;
        OrderService.getAllItemForOrder(SessionService.get('orderId'), function (response) {
            if (response.success) {
                vm.orderItem = response.data;
            } else {
                FlashService.error("Something not working. Please try later");
            }
        });


        function getImageUri(name) {
            return ImageService.getUri(name, ImageService.Size.SMALL);
        }

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