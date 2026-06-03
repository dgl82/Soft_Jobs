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

const registrarUsuario = async (usuario) => {
  try {
    //Recibimos los datos de registro en un objeto llamado usuario
    let { email, password, rol, lenguage } = usuario; //Extraemos los datos email, password, rol y lenguaje
    const passwordEncriptada = bcrypt.hashSync(password); //Encriptamos la contraseña con el paquete bcryptjs
    password = passwordEncriptada; //Actualizamos la contraseña escrita por el usuario con la contraseña encriptada
    const values = [email, passwordEncriptada, rol, lenguage]; //Guardamos en arreglo values los datos que se parametrizan en la consulta
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)"; //Consulta SQL parametrizada para guardar datos en la base de datos
    await pool.query(consulta, values); //Realizamos la consulta a la BD
  } catch (error) {
    console.error("Error al registrar usuario en la base de datos:", error.message); //Mostramos un mensaje por consola con el detalle del error
    throw error; //Devolvemos el error a la API para que responda con el mensaje 500 de la cláusula error de la ruta GET
  }
};
