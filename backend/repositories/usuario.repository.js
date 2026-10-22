import { eq, getTableColumns } from "drizzle-orm";
import { db } from "../db/conexion.js";
import { usuario } from "../db/schema.js";

// Todas las columnas menos password, para no exponer el hash hacia afuera
const { password, ...columnasPublicas } = getTableColumns(usuario);

export function listar() {
  return db.select(columnasPublicas).from(usuario);
}

export async function buscarPorId(id) {
  const [fila] = await db.select(columnasPublicas).from(usuario).where(eq(usuario.id, id));
  return fila ?? null;
}

export async function crear(datos) {
  const [resultado] = await db.insert(usuario).values(datos);
  return resultado.insertId;
}

export async function actualizar(id, datos) {
  await db.update(usuario).set(datos).where(eq(usuario.id, id));
}

export async function eliminar(id) {
  await db.delete(usuario).where(eq(usuario.id, id));
}
