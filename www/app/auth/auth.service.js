(function () {
    'use strict';

    angular
        .module('auth')
        .service('authService', authService);

    /* @ngInject */
    function authService($http, API_URL, $state, $window, $q, $ionicHistory,HOME) {
        
        var local = {
            destroyCredenciales: destroyCredenciales,
            currentUser:currentUser
        };

        var service = {
            login: login,
            logout: logout,
            autologin: autologin,
            register: register,
            currentUser: currentUser
        };
        return service;


        function login(usuario){
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post(API_URL+'/authenticate', usuario).then(success, error);
            return promise;
            function success(p) {
                storeUser(p.data);
                defered.resolve(currentUser());
            }
            function error(error) {
               destroyCredenciales();
                defered.reject(error);
            }
        };

        function autologin() {
            var defered = $q.defer();
            var promise = defered.promise;
            var usuario = currentUser();
            if(usuario){
                 $state.go(HOME);
            }else{
                defered.resolve(false);
            }
            return promise;
        }

        function logout(){
                $window.localStorage.clear();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $state.go('login');
        };

        function register(usuario){
           var defered = $q.defer();
            var promise = defered.promise;
            $http.post(API_URL+'/cliente', usuario).then(success, error);
            return promise;
            function success(p) {
                defered.resolve(currentUser());
            }
            function error(error) {
               destroyCredenciales();
                defered.reject(error);
            }
        };


    function storeUser(usuario) {
            $window.localStorage['usuario'] = JSON.stringify(usuario);
        };
        function currentUser(){
            return JSON.parse(localStorage.getItem('usuario'));
        };
        function destroyCredenciales() {
            $window.localStorage.removeItem('usuario');
        }

    }
})();

