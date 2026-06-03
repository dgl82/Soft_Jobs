const { Pool } = require("pg"); //Importamos la clase Pool del paquete pg
const format = require("pg-format"); //Importamos el paquete pg-format
require("dotenv").config(); //Importamos el paquete "dotenv"
const bcrypt = require("bcryptjs"); //Importamos el paquete bcrypt para encriptar contraseñas

//Creamos una instancia de la clase Pool usando un objeto de configuración con variables de entorno del archivo .env

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  allowExitOnIdle: process.env.DB_ALLOW_EXIT === "true",
});

//Funciones para consultas SQL

//Función para registrar usuarios con password encriptado
