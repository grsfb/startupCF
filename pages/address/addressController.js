(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('AddressController', AddressController);
    AddressController.$inject = ['$rootScope', '$window', 'AddressService'];

    function AddressController($rootScope, $window, AddressService) {
        var vm = this;
        vm.showAddressEditor = true;
        vm.allAddress = [];
        vm.address = {};
        vm.enableAddressEditor = enableAddressEditor;
        vm.saveAndClose = saveAndClose;
        vm.save = save;
        vm.cancel = cancel;
        vm.setSelectedAddress = setSelectedAddress;
        vm.setShippingAddress = setShippingAddress;
        vm.deleteAddress = deleteAddress;
        $rootScope.selectedAddress = undefined;

        AddressService.getAllAddress("9158100044", function (response) {
            if(response.success){
                vm.allAddress = response.data;
            }else{
                //show error msg
            }

        });

        function setShippingAddress(address) {
            $rootScope.selectedAddress = address;
        }


        function setSelectedAddress(address, index, selectedIndex) {
            vm.selectedIndex = index;
        }

        function enableAddressEditor() {
            vm.showAddressEditor = false;
        }

        function deleteAddress(index) {
            if ($window.confirm("Do you want to continue?")) {
                AddressService.remove(vm.allAddress[index]);
                vm.allAddress.splice(index, 1);
            }
        }

        function saveAndClose(address) {
            AddressService.create(address, function(response){
                if(response.success){
                    //msg to show
                }
            });

            vm.showAddressEditor = true;
        }

        function cancel() {
            vm.address = {};
            vm.showAddressEditor = true;
        }

        function save() {
            vm.allAddress.push(vm.address);
            vm.showAddressEditor = false;
            vm.address = {};
        }

        function Address(userId, fullName, lineOne, lineTwo, city, state, zip, mobile) {
            this.userId = userId;
            this.fullName = fullName;
            this.lineOne = lineOne;
            this.lineTwo = lineTwo;
            this.city = city;
            this.state = state;
            this.zip = zip;
            this.mobile = mobile;
        }
    }
})();