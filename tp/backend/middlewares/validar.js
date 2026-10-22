import { AppError } from "../errors/AppError.js";

export function validar(esquema, origen = "body") {
  return (req, res, next) => {
    const resultado = esquema.safeParse(req[origen]);

    if (!resultado.success) {
      const detalles = resultado.error.issues.map((problema) => ({
        campo: problema.path.join("."),
        mensaje: problema.message
      }));
      throw new AppError(400, "Revisá los datos enviados", detalles);
    }

    req.validado = { ...req.validado, [origen]: resultado.data };
    next();
  };
}