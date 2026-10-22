import { randomBytes } from "node:crypto";
import * as reservaRepository from "../repositories/reserva.repository.js";
import * as canchaRepository from "../repositories/cancha.repository.js";
import * as usuarioRepository from "../repositories/usuario.repository.js";
import { AppError } from "../errors/AppError.js";

// Fecha de hoy (YYYY-MM-DD) en horario argentino, no en UTC
function hoy() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" });
}

async function obtenerCanchaHabilitada(numero) {
  const cancha = await canchaRepository.buscarPorNumero(numero);

  if (!cancha) {
    throw new AppError(404, "No existe ese número de cancha");
  }

  if (!cancha.habilitada) {
    throw new AppError(409, "La cancha no está habilitada");
  }

  return cancha;
}

async function verificarTurnoLibre(turno, excluirId) {
  const solapada = await reservaRepository.buscarSolapada({ ...turno, excluirId });

  if (solapada) {
    throw new AppError(409, "La cancha ya está reservada en ese horario");
  }
}

export function listar(filtros) {
  return reservaRepository.listar(filtros);
}

export async function obtener(id) {
  const reserva = await reservaRepository.buscarPorId(id);

  if (!reserva) {
    throw new AppError(404, "No existe una reserva con ese id");
  }

  return reserva;
}

export async function crear(datos) {
  if (datos.dia < hoy()) {
    throw new AppError(400, "No se puede reservar en una fecha pasada");
  }

  const creador = await usuarioRepository.buscarPorId(datos.id_creador);

  if (!creador) {
    throw new AppError(404, "No existe el usuario creador de la reserva");
  }

  const cancha = await obtenerCanchaHabilitada(datos.numero_cancha);

  await verificarTurnoLibre(datos);

  const id = await reservaRepository.crear({
    ...datos,
    precio: cancha.precio,
    estado_pago: false,
    estado_reserva: "pendiente",
    codigo_invitacion: randomBytes(8).toString("base64url")
  });

  return obtener(id);
}

export async function actualizar(id, datos) {
  const actual = await obtener(id);

  if (actual.estado_reserva === "cancelada") {
    throw new AppError(409, "No se puede modificar una reserva cancelada");
  }

  const nueva = { ...actual, ...datos };
  const cambios = { ...datos };

  if (nueva.horario_fin <= nueva.horario_inicio) {
    throw new AppError(400, "El horario de fin tiene que ser posterior al de inicio");
  }

  if (datos.dia && datos.dia < hoy()) {
    throw new AppError(400, "No se puede mover la reserva a una fecha pasada");
  }

  if (datos.numero_cancha !== undefined && datos.numero_cancha !== actual.numero_cancha) {
    const cancha = await obtenerCanchaHabilitada(datos.numero_cancha);
    cambios.precio = cancha.precio;
  }

  const cambiaTurno =
    nueva.numero_cancha !== actual.numero_cancha ||
    nueva.dia !== actual.dia ||
    nueva.horario_inicio !== actual.horario_inicio ||
    nueva.horario_fin !== actual.horario_fin;

  if (cambiaTurno && nueva.estado_reserva !== "cancelada") {
    await verificarTurnoLibre(nueva, id);
  }

  await reservaRepository.actualizar(id, cambios);
  return obtener(id);
}

export async function eliminar(id) {
  await obtener(id);
  await reservaRepository.eliminar(id);
}
