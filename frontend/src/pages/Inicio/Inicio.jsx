import { useReservasDisponibles } from "../../hooks/useReservasDisponibles.js";
import { textoCupo } from "../../utils/cupo.js";
import { Link } from "react-router";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import CanchaItem from "../../components/CanchaItem/CanchaItem.jsx";
import { useUsuario } from "../../hooks/useUsuario.js";
import BotonSolicitud from "../../components/BotonSolicitud/BotonSolicitud.jsx";
import "./Inicio.css";

const CANTIDAD_RESERVAS = 3;
const CANTIDAD_CANCHAS = 3;

function formatearDia(dia) {
  const [anio, mes, d] = dia.split("-");
  return `${d}/${mes}/${anio}`;
}

export default function Inicio() {
  const { usuario } = useUsuario();
  const { reservas: disponibles, canchas: todasLasCanchas, cargando, error } = useReservasDisponibles();
  const reservas = disponibles.slice(0, CANTIDAD_RESERVAS);
  const canchas = todasLasCanchas.filter((c) => c.habilitada).slice(0, CANTIDAD_CANCHAS);

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
                        <p className="inicio__cancha">Cancha {r.numero_cancha}{r.tipo && ` · ${r.tipo}`}</p>{r.capacidad && <p className="inicio__cupo">{textoCupo(r)}</p>}
                        <p className="inicio__precio">${r.precio}</p>
                        {usuario?.id !== r.id_creador && (
                          <BotonSolicitud idReserva={r.id} idUsuario={usuario?.id} />
                        )}
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