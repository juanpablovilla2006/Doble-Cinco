import { and, asc, eq, getTableColumns, gt, inArray, lt, ne } from "drizzle-orm";
import { db } from "../db/conexion.js";
import {
  reserva,
  reserva_participante,
  chat,
  mensaje,
  equipo,
  equipo_participante,
  solicitud,
  notificacion,
  usuario
} from "../db/schema.js";

// En el listado no se expone el código de invitación (es lo que da acceso a las reservas privadas)
const { codigo_invitacion, ...columnasListado } = getTableColumns(reserva);

export function listar(filtros = {}) {
  const condiciones = [];

  if (filtros.dia) condiciones.push(eq(reserva.dia, filtros.dia));
  if (filtros.estado_reserva) condiciones.push(eq(reserva.estado_reserva, filtros.estado_reserva));
  if (filtros.visibilidad !== undefined) condiciones.push(eq(reserva.visibilidad, filtros.visibilidad));
  if (filtros.numero_cancha) condiciones.push(eq(reserva.numero_cancha, filtros.numero_cancha));
  if (filtros.id_creador) condiciones.push(eq(reserva.id_creador, filtros.id_creador));

  return db
    .select(columnasListado)
    .from(reserva)
    .where(and(...condiciones))
    .orderBy(asc(reserva.dia), asc(reserva.horario_inicio));
}

export async function buscarPorId(id) {
  const [fila] = await db.select().from(reserva).where(eq(reserva.id, id));
  return fila ?? null;
}

// Reserva no cancelada de la misma cancha, el mismo día y con horario que se pisa con el pedido
export async function buscarSolapada({ numero_cancha, dia, horario_inicio, horario_fin, excluirId }) {
  const [fila] = await db
    .select({ id: reserva.id })
    .from(reserva)
    .where(
      and(
        eq(reserva.numero_cancha, numero_cancha),
        eq(reserva.dia, dia),
        ne(reserva.estado_reserva, "cancelada"),
        lt(reserva.horario_inicio, horario_fin),
        gt(reserva.horario_fin, horario_inicio),
        excluirId ? ne(reserva.id, excluirId) : undefined
      )
    )
    .limit(1);
  return fila ?? null;
}

// Crea la reserva, agrega al creador como participante y abre el chat, todo o nada
export function crear(datos) {
  return db.transaction(async (tx) => {
    const [resultado] = await tx.insert(reserva).values(datos);
    const id = resultado.insertId;

    await tx.insert(reserva_participante).values({ id_reserva: id, id_usuario: datos.id_creador });
    await tx.insert(chat).values({ id_reserva: id });

    return id;
  });
}

export async function actualizar(id, datos) {
  await db.update(reserva).set(datos).where(eq(reserva.id, id));
}

// Borra la reserva junto con todo lo que depende de ella
export function eliminar(id) {
  return db.transaction(async (tx) => {
    const equiposDeLaReserva = tx.select({ id: equipo.id }).from(equipo).where(eq(equipo.id_reserva, id));

    await tx.delete(equipo_participante).where(inArray(equipo_participante.id_equipo, equiposDeLaReserva));
    await tx.delete(equipo).where(eq(equipo.id_reserva, id));
    await tx.delete(mensaje).where(eq(mensaje.id_chat, id));
    await tx.delete(chat).where(eq(chat.id_reserva, id));
    await tx.delete(solicitud).where(eq(solicitud.id_reserva, id));
    await tx.delete(notificacion).where(eq(notificacion.id_reserva, id));
    await tx.delete(reserva_participante).where(eq(reserva_participante.id_reserva, id));
    await tx.delete(reserva).where(eq(reserva.id, id));
  });
}

// Datos públicos de los participantes (no se exponen mail, dni ni teléfono)
export function listarParticipantes(idReserva) {
  return db
    .select({ id: usuario.id, nombre: usuario.nombre, apellido: usuario.apellido })
    .from(reserva_participante)
    .innerJoin(usuario, eq(reserva_participante.id_usuario, usuario.id))
    .where(eq(reserva_participante.id_reserva, idReserva));
}

// Saca al usuario de la reserva y también de su equipo, si estaba en alguno
export function quitarParticipante(idReserva, idUsuario) {
  return db.transaction(async (tx) => {
    const equiposDeLaReserva = tx.select({ id: equipo.id }).from(equipo).where(eq(equipo.id_reserva, idReserva));

    await tx
      .delete(equipo_participante)
      .where(
        and(
          eq(equipo_participante.id_usuario, idUsuario),
          inArray(equipo_participante.id_equipo, equiposDeLaReserva)
        )
      );

    await tx
      .delete(reserva_participante)
      .where(
        and(eq(reserva_participante.id_reserva, idReserva), eq(reserva_participante.id_usuario, idUsuario))
      );
  });
}
