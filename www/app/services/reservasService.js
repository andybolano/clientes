(function () {
    'use strict';

    angular
        .module('app')
        .service('reservasService',reservasService);

    /* @ngInject */
    function reservasService($http, API_URL,$q) {
        
         var service = {
            getByCancha:getByCancha,
            update:update,
            post:post
        };
        return service;
        
        function post(object){
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post(API_URL+'/reservas/remotas',object).then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        }
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
        function update(idReserva,estado){
            var defered = $q.defer();
            var promise = defered.promise;
            var object = {
                estado:estado,
                abono:false,
                valor :false
            }
           $http.put(API_URL+'/reservas/'+idReserva, object).then(success, error);
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


