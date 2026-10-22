import { AppError } from "../errors/AppError.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      mensaje: err.message,
      detalles: err.detalles
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ mensaje: "El JSON enviado no es válido" });
  }

  console.error(err);
  res.status(500).json({ mensaje: "Error interno del servidor" });
}