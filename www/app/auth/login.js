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
(function() {
    'use strict';

    angular
        .module('auth')
        .controller('LoginCtrl', LoginCtrl);

    /* @ngInject */
    
    function LoginCtrl($scope, authService, $state, HOME, $ionicLoading,$ionicPopup) {
                var vm = this;
                vm.usuario = {};
                $scope.logo = true;
                vm.matenerSesion = true;
                vm.iniciarSesion = iniciarSesion;;
                vm.message = message;
 
      
        $scope.hideLogo = function(){
            $scope.logo = false;
        }
        $scope.showLogo = function(){
            $scope.logo = true;
            $scope.animation ="animated bounceInDown";
        }

        function iniciarSesion(){
        
        if(vm.usuario.email === undefined){
           message("Ingresar Correo");
           return 0;
        }
        if(vm.usuario.password == undefined){
               message("Ingresar Contraseña");
               return 0;
        }
      
           $ionicLoading.show();
           
     
         authService.login(vm.usuario).then(success, error);
            function success(d) {
               $ionicLoading.hide();
               if(d.respuesta === false){
                    mostrarAlert("Oops...",d.message);
                    return false;
               }else{
                   $state.go(HOME);
               }
               
            }
            function error(error) {
                $ionicLoading.hide();
                 if(error.status == 401){
                    mostrarAlert("Oops..","No pudimos autenticarte, intentelo de nuevo");
                    return;
                }
            }
        }
        
        
          function message(msg){
                $ionicLoading.show({ template: msg, noBackdrop: true, duration: 2000 });
            }
            
         function mostrarAlert(titulo,contenido){
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: contenido
            });
            alertPopup.then(function (res) {
            });
        }

    }
})();


