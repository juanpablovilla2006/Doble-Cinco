import { useEffect, useState } from "react";
import { Link } from "react-router";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import { useUsuario } from "../../hooks/useUsuario.js";
import { listarReservasDeUsuario, eliminarReserva } from "../../services/reservaService.js";
import "./MisReservas.css";
import { formatearDia, formatearHora } from "../../utils/fechas.js";

const ETIQUETA_ESTADO = {
  pendiente: "bg-warning text-dark",
  confirmada: "bg-success",
  cancelada: "bg-danger"
};

export default function MisReservas() {
  const { usuario } = useUsuario();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(Boolean(usuario));
  const [mensaje, setMensaje] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [borrandoId, setBorrandoId] = useState(null);

  useEffect(() => {
    if (!usuario) {
      return;
    }

    listarReservasDeUsuario(usuario.id)
      .then(setReservas)
      .catch((e) => setMensaje({ tipo: "danger", texto: e.message }))
      .finally(() => setCargando(false));
  }, [usuario]);

  async function borrar(id) {
    setMensaje(null);
    setBorrandoId(id);

    try {
      await eliminarReserva(id);
      setReservas((anteriores) => anteriores.filter((reserva) => reserva.id !== id));
      setMensaje({ tipo: "success", texto: "La reserva se eliminó correctamente" });
    } catch (error) {
      setMensaje({ tipo: "danger", texto: error.message });
    } finally {
      setBorrandoId(null);
      setConfirmandoId(null);
    }
  }

  if (!usuario) {
    return (
      <>
        <BarraMenu titulo="Mis reservas" />
        <main className="container py-4 text-center">
          <p>Iniciá sesión para ver tus reservas.</p>
          <Link className="btn btn-primary" to="/cuenta/login">Iniciar sesión</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <BarraMenu titulo="Mis reservas" />
      <main className="container py-4">
        {mensaje && <div className={`alert alert-${mensaje.tipo}`} role="alert">{mensaje.texto}</div>}

        {cargando && <p className="text-center">Cargando reservas...</p>}

        {!cargando && reservas.length === 0 && (
          <div className="text-center">
            <p>Todavía no tenés reservas.</p>
            <Link className="btn btn-primary" to="/reservar">Reservar una cancha</Link>
          </div>
        )}

        <ul className="mis-reservas__lista">
          {reservas.map((reserva) => (
            <li
              key={reserva.id}
              className={`card mis-reservas__item ${reserva.estado_reserva === "cancelada" ? "mis-reservas__item--cancelada" : ""}`}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <p className="mis-reservas__dia">{formatearDia(reserva.dia)}</p>
                  <span className={`badge ${ETIQUETA_ESTADO[reserva.estado_reserva] ?? "bg-secondary"}`}>
                    {reserva.estado_reserva}
                  </span>
                </div>

                <p className="mis-reservas__datos">
                  {formatearHora(reserva.horario_inicio)} a {formatearHora(reserva.horario_fin)} hs, cancha {reserva.numero_cancha}
                </p>
                <p className="mis-reservas__datos">
                  ${Number(reserva.precio).toLocaleString("es-AR")} · {reserva.estado_pago ? "Pagada" : "Sin pagar"} · {reserva.visibilidad ? "Pública" : "Privada"}
                </p>

                {confirmandoId === reserva.id ? (
                  <div className="alert alert-danger mt-3 mb-0">
                    <p>¿Seguro que querés eliminar esta reserva? Se borran también sus participantes, equipos y chat.</p>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => borrar(reserva.id)}
                        disabled={borrandoId === reserva.id}
                      >
                        {borrandoId === reserva.id ? "Eliminando..." : "Sí, eliminar"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setConfirmandoId(null)}
                        disabled={borrandoId === reserva.id}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                    <div className="d-flex gap-2 mt-3">
                      <Link className="btn btn-primary btn-sm" to={`/mis-reservas/${reserva.id}`}> Ver reserva</Link>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setConfirmandoId(reserva.id)} disabled={borrandoId !== null}> Eliminar reserva
                      </button>
                    </div>
                  )}
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
