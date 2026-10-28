import { pedir } from "./api.js";

// Los equipos cuelgan de la reserva: /reservas/:idReserva/equipos
const ruta = (idReserva) => `/reservas/${idReserva}/equipos`;

export function listarEquipos(idReserva) {
  return pedir(ruta(idReserva));
}

export function crearEquipo(idReserva, datos) {
  return pedir(ruta(idReserva), { metodo: "POST", cuerpo: datos });
}

export function actualizarEquipo(idReserva, id, datos) {
  return pedir(`${ruta(idReserva)}/${id}`, { metodo: "PUT", cuerpo: datos });
}

export function eliminarEquipo(idReserva, id) {
  return pedir(`${ruta(idReserva)}/${id}`, { metodo: "DELETE" });
}

// POST /reservas/:idReserva/equipos/:id/participantes. Devuelve el equipo actualizado
export function agregarIntegrante(idReserva, id, idUsuario) {
  return pedir(`${ruta(idReserva)}/${id}/participantes`, {
    metodo: "POST",
    cuerpo: { id_usuario: idUsuario }
  });
}

export function quitarIntegrante(idReserva, id, idUsuario) {
  return pedir(`${ruta(idReserva)}/${id}/participantes/${idUsuario}`, { metodo: "DELETE" });
}