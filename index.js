const express = require("express"); //Importamos el paquete express
const morgan = require("morgan"); //Importamos librería morgan
const cors = require("cors"); //Importamos el paquete cors
require("dotenv").config(); //Cargamos las variables del .env
const app = express(); //Asignamos la instancia de express a la constante app
const puerto = process.env.PORT || 3000; //Definimos el puerto de escucha del servidor con la variables ocnfigurada en archivo .env o 3000 por defecto.
const { obtenerJoyas, obtenerJoyasConFiltros, prepararHATEOAS } = require("./consultas"); //Importamos las funciones del archivo consultas.js
const jwt = require("jsonwebtoken"); //Importamos el paquete jsonwebtoken

//middlewares
app.use(cors()); //Habilitamos cors
app.use(express.json()); //Habilitamos el parseo de datos JSON
app.use(morgan("dev")); //Habilitamos el middleware morgan

//Creamos el puerto de escucha
app.listen(puerto, console.log(`Servidor encendido escuchando puerto ${puerto}`));

//Rutas de consultas
