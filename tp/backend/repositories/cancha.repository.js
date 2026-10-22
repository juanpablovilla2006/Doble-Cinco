import { eq } from "drizzle-orm";
import { db } from "../db/conexion.js";
import { cancha } from "../db/schema.js";

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