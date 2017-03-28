(function () {
    'use strict';
    angular.module('reserva', [])
            .config(function ($stateProvider) {
                $stateProvider
                        .state('app.reserva', {
                            url: '/reserva',
                            templateUrl: 'app/reservas/reservas.html',
                            controller: 'reservaCtrl as vm'
                        })
            });
})();
(function () {
    'use strict';
    angular
            .module('reserva')
            .controller('reservaCtrl', reservaCtrl);
    /* @ngInject */
    function reservaCtrl($scope, $state, sessionService, reservasService, sitiosService, canchasService, $ionicTabsDelegate, $ionicLoading, $ionicPopup,$ionicSlideBoxDelegate) {
        var vm = this;
        $scope.$on('$ionicView.loaded', function () {
            vm.getSitios = getSitios;
            vm.viewCanchas = viewCanchas;
            vm.viewAgenda = viewAgenda;
            vm.reservar = reservar;
            vm.moveToFecha = moveToFecha;
            vm.converToFecha = converToFecha;
            vm.comprobarReservada = comprobarReservada;
            vm.sitios = [];
            vm.Sitio = {};
            vm.canchas = [];
            vm.Cancha = {};
            vm.reservadas = [];
            vm.fecha = new Date();
            vm.dias = new Array('', 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado');
            vm.horas = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            vm.altoAgenda = screen.height - 230;
            getSitios();
        });
        Date.prototype.toDateInputValue = (function () {
            var local = new Date(this);
            local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
            return local.toJSON().slice(0, 10);
        });
        function diaSemana() {
            var dia = dia_semana(vm.fecha.toDateInputValue());
            vm.diaSemana = vm.dias[dia];
        }
        function moveToFecha(direction) {
            var f1 = new Date(vm.fecha);
            var fecha = "";
            if (direction === '+') {
                fecha = new Date(f1.getTime() + 24 * 60 * 60 * 1000);
            }
            if (direction === '-') {
                fecha = new Date(f1.getTime() - 24 * 60 * 60 * 1000);
            }
            vm.fecha = new Date(fecha);
            vm.viewAgenda(vm.Cancha);
        }
        function isEmptyJSON(obj) {
            for (var i in obj) {
                return false;
            }
            return true;
        }
        function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
        
        $scope.changetab = function (item) {
            if (isEmptyJSON(vm.Sitio) && item === 1) {
                $ionicSlideBoxDelegate.slide(0);
                message("Selecciona un sitio");
                return false;
            }
            if (isEmptyJSON(vm.Cancha) && item === 2) {
                $ionicSlideBoxDelegate.slide(1);
                message("Selecciona una Cancha ");
                return false;
            }
             $ionicTabsDelegate.select(item);
        };
        $scope.changeSlide = function (item) {
            $ionicTabsDelegate.select(item);
            $ionicSlideBoxDelegate.slide(item);
            
        };
        function getSitios() {
            $ionicLoading.show();
            sitiosService.get().then(success, error);
            function success(d) {
                $ionicLoading.hide();
                vm.sitios = d.data;
            }
            function error(error) {
                $ionicLoading.hide();
                mostrarAlert("Oops..", "tuvimos un problema, intentalo de nuevo");
                return;
            }
        }
        function viewCanchas(sitio) {
            $ionicLoading.show();
            vm.Sitio = sitio;
            $scope.changeSlide(1);
            canchasService.getCanchas(sitio.id).then(success, error);
            function success(d) {
                $ionicLoading.hide();
                vm.canchas = d.data.canchas;
                vm.precios = d.data.precios;
            }
            function error(error) {
                $ionicLoading.hide();
                mostrarAlert("Oops..", "tuvimos un problema, intentalo de nuevo");
                return;
            }
        }
        function converToFecha(fecha) {
            return fecha.toDateInputValue();
        }
        function comprobarReservada(hora) {
            var i = 0;
            var sapo = false;
            for (i = 0; i < vm.reservadas.length; i++) {
                if (parseInt(vm.reservadas[i].hora) === hora) {
                    sapo = true;
                    break;
                } else {
                    sapo = false;
                }
            }
            return sapo;
        }
        function viewAgenda(cancha) {
            diaSemana();
            $ionicLoading.show();
            vm.Cancha = cancha;
            vm.hora = [];
            vm.horas = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            reservasService.getByCancha(vm.Cancha.id, vm.fecha.toDateInputValue()).then(success, error);
            function success(d) {
                $ionicLoading.hide();
                vm.reservadas = d.data;
                 $scope.changeSlide(2);
            }
            function error(error) {
                $ionicLoading.hide();
                mostrarAlert("Oops..", "tuvimos un problema, intentalo de nuevo");
                return;
            }
        }
        function reservar(hora) {
            var precio = 0;
            var f = new Date();
            var hoy = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();
            var resultado = dateComapreTo(hoy, vm.fecha.toDateInputValue());
            var valid_hora = hora - f.getHours();
            if (resultado > 0) {
                message("Imposible devolver el tiempo");
                return false;
            }
            if (valid_hora < 0 && resultado >= 0) {
                message("Imposible devolver el tiempo");
                return false;
            }
            var i = 0;
            for (i = 0; i < vm.precios.length; i++) {
                if (vm.precios[i].cancha === vm.Cancha.id) {
                    var precios = vm.precios[i].precios;
                    var y = 0;
                    for (y = 0; y < precios.length; y++) {
                        if (precios[y].HORA === hora + ':00') {
                            diaSemana = vm.diaSemana.replace(/á/gi, "a");
                            var dia = diaSemana.toUpperCase();
                            var msgList = precios[y];
                            var msgsKeys = Object.keys(msgList);
                            for (var i = 0; i < msgsKeys.length; i++)
                            {
                                if (msgsKeys[i] === dia) {
                                    var msgType = msgsKeys[i];
                                    var msgContent = precios[y][msgType];
                                    msgContent = msgContent.toString() + ".";
                                    precio = parseInt(msgContent.split('.').join(''));
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            var object = {
                idSitio: vm.Sitio.id,
                idCancha: vm.Cancha.id,
                idCliente: sessionService.getIdCliente(),
                fecha: vm.fecha.toDateInputValue(),
                hora: hora,
                diaSemana: vm.diaSemana,
                precio: precio
            }
            var info = "<table width='100%' style='text-align:left'><tr><td width='30%'><b>Sitio:</b></td><td> " + vm.Sitio.nombre + "</td></tr>" +
                    "<tr><td><b>Cancha : </b></td><td>" + vm.Cancha.nombre + "</td></tr>" +
                    "<tr><td><b>Fecha : </b></td><td>" + vm.fecha.toDateInputValue() + " - " + vm.diaSemana + "</td></tr>" +
                    "<tr><td><b>Hora : </b></td><td>" + hora + ":00" + "</td></tr>" +
                    "<tr><td><b>Precio :</b></td><td> $" + precio + "</td></tr>";
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmar reserva',
                template: 'Está seguro que desea realizar esta reserva?<br><br>' + info,
                buttons: [
                    {text: 'Cancelar',
                        type: 'button-default',
                        onTap: function (e) {
                            message("Reserva cancelada");
                        }

                    },
                    {
                        text: 'Si, seguír',
                        type: 'button-positive',
                        onTap: function (e) {
                            $ionicLoading.show();
                            reservasService.post(object).then(success, error);
                            function success(d) {
                                $ionicLoading.hide();
                                if (d.data.respuesta === true) {
                                    mostrarAlert("Bien hecho!", "<img src='img/like.svg' width='50%'><br>" + d.data.message);
                                    $state.go('app.perfil');
                                    object = {};
                                    vm.Sitio = {};
                                    vm.Cancha = {};
                                } else {
                                    mostrarAlert("Oops..", d.data.message);
                                }
                            }
                            function error(error) {
                                $ionicLoading.hide();
                                mostrarAlert("Oops..", "tuvimos un problema, intentalo de nuevo");
                                return;
                            }
                        }
                    }
                ]
            });
        }
        function mostrarAlert(titulo, contenido) {
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: contenido
            });
            alertPopup.then(function (res) {
            });
        }
    }
})();


