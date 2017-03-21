(function () {
    'use strict';
    angular
            .module('app')
            .run(appRun);
    function appRun($ionicPlatform, $state, authService) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            autenticate();
        });
        function autenticate() {
            if (!authService.currentUser()) {
                authService.autologin().then(function (res) {
                    hideSplash();
                    if (res) {

                    } else {
                        $state.go('login');
                    }
                })
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