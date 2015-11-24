+(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('AddressController', AddressController);
    AddressController.$inject = ['$rootScope', '$location', 'AddressService'];

    function AddressController($rootScope, $location, AddressService) {
        var vm = this;
        vm.showAddressEditor=true;
        vm.allAddress=[];
        vm.address={};
        vm.enableAddressEditor=enableAddressEditor;
        vm.saveAndClose=saveAndClose;
        vm.save=save;
        vm.cancel=cancel;
        vm.setShippingAddress=setShippingAddress;
        $rootScope.selectedAddress=undefined;

        function setShippingAddress(address){
            $rootScope.selectedAddress=address;
        }

        AddressService.getAllAddress("userId",function(response){
            vm.allAddress=response;
        });

        function enableAddressEditor(){
            vm.showAddressEditor=false;
        }

        function saveAndClose(){
            AddressService.create("userId",address)
            vm.showAddressEditor=true;
        }

        function cancel(){
            vm.address={};
            vm.showAddressEditor=true;
        }
        function save(){
            vm.allAddress.push(vm.address);
            vm.showAddressEditor=false;
            vm.address={};
        }
    }
})();