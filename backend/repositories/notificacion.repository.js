import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../db/conexion.js";
import { notificacion } from "../db/schema.js";

// Cuántas notificaciones se devuelven como máximo (las más recientes)
const LIMITE = 50;

export function listarPorUsuario(idUsuario) {
  return db
    .select()
    .from(notificacion)
    .where(eq(notificacion.id_usuario, idUsuario))
    .orderBy(desc(notificacion.fecha), desc(notificacion.id))
    .limit(LIMITE);
}

export async function buscarPorId(id) {
  const [fila] = await db.select().from(notificacion).where(eq(notificacion.id, id));
  return fila ?? null;
}

// Notificación de un tipo para ese usuario en esa reserva (null si no hay)
export async function buscarDeReserva(idUsuario, idReserva, tipo) {
  const [fila] = await db
    .select({ id: notificacion.id })
    .from(notificacion)
    .where(
      and(
        eq(notificacion.id_usuario, idUsuario),
        eq(notificacion.id_reserva, idReserva),
        eq(notificacion.tipo, tipo)
      )
    )
    .limit(1);
  return fila ?? null;
}

export async function crear(datos) {
  await db.insert(notificacion).values(datos);
}

// Vuelve a poner la notificación como reciente (fecha de ahora)
export async function renovar(id) {
  await db.update(notificacion).set({ fecha: sql`CURRENT_TIMESTAMP` }).where(eq(notificacion.id, id));
}

export async function eliminar(id) {
  await db.delete(notificacion).where(eq(notificacion.id, id));
}

export async function eliminarDeReserva(idUsuario, idReserva, tipo) {
  await db
    .delete(notificacion)
    .where(
      and(
        eq(notificacion.id_usuario, idUsuario),
        eq(notificacion.id_reserva, idReserva),
        eq(notificacion.tipo, tipo)
      )
    );
}

export async function eliminarTodasDelUsuario(idUsuario) {
  await db.delete(notificacion).where(eq(notificacion.id_usuario, idUsuario));
}
