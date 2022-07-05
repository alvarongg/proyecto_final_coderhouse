const express = require("express");
const productRouter = express.Router();
const path = require('path');
const moment = require('moment'); 
console.log("Router Productos cargados");

let dao 
if(process.env.PERSISTENS_METHOD == 'FIREBASE'){
  dao = "../models/daos/products/productDaoFirebase.js"
}else if(process.env.PERSISTENS_METHOD == 'MONGO'){
  dao = "../models/daos/products/productDaoMongoDb.js"
}else{
  dao = "../models/daos/products/productDaoFs.js"
}

let ProductContainer = require(dao)

let archivo_path = path.join(__dirname, '..', '/data/productos.json');
let productos = new ProductContainer(archivo_path);

productRouter.use(express.json());
productRouter.use(express.urlencoded({ extended: true }));

function getProd(id){
  return productos.getById(id);
}

//devuelve todos los productos
//no valida permisos
productRouter.get("/", async (req, res) => {
  try {
    res.send(await productos.getAll());
  } catch (error) {
    throw new Error("Hubo un error al listar todos los productos");
  }
});

//devuelve solo el producto que necesito con el id pasado por get
//no valida permisos
 productRouter.get("/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let obj = await productos.getObjectById(id);
    console.log(obj);
    res.send(obj);
  } catch (error) {
    throw new Error("Hubo un error al listar el producto seleccionado");
  }
});

//recibe y agrega el producto pasado por post
//solo admins
productRouter.post("/", async (req, res) => {
  try {
    
    if(req.body.adminStatus){
            let obj = {};

            obj.timestamp = moment();
            obj.name = req.body.name;
            obj.description = req.body.description;
            obj.code = req.body.code;
            obj.price = req.body.price;
            obj.stock = req.body.stock;
            obj.thumbnail = req.body.thumbnail;
            let id = await productos.saveObject(obj);
                        
            res.send({id});
            console.log(`Nuevo producto id: ${id} `);
  }
  else {res.json({
    error: 
      '-1'
    , description: `ruta ${req.originalUrl} metodo ${req.method}  no autorizada` 
  });}
  } catch (error) {
    throw new Error("Hubo un error al agregar el producto");
  }
});

//recibe y actualiza el producto segun si id existe
productRouter.put("/:id", async (req, res) => {
  try {
    //REFACTOR
    if(req.body.adminStatus){
    let obj = {};
    obj.id = parseInt(req.params.id);
    obj.title = req.body.title;
    obj.price = req.body.price;
    obj.thumbnail = req.body.thumbnail;

    let id = await productos.updateById(obj);

    res.send(id);
    console.log(`Modificado producto id: ${id} `);}
    else {res.json({
      error: 
        '-1'
      , description: `ruta ${req.originalUrl} metodo ${req.method}  no autorizada` 
    });}
  } catch (error) {
    throw new Error("Hubo un error al actualizar el producto");
  }
});

//borra el producto con el id seleccionado
productRouter.delete("/:id", async (req, res) => {
  try {
    if(req.body.adminStatus){
    let id = parseInt(req.params.id);
    let obj = await productos.deleteById(id);

    res.send(obj);}
    else {res.json({
      error: 
        '-1'
      , description: `ruta ${req.originalUrl} metodo ${req.method} no autorizada` 
    });}
  } catch (error) {
    throw new Error(`Hubo un error al borrar el producto`);
  }
});

module.exports = {productRouter,getProd};
