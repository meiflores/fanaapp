
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'io.melinaflores.fanaapp',
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
      path: '/paginaProducto/:id/',
      url: 'paginaProducto.html',
    },
    {
      path: '/paginaDejarReview/:id/',
      url: 'paginaDejarReview.html',
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
var usuario;


// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");

  //alert("paso1");

  // intento sacar el splash en IOS
  /*
  Observable.timer(15000).subscribe(()=>{
    this.splashScreen.hide();
  });
*/
  navigator.splashscreen.hide();

  //$$('#botonInicioSesion').on('click', funcionLogin);

});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  // Do something here when page loaded and initialized
  //console.log(e);
  $$('#flechaAtras').on('click', function () {
    mainView.router.back();
  })
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);
  $$('#botonInicioSesion').on('click', funcionLogin);
  $$('#botonRegistrate').on('click', funcionRegistrate);
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
  mostrarProductos();
  $$('body').on('click', '.contenedorProductoHome', function () {
    var idProducto = $$(this).attr('id');
    //console.log(idProducto);
    mainView.router.navigate('/paginaProducto/' + idProducto + '/');
  });



})

$$(document).on('page:reinit', '.page[data-name="home"]', function (e) {
  $$('#flechaAtras').addClass('oculto');
  $$('#iconoMenu').removeClass('oculto');
  $$('#iconoBuscador').removeClass('oculto');
});



$$(document).on('page:init', '.page[data-name="paginaProducto"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);
  $$('#flechaAtras').removeClass('oculto');
  $$('#iconoMenu').addClass('oculto');
  $$('#iconoBuscador').addClass('oculto');

  var idProducto = app.view.main.router.currentRoute.params.id;
  mostrarProductoEnPagina(idProducto);
  mostrarReviewsEnPaginaProducto(idProducto);

  $$('#botonDejarReview').on('click', function () {
    mainView.router.navigate('/paginaDejarReview/' + idProducto + '/');
  })

  $$('#fabReview').on('click', function () {
    mainView.router.navigate('/paginaDejarReview/' + idProducto + '/');
  })

})

$$(document).on('page:reinit', '.page[data-name="paginaProducto"]', function (e){
  var idProducto = app.view.main.router.currentRoute.params.id;
  mostrarReviewsEnPaginaProducto(idProducto);
})


$$(document).on('page:init', '.page[data-name="paginaDejarReview"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);

  var idProducto = app.view.main.router.currentRoute.params.id;
  console.log(idProducto);
  mostrarProductoEnPaginaReview(idProducto);

  var minCaracteresTextAreaReview = 200;

  $$("#textAreaDejarReview").keyup(function () {
    var caracteresFaltantes = minCaracteresTextAreaReview - $$(this).val().length;
    $$('#caracteresFaltantesTextAreaReview').text('¡Te faltan ' + caracteresFaltantes + ' caracteres!');
    if (caracteresFaltantes <= 0) {
      $$('#caracteresFaltantesTextAreaReview').addClass('oculto');
    } else {
      $$('#caracteresFaltantesTextAreaReview').removeClass('oculto');
    }

  });

  var calificacionSeleccionadaReview;

  $$('#estrella1').on('click', function () {
    calificacionSeleccionadaReview = 1;
    $$(this).text('star_fill');
    $$('#estrella2').text('star');
    $$('#estrella3').text('star');
    $$('#estrella4').text('star');
    $$('#estrella5').text('star');
  })

  $$('#estrella2').on('click', function () {
    calificacionSeleccionadaReview = 2;
    $$('#estrella1').text('star_fill');
    $$(this).text('star_fill');
    $$('#estrella3').text('star');
    $$('#estrella4').text('star');
    $$('#estrella5').text('star');
  })

  $$('#estrella3').on('click', function () {
    calificacionSeleccionadaReview = 3;
    $$('#estrella1').text('star_fill');
    $$('#estrella2').text('star_fill');
    $$(this).text('star_fill');
    $$('#estrella4').text('star');
    $$('#estrella5').text('star');
  })

  $$('#estrella4').on('click', function () {
    calificacionSeleccionadaReview = 4;
    $$('#estrella1').text('star_fill');
    $$('#estrella2').text('star_fill');
    $$('#estrella3').text('star_fill');
    $$(this).text('star_fill');
    $$('#estrella5').text('star');
  })

  $$('#estrella5').on('click', function () {
    calificacionSeleccionadaReview = 5;
    $$('#estrella1').text('star_fill');
    $$('#estrella2').text('star_fill');
    $$('#estrella3').text('star_fill');
    $$('#estrella4').text('star_fill');
    $$(this).text('star_fill');
  })



  $$('#botonEnviarReview').on('click', function () {
    var contenidoTituloReview = $$('#textAreaTituloReview').val();
    var contenidoReview = $$('#textAreaDejarReview').val();
    registrarReviewEnBaseDeDatos(idProducto, usuario, contenidoReview, contenidoTituloReview, calificacionSeleccionadaReview);
    console.log(contenidoTituloReview + contenidoReview + calificacionSeleccionadaReview + usuario + idProducto);
  });








})







