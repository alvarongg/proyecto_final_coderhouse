const express = require("express");
const {productRouter }= require("./routers/productRouter.js");
const {cartRouter}= require("./routers/cartRouter");
const path = require('path');
const app = express();

const envfile = path.join(__dirname,'..','.env');
require('dotenv').config({path:envfile});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api/productos", productRouter);
app.use("/api/carrito",cartRouter);

app.use(function(req, res) {
  // request invalida
        res.json({
          error: 
            '-2'
          , description: `ruta ${req.originalUrl} metodo ${req.method} no implementada` 
        });
  });

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Estoy escuchando ${port}`);
});



