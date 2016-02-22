(function () {
    'use strict';
    angular
        .module('Chefonia')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['SessionService','UserService', 'AuthenticationService', 'CartService', 'CommonService', '$location','EventHandlingService'];
    function LoginController(SessionService,UserService, AuthenticationService, CartService, CommonService,$location,EventHandlingService) {
        var vm = this;
        vm.login = login;
        vm.passwordReset = passwordReset;
        vm.resetSectionVisible = false;
        vm.isLogging = false;
        vm.isPasswordChanging = false;
        vm.showMblSignup = false;
        vm.reset = reset;
        vm.pageMsg = "";
        vm.doFBLogin=doFBLogin;
        function login() {
            vm.isLogging = true;

            AuthenticationService.Login(vm.user.email, vm.user.password, function (response) {
                if (response.success) {
                    $('#myModal').modal('hide');
                    //for mobile view
                    AuthenticationService.SetCredentials(response.data);
                    EventHandlingService.eventForUpdateBagSelectionBroadcast(true);
                    $location.path('home');
                    //updateUserCart(response.data);
                } else {
                    vm.pageMsg = "User email or password is incorrect";
                }
                vm.isLogging = false;
            });
        }
        function isUserLoggedIn() {
            return SessionService.get(SessionService.Session.CurrentUser);
        }


        //function updateUserCart(currentUser) {
        //    if(currentUser.bagId!=null) {
        //        CartService.count(currentUser.bagId, function (response) {
        //            if (response.success) {
        //                SessionService.putInRootScope('cartItemCount', response.data.count);
        //                SessionService.put(SessionService.Session.CartCount, response.data.count);
        //            }
        //        });
        //    }
        //}

        function passwordReset() {
            vm.resetSectionVisible = !vm.resetSectionVisible;

        }

        function reset() {
            vm.isPasswordChanging = true;
            CommonService.post("/user/" + vm.user.resetEmail + "/forgot-pwd", {}, function (response) {
                if (response.success) {
                    vm.message = "Password reset email sent.";
                } else {
                    vm.message = "Something is not working. Please try later.";
                }
                vm.user.resetEmail = "";
                vm.isPasswordChanging = false;
            })
        }
        function statusChangeCallback(response) {
            // The response object is returned with a status field that lets the
            // app know the current login status of the person.
            // Full docs on the response object can be found in the documentation
            // for FB.getLoginStatus().
            if (response.status === 'connected') {
                // Logged into your app and Facebook.

                var accessToken = response.authResponse.accessToken;
                getFBUserDataAPI(response.authResponse.accessToken,response.authResponse.userID);

            } else {
                // The person is logged into Facebook, but not your app.
                FB.login(function(response){
                    if (response.status === 'connected') {
                        // Logged into your app and Facebook.
                        getFBUserDataAPI(response.authResponse.accessToken,response.authResponse.userID);
                    }
                    // Handle the response object, like in statusChangeCallback() in our demo
                    // code.
                },{scope:'email'});
            }
        }

        // This function is called when someone finishes with the Login
        // Button.  See the onlogin handler attached to it in the sample
        // code below.
        function checkLoginState() {

            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    // Logged into your app and Facebook.

                    var accessToken = response.authResponse.accessToken;
                    getFBUserDataAPI(response.authResponse.accessToken,response.authResponse.userID);

                }
            });
        }
        function doFBLogin() {

            FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
            });
        }
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '1721100084768505',
                cookie     : true,  // enable cookies to allow the server to access
                channelUrl : 'localhost/client/channel.html',      // the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.5' // use version 2.2
            });
            if(isUserLoggedIn()==false) {
                checkLoginState();
            }
        };

        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // Here we run a very simple test of the Graph API after login is
        // successful.  See statusChangeCallback() for when this call is made.
        function getFBUserDataAPI(accessToken,userId) {
            FB.api("/me?fields=id,name,email",function (response) {
                    var fbName=response.name;
                    var fbEmail= response.email;
                    var user = new User(userId,fbName,userId, fbEmail);
                    UserService.create(user, function (response) {
                        if (response.success) {
                            AuthenticationService.Login(fbEmail, userId, function (response) {
                                if (response.success) {
                                    AuthenticationService.SetCredentials(response.data);
                                    $('#myModal').modal('hide');
                                    EventHandlingService.eventForUpdateBagSelectionBroadcast(true);
                                    $location.path('home');
                                    //updateUserCart(response.data);
                                }
                            });
                        } else {
                            AuthenticationService.Login(fbEmail, userId, function (response) {
                                if (response.success) {
                                    $('#myModal').modal('hide');

                                    //for mobile view
                                    AuthenticationService.SetCredentials(response.data);
                                    EventHandlingService.eventForUpdateBagSelectionBroadcast(true);
                                    $location.path('cart');
                                    //updateUserCart(response.data);
                                } else {
                                    vm.pageMsg = "User email or password is incorrect";
                                }
                                vm.isLogging = false;
                            });
                        }
                        vm.isRegistering = false;
                    });

                }
            );

        }
        function User(userId,name, password, email) {
            this.userId=userId;
            this.name = name;
            this.password = password;
            this.email = email;
        }
    }
    // This is called with the results from from FB.getLoginStatus().

})();