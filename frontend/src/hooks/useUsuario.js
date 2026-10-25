import { useContext } from "react";
import { UsuarioContext } from "../context/UsuarioContext.js";

export function useUsuario() {
  return useContext(UsuarioContext);
}