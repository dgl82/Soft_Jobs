const bcrypt = require("bcryptjs"); //Importamos paquete de encriptación para las contraseñas
const { Pool } = require("pg"); //Importamos la clase pool del paquete pg
const jwt = require("jsonwebtoken"); //Importamos el paquete jsonwebtoken

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
      //Comprobamos si el usuario existe. Si no existe (rowcount = 0) se detiene la ruta que llama el middleware con return
      return res.status(401).json({ message: "Email o contraseña incorrecta" }); //Respondemos mensaje 401 (No autorizado) y mensaje sin dar pistas
    }
    //Si rowcount = 1 extraemos la contraseña encriptada del objeto respondido por la BD y la renombramos a "passwordEncriptada"
    const { password: passwordEncriptada } = usuario; //Extraemos el password encriptado de la respuesta de la consulta y lo renombramos
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada); //Comparamos el password introducido por el usuario con el encriptado en BD

    if (!passwordEsCorrecta) {
      //Si el resultado de la operación anterior es "False" el middleware detiene la ruta que lo llamó
      return res.status(401).json({ message: "Email o contraseña incorrecta" }); //Respondemos mensaje 401 (No autorizado) y mensaje sin dar pistas
    }

    next(); //Damos continuidad a la ruta que llamó el middleware
  } catch (error) {
    console.error("Error en el middleware verificarCredenciales", error); //Mostramos error en consola del servidor
    return res.status(500).json({ message: "Error interno del servidor" }); //Interrumpimos la ruta que llamó el middleware y devolvemos error 500 con mensaje
  }
};

//Middleware para verificar la existencia de credenciales en BD en registro usuario

const verificarEmailExistente = async (req, res, next) => {
  try {
    const { email } = req.body; //Extraemos el email del body de la solicitud de registro
    const consulta = "SELECT * FROM usuarios WHERE email = $1"; //Declaramos la consulta SQL a la BD
    const { rowCount } = await pool.query(consulta, [email]); //Extraemos rowcount de la respuesta para saber si existe "=1" o no "=0"

    if (rowCount > 0) {
      //Si rowcount es 1, el correo ya existe
      return res.status(400).json({ message: "El usuario ya está registrado" }); //Interrumpimos la ruta que llamó el middleware y devolvemos error 400 (petición incorrecta) y mensaje JDON
    }

    next(); //Si el correo no existe, la ruta que llamó el middleware continúa
  } catch (error) {
    console.error("Error en el middleware verificarEmailExistente", error); //Mostramos error en consola del servidor
    return res.status(500).json({ message: "Error interno del servidor" }); //Interrumpimos la ruta que llamó el middleware y devolvemos error 500 con mensaje
  }
};

//Middleware para validar el token

const validarToken = (req, res, next) => {
  try {
    const Authorization = req.header("Authorization"); //Accedemos al header "authorization"
    const token = Authorization.split("Bearer ")[1]; //Extraemos el token de la cabecera de la solicitud
    jwt.verify(token, "llave_secreta"); //Verificamos el token
    const { email } = jwt.decode(token); //Decodificamos el token y extraemos el payload (email)
    req.emailUsuario = email; // Pasamos el email de contrabando hacia la ruta
    next(); //Damos continuidad a la ruta que llamó el middleware
  } catch (error) {
    //Si el proceso de validación del token falla
    console.error("Error en el middleware validarToken", error.message); //Mostramos error en consola del servidor
    return res.status(401).json({ message: "Token inválido o expirado" }); //Interrumpimos la ruta que llamó el middleware y devolvemos error 500 con mensaje
  }
};
// Exportamos los middlewares
module.exports = { verificarCredenciales, verificarEmailExistente, validarToken };
