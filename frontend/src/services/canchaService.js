import { pedir } from "./api.js";

export function listarCanchas() {
  return pedir("/canchas");
}

export function crearCancha(datos) {
  return pedir("/canchas", { metodo: "POST", cuerpo: datos });
}

export function actualizarCancha(numero, datos) {
  return pedir(`/canchas/${numero}`, { metodo: "PUT", cuerpo: datos });
}

export function eliminarCancha(numero) {
  return pedir(`/canchas/${numero}`, { metodo: "DELETE" });
}

export function obtenerCancha(numero) {
  return pedir(`/canchas/${numero}`);
}
