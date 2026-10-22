import bcrypt from "bcrypt";
import * as usuarioRepository from "../repositories/usuario.repository.js";
import { AppError } from "../errors/AppError.js";

const SALT_ROUNDS = 10;

function codigoDeError(error) {
  return error.code ?? error.cause?.code;
}

export function listar() {
  return usuarioRepository.listar();
}

export async function obtener(id) {
  const usuario = await usuarioRepository.buscarPorId(id);

  if (!usuario) {
    throw new AppError(404, "No existe un usuario con ese id");
  }

  return usuario;
}

export async function crear(datos) {
  const password = await bcrypt.hash(datos.password, SALT_ROUNDS);

  try {
    const id = await usuarioRepository.crear({ ...datos, password });
    return await obtener(id);
  } catch (error) {
    if (codigoDeError(error) === "ER_DUP_ENTRY") {
      throw new AppError(409, "Ya existe un usuario con ese mail");
    }

    throw error;
  }
}

export async function actualizar(id, datos) {
  await obtener(id);

  const cambios = { ...datos };

  if (cambios.password) {
    cambios.password = await bcrypt.hash(cambios.password, SALT_ROUNDS);
  }

  try {
    await usuarioRepository.actualizar(id, cambios);
  } catch (error) {
    if (codigoDeError(error) === "ER_DUP_ENTRY") {
      throw new AppError(409, "Ya existe un usuario con ese mail");
    }

    throw error;
  }

  return obtener(id);
}

export async function eliminar(id) {
  await obtener(id);

  try {
    await usuarioRepository.eliminar(id);
  } catch (error) {
    // El usuario tiene reservas, solicitudes, etc. asociadas
    if (codigoDeError(error) === "ER_ROW_IS_REFERENCED_2") {
      throw new AppError(409, "No se puede eliminar el usuario porque tiene datos asociados");
    }

    throw error;
  }
}
