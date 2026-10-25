import { useState } from "react";
import { UsuarioContext } from "./UsuarioContext.js";

const CLAVE = "usuarioActual";

function leerGuardado() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE));
  } catch {
    return null;
  }
}

export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(leerGuardado);

  function iniciarSesion(datosUsuario) {
    setUsuario(datosUsuario);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(datosUsuario));
    } catch {
      // Sin almacenamiento disponible. La sesión dura hasta recargar la página
    }
  }

  function cerrarSesion() {
    setUsuario(null);
    try {
      localStorage.removeItem(CLAVE);
    } catch {
      // Nada para borrar
    }
  }

  return (
    <UsuarioContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </UsuarioContext.Provider>
  );
}