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
        sharedService.eventForUpdateBagSelectionBroadcast = function(msg) {
            this.message = msg;
            this.broadBagUpdateItem();
        };

        sharedService.broadBagUpdateItem = function() {
            $rootScope.$broadcast('handleBagUpdate');
        };
        return sharedService;
    }
})();