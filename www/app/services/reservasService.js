(function () {
    'use strict';
    angular
            .module('app')
            .service('reservasService', reservasService);
    /* @ngInject */
    function reservasService($http, API_URL, $q, $ionicLoading, $timeout) {

        var service = {
            getByCancha: getByCancha,
            update: update,
            post: post
        };
        return service;
        function post(object) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post(API_URL + '/reservas/remotas', object).then(success, error);
            return promise;
            function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        }
        function getByCancha(idCancha, fecha) {
            
              var timeoutPromise = $timeout(function ()
            {
                canceler.resolve();
                $ionicLoading.hide();
                message("verifica tu conexión, e intentalo nuevamente");
            },10000);
            
            var canceler = $q.defer();
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL + '/reservas/cancha/' + idCancha + '/fecha/' + fecha ,{timeout: canceler.promise}).then(success, error);
            return promise;
            function success(p) {
                $timeout.cancel(timeoutPromise);
                defered.resolve(p);
            }
            function error(error) {
                $timeout.cancel(timeoutPromise);
                defered.reject(error)
            }
        }
        ;
        function update(idReserva, estado) {
            var defered = $q.defer();
            var promise = defered.promise;
            var object = {
                estado: estado,
                abono: false,
                valor: false,
                detonador:2
            }
            $http.put(API_URL + '/reservas/' + idReserva, object).then(success, error);
            return promise;
            function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        }
        ;
        
        function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }

    }
})();


