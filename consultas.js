//Importamos la clase Pool del paquete pg

const { Pool } = require("pg");

//Importamos el paquete pg-format

const format = require("pg-format");

//Importamos el paquete "dotenv"

require("dotenv").config();

//Creamos una instancia de la clase Pool usando un objeto de configuración con variables de entorno del archivo .env

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  allowExitOnIdle: process.env.DB_ALLOW_EXIT === "true",
});

//Funciones para consultas SQL
