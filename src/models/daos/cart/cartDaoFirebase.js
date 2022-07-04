const path = require('path');
let archivo_path = path.join(__dirname, '..','..', '/containers/containerFirebase.js');

const ContainerFirebase = require(archivo_path);


module.exports =  class CartDaoFirebase extends ContainerFirebase {

    constructor(){
        super('carritos');
    }



}