


  // const mongo = new MongoClient("mongodb+srv://richard:coder.richard@cluster0.rmt0y.mongodb.net/?retryWrites=true&w=majority");
  // await mongo.connect();
  // await mongo.db("comercio").collection("usuarios").insert({nombre: "Otro", apellido: "Usuario", dni: "37124321"});
  // console.log('Ingresado correctamente');
  // //const resultados = await mongo.db("comercio").collection("usuarios").find().toArray();
  // //console.log(resultados);

  module import mongoose from "mongoose";
  const Schema = mongoose.Schema;

const schema = new Schema(
  {
    title:  String,
    price: Number,
    thumbnail: String,
    stock: Number
  }
);


// module.exports =
 class ContenedorMongoDB {
  constructor(collection) {
    this.mongo =  "mongodb+srv://admincoder:ROR1XEuz3f2ziDbZ@cluster-coderhouse.xmxgb1s.mongodb.net/ecommerce?retryWrites=true&w=majority";
    this.db = 'ecommerce';
    this.collection = collection;
  }

  /**
   * Guarda un objeto a mongo
   * @param {string} obj
   * @returns Id del objeto guardado
   */
  async saveObject(obj) {
    try {
      let id_max = await this.mongo.db(this.db).collection(this.collection).find().sort({id:-1}).limit(1);
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
      await await this.mongo.db(this.db).collection(this.collection).insertOne(obj);
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
  async getObjectById(fId) {
    try {
      const product = await this.mongo.collection(this.collection).find( {id: fId});
 

      if (!product.length) {
        return { error: "Objeto no encontrado" };
      } else {
        return product;
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
      console.log('conecto a mongo');
      console.log(this.mongo);
      mongoose.connect(
        this.mongo
      );
      console.log('conecto a modelo');
      const moodelo = mongoose.model(this.collection, schema);

      console.log('ejecuto query');
      const products = await moodelo.find();
      console.log(products);
      if (!products.length) {
        return { error: "Objeto no encontrado" };
      } else {
        return products;
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
      await this.mongo.db(this.db).collection(this.collection).updateMany( { id: obj.id},  { $set: obj } );
      return obj;
    } catch (error) {
      throw error;
    }
  }

   /** Recibe un id y lo borra de la collecion en firebase
   * @param {int} id
   */
  async deleteById(fId) {
    try {
      await this.mongo.db(this.db).collection(this.collection).deleteMany( { id: fId} );
    } catch (error) {
      throw error;
    }
  }
}

// const probar = async () => {
//   const firebase = new ContenedorFb("productos");

//   console.log(await firebase.getObjectById(2));
//   console.log(await firebase.getAll());
// };

// probar();



const probar = async () => {
  const bd = new ContenedorMongoDB("productos");

  await bd.getAll();

};

probar();