import { z } from "zod";
import {hora} from "./reserva.schema.js";
 
export const canchaSchema = z.object({
  numero: z.number().int().positive(),
  tipo: z.string().trim().min(1).max(30),
  capacidad: z.number().int().positive(),
  precio: z.number().min(0),
  habilitada: z.boolean().default(true)
});

export const editarCanchaSchema = canchaSchema.omit({ numero: true });

export const numeroParamSchema = z.object({
  numero: z.coerce
    .number({ error: "El número de cancha no es válido, tiene que ser un número" })
    .int("El número de cancha no es válido, tiene que ser entero")
    .positive("El número de cancha no es válido, tiene que ser mayor a cero")
});

export const disponiblesQuerySchema = z
  .object({
    dia: z.iso.date(),
    horario_inicio: hora,
    horario_fin: hora,
    tipo: z.string().trim().min(1).max(30).optional()
  })
  .refine((q) => q.horario_inicio < q.horario_fin, {
    message: "El horario de inicio debe ser anterior al de fin",
    path: ["horario_fin"]
  });