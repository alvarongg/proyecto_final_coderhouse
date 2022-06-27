const path = require('path');
let archivo_path = path.join(__dirname, '..','..', '/containers/containerFs');

const ContainerFs = require(archivo_path);

module.exports =  class CartDaoFs extends ContainerFs {

    constructor(filePath){
        super(filePath);
    }


  /**
   * Selecciona un objeto del archivo y lo devuleve
   * @param {int} id
   * @returns Devuelve el objeto si lo encuentra
   */
   async addProdToCartById(obj) {
    try {
        //chequeo que el archivo exista si no existe lo creo
        await fileChecker(this.fileName);

      let array = await fileToArray(this.fileName);
      let objIndex = array.findIndex(
        (cart) => cart.id == obj.id
      );

      if (objIndex == -1) {
        return { error: "Carrito no encontrado" };
      } else {

        array[objIndex].productos.push(obj.productos[0]);

        await arrayToFile(this.fileName, array);
        return { estado: "Carrito actualizado" };
      }
    } catch (error) {
      throw error;
    }
  }



 /**
   * Borra el producto con le id carrito y id produ seleccionado en el array
   * @param {obj} .id_cart .id_prod
   */
  async deleteProductoToCartById(obj) {
    try {
      //chequeo que el archivo exista si no existe lo creo
      await fileChecker(this.fileName);

      let array = await fileToArray(this.fileName);
      let objIndex = array.findIndex(
        (cart) => cart.id == obj.id
      );

      if (objIndex == -1) {
        return { error: "Carrito no encontrado" };
      } else {
      
        let arrayCart =  array[objIndex].productos
    
        arrayCart = arrayCart.filter((x) => {
            return x.id != obj.id_prod;
          });
        
        array[objIndex].productos = arrayCart;
       
        console.log(array);
        await arrayToFile(this.fileName, array);
        return { estado: "Carrito actualizado" };
      }
    } catch (error) {
      throw error;
    }
  }


}