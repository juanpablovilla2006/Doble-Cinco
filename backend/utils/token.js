import "dotenv/config";
import jwt from "jsonwebtoken";

const DURACION = "7d";

if (!process.env.JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en el archivo .env del backend");
}

// El token guarda solo lo necesario para saber quién es y qué rol tiene
export function crearToken(usuario) {
  return jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: DURACION });
}

// Devuelve { id, rol } o lanza un error si el token es falso, está alterado o venció
export function verificarToken(token) {
  const { id, rol } = jwt.verify(token, process.env.JWT_SECRET);
  return { id, rol };
}