(function () {
    'use strict';
    angular
        .module('app')
        .service('sitiosService',sitiosService);
    /* @ngInject */
    function sitiosService($http, API_URL,$q) {
         var service = {
            get:get
        };
        return service;
        function get(){
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL+'/sitios').then(success, error);
            return promise;
            function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
            }
        };
    }
})();


