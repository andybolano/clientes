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
    function LoginCtrl($scope, authService, $state, HOME,$ionicLoading,$ionicHistory,$ionicPopup,$ionicSlideBoxDelegate,$q) {
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
        
        
   var fbLoginSuccess = function(response) {
       
    if (!response.authResponse){
      fbLoginError();
      return;
    }
    var authResponse = response.authResponse;
    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
        var object = {
            authResponse: authResponse,userID: 
            profileInfo.id,name:
            profileInfo.name,
            email: profileInfo.email,
            picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
        }
         authService.registroFacebook(object).then(success, error);
            function success(p) {
                $ionicLoading.hide();
                mostrarAlert("Felicidades!", p.data.message);
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                $state.go(HOME); 
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
     
    }, function(fail){
      fbLoginError();
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    mostrarAlert("FACEBOOK", 'Problemas al autenticar, tambien puedes registrarte directamente con nuestra app.');
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();
    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
        info.resolve(response);
      },
      function (response) {
	alert(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

   function authFb() {
    facebookConnectPlugin.getLoginStatus(function(success){
	loadingShow('Autenticando...');
        facebookConnectPlugin.login(['email', 'public_profile','user_friends'], fbLoginSuccess, fbLoginError);
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



