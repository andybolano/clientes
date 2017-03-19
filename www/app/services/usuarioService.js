(function () {
    'use strict';

    angular
        .module('app')
        .service('usuarioService', usuarioService);

    /* @ngInject */
    function usuarioService($http, API_URL,$q) {
        
         var service = {
            getUsuario:getUsuario,
            getReservasPendientes:getReservasPendientes
        };
        return service;
        
        function getUsuario(){
            var usuario = JSON.parse(localStorage.getItem('usuario'));
            return usuario[0];    
        };
        
        function getReservasPendientes(idCliente){
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL+'/cliente/'+idCliente+'/reservas/pendientes').then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        }
        

    }
})();

