(function () {
    'use strict';
    angular
        .module('Chefonia')
        .factory('EventHandlingService', EventHandlingService);
    EventHandlingService.$inject = ['$rootScope'];
    function EventHandlingService($rootScope) {
        var sharedService = {};

        sharedService.message = '';

        sharedService.eventForAddressSelectionBroadcast = function(msg) {
            this.message = msg;
            this.broadcastItem();
        };

        sharedService.broadcastItem = function() {
            $rootScope.$broadcast('handleAddressSelected');
        };
        sharedService.eventForLoginBroadcast = function(msg) {
            this.message = msg;
            this.broadLoginUpdateItem();
        };

        sharedService.broadLoginUpdateItem = function() {
            $rootScope.$broadcast('handleLoginUpdate');
        };
        return sharedService;
    }
})();