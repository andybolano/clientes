(function () {
    'use strict';
    angular.module('perfil', [])
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.perfil', {
                    url: '/perfil',
                    templateUrl: 'app/perfil/perfil.html',
                    controller: 'perfilCtrl as vm'
                })
        });
})();
(function () {
    'use strict';
    angular
            .module('perfil')
            .controller('perfilCtrl', usuarioCtrl);
    /* @ngInject */
    function usuarioCtrl($scope,sessionService, $ionicTabsDelegate,usuarioService, $ionicLoading,$ionicPopup) {
         var vm = this;
        $scope.$on('$ionicView.loaded', function () {
            vm.Usuario = {};
            vm.loadPerfil = loadPerfil;
            vm.reservasPendientes = {};
            $scope.data = {};
            loadPerfil();
            loadReservasPendientes();
        });
        $scope.goForward = function () { 
            var selected = $ionicTabsDelegate.selectedIndex();
            if (selected !== -1) {
                $ionicTabsDelegate.select(selected + 1);
                $scope.transition = 'animated bounceInRight';
            }
        };
        $scope.goBack = function () {
            var selected = $ionicTabsDelegate.selectedIndex();
            if (selected !== -1 && selected !== 0) {
                $ionicTabsDelegate.select(selected - 1);
                $scope.transition = 'animated bounceInLeft';
            }
        };
      function loadPerfil(){
            vm.Usuario = sessionService.getUser();
            vm.Usuario.confianza = 50;
            var i = 0;
            $scope.data = {
                label: 0,
                percentage: 0
            };
            var llenarConfiabilidad = setInterval(function () {
                $scope.$apply(function () {
                    $scope.data.label = i;
                    $scope.data.percentage = $scope.data.label / 100;
                });

                if (i === vm.Usuario.confianza) {
                    clearInterval(llenarConfiabilidad);
                }
                i = i + 1;
            }, 20);
        };
        
        
        function loadReservasPendientes(){
            $ionicLoading.show();
           usuarioService.getReservasPendientes(sessionService.getIdCliente()).then(success, error);
            function success(d) {
              vm.reservasPendientes = d.data;
              $ionicLoading.hide();
            }
            function error(error) {
                $ionicLoading.hide();
                    mostrarAlert("Oops..","No tuvimos un problems, intentelo de nuevo");
                    return;
            }
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