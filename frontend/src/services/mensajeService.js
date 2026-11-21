import { pedir } from "./api.js";

// El chat cuelga de la reserva: /reservas/:idReserva/mensajes
const ruta = (idReserva) => `/reservas/${idReserva}/mensajes`;

// Mensajes del chat. Con despuesDe trae solo los más nuevos que ese id
export function listarMensajes(idReserva, idUsuario, despuesDe) {
  const params = new URLSearchParams({ id_usuario: idUsuario });
  if (despuesDe) params.set("despues_de", despuesDe);
  return pedir(`${ruta(idReserva)}?${params.toString()}`);
}

// Devuelve el mensaje creado
export function enviarMensaje(idReserva, idUsuario, contenido) {
  return pedir(ruta(idReserva), { metodo: "POST", cuerpo: { id_usuario: idUsuario, contenido } });
}

export function eliminarMensaje(idReserva, id, idUsuario) {
  return pedir(`${ruta(idReserva)}/${id}?id_usuario=${idUsuario}`, { metodo: "DELETE" });
}
