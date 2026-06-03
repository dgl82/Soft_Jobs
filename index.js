const express = require("express"); //Importamos el paquete express
const morgan = require("morgan"); //Importamos librería morgan
const cors = require("cors"); //Importamos el paquete cors
require("dotenv").config(); //Cargamos las variables del .env
const app = express(); //Asignamos la instancia de express a la constante app
const puerto = process.env.PORT || 3000; //Definimos el puerto de escucha del servidor con la variables ocnfigurada en archivo .env o 3000 por defecto.
const jwt = require("jsonwebtoken"); //Importamos el paquete jsonwebtoken
const { registrarUsuario } = require("./consultas"); //Importamos las funciones del archivo consultas.js
const { verificarCredenciales } = require("./middlewares"); //Importamos middlewares

//middlewares
app.use(cors()); //Habilitamos cors
app.use(express.json()); //Habilitamos el parseo de datos JSON
app.use(morgan("dev")); //Habilitamos el middleware morgan

//Creamos el puerto de escucha
app.listen(puerto, console.log(`Servidor encendido escuchando puerto ${puerto}`));

//Rutas de consultas

//Ruta POST para registrar usuarios
app.post("/usuarios", verificarCredenciales, async (req, res) => {
  try {
    const usuario = req.body; //Capturamos los datos enviados por el usuario
    await registrarUsuario(usuario); //Llamamos a la función enviando los datos de registro
    res.status(201).send("Usuario creado con éxito"); //Respondemos con código 201 de "creado" y un mensaje
  } catch (error) {
    console.log(error); //Mostramos el error devuelto por la BD en consola
    return res.status(500).json({ message: "Internal server error" }); //Respondemos al frontend con el mensaje 500 y un mensaje en formato JSON
  }
});
