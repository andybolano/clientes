(function () {
    'use strict';
    angular.module('editar', [])
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.editar', {
                    url: '/editar',
                    templateUrl: 'app/editarPerfil/editar.html',
                    controller: 'editarCtrl as vm'
                })
        });
})();
(function () {
    'use strict';
    angular
            .module('editar')
            .controller('editarCtrl',editarCtrl);
    /* @ngInject */
    function editarCtrl($scope,usuarioService,sessionService,$ionicLoading,$ionicPopup) {
         var vm = this;
        $scope.$on('$ionicView.loaded', function () {
            vm.Usuario = {};
            vm.Usuario = sessionService.getUser();
        });
        $scope.$on("$ionicView.beforeEnter", function(event, data){
            $scope.popover.hide();
         });
         function mostrarAlert(titulo,contenido){
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: contenido
            });
            alertPopup.then(function (res) {
            });
        }
         function message(msg){
                $ionicLoading.show({ template: msg, noBackdrop: true, duration: 2000 });
       }
    }
})();


