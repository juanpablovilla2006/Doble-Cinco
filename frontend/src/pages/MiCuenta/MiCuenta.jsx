import { Link } from "react-router";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import { useUsuario } from "../../hooks/useUsuario.js";
import "./MiCuenta.css";

export default function MiCuenta() {
  const { usuario, cerrarSesion } = useUsuario();

  return (
    <>
      <BarraMenu titulo="Mi cuenta" />
      <main className="container py-4">
        <div className="mi-cuenta__acciones">
          {usuario && <p className="mi-cuenta__saludo">Hola, {usuario.nombre}</p>}

          {!usuario && (
            <Link className="btn btn-primary btn-lg" to="/cuenta/registro">
              Registrarte
            </Link>
          )}

          {usuario ? (
            <Link className="btn btn-primary btn-lg" to="/cuenta/datos">
              Mis datos
            </Link>
          ) : (
            <Link className="btn btn-primary btn-lg" to="/cuenta/login">
              Login
            </Link>
          )}

          <Link className="btn btn-primary btn-lg" to="/mis-reservas">
            Mis reservas
          </Link>

          {usuario && (
            <button type="button" className="btn btn-outline-secondary btn-lg" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          )}
        </div>
      </main>
    </>
  );
}