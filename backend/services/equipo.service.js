import * as equipoRepository from "../repositories/equipo.repository.js";
import * as canchaRepository from "../repositories/cancha.repository.js";
import * as reservaService from "./reserva.service.js";
import { AppError } from "../errors/AppError.js";

// Carga la reserva (404 si no existe) y el equipo, verificando que sea de esa reserva
async function cargar(idReserva, id) {
  const reserva = await reservaService.obtener(idReserva);
  const equipo = await equipoRepository.buscarPorIdYReserva(id, idReserva);

  if (!equipo) {
    throw new AppError(404, "No existe ese equipo en la reserva");
  }

  return { reserva, equipo };
}

function verificarReservaActiva(reserva) {
  if (reserva.estado_reserva === "cancelada") {
    throw new AppError(409, "La reserva está cancelada");
  }
}

async function verificarTipoLibre(idReserva, tipo, excluirId) {
  const existente = await equipoRepository.buscarPorTipo(idReserva, tipo, excluirId);

  if (existente) {
    throw new AppError(409, "Ya existe un equipo con ese tipo en la reserva");
  }
}

function conParticipantes(equipo, participantes) {
  return {
    ...equipo,
    participantes: participantes
      .filter((p) => p.id_equipo === equipo.id)
      .map(({ id_equipo, ...usuario }) => usuario)
  };
}

export async function listar(idReserva) {
  await reservaService.obtener(idReserva);

  const equipos = await equipoRepository.listarPorReserva(idReserva);
  const participantes = await equipoRepository.listarParticipantes(equipos.map((e) => e.id));

  return equipos.map((equipo) => conParticipantes(equipo, participantes));
}

export async function obtener(idReserva, id) {
  const { equipo } = await cargar(idReserva, id);
  const participantes = await equipoRepository.listarParticipantes([id]);

  return conParticipantes(equipo, participantes);
}

export async function crear(idReserva, datos) {
  const reserva = await reservaService.obtener(idReserva);

  verificarReservaActiva(reserva);
  await verificarTipoLibre(idReserva, datos.tipo);

  const id = await equipoRepository.crear({ ...datos, id_reserva: idReserva });
  return obtener(idReserva, id);
}

export async function actualizar(idReserva, id, datos) {
  const { reserva } = await cargar(idReserva, id);

  verificarReservaActiva(reserva);
  await verificarTipoLibre(idReserva, datos.tipo, id);

  await equipoRepository.actualizar(id, datos);
  return obtener(idReserva, id);
}

export async function eliminar(idReserva, id) {
  await cargar(idReserva, id);
  await equipoRepository.eliminar(id);
}

export async function agregarParticipante(idReserva, id, idUsuario) {
  const { reserva } = await cargar(idReserva, id);

  verificarReservaActiva(reserva);

  if (!(await equipoRepository.esParticipanteDeReserva(idReserva, idUsuario))) {
    throw new AppError(409, "El usuario no es participante de la reserva");
  }

  const equipoActual = await equipoRepository.buscarEquipoDeUsuario(idReserva, idUsuario);

  if (equipoActual) {
    throw new AppError(
      409,
      equipoActual.id === id
        ? "El usuario ya pertenece a este equipo"
        : "El usuario ya pertenece a otro equipo de la reserva"
    );
  }

  const cancha = await canchaRepository.buscarPorNumero(reserva.numero_cancha);
  const asignados = await equipoRepository.contarAsignados(idReserva);

  if (cancha && asignados >= cancha.capacidad) {
    throw new AppError(409, "Se alcanzó la capacidad de la cancha");
  }

  await equipoRepository.agregarParticipante(id, idUsuario);
  return obtener(idReserva, id);
}

export async function quitarParticipante(idReserva, id, idUsuario) {
  await cargar(idReserva, id);

  const equipoActual = await equipoRepository.buscarEquipoDeUsuario(idReserva, idUsuario);

  if (!equipoActual || equipoActual.id !== id) {
    throw new AppError(404, "El usuario no pertenece a este equipo");
  }

  await equipoRepository.quitarParticipante(id, idUsuario);
}
