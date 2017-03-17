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
    function reservaCtrl($scope, $state, sessionService,sitiosService, $ionicTabsDelegate,$ionicLoading) {
         var vm = this;
        $scope.$on('$ionicView.loaded', function () {
            vm.getSitios = getSitios;
            vm.viewCanchas = viewCanchas;
            vm.sitios = [];
            vm.Sitio = {};
            vm.canchas = [];
            vm.cancha = [];
            getSitios();
        });
        
        function isEmptyJSON(obj) {
        for(var i in obj) { return false; }
        return true;
      }
      function message(msg){
                $ionicLoading.show({ template: msg, noBackdrop: true, duration: 2000 });
            }

         $scope.goForward = function () { 
            var selected = $ionicTabsDelegate.selectedIndex();
            if(isEmptyJSON(vm.Sitio) && selected === 0){
                message("Selecciona un sitio");
            }else{
                if (selected !== -1) {
                    $ionicTabsDelegate.select(selected + 1);
                    $scope.transition = 'animated bounceInRight';
                }
            }
        };
        $scope.goBack = function () {
            var selected = $ionicTabsDelegate.selectedIndex();
            if (selected !== -1 && selected !== 0) {
                $ionicTabsDelegate.select(selected - 1);
                $scope.transition = 'animated bounceInLeft';
            }
        };
        
        function getSitios(){
            $ionicLoading.show();
         sitiosService.get().then(success, error);
            function success(d) {
               $ionicLoading.hide();
               vm.sitios = d.data;
            }
            function error(error) {
                $ionicLoading.hide();
                    mostrarAlert("Oops..","No tuvimos un problems, intentelo de nuevo");
                    return;
            }
        }
        
        function viewCanchas(sitio){
             
             $ionicLoading.show();
             vm.Sitio = sitio;
           sitiosService.getCanchas(sitio.id).then(success, error);
            function success(d) {
               $ionicLoading.hide();
               vm.canchas = d.data.canchas;
               $scope.goForward();
            }
            function error(error) {
                $ionicLoading.hide();
                    mostrarAlert("Oops..","No tuvimos un problems, intentelo de nuevo");
                    return;
            }
        }
    }
    
})();


