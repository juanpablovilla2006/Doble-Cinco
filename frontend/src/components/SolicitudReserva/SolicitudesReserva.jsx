import { useEffect, useState } from "react";
import { listarSolicitudes, resolverSolicitud } from "../../services/solicitudService.js";

// Solicitudes pendientes de una reserva, para que el creador las acepte o rechace.
// onAceptada: se llama después de aceptar, para que la pantalla recargue los participantes
export default function SolicitudesReserva({ idReserva, idUsuario, onAceptada }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [procesandoId, setProcesandoId] = useState(null);

  useEffect(() => {
    listarSolicitudes(idReserva, idUsuario, "pendiente")
      .then(setSolicitudes)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [idReserva, idUsuario]);

  async function resolver(id, estado) {
    setError("");
    setProcesandoId(id);

    try {
      await resolverSolicitud(idReserva, id, idUsuario, estado);
      // Ya no está pendiente: sale de la lista
      setSolicitudes((anteriores) => anteriores.filter((s) => s.id !== id));
      if (estado === "aceptada") onAceptada?.();
    } catch (e) {
      // Por ejemplo 409 si se llenó la cancha
      setError(e.message);
    } finally {
      setProcesandoId(null);
    }
  }

  return (
    <section className="tarjeta-item mt-4">
      <h2 className="h5">Solicitudes pendientes ({solicitudes.length})</h2>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {cargando && <p>Cargando solicitudes...</p>}
      {!cargando && solicitudes.length === 0 && <p>No hay solicitudes pendientes.</p>}

      <ul className="list-group">
        {solicitudes.map((solicitud) => (
          <li key={solicitud.id} className="list-group-item d-flex justify-content-between align-items-center gap-2">
            <span>{solicitud.nombre} {solicitud.apellido}</span>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => resolver(solicitud.id, "aceptada")} disabled={procesandoId !== null}>
                Aceptar
              </button>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => resolver(solicitud.id, "rechazada")} disabled={procesandoId !== null}>
                Rechazar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
