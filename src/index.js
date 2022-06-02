const express = require("express");
const {productRouter,getAllProd,saveProd }= require("./productRouter.js");
const { engine } = require("express-handlebars");
const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');
const moment = require('moment'); 
const path = require('path');
const app = express();


let views_path = path.join(__dirname, '..', 'views');
app.use(express.static('public'));

const messages = [];

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
  })
);

app.set('views', views_path);
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/productos", productRouter);

app.get('/', (req, res) => {
    res.render('main');
  });

// app.listen(8080, () => {
//   console.log("Estoy escuchando 8080 --engine handlebars");
// });

const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

socketServer.on('connection', (socket) => {

  //emite los mensajes y productos actuales
  socket.emit('messages', messages);
  socket.emit('products',getAllProd());

  socket.on('new_product', (producto) => {
    //inserta el producto que le llego 
    console.log(`saved prod: ${producto}`);
    saveProd(producto);
    socketServer.sockets.emit('products', getAllProd());
  
  });

  socket.on('new_message', (mensaje) => {
    const fechaActual = moment();
    mensaje.date = fechaActual.format("DD/MM/YYYY HH:MM:SS");
    messages.push(mensaje);
    socketServer.sockets.emit('messages', messages);
  });
  
});

httpServer.listen(8080, () => {
  console.log('Estoy escuchando en el puerto 8080');
});