var app = angular.module('co', ['ngRoute']);

app.config(['$routeProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/about-us', {
                templateUrl: 'foodkart/pages/about-us/about-us.html'
            }).
            when('/how-we-work', {
                templateUrl: 'foodkart/pages/how-we-work/how-it-works.html'
            }).when('/contact-us', {
                templateUrl: 'foodkart/pages/contact-us/contact-us.html'
            }).
            otherwise({
                templateUrl: 'foodkart/pages/home/home.html',
                controller: 'RC'
            });
    }]);

/*ap.controller('HC', function ($scope, $location, $anchorScroll)
 {$scope.navigate = function (id) {$location.hash(id); $anchorScroll();}});*/

app.controller('RC', function ($rootScope, $scope, $http) {
    $scope.submit = function () {
        var req = {
            method: 'POST',
            url: 'http://chefonia.com/endpoint/db',
            headers: {'Content-Type': 'application/json;charset=UTF-8',
                'Authorization':'Basic '+"c2VjcmV0YWRtaW46cGFzc3dvcmRAY2hlZm9uaWFmb29ka2FydA=="
            },
            data: $scope.chef
        };
        $http(req).then(function (response) {
            if (response.status == 201) {
            }
        });
    };

    animateHeader();
});

var animateHeader = function () {
    $('.heading').textillate({
        minDisplayTime: 2000,
        loop: true,
        autoStart: true,
        in: {
            // set the effect name
            effect: 'fadeInUp',
            // set the delay factor applied to each consecutive character
            delayScale: 1.5,
            // set the delay between each character
            delay: 200,

            // set to true to animate all the characters at the same time
            sync: false,

            // randomize the character sequence
            // (note that shuffle doesn't make sense with sync = true)
            sequence: true
        },

        // out animation settings.
        out: {
            effect: 'fadeInDown',
            delayScale: 1.5,
            delay: 200,
            sync: false,
            sequence: true
        }
    });
};
