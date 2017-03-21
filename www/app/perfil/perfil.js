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
    function usuarioCtrl($scope, $state, sessionService, $ionicTabsDelegate, usuarioService, $ionicLoading, $ionicPopup, reservasService) {
        var vm = this;
        $scope.$on('$ionicView.loaded', function () {
            vm.Usuario = {};
            vm.loadPerfil = loadPerfil;
            vm.mostrarAlert = mostrarAlert;
            vm.loadHistorialReservas = loadHistorialReservas;
            vm.updateEstado = updateEstado;
            vm.irReservar = irReservar;
            vm.reservasPendientes = {};
            vm.historial = {};
            $scope.data = {};
            loadPerfil();
            loadReservasPendientes();
            loadHistorialReservas();
        });
        function irReservar() {
            $state.go('app.reserva');
        }
        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            loadPerfil();
            loadReservasPendientes();
            ;
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
        function updateEstado(idReserva, estado) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmar Acción',
                template: 'Está seguro que desea cambiar el estado de esta reserva a: <br><b>' + estado + '</b>?',
                buttons: [
                    {text: 'Cancelar',
                        type: 'button-default',
                        onTap: function (e) {
                            message("Movimiento cancelado");
                        }
                    },
                    {
                        text: 'Si, seguír',
                        type: 'button-positive',
                        onTap: function (e) {
                            $ionicLoading.show();
                            reservasService.update(idReserva, estado).then(success, error);
                            function success(d) {
                                if (estado === 'cancelada') {
                                    mostrarAlert('Respuesta', "Reserva cancelada");
                                }
                                if (estado === 'confirmadasinabono') {
                                    mostrarAlert('Respuesta', "Reserva Confirmada");
                                }
                                loadReservasPendientes();
                                getUsuarioServer();
                                $ionicLoading.hide();
                            }
                            function error(error) {
                                $ionicLoading.hide();
                                mostrarAlert("Oops..", "No tuvimos un problems, intentelo de nuevo");
                                return;
                            }
                        }
                    }
                ]
            });
        }
        function getUsuarioServer() {
            usuarioService.getUsuarioServer(sessionService.getIdCliente()).then(success, error);
            function success(d) {
                localStorage.removeItem('data');
                localStorage.setItem('data', JSON.stringify(d.data.cliente));
                setTimeout(function () {
                    loadPerfil();
                }, 2000)

            }
            function error(error) {
                $ionicLoading.hide();
                message("No tuvimos un problems, intentelo de nuevo");
                return;
            }
        }
        function loadPerfil() {
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
        function loadHistorialReservas() {
            $ionicLoading.show();
            usuarioService.getReservasHistorial(sessionService.getIdCliente()).then(success, error);
            function success(d) {
                vm.historial = d.data;
                $ionicLoading.hide();
            }
            function error(error) {
                $ionicLoading.hide();
                mostrarAlert("Oops..", "No tuvimos un problems, intentelo de nuevo");
                return;
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
        function loadReservasPendientes() {
            $ionicLoading.show();
            usuarioService.getReservasPendientes(sessionService.getIdCliente()).then(success, error);
            function success(d) {
                vm.reservasPendientes = d.data;
                $ionicLoading.hide();
            }
            function error(error) {
                $ionicLoading.hide();
                mostrarAlert("Oops..", "No tuvimos un problems, intentelo de nuevo");
                return;
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