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
        // if none of the above states are matched, use this as the fallback
        // $urlRouterProvider.otherwise( function($injector) {
        //     var $state = $injector.get("$state");
        //     $state.go(HOME);
        // });
    }
})();
