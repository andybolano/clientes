(function () {
    'use strict';

    angular
        .module('perfil')
        .service('perfilService', perfilService);

    /* @ngInject */
    function perfilService($http, API_URL) {
        
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

