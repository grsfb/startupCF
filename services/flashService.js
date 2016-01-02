(function () {
    'use strict';

    angular
        .module('Chefonia')
        .factory('FlashService', FlashService);
    FlashService.$inject = ['$rootScope'];
    function FlashService($rootScope) {
        var service = {};
        service.Success = Success;
        service.Error = Error;
        service.ClearAllFlashMessage=ClearAllFlashMessage;
        initService();

        return service;

        function initService() {
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });
            function clearFlashMessage() {
                var flash = $rootScope.flash;
                if (flash) {
                    if (!flash.keepAfterLocationChange) {
                        delete $rootScope.flash;
                    } else {
                        // only keep for a single location change
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }
        function ClearAllFlashMessage() {
                    delete $rootScope.flash;

        }
        function Success(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'success',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }

        function Error(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'error',
                keepAfterLocationChange: keepAfterLocationChange
            };
            console.log($rootScope.flash.message);
        }
    }

})();