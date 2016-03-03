(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('AddressController', AddressController);
    AddressController.$inject = ['SessionService', '$window', 'AddressService', 'FlashService', 'EventHandlingService'];
    function AddressController(SessionService, $window, AddressService, FlashService, EventHandlingService) {
        var avm = this;
        avm.showAddressEditor = true;
        avm.allAddress = [];
        avm.address = {};
        avm.enableAddressEditor = enableAddressEditor;
        avm.saveAndClose = saveAndClose;
        avm.cancel = cancel;
        avm.setSelectedAddress = setSelectedAddress;
        avm.deleteAddress = deleteAddress;
        avm.showAddressEditor = false;
        avm.isAddingAddress = false;
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
            if (getUserId() != null) {
                AddressService.getAllAddress(getUserId(), function (response) {
                    if (response.success) {
                        avm.allAddress = response.data;
                    } else {
                        FlashService.Error("Error occurred while retrieving address");
                    }
                    if (avm.allAddress.length == 0) {
                        enableAddressEditor();
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
            avm.selectedIndex = index;
            getEstimatedDelivery(address.addressId)
        }

        function getEstimatedDelivery(addressId) {
            AddressService.getEstimatedDelivery(addressId, function (response) {
                SessionService.putInRootScope('estimatedDeliveryTime', response.data.deliveryTime);
                FlashService.Success("Estimated delivery time for this order is by " + response.data.deliveryTime);
            });
        }

        function enableAddressEditor() {
            avm.showAddressEditor = true;
        }

        function deleteAddress(index) {
            if ($window.confirm("Do you want to continue?")) {
                AddressService.remove(avm.allAddress[index].addressId, function (response) {
                    if (response.success) {
                        SessionService.remove('deliverAddress');
                        avm.allAddress.splice(index, 1);
                        if (avm.allAddress.length == 1) {
                            setSelectedAddress(avm.allAddress[0], 0);
                        }
                    } else {
                        FlashService.Error("Error occurred while deleting address");
                    }
                });

            }
        }

        function saveAndClose(address) {
            avm.isAddingAddress = true;

            var addressToSave = new Address(getUserId(), address.fullName, address.lineOne, address.lineTwo,
                address.city, address.state, address.zip, address.mobile);

            AddressService.create(addressToSave, function (response) {
                if (response.success) {
                    avm.allAddress.push(response.data);
                } else {
                    FlashService.Error("Error occurred while saving address")
                }
                avm.isAddingAddress = false;
                avm.showAddressEditor = false;
                avm.address = {};
            });
        }

        function cancel() {
            avm.address = {};
            avm.showAddressEditor = false;
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