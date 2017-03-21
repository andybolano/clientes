(function () {
    'use strict';
    angular
        .module('app')
        .service('sessionService', sessionService);
    /* @ngInject */
    function sessionService() {
        var service = {
            isLoggedIn: isLoggedIn,
            getIdUser: getIdUser,
            getUser: getUser,
            getToken : getToken,
            getIdCliente:getIdCliente,
            getEmail : getEmail
            
        };
        return service;
        function isLoggedIn(){
          return localStorage.getItem('userIsLogin') !== null;  
        };
         function getToken(){
          if(localStorage.getItem('token') !== null){
              return localStorage.getItem('token');
          } 
        };
        function getEmail(){
          if(localStorage.getItem('email') !== null){
              return localStorage.getItem('email');
          } 
        };
        function getIdUser(){
           if(localStorage.getItem('data') !== null){
                var data = JSON.parse(localStorage.getItem('data'));
                return data.idUsuario;
           } 
        }
        function getIdCliente(){
           if(localStorage.getItem('data') !== null){
                var data = JSON.parse(localStorage.getItem('data'));
                return data.id;
           } 
        }
         function getUser(){
           if(localStorage.getItem('data') !== null){
                var data = JSON.parse(localStorage.getItem('data'));
                return data;
           } 
        }
    }
})();



