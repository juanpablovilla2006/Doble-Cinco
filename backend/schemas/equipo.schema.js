import { z } from "zod";

const idPositivo = (nombre) =>
  z.coerce
    .number({ error: `${nombre} no es válido, tiene que ser un número` })
    .int(`${nombre} no es válido, tiene que ser entero`)
    .positive(`${nombre} no es válido, tiene que ser mayor a cero`);

// La reserva a la que pertenece el equipo viene en la URL, no en el body
export const equipoSchema = z.object({
  tipo: z.string().trim().min(1).max(30)
});

export const editarEquipoSchema = equipoSchema;

export const participanteSchema = z.object({
  id_usuario: z.number().int().positive()
});

export const reservaParamSchema = z.object({
  idReserva: idPositivo("El id de reserva")
});

export const equipoParamSchema = reservaParamSchema.extend({
  id: idPositivo("El id de equipo")
});

export const equipoUsuarioParamSchema = equipoParamSchema.extend({
  idUsuario: idPositivo("El id de usuario")
});
