import { z } from "zod";
import { DURACION_MINIMA, MINUTOS_POR_PASO, esHorarioDeTurno, minutosEntre } from "../utils/horarios.js";

// Valores posibles de reserva.estado_reserva (la columna es un varchar libre)
export const ESTADOS_RESERVA = ["pendiente", "confirmada", "cancelada"];

const fecha = z.iso.date("El día tiene que tener formato YYYY-MM-DD");

// Acepta HH:MM o HH:MM:SS y lo normaliza a HH:MM:SS, así se puede comparar como string
export const hora = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, "El horario tiene que tener formato HH:MM")
  .transform((valor) => (valor.length === 5 ? `${valor}:00` : valor));

const idPositivo = (nombre) =>
  z.coerce
    .number({ error: `${nombre} no es válido, tiene que ser un número` })
    .int(`${nombre} no es válido, tiene que ser entero`)
    .positive(`${nombre} no es válido, tiene que ser mayor a cero`);

// Horario de un turno: además del formato, tiene que ir de a 15 minutos (00, 15, 30 o 45)
export const horaDeTurno = hora.refine(esHorarioDeTurno,
  `El horario tiene que ser de a ${MINUTOS_POR_PASO} minutos (minutos 00, 15, 30 o 45)`
);

// Fin posterior al inicio y duración mínima. Se usa con .superRefine sobre cualquier schema con horario_inicio y horario_fin
export function validarTurno(turno, ctx) {
  if (!turno.horario_inicio || !turno.horario_fin) {
    return;
  }

  const duracion = minutosEntre(turno.horario_inicio, turno.horario_fin);

  if (duracion <= 0) {
    ctx.addIssue({ code: "custom", message: "El horario de fin tiene que ser posterior al de inicio", path: ["horario_fin"] });
  } else if (duracion < DURACION_MINIMA) {
    ctx.addIssue({ code: "custom", message: "La reserva tiene que durar al menos 1 hora", path: ["horario_fin"] });
  }
}
// Base sin refinamientos: en zod 4 no se puede hacer partial/omit sobre un schema refinado
const reservaBase = z.object({
  numero_cancha: z.number().int().positive(),
  id_creador: z.number().int().positive(),
  dia: fecha,
  horario_inicio: hora,
  horario_fin: hora,
  visibilidad: z.boolean(),
  estado_reserva: z.enum(ESTADOS_RESERVA),
  estado_pago: z.boolean()
});

// Al crear, precio, estado, pago y código de invitación los define el sistema
export const reservaSchema = reservaBase
  .omit({ estado_reserva: true, estado_pago: true })
  .extend({ visibilidad: z.boolean().default(false) })
  .superRefine(validarTurno);

// Al editar todo es opcional y el creador no se puede cambiar
export const editarReservaSchema = reservaBase
  .omit({ id_creador: true })
  .partial()
  .superRefine(validarTurno);

export const filtrosReservaSchema = z.object({
  dia: fecha.optional(),
  estado_reserva: z.enum(ESTADOS_RESERVA).optional(),
  visibilidad: z
    .enum(["true", "false"])
    .transform((valor) => valor === "true")
    .optional(),
  numero_cancha: idPositivo("El número de cancha").optional(),
  id_creador: idPositivo("El id del creador").optional()
});

export const idParamSchema = z.object({
  id: idPositivo("El id de reserva")
});

export const participanteParamSchema = idParamSchema.extend({
  idUsuario: idPositivo("El id de usuario")
});
