//Middleware para verificar la existencia del correo en BD

const verificarCredenciales = (req, res, next) => {
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

  next(); //La función del middleware permite que la función que la llamó continúe con su ejecución
};

// Exportamos la función
module.exports = { verificarCredenciales };
