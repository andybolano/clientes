(function () {
    'use strict';
    angular.module('editar', [])
            .config(function ($stateProvider) {
                $stateProvider
                        .state('app.editar', {
                            url: '/editar',
                            templateUrl: 'app/editarPerfil/editar.html',
                            controller: 'editarCtrl as vm'
                        })
            });
})();
(function () {
    'use strict';
    angular
            .module('editar')
            .controller('editarCtrl', editarCtrl);
    /* @ngInject */
    function editarCtrl($scope, usuarioService, sessionService, $ionicLoading, $ionicPopup) {
        var vm = this;
        $scope.$on('$ionicView.loaded', function () {
            vm.Usuario = {};
            vm.Usuario = sessionService.getUser();
            vm.Usuario.email = sessionService.getEmail();
            vm.update = update;
        });
        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            $scope.popover.hide();
        });
        function update(){
             if (vm.Usuario.clave === undefined || vm.Usuario.nombres === undefined || vm.Usuario.apellidos === undefined || vm.Usuario.email === undefined || vm.Usuario.telefono === undefined) {
                message("Faltan campos por digilenciar");
                return 0;
            }
            if(vm.Usuario.newClave === undefined || vm.Usuario.newClave === ""){
                vm.Usuario.newClave = 'false';
            }
            usuarioService.update(vm.Usuario).then(success, error);
            function success(p) {
             message(p.data.message);
             localStorage.setItem('data', JSON.stringify(p.data.request));
             localStorage.setItem('email', p.data.email);
              vm.Usuario.clave = "";
              vm.Usuario.newClave = "";
            }
            function error(error) {
                if (error.status === 409) {
                    mostrarAlert("Fallo en el Registro", "Parece que " + vm.usuario.email + " pertenece a una cuenta ya registrada ");
                    vm.usuario = {};
                    return;
                }
                mostrarAlert("Fallo en el Registro", "No se ha podido realizar el registro, intente mas tarde");
            }
        }
        function mostrarAlert(titulo, contenido) {
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: contenido
            });
            alertPopup.then(function (res) {
            });
        }
        function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
    }
})();


