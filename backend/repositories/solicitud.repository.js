import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/conexion.js";
import { solicitud, reserva_participante, usuario } from "../db/schema.js";

// Datos públicos del solicitante (no se exponen mail, dni ni teléfono)
const columnas = {
  id: solicitud.id,
  fecha: solicitud.fecha,
  estado: solicitud.estado,
  id_reserva: solicitud.id_reserva,
  id_usuario: solicitud.id_usuario,
  nombre: usuario.nombre,
  apellido: usuario.apellido
};

export function listarPorReserva(idReserva, estado) {
  return db
    .select(columnas)
    .from(solicitud)
    .innerJoin(usuario, eq(solicitud.id_usuario, usuario.id))
    .where(and(eq(solicitud.id_reserva, idReserva), estado ? eq(solicitud.estado, estado) : undefined))
    .orderBy(desc(solicitud.fecha));
}

// Solo devuelve la solicitud si pertenece a esa reserva
export async function buscarPorIdYReserva(id, idReserva) {
  const [fila] = await db
    .select(columnas)
    .from(solicitud)
    .innerJoin(usuario, eq(solicitud.id_usuario, usuario.id))
    .where(and(eq(solicitud.id, id), eq(solicitud.id_reserva, idReserva)));
  return fila ?? null;
}

export async function buscarPendiente(idReserva, idUsuario) {
  const [fila] = await db
    .select({ id: solicitud.id })
    .from(solicitud)
    .where(
      and(
        eq(solicitud.id_reserva, idReserva),
        eq(solicitud.id_usuario, idUsuario),
        eq(solicitud.estado, "pendiente")
      )
    )
    .limit(1);
  return fila ?? null;
}

export async function crear(datos) {
  const [resultado] = await db.insert(solicitud).values(datos);
  return resultado.insertId;
}

export async function cambiarEstado(id, estado) {
  await db.update(solicitud).set({ estado }).where(eq(solicitud.id, id));
}

// Acepta la solicitud y suma al usuario como participante, todo o nada
export function aceptar(id, idReserva, idUsuario) {
  return db.transaction(async (tx) => {
    await tx.update(solicitud).set({ estado: "aceptada" }).where(eq(solicitud.id, id));
    await tx.insert(reserva_participante).values({ id_reserva: idReserva, id_usuario: idUsuario });
  });
}

export async function eliminar(id) {
  await db.delete(solicitud).where(eq(solicitud.id, id));
}
