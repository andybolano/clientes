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
    function reservaCtrl($scope, $state, sessionService, reservasService,$ionicModal, usuarioService,sitiosService, canchasService, $ionicTabsDelegate, $ionicLoading, $ionicPopup,$ionicSlideBoxDelegate) {
        var vm = this;
        $scope.$on('$ionicView.loaded', function () {
            vm.getSitios = getSitios;
            vm.viewCanchas = viewCanchas;
            vm.viewAgenda = viewAgenda;
            vm.reservar = reservar;
            vm.moveToFecha = moveToFecha;
            vm.converToFecha = converToFecha;
            vm.comprobarReservada = comprobarReservada;
            vm.isEmptyJSON = isEmptyJSON;
            vm.conexion = true;
            vm.sitios = [];
            vm.Sitio = {};
            vm.canchas = [];
            vm.Cancha = {};
            vm.reservadas = [];
            vm.telefono ="";
            vm.imageSrc = "";
            vm.fecha = new Date();
            vm.dias = new Array('', 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado');
            vm.horas = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            vm.altoAgenda = screen.height - 230;
            getSitios();
        });
        
        
              $ionicModal.fromTemplateUrl('image-modal.html', {
                    scope: $scope,
                    animation: 'zoom-from-center'
                }).then(function (modal) {
                    $scope.modal = modal;
                });

                $scope.openModal = function (foto) {
                     vm.imageSrc = foto;
                    $scope.modal.show();
                };

                $scope.closeModal = function () {
                    $scope.modal.hide();
                };
                
                
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

           if(!sessionService.getPhone()){
               validarTelefono(); 
           }
      
        
            
            if(!window.localStorage.getItem('sitios')){
              loadingShow('Cargando Sitios...');
            }else{
                vm.sitios = JSON.parse(window.localStorage.getItem('sitios'));
            }
           var promisePost = sitiosService.get();
            promisePost.then(function (d) {
                $ionicLoading.hide();
                vm.sitios = d.data;
                window.localStorage.setItem('sitios',JSON.stringify(vm.sitios));
                 vm.conexion = true;
            }, function (err) {
                
                if(err == 'time'){
                    vm.conexion = false;
                    message("Conexión debil, intentalo nuevamente");
                    return;
                }
                $ionicLoading.hide();
                mostrarAlert("Oops..", "tuvimos un problema, intentalo de nuevo");
                return;
             }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        function viewCanchas(sitio) {
           loadingShow('Cargando canchas...');
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
             loadingShow('Cargando agenda...');
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
                        text: '<b>Si, seguír</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            loadingShow('Procesando reserva...');
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
        
         function loadingShow(msg){
             $ionicLoading.show({
                template: '<div class="loading-animation"></div> <div class="mensaje-loading">'+msg+'</div>',
              }).then(function(){
                 
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
        
       function validarTelefono(){
           var myPopup = $ionicPopup.show({
          template: '<input type="number" ng-model="vm.telefono" class="box-text">',
          title: 'Ingresar Teléfono',
          subTitle: 'Aun no tenemos tu número de teléfono registrado, para continuar es necesario que lo registres.',
          scope: $scope,
          buttons: [
            {text: 'Cancelar',
                        type: 'button-default',
                        onTap: function (e) {
                            message("Proceso Cancelado");
                            $state.go('app.perfil');
                }
            },
            {
              text: '<b>Guardar</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!vm.telefono) {
                  message("Es nesario ingresar el teléfono");
                  e.preventDefault();
                } else {
                   loadingShow('Guardando Telefono...');
                   var object = {
                       telefono : vm.telefono.toString()
                   }
                            usuarioService.updatePhone(object).then(success, error);
                            function success(d) {
                                $ionicLoading.hide();
                                message(d.data.message);
                                    var data = JSON.parse(window.localStorage.getItem('data'));
                                    data.telefono = vm.telefono;
                                    window.localStorage.setItem('data',JSON.stringify(data));
                                    vm.telefono = "";
                                    return;    
                            }
                            function error(error) {
                                $ionicLoading.hide();
                                mostrarAlert("Oops..", "tuvimos un problema, intentalo de nuevo");
                                return;
                    }
                }
              }
            }
          ]
        });
       }
    }
})();


