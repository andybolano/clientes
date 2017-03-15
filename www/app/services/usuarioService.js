(function () {
    'use strict';

    angular
        .module('app')
        .service('usuarioService', usuarioService);

    /* @ngInject */
    function usuarioService($http, API_URL) {
        
         var service = {
            getUsuario:getUsuario
        };
        return service;
        
        function getUsuario(){
            var usuario = JSON.parse(localStorage.getItem('usuario'));
            return usuario[0];    
        };
        

    }
})();

