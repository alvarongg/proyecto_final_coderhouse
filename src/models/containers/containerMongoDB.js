// const mongo = new MongoClient("mongodb+srv://richard:coder.richard@cluster0.rmt0y.mongodb.net/?retryWrites=true&w=majority");
// await mongo.connect();
// await mongo.db("comercio").collection("usuarios").insert({nombre: "Otro", apellido: "Usuario", dni: "37124321"});
// console.log('Ingresado correctamente');
// //const resultados = await mongo.db("comercio").collection("usuarios").find().toArray();
// //console.log(resultados);
console.log("pruebas");
const mongoose = require("mongoose");
const { createPoolCluster } = require("mysql2");

const Schema = mongoose.Schema;

// module.exports =
class ContenedorMongoDB {
  constructor(collection) {
    this.mongo =
      "mongodb+srv://admincoder:ROR1XEuz3f2ziDbZ@cluster-coderhouse.xmxgb1s.mongodb.net/ecommerce?retryWrites=true&w=majority";
    this.db = "ecommerce";
    this.collection = collection;
    this.schema = new Schema({
      title: String,
      price: Number,
      thumbnail: String,
      stock: Number,
      id_interno: Number,
    });
  }

  /**
   * Guarda un objeto a mongo
   * @param {string} obj
   * @returns Id del objeto guardado
   */
  async saveObject(obj) {
    try {
      await mongoose.connect(
        this.mongo,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log("Connected");
          }
        }
      );

      const moodelo = mongoose.model(this.collection, this.schema);

      const id_max = await moodelo
        .findOne({})
        .select("id_interno")
        .sort({ id_interno: -1 })
        .limit(1);
      console.log(id_max);
      let index = 1;

      //Valido que la tabla tenga objetos
      if (id_max.id_interno !== undefined) {
        //sumar uno al id del ultimo elemento y agregarlo al id del objeto
        index = id_max.id_interno + 1;
      }

      obj.id_interno = index;
      console.log(obj);
      //escribir en MongoDB
      const objAguardar = new moodelo(obj);
      await objAguardar.save();

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
      await mongoose.connect(
        this.mongo,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log("Connected");
          }
        }
      );

      const moodelo = mongoose.model(this.collection, this.schema);

      const product = await moodelo.findOne({ id_interno: fId });
      console.log(product);
      if (!product) {
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
      console.log(this.mongo);
      await mongoose.connect(
        this.mongo,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log("Connected");
          }
        }
      );

      const moodelo = mongoose.model(this.collection, this.schema);

      console.log("ejecuto query");
      const products = await moodelo.find({}).exec();

      console.log(products);
      console.log(!products.length);
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
      await mongoose.connect(
        this.mongo,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log("Connected");
          }
        }
      );

      const moodelo = mongoose.model(this.collection, this.schema);

      await moodelo.updateOne({ id_interno: obj.id_interno }, { $set: obj });
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
      await mongoose.connect(
        this.mongo,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log("Connected");
          }
        }
      );

      const moodelo = mongoose.model(this.collection, this.schema);

      await moodelo.deleteMany({ id_interno: fId });
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

  //console.log(await bd.getAll());

  obj = {
    title: "Producto_modificado",
    price: 9.99,
    thumbnail: "http>//productoprueba",
    stock: 100,
    id_interno: 5,
  };

  // console.log(await bd.saveObject(obj));

  console.log(await bd.deleteById(4));
};

probar();
