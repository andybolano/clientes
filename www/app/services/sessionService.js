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
            getEmail : getEmail,
            getPhone :getPhone
            
        };
        return service;
        function isLoggedIn(){
          return window.localStorage.getItem('userIsLogin') !== null;  
        };
         function getToken(){
          if(window.localStorage.getItem('token') !== null){
              return window.localStorage.getItem('token');
          } 
        };
        function getEmail(){
          if(window.localStorage.getItem('email') !== null){
              return window.localStorage.getItem('email');
          } 
        };
        function getIdUser(){
           if(window.localStorage.getItem('data') !== null){
                var data = JSON.parse(localStorage.getItem('data'));
                return data.idUsuario;
           } 
        }
        function getIdCliente(){
           if(window.localStorage.getItem('data') !== null){
                var data = JSON.parse(localStorage.getItem('data'));
                return data.id;
           } 
        }
         function getUser(){
           if(window.localStorage.getItem('data') !== null){
                var data = JSON.parse(window.localStorage.getItem('data'));
                return data;
           } 
        }
         function getPhone(){
           if(window.localStorage.getItem('data') !== null){
                var data = JSON.parse(window.localStorage.getItem('data'));
                return data.telefono;
           } 
        }
    }
})();



