(function () {
    'use strict';
    angular.module('auth', [])

        .config(function ($stateProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/auth/login.html',
                    controller: 'LoginCtrl as vm',
                    data: {
                        noRequiresLogin: true
                    }
                })
                .state('registre', {
                    url: '/registre',
                    templateUrl: 'app/auth/registre.html',
                    controller: 'RegistroCtrl as vm',
                    data: {
                        noRequiresLogin: true
                    }
                })
        });
})();
