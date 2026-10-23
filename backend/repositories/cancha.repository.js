import { eq, and , gt, lt, ne, notExists, sql } from "drizzle-orm";
import { db } from "../db/conexion.js";
import { cancha, reserva } from "../db/schema.js";

export function listar() {
  return db.select().from(cancha);
}

export async function buscarPorNumero(numero) {
  const [fila] = await db.select().from(cancha).where(eq(cancha.numero, numero));
  return fila ?? null;
}

export async function crear(datos) {
  await db.insert(cancha).values(datos);
}

export async function actualizar(numero, datos) {
  await db.update(cancha).set(datos).where(eq(cancha.numero, numero));
}

export async function eliminar(numero) {
  await db.delete(cancha).where(eq(cancha.numero, numero));
}

export function listarDisponibles({ dia, horario_inicio, horario_fin, tipo }) {
  const condiciones = [
    eq(cancha.habilitada, true),
    notExists(
      db
        .select({ uno: sql`1` })
        .from(reserva)
        .where(
          and(
            eq(reserva.numero_cancha, cancha.numero),
            eq(reserva.dia, dia),
            ne(reserva.estado_reserva, "cancelada"),
            lt(reserva.horario_inicio, horario_fin),
            gt(reserva.horario_fin, horario_inicio)
          )
        )
    )
  ];

  if (tipo) condiciones.push(eq(cancha.tipo, tipo));

  return db.select().from(cancha).where(and(...condiciones));
}