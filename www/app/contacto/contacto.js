(function () {
    'use strict';
    angular.module('contacto', [])
            .config(function ($stateProvider) {
                $stateProvider
                        .state('app.contacto', {
                            url: '/contacto',
                            templateUrl: 'app/contacto/contacto.html',
                            controller: 'contactoCtrl as vm'
                        })
            });
})();
(function () {
    'use strict';
    angular
            .module('contacto')
            .controller('contactoCtrl', contactoCtrl);
    /* @ngInject */
    function contactoCtrl($scope, usuarioService,sessionService, $ionicLoading, $ionicPopup) {
        var vm = this;
        vm.enviar = enviar;
        vm.mensaje = "";
        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            $scope.popover.hide();
        });
        function enviar() {
            if (vm.mensaje === "") {
                message("Escribe tu mensaje");
                return 0;
            }
            var object = {
                cliente :sessionService.getIdCliente(),
                mensaje : vm.mensaje
            }
            $ionicLoading.show();
            usuarioService.contacto(object).then(success, error);
            function success(p) {
                $ionicLoading.hide();
                vm.mensaje="";
              mostrarAlert("Mensaje Enviado", p.data.message);
            }
            function error(error) {
                 $ionicLoading.hide();
                if (error.status === 409) {

                    vm.mensaje = {};
                    return;
                }
                mostrarAlert("Fallo el envio del mensaje");
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


