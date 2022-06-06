const fs = require("fs");

/**
 * Lee un array de objetos dentro de un archivo, retorna un array de objetos json
 * @param {string} fileName
 * @returns Array de objetos contenido en el archivo
 */
const fileToArray = async (fileName) => {
  try {
    //leer archivo y cargarlo en array
    //devolver array
    return JSON.parse(await fs.promises.readFile(fileName));
  } catch (error) {
    console.log("Se produjo un error!");
    throw error;
  }
};

/**
 * Escribe el array completo en un archivo
 * @param {string} fileName
 * @param {obj} array
 */
const arrayToFile = async (fileName, array) => {
  try {
    //leer archivo y cargarlo en array
    await fs.promises.writeFile(fileName, JSON.stringify(array));
  } catch (error) {
    throw error;
  }
};

/**
 * Crea un archivo nuevo con el nombre recibido por parametro
 * @param {string} fileName
 */
const createEmptyFile = async (fileName) => {
  try {
    //leer archivo y cargarlo en array
    await fs.promises.writeFile(fileName, "[]");
  } catch (e) {
    throw error;
  }
};

/**
 * Valida que exista el archivo, si no existe lo crea llamando a createEmptyFile(fileName)
 * @param {string} fileName 
 */
const fileChecker = async (fileName) => {
  //chequeo que el archivo exista si no existe lo creo
  const stats = fs.existsSync(fileName);

  if (stats) {
    console.log(`Existe el archivo: ${fileName}`);
  }
  else{console.log(`Creo archivo vacio: ${fileName}`);
  await createEmptyFile(fileName);}
};

class cartContainer {
  constructor(fileName) {
    //this.container = [];
    this.fileName = fileName;
  }

  /**
   * Guarda agrega un objeto array
   * @param {string} obj
   * @returns Id del objeto guardado
   */
  async createCart() {
    try {
        //chequeo que el archivo exista si no existe lo creo
         await fileChecker(this.fileName);
      let obj = {};
      let array = await fileToArray(this.fileName);
      let longitud = array.length;
      let index = 0;
      //Valido que el array tenga objetos
      if (longitud == 0) {
        index = 1;
      } else {
        //sumar uno al id del ultimo elemento y agregarlo al id del objeto
        index = array[longitud - 1].id + 1;
      }

      obj.id = index;
      console.log(array);
      array.push(obj);
      console.log(array);
      //escribir archivo
      await arrayToFile(this.fileName, array);
      //devolver id
      return obj.id;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Selecciona un objeto del archivo y lo devuleve
   * @param {int} id
   * @returns Devuelve el objeto si lo encuentra
   */
   async getCartById(id) {
    try {

       //chequeo que el archivo exista si no existe lo creo
       await fileChecker(this.fileName);

      let array = await fileToArray(this.fileName);

      array = array.filter((x) => {
        return x.id == id;
      });

      if (array[0] == undefined) {
        return { error: "Carrito no encontrado" };
      } else {
        return array;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Selecciona un objeto del archivo y lo devuleve
   * @param {int} id
   * @returns Devuelve el objeto si lo encuentra
   */
  async addProdTCartById(obj) {
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
        console.log('intenta insertar producto')

        if (!array[objIndex].productos ||  array[objIndex].productos.length == 0){
            console.log('crea array de productos vacio')
         array[objIndex].productos = new Array();
        }
        
        let objCart = {id: obj.productId};

        array[objIndex].productos.push(objCart);


        await arrayToFile(this.fileName, array);
        return { estado: "Carrito actualizado" };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @returns Devuelve todos los objetos del array
   */
  async getAll() {
    try {
      await fileChecker(this.fileName);
      return  fileToArray(this.fileName);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Borra el objeto con le id seleccionado en el array
   * @param {int} id
   */
  async deleteCartById(id) {
    try {
      await fileChecker(this.fileName);
     
      let array = await fileToArray(this.fileName);
     
      let obj = this.getCartById(id);
      console.log(obj.error != "");

      if (obj.error == "") {
        return obj;
      } else {
        array = array.filter((x) => {
          return x.id != id;
        });
        await arrayToFile(this.fileName, array);
        return { idDeleted: id };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Borra el objeto con le id seleccionado en el array
   * @param {int} id
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
        console.log('intenta borrar producto');
        console.log(obj.productId);
     
        console.log('guardo productos en array');
        let arrayCart =  array[objIndex].productos
        console.log(arrayCart);
       
        console.log('filtro productos en array');
        arrayCart = arrayCart.filter((x) => {
            return x.id != obj.productId;
          });
        console.log(arrayCart);
        console.log('inserto productos en array.productos');
        array[objIndex].productos = arrayCart;
        console.log('guardo array');
        console.log(array);
        await arrayToFile(this.fileName, array);
        return { estado: "Carrito actualizado" };
      }
    } catch (error) {
      throw error;
    }
  }


  /**
   * Borra todos los objetos del archivo llamado a createEmptyFile(this.fileName)
   */
   async deleteAll() {
    await createEmptyFile(this.fileName);
  }
};






async function main(){

    let carritos = new cartContainer('carritos.txt');

    let obj = {id: 1, productId:4};


    await carritos.createCart();

    await carritos.addProdTCartById(obj);
    
     obj = {id: 1, productId:4};

    await carritos.deleteProductoToCartById(obj);



};

main();