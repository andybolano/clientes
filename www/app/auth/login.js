 (function () {
    'use strict';
    angular.module('auth', [])
            .config(function ($stateProvider) {
                $stateProvider
                        .state('login', {
                            url: '/login',
                            templateUrl: 'app/auth/auth.html',
                            controller: 'LoginCtrl as vm',
                            data: {
                                noRequiresLogin: true
                            }
                        })
            });
})();
(function () {
    'use strict';
    angular
            .module('auth')
            .controller('LoginCtrl', LoginCtrl);
    /* @ngInject */
    function LoginCtrl($scope, authService, $state, HOME, $ionicLoading,$ionicHistory,$ionicPopup,$ionicSlideBoxDelegate) {
        var vm = this;
       $scope.$on('$ionicView.beforeEnter', function (viewData) {
                viewData.enableBack = true;
       });
        vm.usuario = {};
        vm.logo = true;
        vm.matenerSesion = true;
        vm.iniciarSesion = iniciarSesion;
        vm.hideLogo = hideLogo;
        vm.showLogo = showLogo;
        vm.message = message;
        vm.registrarUsuario = registrarUsuario;
        function hideLogo() {
            vm.logo = false;
        };
         $scope.changeSlide = function (item) {
            $ionicSlideBoxDelegate.slide(item);
        };
        function showLogo() {
            vm.logo = true;
            vm.animation = "animated bounceInDown";
        };
        function iniciarSesion() {
            if (vm.usuario.email === undefined) {
                message("Ingresar Correo");
                return 0;
            }
            if (vm.usuario.password === undefined) {
                message("Ingresar Contraseña");
                return 0;
            }
            $ionicLoading.show();
            vm.usuario.regId = localStorage.getItem('regId');
            authService.login(vm.usuario).then(success, error);
            function success(d) {
                vm.usuario = {};
                $ionicLoading.hide();
                if (d.respuesta === false) {
                    mostrarAlert("Oops...", d.message);
                    return false;
                } else {
                    $state.go(HOME);
                    $ionicHistory.clearHistory();
                    $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                }
            }
            function error(error) {
                vm.usuario = {};
                $ionicLoading.hide();
                if (error.status === 401) {
                    message("No pudimos autenticarte, intentelo de nuevo");
                    return;
                }
            }
        }
        
         function registrarUsuario() {
            if (vm.usuario.clave === undefined || vm.usuario.nombres === undefined || vm.usuario.apellidos === undefined || vm.usuario.email === undefined || vm.usuario.telefono === undefined) {
                message("Faltan campos por digilenciar");
                return 0;
            }
             $ionicLoading.show();
            authService.register(vm.usuario).then(success, error);
            function success(p) {
                 $ionicLoading.hide();
                mostrarAlert("Felicidades!", p.data.message);
                $state.go('login');
                vm.usuario = {};
            }
            function error(error) {
                $ionicLoading.hide();
                if (error.status === 409) {
                    mostrarAlert("Fallo en el Registro", "Parece que " + vm.usuario.email + " pertenece a una cuenta ya registrada ");
                    vm.usuario = {};
                    return;
                }
                 vm.usuario = {};
                mostrarAlert("Fallo en el Registro", "No se ha podido realizar el registro, intente mas tarde");
            }
        }
        
        function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
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



