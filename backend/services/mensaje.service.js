import * as mensajeRepository from "../repositories/mensaje.repository.js";
import * as reservaRepository from "../repositories/reserva.repository.js";
import * as reservaService from "./reserva.service.js";
import { AppError } from "../errors/AppError.js";

// Solo los participantes de la reserva (el creador incluido) pueden leer y escribir
async function verificarParticipante(idReserva, idUsuario) {
  const participantes = await reservaRepository.listarParticipantes(idReserva);

  if (!participantes.some((participante) => participante.id === idUsuario)) {
    throw new AppError(403, "Solo los participantes de la reserva pueden usar el chat");
  }
}

export async function listar(idReserva, { id_usuario, despues_de }) {
  await reservaService.obtener(idReserva);
  await verificarParticipante(idReserva, id_usuario);

  return mensajeRepository.listar(idReserva, despues_de);
}

export async function crear(idReserva, { id_usuario, contenido }) {
  const reserva = await reservaService.obtener(idReserva);

  await verificarParticipante(idReserva, id_usuario);

  // Una reserva cancelada deja el chat en solo lectura
  if (reserva.estado_reserva === "cancelada") {
    throw new AppError(409, "La reserva está cancelada, el chat quedó en solo lectura");
  }

  const id = await mensajeRepository.crear({ id_chat: idReserva, id_usuario, contenido });
  return mensajeRepository.buscarPorId(id);
}

export async function eliminar(idReserva, id, idActor) {
  const reserva = await reservaService.obtener(idReserva);
  const mensaje = await mensajeRepository.buscarPorIdYChat(id, idReserva);

  if (!mensaje) {
    throw new AppError(404, "No existe ese mensaje en el chat");
  }

  if (mensaje.id_usuario !== idActor && reserva.id_creador !== idActor) {
    throw new AppError(403, "Solo el autor o el creador de la reserva pueden borrar el mensaje");
  }

  if (reserva.estado_reserva === "cancelada") {
    throw new AppError(409, "La reserva está cancelada, el chat quedó en solo lectura");
  }

  await mensajeRepository.eliminar(id);
}
