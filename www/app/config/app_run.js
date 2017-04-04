(function () {
    'use strict';
    angular
            .module('app')
            .run(appRun);
    function appRun($ionicPlatform, $state, authService,$ionicPopup) {
        $ionicPlatform.ready(function () {
            
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
      
   var push = PushNotification.init({
                android: {
                        senderID: "991363187494",
                        vibrate : true,
                        sound:true,
                        alert: true,
                        badge: true
                }
            });
            
          push.on('registration', function(data) {
              window.localStorage.setItem('regId',data.registrationId);
          });
            
           push.on('notification', function(data) {
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
          });
          
            hideSplash();
            autenticate();
        });
        function autenticate() {
            if (authService.currentUser()) {
                authService.autologin().then(function (res) {
                    hideSplash();
                    if (res) {
  
                    } else {
                        $state.go('login');
                    }
                })
            }else{
                   $state.go('login');
            }
        }
        function hideSplash() {
            if (navigator.splashscreen) {
                setTimeout(function () {
                    navigator.splashscreen.hide();
                }, 100);
            }
        }
        
       
    }
})();
