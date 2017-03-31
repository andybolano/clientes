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
    function LoginCtrl($scope, authService, $state, HOME, $cordovaOauth,$ionicLoading,$ionicHistory,$ionicPopup,$ionicSlideBoxDelegate,$http) {
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
        vm.authFb = authFb;
        
        function authFb(){
            $cordovaOauth.facebook("1623872244548223", ["email", "public_profile"], {redirect_uri: "http://localhost/callback"}).then(function(result){
                    displayData(result.access_token);
            },  function(error){
                 mostrarAlert("Facebook" + error);
            });
        }
        
        function displayData(access_token){
            $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: access_token, fields: "name,gender,location,picture", format: "json" }}).then(function(result) {
                alert(JSON.stringify(result));
            }, function(error) {
                mostrarAlert("Facebook" + error);
            });
        }
        
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
            loadingShow('Autenticando...');
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
               loadingShow('Registrando...');
            vm.usuario.telefono = vm.usuario.telefono.toString();
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
        
         function loadingShow(msg){
             $ionicLoading.show({
                template: '<div class="loading-animation"></div> <div class="mensaje-loading">'+msg+'</div>',
              }).then(function(){
                 
              });
        }
    }
})();



