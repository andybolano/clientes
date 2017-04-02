(function () {
    'use strict';
    angular
            .module('app')
            .service('usuarioService', usuarioService);
    /* @ngInject */
    function usuarioService($http, API_URL, $q, $ionicLoading, $timeout) {
        var service = {
            getUsuario: getUsuario,
            getReservasPendientes: getReservasPendientes,
            getUsuarioServer: getUsuarioServer,
            getReservasHistorial: getReservasHistorial,
            update:update,
            contacto:contacto
        };
        return service;
        function contacto(object){
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post(API_URL + '/superadmin/mensaje' , object).then(success, error);
            return promise;
            function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
            }
        }
        function getUsuario() {
            var usuario = JSON.parse(window.localStorage.getItem('usuario'));
            return usuario[0];
        }
        ;
        function update(usuario) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.put(API_URL + '/cliente/'+usuario.id, usuario).then(success, error);
            return promise;
            function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
            }
        }
        function getUsuarioServer(idCliente) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL + '/cliente/' + idCliente).then(success, error);
            return promise;
            function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        }
        function getReservasPendientes(idCliente) {
            var defered = $q.defer();
            var promise = defered.promise;
            
              var timeoutPromise = $timeout(function ()
            {
                canceler.resolve();
                $ionicLoading.hide();
                message("verifica tu conexión, e intentalo nuevamente");
            },10000);
            var canceler = $q.defer();
            
            $http.get(API_URL + '/cliente/' + idCliente + '/reservas/pendientes',{timeout: canceler.promise}).then(success, error);
            return promise;
            function success(p) {
                $timeout.cancel(timeoutPromise);
                defered.resolve(p);
            }
            function error(error) {
              $timeout.cancel(timeoutPromise);
                defered.reject(error);
            }
        }
        function getReservasHistorial(idCliente) {
            var defered = $q.defer();
            var promise = defered.promise;
             var defered = $q.defer();
            var promise = defered.promise;
            
              var timeoutPromise = $timeout(function ()
            {
                canceler.resolve();
                $ionicLoading.hide();
                message("verifica tu conexión, e intentalo nuevamente");
            },10000);
            var canceler = $q.defer();
            $http.get(API_URL + '/cliente/' + idCliente + '/reservas/historial',{timeout: canceler.promise}).then(success, error);
            return promise;
            function success(p) {
                 $timeout.cancel(timeoutPromise);
                defered.resolve(p);
            }
            function error(error) {
                 $timeout.cancel(timeoutPromise);
                defered.reject(error);
            }
        }
        
        function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
    }
})();

