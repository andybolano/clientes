(function() {
    'use strict';

    angular
        .module('app')
        .controller('MenuCtrl', MenuCtrl);

    /* @ngInject */
    function MenuCtrl(authService,$scope,$ionicPopover,$ionicLoading,$state) {
        var vm = this;
        vm.logout = authService.logout;
        
        
  
        $ionicPopover.fromTemplateUrl('my-popover.html', {
                    scope: $scope
            }).then(function(popover) {
                $scope.popover = popover;
            });
            
            $scope.openPopover = function($event) {
               $scope.popover.show($event);
             };
             $scope.closePopover = function() {
               $scope.popover.hide();
             };
             //Cleanup the popover when we're done with it!
             $scope.$on('$destroy', function() {
               $scope.popover.remove();
             });
             // Execute action on hidden popover
             $scope.$on('popover.hidden', function() {
               // Execute action
             });
             // Execute action on remove popover
             $scope.$on('popover.removed', function() {
               // Execute action
             });
             
             $scope.logout = function(){
                 $scope.closePopover();
                 authService.logout();
             }
     }

})();


