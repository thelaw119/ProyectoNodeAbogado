const http=require('http');
const url=require('url');
const fs=require('fs');
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
  let camino='web'+objetourl.pathname;
  if (camino=='web/')
    camino='web/index.html';
  encaminar(pedido,respuesta,camino);
});

servidor.listen(8888);


function encaminar (pedido,respuesta,camino) {
  
  switch (camino) {
    case 'web/subir': {
      subir(pedido,respuesta);
      break;
    }	
    case 'web/listadofotos': {
      listar(respuesta);
      break;
    }			
    default : {  
      fs.stat(camino, error => {
        if (!error) {
            fs.readFile(camino,(error,contenido) => {
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

console.log('Servidor web iniciado');