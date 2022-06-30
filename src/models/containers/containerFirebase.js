const path = require("path");
const config_path = path.join(__dirname, ".", "config", "coder-firebase.json");
let admin = require("firebase-admin");

let serviceAccount = require(config_path);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coder-backend-26f3f-default-rtdb.firebaseio.com/",
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
      let id_max = await this.query.get().orderBy("id", desc).limit(1);
      let index = 0;
      //Valido que la tabla tenga objetos
      if (id_max == 0) {
        index = 1;
      } else {
        //sumar uno al id del ultimo elemento y agregarlo al id del objeto
        index = id_max + 1;
      }

      obj.id = index;
      //escribir firebase
      await this.query.create(obj);
      //devolver id
      return obj.id;
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
      const products = await this.query.where("id", "==", id).get();
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
      await this.query
        .doc(obj.id)
        .update(obj)
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
      return obj;
    } catch (error) {
      throw error;
    }
  }

   /** Recibe un id y lo borra de la collecion en firebase
   * @param {int} id
   */
  async deleteById(id) {
    try {
      await this.query
        .doc(id)
        .delete()
        .catch((error) => {
          console.error("Error deleting document: ", error);
        });
    } catch (error) {
      throw error;
    }
  }
}

