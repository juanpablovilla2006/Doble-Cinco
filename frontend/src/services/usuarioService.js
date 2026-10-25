import { pedir } from "./api.js";

export function registrarUsuario(datos) {
  return pedir("/usuarios", { metodo: "POST", cuerpo: datos });
}