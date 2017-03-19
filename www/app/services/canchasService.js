(function () {
    'use strict';

    angular
        .module('app')
        .service('canchasService',canchasService);

    /* @ngInject */
    function canchasService($http, API_URL,$q) {
        
         var service = {
            getCanchas:getCanchas
        };
        return service;

           function getCanchas(idSitio){
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL+'/canchas/'+idSitio+'/sitio').then(success, error);
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

