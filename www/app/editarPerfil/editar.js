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
            .controller('editarCtrl', editarCtrl);
    /* @ngInject */
    function editarCtrl($scope, usuarioService, sessionService, $ionicLoading, $ionicPopup,API_URL,$cordovaFileTransfer) {
        var vm = this;
        $scope.$on('$ionicView.loaded', function () {
            vm.Usuario = {};
            vm.Usuario = sessionService.getUser();
            vm.Usuario.email = sessionService.getEmail();
            vm.buscarAlbum = buscarAlbum;
            vm.update = update;
            vm.isfacebook = true;
            
            var info = JSON.parse(localStorage.getItem('data'));
            if(info.facebookId == '0' || info.facebookId == 'NULL'){
                vm.isfacebook = false;
            }
        });
        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            $scope.popover.hide();
        });
       function buscarAlbum(){
                navigator.camera.getPicture( onSuccess, onError, { 
                quality : 50,
                destinationType : Camera.DestinationType.FILE_URI,
                sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit : false,
                encodingType: Camera.EncodingType.JPEG         
            });
        }
        function onSuccess(imageURI){
        var image = document.getElementById('Imagen');
        image.src = imageURI;
            subirImagen(imageURI);
        }
        function onError(msg){
         navigator.notification.alert("Error capturando foto "+ msg);
        }

        function subirImagen(imageURI){
            $ionicLoading.show();
           var options = {
                fileKey: "imagen",
                fileName: vm.Usuario.id+".jpg",
                chunkedMode: false,
                mimeType: "image/jpeg"
            };
             $cordovaFileTransfer.upload(API_URL+"/cliente/"+vm.Usuario.id+"/image",imageURI, options).then(function(p) {
             $ionicLoading.hide();
              message("Imagen Actualizada");
               var data = JSON.parse(window.localStorage.getItem('data'));
               data.image = 1;
               data.url = "https://birriassoccer.com/images/clientes/"+vm.Usuario.id+".jpg"
               window.localStorage.setItem('data',JSON.stringify(data));
            }, function(err) {
                 message("Error al actualizar imagen");
            }, function (progress) {
                // constant progress updates
            })
        }
        

        function update(){
             if ( vm.Usuario.nombres === undefined || vm.Usuario.apellidos === undefined || vm.Usuario.telefono === undefined) {
                message("Faltan campos por digilenciar");
                return 0;
            }
            if(!vm.isfacebook){
                if( vm.Usuario.clave === undefined || vm.Usuario.email === undefined){
                     message("Ingresa tu correo y contraseña");
                     return 0;
                }
                if(vm.Usuario.newClave === undefined || vm.Usuario.newClave === ""){
                    vm.Usuario.newClave = 'false';
                }
                
                vm.Usuario.facebook = 'false';
            }else{
             vm.Usuario.facebook = 'true';
            }
            
            usuarioService.update(vm.Usuario).then(success, error);
            function success(p) {
               
             message(p.data.message);
             window.localStorage.setItem('data', JSON.stringify(p.data.request));
             if(!vm.isfacebook){
                window.localStorage.setItem('email', p.data.email);
                 vm.Usuario.clave = "";
                 vm.Usuario.newClave = "";
                }
            }
            function error(error) {
               
                if (error.status === 409) {
                    mostrarAlert("Fallo en el Registro", "Parece que " + vm.usuario.email + " pertenece a una cuenta ya registrada ");
                    vm.usuario = {};
                    return;
                }
                mostrarAlert("Fallo en el Registro", "No se ha podido realizar el registro, intente mas tarde");
            }
        }
        function mostrarAlert(titulo, contenido) {
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: contenido
            });
            alertPopup.then(function (res) {
            });
        }
        function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
    }
})();


