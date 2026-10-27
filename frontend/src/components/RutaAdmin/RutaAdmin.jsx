import { useContext } from "react";
import { Navigate } from "react-router";
import { UsuarioContext } from "../../context/UsuarioContext.js";

export default function RutaAdmin({ children }) {
  const { usuario } = useContext(UsuarioContext);

  if (!usuario) {
    return <Navigate to="/cuenta/login" replace />;
  }

  if (usuario.rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}