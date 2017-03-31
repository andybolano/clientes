(function () {
    'use strict';
    angular
        .module('app')
        .service('sitiosService',sitiosService);
    /* @ngInject */
    function sitiosService($http, API_URL,$q,$ionicLoading, $timeout) {
         var service = {
            get:get
        };
        return service;
        function get(){
            var defered = $q.defer();
            var promise = defered.promise;
            var defered = $q.defer();
            var promise = defered.promise;
            
              var timeoutPromise = $timeout(function ()
            {
                canceler.resolve();
                $ionicLoading.hide();
                message("Conexión debil, intentalo nuevamente");
            },10000);
            var canceler = $q.defer();
            
            $http.get(API_URL+'/sitios',{timeout: canceler.promise}).then(success, error);
            return promise;
            function success(p) {
                $timeout.cancel(timeoutPromise);
                defered.resolve(p);
            }
            function error(error) {
                error = 'time';
                $timeout.cancel(timeoutPromise);
                defered.reject(error);
            }
        };
         function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
    }
    
   
})();


