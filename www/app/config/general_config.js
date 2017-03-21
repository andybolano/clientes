(function() {
    'use strict';
    angular
        .module('app')
        .config(config);
    /* @ngInject */
    function config($ionicConfigProvider) {
        $ionicConfigProvider.navBar.alignTitle('left');
    }
})();


