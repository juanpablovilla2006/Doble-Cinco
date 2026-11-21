import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "../db/conexion.js";
import { mensaje, usuario } from "../db/schema.js";

// Cuántos mensajes se devuelven como máximo por pedido (los más recientes)
const LIMITE = 100;

// Datos públicos del autor (no se exponen mail, dni ni teléfono)
const columnas = {
  id: mensaje.id,
  contenido: mensaje.contenido,
  fecha_enviado: mensaje.fecha_enviado,
  id_usuario: mensaje.id_usuario,
  nombre: usuario.nombre,
  apellido: usuario.apellido
};

// El chat de una reserva tiene como id el de la reserva (chat.id_reserva)
export async function listar(idChat, despuesDe) {
  const filas = await db
    .select(columnas)
    .from(mensaje)
    .innerJoin(usuario, eq(mensaje.id_usuario, usuario.id))
    .where(and(eq(mensaje.id_chat, idChat), despuesDe ? gt(mensaje.id, despuesDe) : undefined))
    .orderBy(desc(mensaje.id))
    .limit(LIMITE);

  // Se piden los últimos primero para quedarse con los más recientes, y se devuelven en orden cronológico
  return filas.reverse();
}

export async function buscarPorId(id) {
  const [fila] = await db
    .select(columnas)
    .from(mensaje)
    .innerJoin(usuario, eq(mensaje.id_usuario, usuario.id))
    .where(eq(mensaje.id, id));
  return fila ?? null;
}

export async function crear(datos) {
  const [resultado] = await db.insert(mensaje).values(datos);
  return resultado.insertId;
}

export async function buscarPorIdYChat(id, idChat) {
  const [fila] = await db
    .select({ id: mensaje.id, id_usuario: mensaje.id_usuario })
    .from(mensaje)
    .where(and(eq(mensaje.id, id), eq(mensaje.id_chat, idChat)));
  return fila ?? null;
}

export async function eliminar(id) {
  await db.delete(mensaje).where(eq(mensaje.id, id));
}
