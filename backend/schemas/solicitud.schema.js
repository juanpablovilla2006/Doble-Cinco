import { z } from "zod";
import { reservaParamSchema } from "./equipo.schema.js";

// Valores posibles de solicitud.estado (coinciden con el enum de la tabla)
export const ESTADOS_SOLICITUD = ["pendiente", "aceptada", "rechazada"];

const idPositivo = (nombre) =>
  z.coerce
    .number({ error: `${nombre} no es válido, tiene que ser un número` })
    .int(`${nombre} no es válido, tiene que ser entero`)
    .positive(`${nombre} no es válido, tiene que ser mayor a cero`);

// La reserva viene en la URL; en el body solo viene quién pide unirse
export const solicitudSchema = z.object({
  id_usuario: z.number().int().positive()
});

// Quien resuelve se identifica con id_usuario; el service verifica que sea el creador
export const resolverSolicitudSchema = z.object({
  id_usuario: z.number().int().positive(),
  estado: z.enum(["aceptada", "rechazada"])
});

// Para GET y DELETE (sin body): quién hace el pedido va en la query
export const actorQuerySchema = z.object({
  id_usuario: idPositivo("El id de usuario")
});

export const filtrosSolicitudSchema = actorQuerySchema.extend({
  estado: z.enum(ESTADOS_SOLICITUD).optional()
});

export const solicitudParamSchema = reservaParamSchema.extend({
  id: idPositivo("El id de solicitud")
});

export { reservaParamSchema };
