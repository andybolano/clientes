(function () {
    'use strict';
    angular.module('perfil', [])

        .config(function ($stateProvider) {
            $stateProvider
                .state('app.perfil', {
                    url: '/perfil',
                    templateUrl: 'app/perfil/perfil.html',
                    controller: 'perfilCtrl'
                })
        });

})();

