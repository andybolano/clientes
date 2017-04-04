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
    function usuarioCtrl($scope, $state, sessionService,$ionicHistory, $ionicTabsDelegate,$ionicSlideBoxDelegate, usuarioService, $ionicLoading, $ionicPopup, reservasService) {
        var vm = this;
        $scope.$on('$ionicView.loaded', function () {
            vm.Usuario = {};
            vm.invitar_fb = invitar_fb;
            vm.loadPerfil = loadPerfil;
            vm.mostrarAlert = mostrarAlert;
            vm.loadHistorialReservas = loadHistorialReservas;
            vm.updateEstado = updateEstado;
            vm.loadReservasPendientes = loadReservasPendientes;
            vm.loadHistorialReservas = loadHistorialReservas;
            vm.irReservar = irReservar;
            vm.reservasPendientes = [];
            vm.historial = [];
            $scope.data = {};
            loadHistorialReservas();
            
            
           var push = PushNotification.init({
                android: {
                        senderID: "991363187494",
                        vibrate : true,
                        sound:true,
                        alert: true,
                        badge: true
                }
            });
            
           push.on('notification', function(data) {
                loadReservasPendientes();
                 var confirmPopup = $ionicPopup.confirm({
                title: 'Notificación',
                template: data.message,
                buttons: [
                    {text: 'Entendido',
                        type: 'button-positive',
                        onTap: function (e) {
                            $state.go('app.perfil');
                         
                        }
                    },
                ]
              });
                $scope.changeSlide(1);
          });
            
        });

        function invitar_fb(){
           facebookConnectPlugin.appInvite(
                {
                    url: "https://birriassoccer.com/app_links/index.html",
                    picture: "https://birriassoccer.com/invite_facebook.png"
                },
                function(obj){
                    if(obj) {
                        if(obj.completionGesture == "cancel") {
                          message("En otra ocasion pordras inviar a tus amigos, para que puedan obtener los beneficios que solo birrias ofrece.");
                        } else {
                            message("Ahora tus amigos podran obtener los beneficios que birrias ofrece.");
                        }
                    } else {
                       message("Chico malo!")
                    }
                },
                function(obj){
                    // error
                    console.log(obj);
                }
            ); 
        }  
        
        function irReservar() {
            $state.go('app.reserva');
        }
        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            loadPerfil();
            loadReservasPendientes();
        });
        $scope.changetab = function (item) {
            $ionicTabsDelegate.select(item);
        };
        $scope.changeSlide = function (item) {
            $ionicTabsDelegate.select(item);
            $ionicSlideBoxDelegate.slide(item);
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
                           loadingShow('Actualizando ...');
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
                                mostrarAlert("Oops..", "tuvimos un problema, intentalo de nuevo");
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
                window.localStorage.removeItem('data');
                window.localStorage.setItem('data', JSON.stringify(d.data.cliente));
                setTimeout(function () {
                    loadPerfil();
                }, 2000)

            }
            function error(error) {
                $ionicLoading.hide();
                return;
            }
        }
        function loadPerfil() {
            vm.Usuario = sessionService.getUser();
            vm.Usuario.confianza = 0;
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
        }
        ;
        function loadHistorialReservas() {
           loadingShow('Cargando historial...');
            usuarioService.getReservasHistorial(sessionService.getIdCliente()).then(success, error);
            function success(d) {
                vm.historial = d.data;
                $ionicLoading.hide();
            }
            function error(err) {
                if(err.data == null){
                    return;
                }
                  if(err.data.status == 401){
                     mostrarAlert("Oops..", err.data.error);
                     window.localStorage.clear();
                     window.sessionStorage.clear();
                    $state.go('login', {}, {reload: true});
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                }
               $ionicLoading.hide();
               mostrarAlert("Oops..", "tuvimos un problema, intentalo de nuevo");
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
        
           loadingShow('Cargando reservas...');
           var promisePost =  usuarioService.getReservasPendientes(sessionService.getIdCliente());
            promisePost.then(function (d) {
          
                vm.reservasPendientes = d.data;
                $ionicLoading.hide();
            }, function (err) {
                if(err.data == null){
                    return;
                }
                if(err.data.status == 401){
                     mostrarAlert("Oops..", err.data.error);
                     window.localStorage.clear();
                     window.sessionStorage.clear();
                    $state.go('login', {}, {reload: true});
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                }
                $ionicLoading.hide();
               mostrarAlert("Oops..", "tuvimos un problema, intentalo de nuevo");
                return;
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
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
        function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
    }
})();