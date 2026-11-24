import { pedir } from "./api.js";

// Notificaciones del usuario, las más recientes primero
export function listarNotificaciones(idUsuario) {
  return pedir(`/notificaciones?id_usuario=${idUsuario}`);
}

// Borrarla equivale a darla por leída
export function borrarNotificacion(id, idUsuario) {
  return pedir(`/notificaciones/${id}?id_usuario=${idUsuario}`, { metodo: "DELETE" });
}

export function borrarTodasLasNotificaciones(idUsuario) {
  return pedir(`/notificaciones?id_usuario=${idUsuario}`, { metodo: "DELETE" });
}
