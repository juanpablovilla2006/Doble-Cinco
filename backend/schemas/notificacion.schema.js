import { z } from "zod";

const idPositivo = (nombre) =>
  z.coerce
    .number({ error: `${nombre} no es válido, tiene que ser un número` })
    .int(`${nombre} no es válido, tiene que ser entero`)
    .positive(`${nombre} no es válido, tiene que ser mayor a cero`);

// Quién pide va en la query (GET y DELETE no llevan body)
export const usuarioQuerySchema = z.object({
  id_usuario: idPositivo("El id de usuario")
});

export const notificacionParamSchema = z.object({
  id: idPositivo("El id de notificación")
});
