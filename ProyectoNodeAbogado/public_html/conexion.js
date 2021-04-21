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
   'mp3'  :	'audio/mpeg3',
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
    case 'public/GuardarDatos': {
      GuardarDatos(pedido,respuesta);
      break;
    }	
    case 'public/leercomentarios': {
      leerComentarios(respuesta);
      break;
    }			
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

function GuardarDatos(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', function(){
    const formulario = querystring.parse(info);
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    const pagina=`<!doctype html><html><head></head><body>
                DNI:${formulario['dni']}<br>
                Nombre:${formulario['nombre']}<br>
                Apellido:${formulario['apellido']}<br>
                Direccion:${formulario['direccion']}<br>
                Numero Expediente:${formulario['numero_expediente']}<br>
                Estado:${formulario['estado']}<br>
                Periodo:${formulario['periodo']}<br>
                <a href="index.html">Retornar</a>
                </body></html>`;
    respuesta.end(pagina);
    GuardarFinalizador(formulario); 
  });	
}

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


servidor.listen(8888);




console.log('Servidor web iniciado');