(function() {
    'use strict';

    angular
        .module('auth')
        .controller('RegistroCtrl', RegistroCtrl);

    /* @ngInject */
    function RegistroCtrl($scope, authService, $ionicPopup, $state,$ionicLoading) {
        var vm = this;
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;

            vm.usuario = {};
            vm.mostrarAdvertencia = false;

            vm.registrarUsuario = registrarUsuario;
 

            
        });

        function registrarUsuario(){
            
        if(vm.usuario.clave == undefined || vm.usuario.nombres == undefined || vm.usuario.apellidos == undefined || vm.usuario.email == undefined || vm.usuario.telefono == undefined){
            message("Faltan campos por digilenciar");
            return 0;
        }    

           authService.register(vm.usuario).then(success, error);
            function success(p) {
                console.log(p);
                /*}else{
                    mostrarAlert("Error", "Tu información no ha podido ser registrada");
                } */  
            }
            function error(error) {
                if(error.status == 409){
                    mostrarAlert("Fallo en el Registro", "Parece que "+vm.usuario.correo+" pertenece a una cuenta ya registrada ");
                    return;
                }
                mostrarAlert("Fallo en el Registro", "No se ha podido realizar el registro intente mas tarde");
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

