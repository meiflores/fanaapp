
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    {
      path: '/index/',
      url: 'index.html',
    },
    {
      path: '/registracion1/',
      url: 'registracion1.html',
    },
    {
      path: '/registracion2/',
      url: 'registracion2.html',
    },
    {
      path: '/panel/',
      url: 'panel.html',
    },
    {
      path: '/home/',
      url: 'home.html',
    },
  ]
  // ... other parameters
});


//VARIABLES GLOBALES

var mainView = app.views.create('.view-main');
var maxCaracteresBio = 200;
var email;
var baseDeDatos;
var coleccionUsuarios;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");

  //$$('#botonInicioSesion').on('click', funcionLogin);

});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  // Do something here when page loaded and initialized
  //console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);
  $$('#botonInicioSesion').on('click', funcionLogin);
})
$$(document).on('page:init', '.page[data-name="registracion1"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);
  $$('#botonSiguiente').on('click', funcionRegistro1);

})
$$(document).on('page:init', '.page[data-name="registracion2"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);

  $$('#botonFinalizar').on('click', funcionRegistro2);
  $$('#botonGaleria').on('click', funcionGaleria);
  $$('#botonCamara').on('click', funcionCamara);

  $$("#textAreaBio").keyup(function () {
    var caracteresRestantes = maxCaracteresBio - $$(this).val().length;
    $$('#caracteresBio').text(caracteresRestantes + '/200');
  });

})
$$(document).on('page:init', '.page[data-name="panel"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);
})
$$(document).on('page:init', '.page[data-name="home"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);
})

/* MIS FUNCIONES */

function funcionLogin() {
  // prueba@prueba.com 12345678
  email = $$('#loginEmail').val();
  clave = $$('#loginContraseña').val();


  firebase.auth().signInWithEmailAndPassword(email, clave)
    .then(function () {

      mainView.router.navigate('/home/');
      console.log('usuario ok');

    })

    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      $$('#mensajeLogin').html(errorMessage);
      console.log('usuario incorrecto');
      // ...
    });

}

function funcionRegistro1() {

  usuario = $$('#registroUsuario').val();
  baseDeDatos = firebase.firestore();
  coleccionUsuarios = baseDeDatos.collection('Usuarios');
  var yaExisteUsuario = false;

  var referenciaUsuarios = baseDeDatos.collection("Usuarios").where("usuario", "==", usuario);
  referenciaUsuarios.get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        yaExisteUsuario  = true;
        console.log('Existe usuario');
      });
    })
    .catch(function (error) {

      console.log("Error: ", error);

    });
  console.log(contador);
  if (!yaExisteUsuario) {
    email = $$('#registroEmail').val();
    clave = $$('#registroContraseña').val();
    nombre = $$('#registroNombre').val();
    apellido = $$('#registroApellido').val();

    firebase.auth().createUserWithEmailAndPassword(email, clave)
      .then(function (parametroCallBack) {

        datos = {
          nombre: nombre,
          apellido: apellido,
          usuario: usuario

        }

        coleccionUsuarios.doc(email).set(datos)
          .then(function () {
            mainView.router.navigate('/registracion2/');
          })

          .catch(function (e) {
            console.log('algo falló');
          })

          ;

      })

      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        // ...
      });
  } else {
    console.log('El usuario ingresado ya existe');
  }



}

function funcionRegistro2() {

  var textoBio = $$('#textAreaBio').val();
  var imagenPerfil = $$('#fotoPerfil').attr('src');

  baseDeDatos.collection("Usuarios").doc(email).update
    ({
      bioPerfil: textoBio,
      imagenDePerfil: imagenPerfil
    })
    .then(function () {

      console.log("Se actualizó el texto de la Bio");

    })
    .catch(function (error) {

      console.log("Error: " + error);

    });
  mainView.router.navigate('/home/');
}





// FUNCIONES CAMARA Y GALERÍA
function funcionGaleria() {
  navigator.camera.getPicture(onSuccessCamera, onErrorCamera,
    {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}

function funcionCamara() {
  navigator.camera.getPicture(onSuccessCamera, onErrorCamera,
    {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA
    });
}

function onSuccessCamera(imageURI) {
  $$('#fotoPerfil').attr('src', imageURI);
}

function onErrorCamera(message) {
  alert('Failed because: ' + message);
}






