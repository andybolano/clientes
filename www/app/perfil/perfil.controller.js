(function () {
    'use strict';

    angular
            .module('perfil')
            .controller('perfilCtrl', usuarioCtrl);

    /* @ngInject */
    function usuarioCtrl($scope, $state, perfilService, $ionicTabsDelegate) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.Usuario = {};
            $scope.loadPerfil();
            $scope.data = {};



        });

        $scope.goForward = function () {
            var selected = $ionicTabsDelegate.selectedIndex();
            if (selected != -1) {
                $ionicTabsDelegate.select(selected + 1);
                $scope.transition = 'animated bounceInRight';
            }
        }

        $scope.goBack = function () {
            var selected = $ionicTabsDelegate.selectedIndex();
            if (selected != -1 && selected != 0) {
                $ionicTabsDelegate.select(selected - 1);
                $scope.transition = 'animated bounceInLeft';
            }
        }

        $scope.loadPerfil = function () {
            $scope.Usuario = perfilService.getUsuario();
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

                if (i === $scope.Usuario.confianza) {
                    clearInterval(llenarConfiabilidad);
                }
                i = i + 1;
            }, 20);
        }

    }
})();


