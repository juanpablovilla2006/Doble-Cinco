import { useEffect, useState } from "react";
import { Link } from "react-router";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import BotonSolicitud from "../../components/BotonSolicitud/BotonSolicitud.jsx";
import { useUsuario } from "../../hooks/useUsuario.js";
import { listarCanchas } from "../../services/canchaService.js";
import { listarReservasPublicas, listarReservasDeUsuario } from "../../services/reservaService.js";
import { formatearDia, formatearHora } from "../../utils/fechas.js";
import "./ReservasDisponibles.css";

// Misma comparación que usa Inicio: la reserva todavía no empezó (hora de Argentina)
function esFutura(reserva) {
  const ahora = new Date().toLocaleString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" });
  const [dia, hora] = ahora.split(" ");
  return reserva.dia > dia || (reserva.dia === dia && reserva.horario_inicio > hora);
}

export default function ReservasDisponibles() {
  const { usuario } = useUsuario();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(Boolean(usuario));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuario) {
      return;
    }

    Promise.all([listarReservasPublicas(), listarReservasDeUsuario(usuario.id), listarCanchas()])
      .then(([publicas, propias, canchas]) => {
        // Se descartan las reservas en las que el usuario ya participa (incluye las que creó)
        const idsPropias = new Set(propias.map((reserva) => reserva.id));
        const tipos = new Map(canchas.map((cancha) => [cancha.numero, cancha.tipo]));

        setReservas(
          publicas
            .filter((r) => r.estado_reserva !== "cancelada" && esFutura(r) && !idsPropias.has(r.id))
            .map((r) => ({ ...r, tipo: tipos.get(r.numero_cancha) }))
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [usuario]);

  if (!usuario) {
    return (
      <>
        <BarraMenu titulo="Reservas disponibles" />
        <main className="container py-4 text-center">
          <p>Iniciá sesión para ver las reservas a las que te podés unir.</p>
          <Link className="btn btn-primary" to="/cuenta/login">Iniciar sesión</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <BarraMenu titulo="Reservas disponibles" />
      <main className="container py-4">
        <div className="reservas-disponibles__volver">
          <Link className="btn btn-primary btn-sm" to="/mis-reservas">Volver a mis reservas</Link>
        </div>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {cargando && <p className="text-center">Cargando reservas...</p>}

        {!cargando && !error && reservas.length === 0 && (
          <p className="text-center">No hay reservas públicas a las que te puedas unir por el momento.</p>
        )}

        <ul className="reservas-disponibles__lista">
          {reservas.map((reserva) => (
            <li key={reserva.id} className="tarjeta-item">
              <p className="reservas-disponibles__dia">{formatearDia(reserva.dia)}</p>
              <p className="reservas-disponibles__datos">
                {formatearHora(reserva.horario_inicio)} a {formatearHora(reserva.horario_fin)} hs, cancha {reserva.numero_cancha}
                {reserva.tipo && ` (${reserva.tipo})`}
              </p>
              <p className="reservas-disponibles__datos">
                ${Number(reserva.precio).toLocaleString("es-AR")}
              </p>

              <BotonSolicitud idReserva={reserva.id} idUsuario={usuario.id} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
