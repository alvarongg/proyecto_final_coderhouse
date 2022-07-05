const path = require('path');
let archivo_path = path.join(__dirname, '..','..', '/containers/containerFs');

const ContainerFs = require(archivo_path);


module.exports =  class ProductsDaoFs extends ContainerFs {

    constructor(filePath){
        super(filePath);
    }

      /**
   * Selecciona un objeto del archivo y lo devuleve
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