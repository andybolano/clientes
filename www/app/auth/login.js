(function () {
    'use strict';
    angular.module('auth', [])
            .config(function ($stateProvider) {
                $stateProvider
                        .state('login', {
                            url: '/login',
                            templateUrl: 'app/auth/login.html',
                            controller: 'LoginCtrl as vm',
                            data: {
                                noRequiresLogin: true
                            }
                        })
                        .state('registre', {
                            url: '/registre',
                            templateUrl: 'app/auth/registre.html',
                            controller: 'RegistroCtrl as vm',
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
    function LoginCtrl($scope, authService, $state, HOME, $ionicLoading,$ionicHistory,$ionicPopup) {
        var vm = this;
        vm.usuario = {};
        vm.logo = true;
        vm.matenerSesion = true;
        vm.iniciarSesion = iniciarSesion;
        vm.hideLogo = hideLogo;
        vm.showLogo = showLogo;
        vm.message = message;
        function hideLogo() {
            vm.logo = false;
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
                $ionicLoading.hide();
                if (error.status === 401) {
                    message("No pudimos autenticarte, intentelo de nuevo");
                    return;
                }
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



