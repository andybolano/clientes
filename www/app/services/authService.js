(function () {
    'use strict';

    angular
        .module('auth')
        .service('authService', authService);

    /* @ngInject */
    function authService($http, API_URL, $state,$q,$ionicHistory,HOME) {
        
 

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
                if(p.data.rol === 'CLIENTE'){
                    if(p.data.respuesta === true){
                       storeUser(p.data);
                       defered.resolve(currentUser());
                   }else{
                       defered.resolve(p.data);
                   }
                }else{
                    p.data.respuesta = false;
                    p.data.message = "Su usuario no corresponde a esta aplicacíon";
                    defered.resolve(p.data);
                }
            }
            function error(error) {
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
               
        };

        function register(usuario){
           var defered = $q.defer();
            var promise = defered.promise;
            $http.post(API_URL+'/cliente', usuario).then(success, error);
            return promise;
            function success(p) {
                defered.resolve(p);
            }
            function error(error) {
               destroyCredenciales();
                defered.reject(error);
            }
        };


    function storeUser(data) {
            var data = JSON.parse("[" + data.user + "]");
            localStorage.setItem('data',JSON.stringify(data[0].cliente));
            localStorage.setItem('email',data[0].email);
            localStorage.setItem('token',data[0].token);
            localStorage.setItem('userIsLogin',true);
        };
        function currentUser(){
            return JSON.parse(localStorage.getItem('data'));
        };

    }
})();
