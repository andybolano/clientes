(function() {
    'use strict';

    angular
        .module('app')
        .config(config)
        .constant('HOME', 'app.perfil');
   

    /* @ngInject */
    function config($stateProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'app/layout/layout.html',
                controller: 'MenuCtrl'
            });
    }
})();
