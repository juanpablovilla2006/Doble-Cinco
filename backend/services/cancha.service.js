import * as canchaRepository from "../repositories/cancha.repository.js";
import { AppError } from "../errors/AppError.js";

export function listar() {
  return canchaRepository.listar();
}

export async function obtener(numero) {
  const cancha = await canchaRepository.buscarPorNumero(numero);

  if (!cancha) {
    throw new AppError(404, "No existe ese número de cancha");
  }

  return cancha;
}

export async function crear(datos) {
  try {
    await canchaRepository.crear(datos);
  } catch (error) {
    const codigo = error.code ?? error.cause?.code;

    if (codigo === "ER_DUP_ENTRY") {
      throw new AppError(409, "Ya existe una cancha con ese número");
    }

    throw error;
  }

  return datos;
}

export async function actualizar(numero, datos) {
  await obtener(numero);
  await canchaRepository.actualizar(numero, datos);
  return { numero, ...datos };
}

export async function eliminar(numero) {
  await obtener(numero);
  await canchaRepository.eliminar(numero);
}