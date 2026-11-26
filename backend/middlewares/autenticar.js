import { AppError } from "../errors/AppError.js";
import { verificarToken } from "../utils/token.js";

// Exige un token válido en el header "Authorization: Bearer <token>".
// Si está bien, deja al usuario en req.usuario ({ id, rol })
export function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization ?? "").split(" ");

  if (tipo !== "Bearer" || !token) {
    throw new AppError(401, "Tenés que iniciar sesión");
  }

  try {
    req.usuario = verificarToken(token);
  } catch {
    throw new AppError(401, "La sesión no es válida o venció, volvé a iniciar sesión");
  }

  next();
}

// Se usa después de autenticar: solo deja pasar a los administradores
export function soloAdmin(req, res, next) {
  if (req.usuario.rol !== "admin") {
    throw new AppError(403, "No tenés permisos para hacer esto");
  }

  next();
}