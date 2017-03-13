(function() {
    'use strict';

    angular
        .module('auth')
        .controller('LoginCtrl', LoginCtrl);

    /* @ngInject */
    
    function LoginCtrl($scope, authService, $state, HOME, $ionicLoading) {
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
            function success(data) {
                if(data){
                     $ionicLoading.hide();
                     $state.go(HOME);
                }else{
                message("Datos Incorrectos");
                $ionicLoading.hide(); 
                }
            }
            function error(error) {
                $ionicLoading.hide();
                message("Verifica tu conexión");
            }
        }
        
        
          function message(msg){
                $ionicLoading.show({ template: msg, noBackdrop: true, duration: 2000 });
            }

    }
})();



