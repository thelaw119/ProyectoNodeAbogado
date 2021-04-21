const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const formidable=require('formidable');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

const servidor=http.createServer((pedido,respuesta) => {
  const objetourl = url.parse(pedido.url);
  let camino='public'+objetourl.pathname;
  if (camino=='public/')
    camino='public/index.html';
  encaminar(pedido,respuesta,camino);
});

function encaminar (pedido,respuesta,camino) {
  switch (camino) {
      //LAW
    case 'public/GuardarDatos': {
      GuardarDatos(pedido,respuesta);
      break;
    }
    case 'public/grabarDatosProc': {
      grabarDatosProc(pedido,respuesta);
      break;
    }case 'public/leerprocurador': {
      leerprocurador(respuesta);
      break;}
    //SE DEBE AGREGAR OTRO CASE PARA VISUALIZAR
                
                
    default : {  
      fs.stat(camino, error => {
        if (!error) {
          fs.readFile(camino,(error, contenido) => {
            if (error) {
              respuesta.writeHead(500, {'Content-Type': 'text/plain'});
              respuesta.write('Error interno');
              respuesta.end();					
            } else {
              const vec = camino.split('.');
              const extension=vec[vec.length-1];
              const mimearchivo=mime[extension];
              respuesta.writeHead(200, {'Content-Type': mimearchivo});
              respuesta.write(contenido);
              respuesta.end();
            }
          });
        } else {
          respuesta.writeHead(404, {'Content-Type': 'text/html'});
          respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
          respuesta.end();
        }
      });	
    }
  }	
}
 
//Funcion creado por Law 
function GuardarDatos(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', function(){
    const formulario = querystring.parse(info);
    respuesta.writeHead(200, {'Content-Type': 'text/html'});

    const pagina=`<!doctype html><html><head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">  
                </head><body style="background-color: rgba(63, 176, 211, 0.39);"><center>
                <div style="height: 100px; background-color: rgba(247, 0, 255, 0.397);"><br>
                <a class="btn btn-outline-dark " href="index.html" role="button">Inicio</a>
                <a class="btn btn-outline-light" href="datos_clientes.html" role="button">Ingreso Clientes</a>
                <a class="btn btn-outline-dark active" href="datos_procurador.html" role="button">Ingreso Procurador</a>
                <a class="btn btn-outline-light " href="historial_cliente.html" role="button">Historial Clientes</a>
                <a class="btn btn-outline-dark" href="historial_procurador.html" role="button">Historial Procurador</a>    
                </div><br><br><br><br><div class="col-md-4 input-group-text border border-info">
                <div class="text-center col-lg-12"><br><br>
                <h3>DNI:${formulario['dni']}<h3><br>
                <h3>Nombre:${formulario['nombre']}<h3><br>
                <h3>Apellido:${formulario['apellido']}<h3><br>
                <h3>Direccion:${formulario['direccion']}<h3><br>
                <h3>Numero Expediente:${formulario['numero_expediente']}<h3><br>
                <h3>Estado:${formulario['estado']}<h3><br>
                <h3>Fecha Inicio:${formulario['fecha_i']}<h3><br>
                <h3>Fecha termino:${formulario['fecha_t']}<h3><br>
                <a class="btn btn-outline-danger btn-lg" href="datos_clientes.html" role="button">Volver</a><br><br>
                </div></div></center></body></html>`;  
    respuesta.end(pagina);
    GuardarFinalizador(formulario); 
  });	
}

//Funcion creada por LAW
function GuardarFinalizador(formulario) {
  const datos=` DNI:${formulario['dni']}<br>
                Nombre:${formulario['nombre']}<br>
                Apellido:${formulario['apellido']}<br>
                Direccion:${formulario['direccion']}<br>
                Numero Expediente:${formulario['numero_expediente']}<br>
                Estado:${formulario['estado']}<br>
                Periodo:${formulario['periodo']}<hr>`;
  fs.appendFile('public/Cliente.txt',datos, error => {
    if (error)
      console.log(error);
  });
}
//*****seiko*****
function grabarDatosProc(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', function(){
    const formulario = querystring.parse(info);
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    const pagina=`<!doctype html><html><head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">  
                </head><body style="background-color: rgba(63, 176, 211, 0.39);"><center>
                <div style="height: 100px; background-color: rgba(247, 0, 255, 0.397);"><br>
                <a class="btn btn-outline-dark " href="index.html" role="button">Inicio</a>
                <a class="btn btn-outline-light" href="datos_clientes.html" role="button">Ingreso Clientes</a>
                <a class="btn btn-outline-dark active" href="datos_procurador.html" role="button">Ingreso Procurador</a>
                <a class="btn btn-outline-light " href="historial_cliente.html" role="button">Historial Clientes</a>
                <a class="btn btn-outline-dark" href="historial_procurador.html" role="button">Historial Procurador</a>    
                </div><br><br><br><br><div class="col-md-4 input-group-text border border-info">
                <div class="text-center col-lg-12"><br><br>
                <h3>Nombre: ${formulario['nombre']}<h3><br>
                <h3>apellidos: ${formulario['apellidos']}<h3><br>
                <h3>correo: ${formulario['correo']}<h3><br>
                <h3>edad: ${formulario['edad']}<h3><br>
                <h3>expediente: ${formulario['exped']}<h3><br>
                <a class="btn btn-outline-danger btn-lg" href="index.html" role="button">Volver</a><br><br>
                </div></div></center></body></html>`;
    respuesta.end(pagina);
    grabarEnArchivo(formulario); 
  });	
}

function grabarEnArchivo(formulario) {
  const datos=`
               nombre:${formulario['nombre']}
               apellidos:${formulario['apellidos']}
               correo:${formulario['correo']}
               edad:${formulario['edad']}
               expediente:${formulario['exped']}
               *******************
`;
  fs.appendFile('public/procuradores.txt',datos, error => {
    if (error)
      console.log(error);
  });
}
function leerprocurador(respuesta) {
  fs.readFile('public/procuradores.txt', (error,datos) => {
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    respuesta.write('<!doctype html><html><head></head><body>');
    respuesta.write(datos);
    respuesta.write('</body></html>');
    respuesta.end();	      
  });
}
//*****seiko*****
servidor.listen(8888);




console.log('Servidor web iniciado');