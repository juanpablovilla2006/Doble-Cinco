import { pedir } from "./api.js";

// Las solicitudes cuelgan de la reserva: /reservas/:idReserva/solicitudes
const ruta = (idReserva) => `/reservas/${idReserva}/solicitudes`;

// Un usuario pide unirse a una reserva pública
export function crearSolicitud(idReserva, idUsuario) {
  return pedir(ruta(idReserva), { metodo: "POST", cuerpo: { id_usuario: idUsuario } });
}

// El creador recibe todas las de la reserva; cualquier otro usuario, solo las suyas
export function listarSolicitudes(idReserva, idUsuario, estado) {
  const params = new URLSearchParams({ id_usuario: idUsuario });
  if (estado) params.set("estado", estado);
  return pedir(`${ruta(idReserva)}?${params.toString()}`);
}

// El creador acepta o rechaza. estado: "aceptada" | "rechazada"
export function resolverSolicitud(idReserva, id, idUsuario, estado) {
  return pedir(`${ruta(idReserva)}/${id}`, {
    metodo: "PUT",
    cuerpo: { id_usuario: idUsuario, estado }
  });
}

// El solicitante retira su solicitud mientras siga pendiente
export function retirarSolicitud(idReserva, id, idUsuario) {
  return pedir(`${ruta(idReserva)}/${id}?id_usuario=${idUsuario}`, { metodo: "DELETE" });
}
