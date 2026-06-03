const bcrypt = require("bcryptjs"); //Importamos paquete de encriptación para las contraseñas
const { Pool } = require("pg"); //Importamos la clase pool del paquete pg

//Creamos una instancia de la clase Pool usando un objeto de configuración con variables de entorno del archivo .env
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  allowExitOnIdle: process.env.DB_ALLOW_EXIT === "true",
});

//Middleware para verificar la existencia de credenciales en BD en login

const verificarCredenciales = async (req, res, next) => {
  try {
    const { email, password } = req.body; //Capturamos el email y password del body
    const values = [email]; //Guardamos el email como value para usarlo como valor parametrizado
    const consulta = "SELECT * FROM usuarios WHERE email = $1"; //Consulta a BD por el email ingresado
    //Extraemos el primer objeto de la respuesta y la cantidad de registros de la respuesta de la consulta
    const {
      rows: [usuario],
      rowCount,
    } = await pool.query(consulta, values);

    if (!rowCount) {
      //Comprobamos si el usuario existe. Si no existe (rowcount = 0) se detiene la función que llama el middleware con return
      return res.status(401).json({ message: "Email o contraseña incorrecta" }); //Respondemos mensaje 401 (No autorizado) y mensaje sin dar pistas
    }
    //Extraemos la contraseña encriptada del objeto respondido por la BD y la renombramos a "passwordEncriptada"
    const { password: passwordEncriptada } = usuario;
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada); //Comparamos el password introducido por el usuario con el encriptado en BD

    if (!passwordEsCorrecta) {
      //Si el resultado de la operación anterior es "False" el middleware detiene la función que lo llamó
      return res.status(401).json({ message: "Email o contraseña incorrecta" }); //Respondemos mensaje 401 (No autorizado) y mensaje sin dar pistas
    }

    next(); //Damos continuidad a la función que llamó el middleware
  } catch (error) {
    console.error("Error en el middleware de credenciales:", error); //Mostramos error en consola del servidor
    return res.status(500).json({ message: "Error interno del servidor" }); //Interrumpimos la función que llamó el middleware y devolvemos error 500 con mensaje
  }
};

////////////////////////////////////////////////////
const verificarRegistro = (req, res, next) => {
  const { email, password, rol, lenguage } = req.body; //Capturamos los datos enviados por el usuario

  if (
    //Comprobaciones de credenciales
    !email || //Si el dato email no viene en la solicitud
    !password || //O no viene el password
    !rol || //O no viene el rol
    !lenguage || //O no viene el lenguage
    email.trim() === "" || //O el email está vacío
    password.trim() === "" || //O el password está vacío
    rol === "Seleccione un rol" || //O el usuario no seleccionó ninguna opción del desplegable rol
    lenguage === "Seleccione un Lenguage" //O el usuario no seleccionó ninguna opción del desplegable lenguage
  ) {
    //Si alguna condición se cumple, se manda de vuelta error 400 (petición incorrecta) y mensaje en formato JSON
    //Se agrega return para que detenga la función en que se usa este middleware
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  next(); //Permitimos que la función que llamó éste middleware continúe con su ejecución
};

//Middleware para verificar la existencia de credenciales en login

const verificarLogin = (req, res, next) => {
  const { email, password } = req.body; //Capturamos los datos enviados por el usuario

  //Sólo validamos existencia de email y password y que no estén vacíos en el login
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    //Si alguna condición se cumple, se manda de vuelta error 400 (petición incorrecta) y mensaje en formato JSON
    //Se agrega return para que detenga la función en que se usa este middleware
    return res.status(400).json({ message: "Email y contraseña son obligatorios." });
  }

  next(); //Permitimos que la función que llamó éste middleware continúe con su ejecución
};

// Exportamos los middlewares
module.exports = { verificarCredenciales };
