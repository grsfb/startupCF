(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CheckoutController', CheckoutController);
    CheckoutController.$inject = ['SessionService', '$location', 'FlashService', 'OrderService', 'UserService', 'AuthenticationService', 'EventHandlingService', '$scope', '$window'];

    function CheckoutController(SessionService, $location, FlashService, OrderService, UserService, AuthenticationService, EventHandlingService, $scope, $window) {
        var vm = this;
        if (!SessionService.get('isOrderInProgress') && SessionService.get('bagId') == undefined) {
            FlashService.ClearAllFlashMessage();
            $location.path('home');
            return;
        }
        vm.shippingCost = SessionService.get('shippingCost');
        vm.cartTotal = SessionService.get('cartTotal');
        vm.discount = SessionService.get('discount');
        vm.checkAndPlaceOrder = checkAndPlaceOrder;
        vm.isPlacingOrder = false;
        vm.paymentType = "PAYU";
        vm.isGuestLogin = true;
        vm.guestLogin = guestLogin;
        vm.setPaymentType = setPaymentType;
        vm.loggedInUserEmail = undefined;
        vm.isDeliveryAddressAdded = false;
        vm.login = login;
        vm.notifyDeliveryAddressSelected = notifyDeliveryAddressSelected;

        function notifyDeliveryAddressSelected() {
            vm.isDeliveryAddressAdded = true;
            $('#addressPanel').collapse('hide');
            $('#paymentPanel').collapse('show');
        }

        function isUserLoggedIn() {
            return SessionService.get(SessionService.Session.CurrentUser);
        }

        if (isUserLoggedIn()) {
            vm.loggedInUserEmail = SessionService.get(SessionService.Session.CurrentUser).email;
            vm.isGuestLogin = false;
            $('#loginPanel').collapse('hide');
            $('#addressPanel').collapse('show');
            vm.hasLogged = true;
        }
        function setPaymentType(method) {
            vm.paymentType = method;
        }

        function verifyDeliveryAddress(address) {
            if (address == undefined) {
                FlashService.Error("Delivery address is not selected");
                return false;
            }
            if (vm.paymentType == 'COD') {
                if (!("pune" == address.city.toLowerCase() && "411" == (address.zip.substring(0, 3)))) {
                    FlashService.Error("Cash on Delivery is only available in pune");
                    return false;
                }
            }
            return true;
        }

        function checkAndPlaceOrder() {
            var address = SessionService.get('deliverAddress');
            if (verifyDeliveryAddress(address)) {
                var userOrder = new Order(SessionService.get('currentUser').userId,
                    address.addressId, vm.paymentType, SessionService.get("couponCode"));
                vm.isPlacingOrder = true;
                OrderService.create(userOrder, function (response) {
                    if (response.success) {
                        if (vm.paymentType == 'COD') {
                            $location.path('/orderDetail/' + response.data.orderId);
                        } else {
                            $location.path('/payu-redirect/' + response.data.orderId)
                        }
                    } else {
                        FlashService.Error("Something not working. Please try later");
                    }
                    vm.isPlacingOrder = false;
                });
            }
        }

        function Order(userId, addressId, paymentType, couponId) {
            this.userId = userId;
            this.bagId = SessionService.get('bagId');
            this.deliveryAddress = {"addressId": addressId};
            this.paymentType = paymentType;
            if (couponId) {
                this.couponId = couponId;
            }
        }

        function login() {
            if ($window.innerWidth <= 767) {
                $location.path('login-mble');
            } else {
                $("#myModal").modal();
            }
        }

        function openGuestLogin(callback) {
            AuthenticationService.GuestLogin(function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(response.data);
                }
                if (callback) {
                    callback();
                }
            });
        }

        function guestLogin(guestEmail) {
            var user = {"name": "Guest", "email": guestEmail};
            UserService.create(user, function (response) {
                if (response.success) {
                    AuthenticationService.GuestLogin(guestEmail, function (response) {
                        if (response.success) {
                            vm.loggedInUserEmail = guestEmail;
                            AuthenticationService.SetCredentials(response.data);
                            $('#addressPanel').collapse('show');
                            $('#loginPanel').collapse('hide');
                            $('#paymentPanel').collapse('hide');
                            vm.hasLogged = true;
                        }
                    });
                }
            });

        }

        $scope.$on('handleAddressSelected', function () {
            if (EventHandlingService.message == true) {
                notifyDeliveryAddressSelected();
            }

        });
        $scope.$on('handleLoginUpdate', function () {
            if (EventHandlingService.message == true) {
                vm.loggedInUserEmail = SessionService.get(SessionService.Session.CurrentUser).email;
                vm.isGuestLogin = false;
                $('#loginPanel').collapse('hide');
                $('#addressPanel').collapse('show');
                vm.hasLogged = true;

            }

        });
    }
    })();