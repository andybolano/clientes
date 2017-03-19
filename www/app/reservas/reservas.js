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
    function reservaCtrl($scope, $state, sessionService,reservasService,sitiosService,canchasService ,$ionicTabsDelegate,$ionicLoading) {
         var vm = this;
        $scope.$on('$ionicView.loaded', function () {
            vm.getSitios = getSitios;
            vm.viewCanchas = viewCanchas;
            vm.viewAgenda = viewAgenda;
            vm.reservar = reservar;
            vm.moveToFecha = moveToFecha;
            vm.converToFecha = converToFecha;
            vm.sitios = [];
            vm.Sitio = {};
            vm.canchas = [];
            vm.Cancha = {};
            vm.fecha = new Date();
            vm.dias = new Array('', 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado');
            getSitios();
        });
        
        
      Date.prototype.toDateInputValue = (function () {
            var local = new Date(this);
            local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
            return local.toJSON().slice(0, 10);
       }); 
       
      function diaSemana() {
            var dia = dia_semana(vm.fecha.toDateInputValue());
            vm.diaSemana = vm.dias[dia];
       }
       
       function moveToFecha(direction) {
            var f1 = new Date(vm.fecha);
            var fecha = "";
            if (direction === '+') {
                fecha = new Date(f1.getTime() + 24 * 60 * 60 * 1000);
            }
            if (direction === '-') {
                fecha = new Date(f1.getTime() - 24 * 60 * 60 * 1000);
            }
            vm.fecha = new Date(fecha);
            vm.viewAgenda(vm.Cancha);
        }
        
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
                return false;
            }
            
            if(isEmptyJSON(vm.Cancha) && selected === 1){
                message("Selecciona una cancha");
                return false;
            }
            
                if (selected !== -1) {
                    $ionicTabsDelegate.select(selected + 1);
                    $scope.transition = 'animated bounceInRight';
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
             $scope.goForward();
           canchasService.getCanchas(sitio.id).then(success, error);
            function success(d) {
               $ionicLoading.hide();
               vm.canchas = d.data.canchas;
            }
            function error(error) {
                $ionicLoading.hide();
                    mostrarAlert("Oops..","No tuvimos un problems, intentelo de nuevo");
                    return;
            }
        }
        
        function converToFecha(fecha){
           return fecha.toDateInputValue();
        }
        function viewAgenda(cancha){
       
            vm.horas = [];  
            vm.horas = [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
       
           diaSemana();
           $ionicLoading.show();
           vm.Cancha = cancha;
           $scope.goForward();
           reservasService.getByCancha(vm.Cancha.id,vm.fecha.toDateInputValue()).then(success, error);
            function success(d) {
               $ionicLoading.hide();
               var reservas = d.data;
               var i = 0;
               for(i=0; i<reservas.length; i++){
                    document.getElementById(reservas[i].hora+"-"+vm.fecha.toDateInputValue()).style.background = "#FF3F45";
                    document.getElementById(reservas[i].hora+"-"+vm.fecha.toDateInputValue()).innerHTML ="<span>RESERVADA</span>";
               }
            }
            function error(error) {
                $ionicLoading.hide();
                    mostrarAlert("Oops..","No tuvimos un problems, intentelo de nuevo");
                    return;
            }
        }
        
        function reservar(hora){
            var f = new Date();
            var hoy = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();
            var resultado = dateComapreTo(hoy, vm.fecha.toDateInputValue());
            var valid_hora = hora - f.getHours();

            if (resultado > 0) {
                message("Imposible devolver el tiempo");
                return false;
            }

            if (valid_hora < 0 && resultado >= 0) {
                message("Imposible devolver el tiempo");
                return false;
            }
            
            var object = {
                idSitio : vm.Sitio.id,
                idCancha : vm.Cancha.id,
                idCliente : sessionService.getIdCliente(),
                fecha : vm.fecha.toDateInputValue(),
                hora : hora,
                diaSeaman: vm.diaSemana,
                tipo:"SIMPLE"
            }
        }
        
        
    }
    
})();


