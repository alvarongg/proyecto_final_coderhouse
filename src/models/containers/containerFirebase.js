console.log("Container Firebase -- Cargado");
const path = require("path");
const config_path = path.join(__dirname, ".", "config", "coder-firebase.json");
let admin = require("firebase-admin");

let serviceAccount = require(config_path);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coder-backend-26f3f-default-rtdb.firebaseio.com",
});


module.exports = class ContenedorFb {
  constructor(db) {
    this.db = admin.firestore();
    this.query = this.db.collection(db);
  }

  /**
   * Guarda un objeto a firebase
   * @param {string} obj
   * @returns Id del objeto guardado
   */
  async saveObject(obj) {
    try {
      console.log("entro a saveObject");
      let result = await this.query.orderBy("id_interno",'desc').limit(1).get();
      const id_max = result.docs.map((doc) => doc.data());

      let index = 0;
      //Valido que la tabla tenga objetos
      if (id_max[0].id_interno == 0) {
        index = 1;
      } else {
        //sumar uno al id del ultimo elemento y agregarlo al id del objeto
        index = id_max[0].id_interno + 1;
      }

      obj.id_interno = index;
      //escribir firebase
      console.log(obj);
      await this.query.add(obj);
      //devolver id
      return obj.id_interno;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Selecciona un objeto de firebase y lo devuleve
   * @param {int} id
   * @returns Devuelve el objeto si lo encuentra
   */
  async getObjectById(id) {
    try {
      console.log('Buscando id: ',id);
      const products = await this.query.where("id_interno", "==", id).get();
      const result = products.docs.map((doc) => doc.data());

      if (!result.length) {
        return { error: "Objeto no encontrado" };
      } else {
        return products.docs.map((doc) => doc.data());
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @returns Devuelve todos los objetos del la coleccion
   */
  async getAll() {
    try {
      const products = await this.query.get();
      const result = products.docs.map((doc) => doc.data());

      if (!result.length) {
        return { error: "Objeto no encontrado" };
      } else {
        return products.docs.map((doc) => doc.data());
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Recibe un objeto y updatea el id del producto
   * @param {int} id
   * @returns el objeto actualizado
   */
  async updateById(obj) {
    try {

     await  this.query
      .where("id_interno", "==", obj.id_interno)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            console.log(doc.id, " => ", doc.data());
            doc.ref.update(obj);
          });
        });

      return obj;
    } catch (error) {
      throw error;
    }
  }

  /** Recibe un id y lo borra de la collecion en firebase
   * @param {int} id
   */
  async deleteById(id_interno) {
    try {
  
        await  this.query
        .where("id_interno", "==", id_interno)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              console.log(doc.id, " => ", doc.data());
              doc.ref.delete();
            });
          });

    } catch (error) {
      throw error;
    }
  }
}

// const probar = async () => {
//   const container = new ContenedorFb("carrito");

//   let obj = {};

//   obj.timestamp = Date.now();
//   obj.productos = [2];
//   obj.id_interno = 2;

//   console.log(await container.getAll());

//   console.log(await container.deleteById(2));
// };

// probar();
