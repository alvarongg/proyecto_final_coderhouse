const path = require('path');
let archivo_path = path.join(__dirname, '..','..', '/containers/containerMongoDb.js');

const ContenedorMongoDB = require(archivo_path);
const mongoose = require("mongoose");


const Schema = mongoose.Schema;

module.exports =  class ProductsDaoMongoDb extends ContenedorMongoDB {

    constructor(){
        super('productos');
        this.schema =  new Schema({
            title: String,
            price: Number,
            thumbnail: String,
            stock: Number,
            id_interno: Number,
          });
    }



}