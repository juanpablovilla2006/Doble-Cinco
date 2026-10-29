import { useEffect, useState } from "react";
import { Link } from "react-router";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import CanchaItem from "../../components/CanchaItem/CanchaItem.jsx";
import { listarCanchas } from "../../services/canchaService.js";
import { listarReservasPublicas } from "../../services/reservaService.js";
import "./Inicio.css";

const CANTIDAD_RESERVAS = 3;
const CANTIDAD_CANCHAS = 3;

function esFutura(reserva) {
  const ahora = new Date().toLocaleString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" });
  const [dia, hora] = ahora.split(" ");
  return reserva.dia > dia || (reserva.dia === dia && reserva.horario_inicio > hora);
}

function formatearDia(dia) {
  const [anio, mes, d] = dia.split("-");
  return `${d}/${mes}/${anio}`;
}

export default function Inicio() {
  const [reservas, setReservas] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([listarReservasPublicas(), listarCanchas()])
      .then(([reservasPublicas, todasLasCanchas]) => {
        setReservas(
          reservasPublicas
            .filter((r) => r.estado_reserva !== "cancelada" && esFutura(r))
            .slice(0, CANTIDAD_RESERVAS)
        );
        setCanchas(todasLasCanchas.filter((c) => c.habilitada).slice(0, CANTIDAD_CANCHAS));
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <>
      <BarraMenu titulo="Doble Cinco" conLogo />
      <main className="container py-4 inicio">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {cargando && <p className="text-muted">Cargando...</p>}

        {!cargando && (
          <>
            <section>
              <h2 className="inicio__seccion">Reservas disponibles</h2>

              {reservas.length === 0 ? (
                <p className="text-muted">No hay reservas disponibles por el momento.</p>
              ) : (
                <div className="row g-3">
                  {reservas.map((r) => (
                    <div className="col-12 col-md-4" key={r.id}>
                      <article className="tarjeta-item inicio__reserva">
                        <p className="inicio__fecha">
                          {formatearDia(r.dia)} · {r.horario_inicio.slice(0, 5)} a {r.horario_fin.slice(0, 5)}
                        </p>
                        <p className="inicio__cancha">Cancha {r.numero_cancha}</p>
                        <p className="inicio__precio">${r.precio}</p>
                      </article>
                    </div>
                  ))}
                </div>
              )}

              <Link className="btn btn-primary mt-3" to="/reservar">
                Reservar una cancha
              </Link>
            </section>

            <section className="mt-5">
              <h2 className="inicio__seccion">Canchas disponibles</h2>
              <ul className="list-unstyled d-flex flex-column gap-3 mb-2 inicio__canchas">
                {canchas.map((cancha) => <CanchaItem key={cancha.numero} cancha={cancha} />)}
              </ul>
              <Link to="/canchas" className="inicio__vermas">Ver todas</Link>
            </section>
          </>
        )}
      </main>
    </>
  );
}