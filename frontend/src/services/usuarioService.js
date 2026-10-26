import { pedir } from "./api.js";

export function registrarUsuario(datos) {
  return pedir("/usuarios", { metodo: "POST", cuerpo: datos });
}

export function ingresarUsuario(mail, password) {
  return pedir("/usuarios/login", { metodo: "POST", cuerpo: { mail, password } });
}

export function obtenerUsuario(id) {
  return pedir(`/usuarios/${id}`);
}

export function actualizarUsuario(id, datos) {
  return pedir(`/usuarios/${id}`, { metodo: "PUT", cuerpo: datos });
}

export function eliminarUsuario(id) {
  return pedir(`/usuarios/${id}`, { metodo: "DELETE" });
}