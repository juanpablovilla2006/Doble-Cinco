import { and, count, eq, inArray, ne } from "drizzle-orm";
import { db } from "../db/conexion.js";
import { equipo, equipo_participante, reserva_participante, usuario } from "../db/schema.js";

export function listarPorReserva(idReserva) {
  return db.select().from(equipo).where(eq(equipo.id_reserva, idReserva));
}

// Solo devuelve el equipo si pertenece a esa reserva
export async function buscarPorIdYReserva(id, idReserva) {
  const [fila] = await db
    .select()
    .from(equipo)
    .where(and(eq(equipo.id, id), eq(equipo.id_reserva, idReserva)));
  return fila ?? null;
}

export async function buscarPorTipo(idReserva, tipo, excluirId) {
  const [fila] = await db
    .select({ id: equipo.id })
    .from(equipo)
    .where(
      and(
        eq(equipo.id_reserva, idReserva),
        eq(equipo.tipo, tipo),
        excluirId ? ne(equipo.id, excluirId) : undefined
      )
    )
    .limit(1);
  return fila ?? null;
}

export async function crear(datos) {
  const [resultado] = await db.insert(equipo).values(datos);
  return resultado.insertId;
}

export async function actualizar(id, datos) {
  await db.update(equipo).set(datos).where(eq(equipo.id, id));
}

// Borra el equipo junto con sus integrantes
export function eliminar(id) {
  return db.transaction(async (tx) => {
    await tx.delete(equipo_participante).where(eq(equipo_participante.id_equipo, id));
    await tx.delete(equipo).where(eq(equipo.id, id));
  });
}

export async function listarParticipantes(idsEquipo) {
  if (idsEquipo.length === 0) return [];

  return db
    .select({
      id_equipo: equipo_participante.id_equipo,
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido
    })
    .from(equipo_participante)
    .innerJoin(usuario, eq(equipo_participante.id_usuario, usuario.id))
    .where(inArray(equipo_participante.id_equipo, idsEquipo));
}

export async function esParticipanteDeReserva(idReserva, idUsuario) {
  const [fila] = await db
    .select({ id_usuario: reserva_participante.id_usuario })
    .from(reserva_participante)
    .where(
      and(
        eq(reserva_participante.id_reserva, idReserva),
        eq(reserva_participante.id_usuario, idUsuario)
      )
    )
    .limit(1);
  return fila !== undefined;
}

// Equipo de esa reserva en el que está el usuario (null si no está en ninguno)
export async function buscarEquipoDeUsuario(idReserva, idUsuario) {
  const [fila] = await db
    .select({ id: equipo.id })
    .from(equipo_participante)
    .innerJoin(equipo, eq(equipo_participante.id_equipo, equipo.id))
    .where(and(eq(equipo.id_reserva, idReserva), eq(equipo_participante.id_usuario, idUsuario)))
    .limit(1);
  return fila ?? null;
}

// Cantidad de jugadores ya asignados a algún equipo de la reserva
export async function contarAsignados(idReserva) {
  const [fila] = await db
    .select({ total: count() })
    .from(equipo_participante)
    .innerJoin(equipo, eq(equipo_participante.id_equipo, equipo.id))
    .where(eq(equipo.id_reserva, idReserva));
  return Number(fila.total);
}

export async function agregarParticipante(idEquipo, idUsuario) {
  await db.insert(equipo_participante).values({ id_equipo: idEquipo, id_usuario: idUsuario });
}

export async function quitarParticipante(idEquipo, idUsuario) {
  await db
    .delete(equipo_participante)
    .where(and(eq(equipo_participante.id_equipo, idEquipo), eq(equipo_participante.id_usuario, idUsuario)));
}
