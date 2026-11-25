import * as notificacionRepository from "../repositories/notificacion.repository.js";
import * as reservaRepository from "../repositories/reserva.repository.js";
import { AppError } from "../errors/AppError.js";

// Valores de notificacion.tipo (la columna es un varchar libre)
export const TIPOS_NOTIFICACION = {
  SOLICITUD: "solicitud_nueva",
  ACEPTADO: "solicitud_aceptada",
  RECHAZADO: "solicitud_rechazada",
  MENSAJE: "mensaje"
};

// "del 31/12/2026 a las 00:00 (cancha 1)"
function describirReserva(reserva) {
  const [anio, mes, dia] = reserva.dia.split("-");
  return `del ${dia}/${mes}/${anio} a las ${reserva.horario_inicio.slice(0, 5)} (cancha ${reserva.numero_cancha})`;
}

// Avisar es secundario: si falla, no tiene que romper la acción principal (aceptar, mandar mensaje)
async function sinRomper(accion) {
  try {
    await accion();
  } catch (error) {
    console.error("No se pudo generar la notificación:", error);
  }
}

export async function listar(idUsuario) {
  return notificacionRepository.listarPorUsuario(idUsuario);
}

// La notificación se da por leída cuando se borra
export async function eliminar(id, idActor) {
  const notificacion = await notificacionRepository.buscarPorId(id);

  if (!notificacion) {
    throw new AppError(404, "No existe esa notificación");
  }

  if (notificacion.id_usuario !== idActor) {
    throw new AppError(403, "Solo podés borrar tus propias notificaciones");
  }

  await notificacionRepository.eliminar(id);
}

export async function eliminarTodas(idUsuario) {
  await notificacionRepository.eliminarTodasDelUsuario(idUsuario);
}

// Alguien pidió unirse a la reserva: se le avisa al creador (RN 31)
export function avisarSolicitud(reserva, solicitante) {
  return sinRomper(() =>
    notificacionRepository.crear({
      tipo: TIPOS_NOTIFICACION.SOLICITUD,
      descripcion: `${solicitante.nombre} ${solicitante.apellido} pidió unirse a tu reserva ${describirReserva(reserva)}`,
      id_usuario: reserva.id_creador,
      id_reserva: reserva.id
    })
  );
}

// Al usuario lo aceptaron en una reserva
export function avisarAceptacion(reserva, idUsuario) {
  return sinRomper(() =>
    notificacionRepository.crear({
      tipo: TIPOS_NOTIFICACION.ACEPTADO,
      descripcion: `Te aceptaron en la reserva ${describirReserva(reserva)}`,
      id_usuario: idUsuario,
      id_reserva: reserva.id
    })
  );
}

// Al usuario le rechazaron la solicitud para unirse a una reserva
export function avisarRechazo(reserva, idUsuario) {
  return sinRomper(() =>
    notificacionRepository.crear({
      tipo: TIPOS_NOTIFICACION.RECHAZADO,
      descripcion: `Rechazaron tu solicitud para unirte a la reserva ${describirReserva(reserva)}`,
      id_usuario: idUsuario,
      id_reserva: reserva.id
    })
  );
}

// Hay un mensaje nuevo: se avisa a los demás participantes.
// Si ya tienen un aviso de mensajes sin leer en esa reserva, se renueva en vez de apilar uno por mensaje
export function avisarMensaje(reserva, idAutor) {
  return sinRomper(async () => {
    const participantes = await reservaRepository.listarParticipantes(reserva.id);

    for (const participante of participantes) {
      if (participante.id === idAutor) continue;

      const existente = await notificacionRepository.buscarDeReserva(
        participante.id,
        reserva.id,
        TIPOS_NOTIFICACION.MENSAJE
      );

      if (existente) {
        await notificacionRepository.renovar(existente.id);
      } else {
        await notificacionRepository.crear({
          tipo: TIPOS_NOTIFICACION.MENSAJE,
          descripcion: `Tenés mensajes nuevos en el chat de la reserva ${describirReserva(reserva)}`,
          id_usuario: participante.id,
          id_reserva: reserva.id
        });
      }
    }
  });
}

// El usuario está leyendo el chat: sus avisos de mensajes de esa reserva ya no hacen falta
export function limpiarAvisosDeMensajes(idReserva, idUsuario) {
  return sinRomper(() =>
    notificacionRepository.eliminarDeReserva(idUsuario, idReserva, TIPOS_NOTIFICACION.MENSAJE)
  );
}
