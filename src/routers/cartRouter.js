const express = require("express");
const cartRouter = express.Router();
const moment = require("moment");
const path = require("path");
const { getProd } = require("./productRouter.js");
console.log("Router Carritos cargados");

let archivo_path
let dao 
if(process.env.PERSISTENS_METHOD == 'FIREBASE'){
  dao = "../models/daos/cart/cartDaoFirebase.js"
}else if(process.env.PERSISTENS_METHOD == 'MONGO'){
  dao = "../models/daos/cart/cartDaoMongoDb.js"
}else{
  dao = "../models/daos/cart/cartDaoFs.js"
  archivo_path = path.join(__dirname, "..", "/data/carrito.json");
}


let CartContainer = require(dao);
let carritos = new CartContainer(archivo_path);

cartRouter.use(express.json());
cartRouter.use(express.urlencoded({ extended: true }));


//devuelve todos los carritos
cartRouter.get("/", async (req, res) => {
  try {
    res.send(await carritos.getAll());
  } catch (error) {
    throw new Error("Hubo un error al listar todos los carritos");
  }
});

//devuelve solo los productos del carrito
cartRouter.get("/:id/productos", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    console.log(`carrito buscado: ${id}`);
    let obj = await carritos.getObjectById(id);
    console.log(obj);
    if(obj.error){res.send(obj);}else{
    if (obj[0].productos == undefined) {
      res.send(obj);
    } else {
      res.send(obj[0].productos);
    }};
  } catch (error) {
    throw new Error(
      "Hubo un error al listar los productos del carrito seleccionado"
    );
  }
});

//recibe y agrega el producto pasado por post al carrito y devuelve el carrito
cartRouter.post("/:id/productos", async (req, res) => {
  try {
    let obj = {};
    //REFACTOR
    obj.id = parseInt(req.params.id);

    let productId = parseInt(req.body.productoId);

    obj.productos = await getProd(productId);

    if (obj.productos.error) {
      res.send(obj.productos);
    } else {
      await carritos.addProdToCartById(obj);

      let cart = await carritos.getCartById(obj.id);

      res.send({ cart });

      console.log(`Nuevo producto agregado al carrito id: ${obj.id} `);
    }
  } catch (error) {
    throw new Error(`Hubo un error al agregar el producto id: ${obj.id}`);
  }
});

//crea un carrito nuevo y devuelve el id
cartRouter.post("/", async (req, res) => {
  try {
    let obj = {};

    obj.timestamp = moment();
    obj.productos = [];
    
    console.log('creacion del carrito nuevo')
    let id = await carritos.saveObject(obj);

    res.send({ id });

    console.log(`Nuevo al carrito id: ${id} `);
  } catch (error) {
    throw new Error(`Hubo un error al agregar el producto id: ${id}`);
  }
});

//borra carrito seleccionado
cartRouter.delete("/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let obj = await carritos.deleteById(id);

    res.send(obj);
  } catch (error) {
    throw new Error(`Hubo un error al borrar el producto`);
  }
});

//borra productos seleccionado del carrito pasado por parametro
cartRouter.delete("/:id/productos/:id_prod", async (req, res) => {
  try {
    ///REFACTOR
    let deleteCombo = {};
    let id = parseInt(req.params.id);
    let id_prod = parseInt(req.params.id_prod);
    deleteCombo.id_prod = id_prod;
    deleteCombo.id = id;
    let obj = await carritos.deleteProductoToCartById(deleteCombo);

    res.send(obj);
  } catch (error) {
    throw new Error(`Hubo un error al borrar el producto`);
  }
});

module.exports = { cartRouter};
