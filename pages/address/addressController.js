(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('AddressController', AddressController);
    AddressController.$inject = ['SessionService', '$window', 'AddressService', 'FlashService'];
    function AddressController(SessionService, $window, AddressService, FlashService) {
        var vm = this;
        vm.showAddressEditor = true;
        vm.allAddress = [];
        vm.address = {};
        vm.enableAddressEditor = enableAddressEditor;
        vm.saveAndClose = saveAndClose;
        vm.cancel = cancel;
        vm.setSelectedAddress = setSelectedAddress;
        vm.deleteAddress = deleteAddress;
        vm.showAddressEditor = false;
        vm.isAddingAddress = false;
        vm.estimateDeliveryTime = undefined;
        vm.isChefFromPune = SessionService.get('isChefFromPune');
        var userId = SessionService.get(SessionService.Session.CurrentUser).userId;
        AddressService.getAllAddress(userId, function (response) {
            if (response.success) {
                vm.allAddress = response.data;
            } else {
                FlashService.Error("Error occurred while retrieving address");
            }
            if (vm.allAddress.length == 0) {
                enableAddressEditor();
            }
            else if (vm.allAddress.length == 1) {
                setSelectedAddress(vm.allAddress[0], 0);
            }
        });

        function setSelectedAddress(address, index) {
            SessionService.putInRootScope('deliverAddress', address);
            vm.selectedIndex = index;
            var addressFromPune = address.city.toLowerCase() == 'pune' || address.zip.slice(0, 3) == '411';
            if (addressFromPune == true && vm.isChefFromPune == true) {
                vm.estimateDeliveryTime = "Your all items will be delivered in 2 to 4 working days";
                FlashService.Success(vm.estimateDeliveryTime,false);
            }
            else if (addressFromPune == true && vm.isChefFromPune == false) {
                vm.estimateDeliveryTime = "Your all items will be delivered in 5 to 7 working days";
                FlashService.Success(vm.estimateDeliveryTime,false);
            }
            else {
                FlashService.Error("Items can not be delivered to specified delivery location. Currently we are in pune only.",false);
            }
            SessionService.putInRootScope('EstimateDeliveryTime', vm.estimateDeliveryTime);
        }

        function enableAddressEditor() {
            vm.showAddressEditor = true;
        }

        function deleteAddress(index) {
            if ($window.confirm("Do you want to continue?")) {
                AddressService.remove(vm.allAddress[index].addressId, function (response) {
                    if (response.success) {
                        SessionService.remove('deliverAddress');
                        vm.allAddress.splice(index, 1);
                        if (vm.allAddress.length == 1) {
                            setSelectedAddress(vm.allAddress[0], 0);
                        }
                    } else {
                        FlashService.Error("Error occurred while deleting address");
                    }
                });

            }
        }

        function saveAndClose(address) {
            vm.isAddingAddress = true;

            var addressToSave = new Address(userId, address.fullName, address.lineOne, address.lineTwo,
                address.city, address.state, address.zip, address.mobile);

            AddressService.create(addressToSave, function (response) {
                if (response.success) {
                    vm.allAddress.push(response.data);
                } else {
                    FlashService.Error("Error occurred while saving address")
                }
                vm.isAddingAddress = false;
                vm.showAddressEditor = false;
                vm.address = {};
            });
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