/* MIS FUNCIONES */

function funcionLogin() {
  // prueba@prueba.com 12345678
  email = $$('#loginEmail').val();
  clave = $$('#loginContraseña').val();


  firebase.auth().signInWithEmailAndPassword(email, clave)
    .then(function () {

      baseDeDatos = firebase.firestore();
      var referenciaUsuarios = baseDeDatos.collection('Usuarios').where('email', '==', email);
      referenciaUsuarios.get()

      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          usuario = doc.id;
        });
      })  

        .catch(function (error) {

          console.log("Error: ", error);

        });


      mainView.router.navigate('/home/');
      //console.log('usuario ok');

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
  var referenciaUsuarios = baseDeDatos.collection("Usuarios").doc(usuario);

  referenciaUsuarios.get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        referenciaUsuarios.onSnapshot((doc) => {
          console.log("YA EXISTE EL USUARIO");

        });
      } else {
        console.log("NO EXISTE EL USUARIO");
        /* EL USUARIO NO EXISTE, SE PUEDE CREAR */

        email = $$('#registroEmail').val();
        clave = $$('#registroContraseña').val();
        nombre = $$('#registroNombre').val();
        apellido = $$('#registroApellido').val();

        firebase.auth().createUserWithEmailAndPassword(email, clave)
          .then(function (parametroCallBack) {
            /* EL MAIL ESTA OK */
            datos = {
              nombre: nombre,
              apellido: apellido,
              email: email
            }


            coleccionUsuarios.doc(usuario).set(datos)
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





      }
    });
}


function funcionRegistrate() {
  mainView.router.navigate('/registracion1/');
  $$('#mensajeLogin').text('Estoy funcionando');
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


//FUNCIONES HOME

function mostrarProductos() {
  // console.log('Acá se van a mostrar los productos');
  baseDeDatos = firebase.firestore();
  var referenciaProductos = baseDeDatos.collection('Productos');
  referenciaProductos.get()

    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        //console.log(doc.data().nombreProducto + " " + doc.data().marcaProducto + " " + doc.data().calificacionProducto);
        $$('#contenedorMiniaturasHome').append('<div class="col-33 contenedorProductoHome" id="' + doc.id + '"><div class="row"><div class="col-100" id="contenedorImagenHome"><img src="' + doc.data().miniaturaHome + '"></div><div class="col-100 text-align-center"><p class="nombreProductoHome">' + doc.data().nombreProducto + '</p><p class="marcaProductoHome">' + doc.data().marcaProducto + '</p></div></div> </div>');
      });
    })
    .catch(function (error) {

      console.log("Error: ", error);

    });
}

