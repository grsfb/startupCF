(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('AddressController', AddressController);
    AddressController.$inject = ['$rootScope', '$window', 'AddressService', 'FlashService'];

    function AddressController($rootScope, $window, AddressService, FlashService) {
        var vm = this;
        vm.showAddressEditor = true;
        vm.allAddress = [];
        vm.address = {};
        vm.enableAddressEditor = enableAddressEditor;
        vm.saveAndClose = saveAndClose;
        vm.cancel = cancel;
        vm.setSelectedAddress = setSelectedAddress;
        vm.setShippingAddress = setShippingAddress;
        vm.deleteAddress = deleteAddress;
        vm.showAddressEditor = false;
        $rootScope.selectedAddress = undefined;

        AddressService.getAllAddress("userId", function (response) {
            if (response.success) {
                vm.allAddress = response.data;
            } else {
                FlashService.Error("Error occurred while retrieving address");
            }

        });

        function setShippingAddress(address) {
            $rootScope.selectedAddress = address;
        }


        function setSelectedAddress(address, index, selectedIndex) {
            vm.selectedIndex = index;
        }

        function enableAddressEditor() {
            vm.showAddressEditor = true;
        }

        function deleteAddress(index) {
            if ($window.confirm("Do you want to continue?")) {
                AddressService.remove(vm.allAddress[index].addressId, function (response) {
                    if (response.success) {
                        vm.allAddress.splice(index, 1);
                    } else {
                        FlashService.Error("Error occurred while deleting address");
                    }
                });

            }
        }

        function saveAndClose(address) {
            var addressToSave = new Address("userId", address.fullName, address.lineOne, address.lineTwo,
                address.city, address.state, address.zip, address.mobile);

            AddressService.create(addressToSave, function (response) {
                if (response.success) {
                    vm.allAddress.push(response.data);
                } else {
                    FlashService.Error("Error occurred while saving address")
                }
            });

            vm.showAddressEditor = false;
        }

        function cancel() {
            vm.address = {};
            vm.showAddressEditor = false;
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