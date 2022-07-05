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

      /**
   * updatea un producto en base al id pasado
   * @param {int} id
   * @returns Devuelve el objeto si lo encuentra
   */
       async updateById(obj) {
        try {
            //chequeo que el archivo exista si no existe lo creo
            await fileChecker(this.fileName);
    
          let array = await fileToArray(this.fileName);
          let objIndex = array.findIndex(
            (product) => product.id == obj.id
          );
    
          if (objIndex == -1) {
            return { error: "producto no encontrado" };
          } else {
            array[objIndex].title = obj.title;
            array[objIndex].price = obj.price;
            array[objIndex].thumbnail = obj.thumbnail;
            await arrayToFile(this.fileName, array);
            return { estado: "Producto actualizado" };
          }
        } catch (error) {
          throw error;
        }
      }

}