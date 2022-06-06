const express = require("express");
const cartRouter = express.Router();
const moment = require('moment'); 
console.log("Router Carritos cargados");
const {getAllProd,saveProd,getProd }= require("./productRouter.js");

let cartContainer = require("../models/cartContainer.js");
let carritos = new cartContainer('carrito.txt');

cartRouter.use(express.json());
cartRouter.use(express.urlencoded({ extended: true }));

function getAllCart(){
  return carritos.getAll();
}

function saveCart(obj){
  carritos.save(obj);
}

//devuelve todos los carritos
cartRouter.get("/", (req, res) => {
  try {
    res.send(carritos.getAll());
  } catch (error) {
    throw new Error("Hubo un error al listar todos los carritos");
  }
});

//devuelve solo los productos del carrito
cartRouter.get("/:id/productos", (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let obj = carritos.getById(id);

    res.send(obj.productos);
  } catch (error) {
    throw new Error("Hubo un error al listar los productos del carrito seleccionado");
  }
});

//recibe y agrega el producto pasado por post al carrito y devuelve el carrito
cartRouter.post(":id/productos", (req, res) => {
  try {
    let obj = {};

    obj.id = parseInt(req.params.id);

    let productId = parseInt(req.params.productosId);

    obj.productos = getProd(productId);
    
    carritos.addProdToCartById(obj);

    let cart = carritos.getCartById(obj.id);

    res.send({ cart });

    console.log(`Nuevo producto agregado al carrito id: ${obj.id} `);
  } catch (error) {
    throw new Error(`Hubo un error al agregar el producto id: ${obj.id}`);
  }
});

//crea un carrito nuevo y devuelve el id
cartRouter.post("/", (req, res) => {
  try {

    let obj = {};

    obj.timestamp = moment();
    obj.productos = {};

    let id = carritos.createCart(obj);

    res.send({ id });

    console.log(`Nuevo al carrito id: ${id} `);
  } catch (error) {
    throw new Error(`Hubo un error al agregar el producto id: ${id}`);
  }
});

//borra carrito seleccionado
cartRouter.delete("/:id", (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let obj = carritos.deleteCartById(id);

    res.send(obj);
  } catch (error) {
    throw new Error(`Hubo un error al borrar el producto`);
  }
});

//borra productos seleccionado del carrito pasado por parametro
cartRouter.delete("/:id/productos/:id_prod", (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let id_prod = parseInt(req.params.id_prod);
    let obj = carritos.deleteProductoToCartById(id);

    res.send(obj);
  } catch (error) {
    throw new Error(`Hubo un error al borrar el producto`);
  }
});


module.exports = {cartRouter,getAllCart,saveCart};

