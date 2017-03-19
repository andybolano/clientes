(function () {
    'use strict';

    angular
        .module('app')
        .service('reservasService',reservasService);

    /* @ngInject */
    function reservasService($http, API_URL,$q) {
        
         var service = {
            getByCancha:getByCancha
        };
        return service;
        
       function getByCancha(idCancha,fecha){
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL+'/reservas/cancha/'+idCancha+'/fecha/'+fecha).then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        };
       
        

    }
})();


