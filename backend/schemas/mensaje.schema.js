import { z } from "zod";
import { reservaParamSchema } from "./equipo.schema.js";

export const LARGO_MAXIMO_MENSAJE = 500;

const idPositivo = (nombre) =>
  z.coerce
    .number({ error: `${nombre} no es válido, tiene que ser un número` })
    .int(`${nombre} no es válido, tiene que ser entero`)
    .positive(`${nombre} no es válido, tiene que ser mayor a cero`);

// La reserva (y su chat) viene en la URL; en el body, quién escribe y qué
export const mensajeSchema = z.object({
  id_usuario: z.number().int().positive(),
  contenido: z.string().trim().min(1, "El mensaje no puede estar vacío").max(LARGO_MAXIMO_MENSAJE)
});

// Para GET (sin body): quién pide va en la query. despues_de trae solo los mensajes más nuevos que ese id
export const filtrosMensajeSchema = z.object({
  id_usuario: idPositivo("El id de usuario"),
  despues_de: idPositivo("El id del mensaje").optional()
});

export { reservaParamSchema };
