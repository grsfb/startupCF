(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('AddressController', AddressController);
    AddressController.$inject = ['SessionService', '$window', 'AddressService', 'FlashService','EventHandlingService'];
    function AddressController(SessionService, $window, AddressService, FlashService,EventHandlingService) {
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
        loadAddress(function () {
            //do nothing
        });
        function isUserLoggedIn() {
            return SessionService.get(SessionService.Session.CurrentUser);
        }

        function getUserId() {
            if (isUserLoggedIn()) {
                return SessionService.get(SessionService.Session.CurrentUser).userId;
            }
            else {
                return null;
            }
        }
        function loadAddress(callback) {
            if(getUserId()!=null){

                AddressService.getAllAddress(getUserId(), function (response) {
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
            }
        else {
                enableAddressEditor();
                callback();
            }
        }


        function setSelectedAddress(address, index) {
            SessionService.putInRootScope('deliverAddress', address);
            EventHandlingService.eventForAddressSelectionBroadcast(true);
            vm.selectedIndex = index;
            getEstimatedDelivery(address.addressId)
        }

        function getEstimatedDelivery(addressId) {
            AddressService.getEstimatedDelivery(addressId, function (response) {
                SessionService.putInRootScope('estimatedDeliveryTime', response.data.deliveryTime);
                FlashService.Success("Estimated delivery time for this order is by "+response.data.deliveryTime);
            });
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

            var addressToSave = new Address(getUserId(), address.fullName, address.lineOne, address.lineTwo,
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