// FUNCIONES PÁGINA DE PRODUCTO

function mostrarProductoEnPagina(idProducto) {
  baseDeDatos = firebase.firestore();
  var referenciaProductos = baseDeDatos.collection('Productos').doc(idProducto);
  referenciaProductos.get()

    .then(function (doc) {

      $$('#nombreProducto').text(doc.data().nombreProducto);
      $$('#marcaProducto').text(doc.data().marcaProducto);
      $$('#descripcionProducto').text(doc.data().descripcionProducto);
      $$('#ingredientesProducto').text(doc.data().ingredientesProducto);
      $$('#bannerProducto').attr('src', doc.data().bannerProducto);

    })
    .catch(function (error) {

      console.log("Error: ", error);

    });
}

function mostrarReviewsEnPaginaProducto(idProducto) {
  baseDeDatos = firebase.firestore();
  var referenciaReviews = baseDeDatos.collection('Reviews').where('idProducto', '==', idProducto).orderBy('fechaCreacion','desc');
  referenciaReviews.get()

    .then(function (querySnapshot) {
      $$('#contenedorReviewsGeneral').empty();
      querySnapshot.forEach(function (doc) {

        var referenciaUsuarios = baseDeDatos.collection('Usuarios').doc(doc.data().usuario);
        referenciaUsuarios.get()

          .then(function (doc2) {


            $$('#contenedorReviewsGeneral').append('<div class="row contenedorReviewIndividual"><div class="col-20"><div class="row"><div class="col-100"><img src="' + doc2.data().fotoPerfilUsuario + '" class="avatarPaginaProducto"></div><div class="col-100"><p class="nombreUsuarioPaginaProducto">' + doc.data().usuario + '</p></div></div></div><div class="col-80" ><div class="row"><div class="col-100" id="contenedorEstrellasReview"><i class="f7-icons estrellaReviewProducto">star_fill</i><i class="f7-icons estrellaReviewProducto">star_fill</i><i class="f7-icons estrellaReviewProducto">star_fill</i><i class="f7-icons estrellaReviewProducto">star_fill</i><i class="f7-icons estrellaReviewProducto">star</i></div><div class="col-100"><p class="tituloReviewEnPaginaProducto">' + doc.data().titulo + '</p></div><div class="col-100"><p class="contenidoReviewEnPaginaProducto">' + doc.data().texto + '</p></div></div></div></div>');


          })
          .catch(function (error) {

            console.log("Error: ", error);

          });


      });
    })

    .catch(function (error) {

      console.log("Error: ", error);

    });

}

//FUNCIONES EN PAGINA DEJAR REVIEW

function mostrarProductoEnPaginaReview(idProducto) {
  baseDeDatos = firebase.firestore();
  var referenciaProductos = baseDeDatos.collection('Productos').doc(idProducto);
  referenciaProductos.get()

    .then(function (doc) {
      console.log(doc.data().nombreProducto);
      $$('#nombreProductoDejarReview').text(doc.data().nombreProducto);
      $$('#marcaProductoDejarReview').text(doc.data().marcaProducto);
    })
    .catch(function (error) {

      console.log("Error: ", error);

    });
}

function volverAtras() {
  mainView.router.back();
}

function registrarReviewEnBaseDeDatos(idProducto, usuario, contenidoReview, contenidoTituloReview, calificacionSeleccionadaReview){
 
  baseDeDatos = firebase.firestore();
 
  var cargaDeDatosReview = {
    idProducto: idProducto,
    usuario: usuario,
    texto: contenidoReview,
    titulo: contenidoTituloReview,
    valoracion: calificacionSeleccionadaReview
    };

    baseDeDatos.collection("Reviews").doc().set(cargaDeDatosReview)

    .then(function(){
      app.dialog.alert('Tu reseña se añadió correctamente', 'Yay!', volverAtras);
    })

    .catch(function(error){
      console.error("El error fue: ", error);
    })


}