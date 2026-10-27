import { pedir } from "./api.js";
 
// GET /canchas/disponibles?dia=...&horario_inicio=...&horario_fin=...&tipo=...
export function buscarCanchasDisponibles({ dia, horario_inicio, horario_fin, tipo }) {
  const params = new URLSearchParams({ dia, horario_inicio, horario_fin });
  if (tipo) params.set("tipo", tipo);
  return pedir(`/canchas/disponibles?${params.toString()}`);
}
 
// POST /reservas
export function crearReserva(datos) {
  return pedir("/reservas", { metodo: "POST", cuerpo: datos });
}
 
export function listarReservasDeUsuario(idUsuario) {
  return pedir(`/reservas?id_creador=${idUsuario}`);
}
 
export function eliminarReserva(id) {
  return pedir(`/reservas/${id}`, { metodo: "DELETE" });
}
 
