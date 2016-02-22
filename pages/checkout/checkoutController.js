(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('CheckoutController', CheckoutController);
    CheckoutController.$inject = ['SessionService', '$location', 'FlashService', 'OrderService','EventHandlingService','$scope','UserService','AuthenticationService'];

    function CheckoutController(SessionService, $location, FlashService, OrderService,EventHandlingService,$scope,UserService,AuthenticationService) {
        var vm = this;
        if (!SessionService.get('isOrderInProgress')) {
            FlashService.ClearAllFlashMessage();
            $location.path('#!home');
            return;
        }
        vm.shippingCost = SessionService.get('shippingCost');
        vm.cartTotal = SessionService.get('cartTotal');
        vm.discount = SessionService.get('discount');
        vm.checkAndPlaceOrder = checkAndPlaceOrder;
        vm.isPlacingOrder = false;
        vm.paymentType = "PAYU";
        vm.guestLogin=guestLogin;
        vm.changeLogin=changeLogin;
        vm.changeAddress=changeAddress;
        vm.changePayment=changePayment;
        vm.setPaymentType = setPaymentType;
        vm.hasLogged=false;
        vm.addressLogged=false;
        vm.payAllowed=false;
        vm.guestEmail=undefined;
        vm.login=login;
        function isUserLoggedIn() {
            return SessionService.get(SessionService.Session.CurrentUser);
        }
        if(isUserLoggedIn()){
            vm.guestEmail = SessionService.get(SessionService.Session.CurrentUser).email;
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
                if (!("pune"==address.city.toLowerCase() && "411"==(address.zip.substring(0, 3)))) {
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
            this.bagId=SessionService.get('bagId');
            this.deliveryAddress = {"addressId": addressId};
            this.paymentType = paymentType;
            if (couponId) {
                this.couponId = couponId;
            }
        }
        //$scope.initSlider = function () {
        //    $(function () {
        //        // wait till load event fires so all resources are available
        //        $("#collapse2").collapse('show');
        //    });
        //
        //};
        function login(){
            $("#myModal").modal();
        }
        function openGuestLogin(callback){

            AuthenticationService.GuestLogin(function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(response.data);
                }
                if (callback) {
                    callback();
                }
            });
        }
        function guestLogin() {
            var user = {"name": "Guest", "email": vm.guestEmail};
            UserService.create(user, function (response) {
                if (response.success) {
                    AuthenticationService.GuestLogin(vm.guestEmail, function (response) {
                        if (response.success) {
                            AuthenticationService.SetCredentials(response.data);
                            $('#addressPanel').collapse('show');
                            $('#loginPanel').collapse('hide');
                            $('#paymentPanel').collapse('hide');
                            vm.hasLogged = true;
                        }
                    });
                }
            });
            //CommonService.update("/updateGuestUser", user, function (response) {
            //    if (response.success) {

                }

          //  });

        function changeLogin(){
            $('#loginPanel').collapse('show');

            $('#addressPanel').collapse('hide');
            $('#paymentPanel').collapse('hide');
        }
        function changeAddress(){
            $('#loginPanel').collapse('hide');

            $('#addressPanel').collapse('show');
            $('#paymentPanel').collapse('hide');
        }
        function changePayment(){
            $('#loginPanel').collapse('hide');

            $('#addressPanel').collapse('hide');
            $('#paymentPanel').collapse('show');
        }
        $scope.$on('handleAddressSelected', function() {
            if(EventHandlingService.message==true){
                $('#loginPanel').collapse('hide');

                $('#addressPanel').collapse('hide');
                $('#paymentPanel').collapse('show');
                vm.addressLogged=true;
                vm.payAllowed=true;
                vm.hasLogged=true;
            }

        });
        //$scope.initSlider = function () {
        //    $(function () {
        //        // wait till load event fires so all resources are available
        //            $("#panel3").collapse('hide');
        //
        //
        //    });
        //};
        //
        //$scope.initSlider();
    }
})();