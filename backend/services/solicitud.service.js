import * as solicitudRepository from "../repositories/solicitud.repository.js";
import * as reservaRepository from "../repositories/reserva.repository.js";
import * as canchaRepository from "../repositories/cancha.repository.js";
import * as usuarioRepository from "../repositories/usuario.repository.js";
import * as reservaService from "./reserva.service.js";
import * as notificacionService from "./notificacion.service.js";
import { AppError } from "../errors/AppError.js";

// Carga la reserva (404 si no existe) y la solicitud, verificando que sea de esa reserva
async function cargar(idReserva, id) {
  const reserva = await reservaService.obtener(idReserva);
  const solicitud = await solicitudRepository.buscarPorIdYReserva(id, idReserva);

  if (!solicitud) {
    throw new AppError(404, "No existe esa solicitud en la reserva");
  }

  return { reserva, solicitud };
}

function esCreador(reserva, idUsuario) {
  return reserva.id_creador === idUsuario;
}

function verificarCreador(reserva, idUsuario) {
  if (!esCreador(reserva, idUsuario)) {
    throw new AppError(403, "Solo el creador de la reserva puede aceptar o rechazar solicitudes");
  }
}

function verificarReservaActiva(reserva) {
  if (reserva.estado_reserva === "cancelada") {
    throw new AppError(409, "La reserva está cancelada");
  }
}

// La capacidad es la de la cancha: no puede haber más participantes que jugadores
async function verificarCapacidad(reserva, participantes) {
  const cancha = await canchaRepository.buscarPorNumero(reserva.numero_cancha);

  if (cancha && participantes.length >= cancha.capacidad) {
    throw new AppError(409, "Se alcanzó la capacidad de la cancha");
  }
}

// El creador ve todas las solicitudes de la reserva; cualquier otro, solo las suyas
export async function listar(idReserva, { estado, id_usuario }) {
  const reserva = await reservaService.obtener(idReserva);
  const solicitudes = await solicitudRepository.listarPorReserva(idReserva, estado);

  return esCreador(reserva, id_usuario)
    ? solicitudes
    : solicitudes.filter((solicitud) => solicitud.id_usuario === id_usuario);
}

// La puede ver el creador o el propio solicitante
export async function obtener(idReserva, id, idActor) {
  const { reserva, solicitud } = await cargar(idReserva, id);

  if (!esCreador(reserva, idActor) && solicitud.id_usuario !== idActor) {
    throw new AppError(403, "No tenés permiso para ver esta solicitud");
  }

  return solicitud;
}

export async function crear(idReserva, { id_usuario }) {
  const reserva = await reservaService.obtener(idReserva);

  verificarReservaActiva(reserva);

  if (!reserva.visibilidad) {
    throw new AppError(403, "La reserva es privada, solo se puede entrar con invitación");
  }

  const usuario = await usuarioRepository.buscarPorId(id_usuario);

  if (!usuario) {
    throw new AppError(404, "No existe el usuario que quiere unirse");
  }

  const participantes = await reservaRepository.listarParticipantes(idReserva);

  if (participantes.some((p) => p.id === id_usuario)) {
    throw new AppError(409, "El usuario ya es participante de la reserva");
  }

  if (await solicitudRepository.buscarPendiente(idReserva, id_usuario)) {
    throw new AppError(409, "Ya tenés una solicitud pendiente para esta reserva");
  }

  await verificarCapacidad(reserva, participantes);

  const id = await solicitudRepository.crear({ id_reserva: idReserva, id_usuario });
  await notificacionService.avisarSolicitud(reserva, usuario);
  const { solicitud } = await cargar(idReserva, id);
  return solicitud;
}

// Solo el creador acepta o rechaza. Al aceptar, el usuario pasa a ser participante
export async function resolver(idReserva, id, { estado, id_usuario }) {
  const { reserva, solicitud } = await cargar(idReserva, id);

  verificarCreador(reserva, id_usuario);
  verificarReservaActiva(reserva);

  if (solicitud.estado !== "pendiente") {
    throw new AppError(409, `La solicitud ya fue ${solicitud.estado}`);
  }

  if (estado === "aceptada") {
    const participantes = await reservaRepository.listarParticipantes(idReserva);

    if (participantes.some((p) => p.id === solicitud.id_usuario)) {
      throw new AppError(409, "El usuario ya es participante de la reserva");
    }

    await verificarCapacidad(reserva, participantes);
    await solicitudRepository.aceptar(id, idReserva, solicitud.id_usuario);
    await notificacionService.avisarAceptacion(reserva, solicitud.id_usuario);
    } 
  else {
    await solicitudRepository.cambiarEstado(id, estado);
    await notificacionService.avisarRechazo(reserva, solicitud.id_usuario);
  } 

  const { solicitud: actualizada } = await cargar(idReserva, id);
  return actualizada;
}

// Solo quien la hizo puede retirarla, y mientras siga pendiente
export async function eliminar(idReserva, id, idActor) {
  const { solicitud } = await cargar(idReserva, id);

  if (solicitud.id_usuario !== idActor) {
    throw new AppError(403, "Solo quien hizo la solicitud puede retirarla");
  }

  if (solicitud.estado !== "pendiente") {
    throw new AppError(409, "Solo se puede retirar una solicitud pendiente");
  }

  await solicitudRepository.eliminar(id);
}
