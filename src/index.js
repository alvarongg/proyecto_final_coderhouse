const express = require("express");
const {productRouter }= require("./routers/productRouter.js");
const {cartRouter}= require("./routers/cartRouter");
// const { engine } = require("express-handlebars");
const moment = require('moment'); 
const path = require('path');
const app = express();


// let views_path = path.join(__dirname, '../routers/', 'views');
// app.use(express.static('public'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/productos", productRouter);
app.use("/api/carrito",cartRouter);

app.get('/', (req, res) => {
    res.render('main');
  });

app.listen(8080, () => {
  console.log("Estoy escuchando 8080 --engine handlebars");
});



