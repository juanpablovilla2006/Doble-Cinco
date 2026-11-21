import { useEffect, useState } from "react";
import { Link } from "react-router";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import { useUsuario } from "../../hooks/useUsuario.js";
import { listarReservasDeUsuario } from "../../services/reservaService.js";
import { formatearDia, formatearHora } from "../../utils/fechas.js";
import "./Chats.css";

// Cada reserva tiene su chat (se crea junto con la reserva), así que la lista de chats
// es la lista de reservas en las que participa el usuario
export default function Chats() {
  const { usuario } = useUsuario();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(Boolean(usuario));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuario) {
      return;
    }

    listarReservasDeUsuario(usuario.id)
      .then((lista) => {
        // Las canceladas quedan al final (su chat es de solo lectura)
        const activas = lista.filter((r) => r.estado_reserva !== "cancelada");
        const canceladas = lista.filter((r) => r.estado_reserva === "cancelada");
        setReservas([...activas, ...canceladas]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [usuario]);

  if (!usuario) {
    return (
      <>
        <BarraMenu titulo="Chats" />
        <main className="container py-4 text-center">
          <p>Iniciá sesión para ver tus chats.</p>
          <Link className="btn btn-primary" to="/cuenta/login">Iniciar sesión</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <BarraMenu titulo="Chats" />
      <main className="container py-4">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {cargando && <p className="text-center">Cargando chats...</p>}

        {!cargando && !error && reservas.length === 0 && (
          <div className="text-center">
            <p>Todavía no tenés chats. Cada reserva tiene el suyo.</p>
            <Link className="btn btn-primary" to="/reservar">Reservar una cancha</Link>
          </div>
        )}

        <ul className="chats__lista">
          {reservas.map((reserva) => (
            <li
              key={reserva.id}
              className={`tarjeta-item ${reserva.estado_reserva === "cancelada" ? "tarjeta-item--cancelada" : ""}`}
            >
              <div className="d-flex justify-content-between align-items-center gap-2">
                <div>
                  <p className="chats__dia">{formatearDia(reserva.dia)}</p>
                  <p className="chats__datos">
                    {formatearHora(reserva.horario_inicio)} a {formatearHora(reserva.horario_fin)} hs, cancha {reserva.numero_cancha}
                    {reserva.estado_reserva === "cancelada" && " · Cancelada"}
                  </p>
                </div>
                <Link className="btn btn-primary btn-sm" to={`/chats/${reserva.id}`}>Abrir chat</Link>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
