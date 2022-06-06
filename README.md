# Proyecto Final Curso Backend CoderHouse 2022



## Despliegue 📦

> Cada proyecto esta configurado para ejecutarse en un puerto distinto lo que nos permite es tener corriendo los 3 a la vez 8080=hbs 8081=pug 8082=ejs

* Instalacion de depedencias
```bash
npm i 
```
* Ejecucion del proyecto handlebars (se ejecuta en puerto 8080)
```bash
npm run start
```

## Web Endpoits 

* [Web Productos](http://localhost8080/productos)
* [Web Carrito](http://localhost8080/carrito)

## API Endpoint Producto
* GET http://localhost8080/api/productos -- Me permite listar todos los productos disponibles (disponible para usuarios y administradores)
* GET http://localhost8080/api/productos/:id --  Me permite listar un producto por su id (disponible para usuarios y administradores)
* POST http://localhost8080/api/productos -- Para incorporar productos al listado (disponible para administradores)
* PUT http://localhost8080/api/productos/:id -- Actualiza un producto por su id (disponible para administradores)
* DELETE http://localhost8080/api/productos/:id -- Borra un producto por su id (disponible para administradores)

## API Endpoint Carrito
* x POST http://localhost8080/api/carrito -- Crea un carrito y devuelve su id. 
* x DELETE http://localhost8080/api/carrito/:id -- Vacía un carrito y lo elimina.
* x GET http://localhost8080/api/carrito/:id/productos -- Me permite listar todos los productos guardados en el carrito
* x POST http://localhost8080/api/carrito/:id/productos -- Para incorporar productos al carrito por su id de producto
* x DELETE http://localhost8080/api/carrito/:id/productos -- Eliminar un producto del carrito por su id de carrito y de producto

## Construido con 🛠️

* [Express🛰️](https://expressjs.com/es/4x/api.html)
* [Moment.js](https://momentjs.com)


