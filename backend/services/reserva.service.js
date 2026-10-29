import { randomBytes } from "node:crypto";
import * as reservaRepository from "../repositories/reserva.repository.js";
import * as canchaRepository from "../repositories/cancha.repository.js";
import * as usuarioRepository from "../repositories/usuario.repository.js";
import { AppError } from "../errors/AppError.js";
import { DURACION_MINIMA, minutosEntre } from "../utils/horarios.js";

export const DIAS_MAXIMOS_ANTICIPACION = 90;

// trae el momento actual a la hora de la reserva
function ahora() {
  const [dia, hora] = new Date()
    .toLocaleString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" })
    .split(" ");
  return { dia, hora };
}
// compara el moemnto actual con la reserva esperada para verificar quen no este en el mismo dia pero en una hora pasada
function verificarFuturo(dia, horarioInicio, mensaje) {
  const actual = ahora();
  if (dia < actual.dia || (dia === actual.dia && horarioInicio <= actual.hora)) {
    throw new AppError(400, mensaje);
  }
}

function fechaMaximaReserva() {
  const limite = new Date(Date.now() + DIAS_MAXIMOS_ANTICIPACION * 24 * 60 * 60 * 1000);
  return limite.toLocaleDateString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" });
}

function verificarDentroDelLimite(dia) {
  if (dia > fechaMaximaReserva()) {
    throw new AppError(
      400,
      `Solo se puede reservar con hasta ${DIAS_MAXIMOS_ANTICIPACION} días de anticipación`
    );
  }
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
// filtra para que solo las reservas publicas puedan listarse
export function listar(filtros) {
  if (filtros.visibilidad === undefined && filtros.id_creador === undefined) {
    filtros = { ...filtros, visibilidad: true };
  }
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
  
  verificarFuturo(datos.dia, datos.horario_inicio, "La reserva tiene que ser en una fecha y horario futuros");
  verificarDentroDelLimite(datos.dia, "La reserva tiene que ser dentro del límite de anticipación permitido de 90 días");
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

    // Si se toca el horario, la reserva que queda tiene que durar al menos 1 hora
  if (
    (datos.horario_inicio !== undefined || datos.horario_fin !== undefined) &&
    minutosEntre(nueva.horario_inicio, nueva.horario_fin) < DURACION_MINIMA
  ) {
    throw new AppError(400, "La reserva tiene que durar al menos 1 hora");
  }

  // entra al if si se cambia el dia o la hora de inicio
  if (datos.dia !== undefined || datos.horario_inicio !== undefined) {
  verificarFuturo(nueva.dia, nueva.horario_inicio, "La reserva tiene que ser en una fecha y horario futuros");
  }
  // si se cambia la cancha, se verifica que la nueva cancha tenga capacidad para los participantes actuales
  if (datos.numero_cancha !== undefined && datos.numero_cancha !== actual.numero_cancha) {
    const cancha = await obtenerCanchaHabilitada(datos.numero_cancha);
    const participantes = await reservaRepository.listarParticipantes(id);

    if (participantes.length > cancha.capacidad) {
    throw new AppError(409, "La nueva cancha no tiene capacidad para los participantes actuales");
    }
    cambios.precio = cancha.precio;
  }
  const cambiaTurno =
    nueva.numero_cancha !== actual.numero_cancha ||
    nueva.dia !== actual.dia ||
    nueva.horario_inicio !== actual.horario_inicio ||
    nueva.horario_fin !== actual.horario_fin;

  if (cambiaTurno) {
  verificarFuturo(
    nueva.dia,
    nueva.horario_inicio,
    "No se puede mover la reserva a una fecha y horario pasados"
  );
  verificarDentroDelLimite(nueva.dia);
  }
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

export async function listarParticipantes(idReserva) {
  const reserva = await obtener(idReserva);
  const participantes = await reservaRepository.listarParticipantes(idReserva);

  return participantes.map((participante) => ({
    ...participante,
    es_creador: participante.id === reserva.id_creador
  }));
}

export async function abandonar(idReserva, idUsuario) {
  const reserva = await obtener(idReserva);

  if (reserva.estado_reserva === "cancelada") {
    throw new AppError(409, "La reserva está cancelada");
  }

  if (idUsuario === reserva.id_creador) {
    throw new AppError(409, "El creador no puede abandonar la reserva, tiene que cancelarla");
  }

  const participantes = await reservaRepository.listarParticipantes(idReserva);

  if (!participantes.some((participante) => participante.id === idUsuario)) {
    throw new AppError(404, "El usuario no es participante de la reserva");
  }

  await reservaRepository.quitarParticipante(idReserva, idUsuario);
}
