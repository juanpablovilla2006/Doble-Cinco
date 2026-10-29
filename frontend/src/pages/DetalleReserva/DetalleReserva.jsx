import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario.jsx";
import EquipoItem from "../../components/EquipoItem/EquipoItem.jsx";
import { useUsuario } from "../../hooks/useUsuario.js";
import { obtenerCancha } from "../../services/canchaService.js";
import {
  obtenerReserva,
  actualizarReserva,
  listarParticipantes,
  quitarParticipante
} from "../../services/reservaService.js";
import { listarEquipos, crearEquipo } from "../../services/equipoService.js";
import { formatearDia, formatearHora } from "../../utils/fechas.js";
import "./DetalleReserva.css";

const ETIQUETA_ESTADO = {
  pendiente: "bg-warning text-dark",
  confirmada: "bg-success",
  cancelada: "bg-danger"
};

const MAX_EQUIPOS = 2;

export default function DetalleReserva() {
  const { id } = useParams();
  const { usuario } = useUsuario();

  const [reserva, setReserva] = useState(null);
  const [cancha, setCancha] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(Boolean(usuario));
  const [mensaje, setMensaje] = useState(null);

  const [cambiandoVisibilidad, setCambiandoVisibilidad] = useState(false);
  const [confirmandoQuitarId, setConfirmandoQuitarId] = useState(null);
  const [quitandoId, setQuitandoId] = useState(null);
  const [confirmandoCancelacion, setConfirmandoCancelacion] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  const [nombreEquipo, setNombreEquipo] = useState("");
  const [errorEquipo, setErrorEquipo] = useState("");
  const [creandoEquipo, setCreandoEquipo] = useState(false);

  useEffect(() => {
    if (!usuario) return;

    Promise.all([obtenerReserva(id), listarParticipantes(id), listarEquipos(id)])
      .then(async ([reservaCargada, participantesCargados, equiposCargados]) => {
        const canchaCargada = await obtenerCancha(reservaCargada.numero_cancha);

        setReserva(reservaCargada);
        setCancha(canchaCargada);
        setParticipantes(participantesCargados);
        setEquipos(equiposCargados);
      })
      .catch((e) => setMensaje({ tipo: "danger", texto: e.message }))
      .finally(() => setCargando(false));
  }, [id, usuario]);

  // Solo el creador puede modificar la reserva, y no si está cancelada
  const esCreador = Boolean(usuario && reserva && usuario.id === reserva.id_creador);
  const puedeGestionar = esCreador && reserva.estado_reserva !== "cancelada";

  // Participantes que todavía no están en ningún equipo
  const idsConEquipo = new Set(equipos.flatMap((equipo) => equipo.participantes.map((p) => p.id)));
  const sinEquipo = participantes.filter((participante) => !idsConEquipo.has(participante.id));

  function equipoDe(idUsuario) {
    return equipos.find((equipo) => equipo.participantes.some((p) => p.id === idUsuario))?.tipo;
  }

  async function cambiarVisibilidad(evento) {
    const visibilidad = evento.target.checked;
    setMensaje(null);
    setCambiandoVisibilidad(true);

    try {
      const actualizada = await actualizarReserva(reserva.id, { visibilidad });
      setReserva(actualizada);
      setMensaje({
        tipo: "success",
        texto: actualizada.visibilidad ? "La reserva ahora es pública" : "La reserva ahora es privada"
      });
    } catch (error) {
      setMensaje({ tipo: "danger", texto: error.message });
    } finally {
      setCambiandoVisibilidad(false);
    }
  }

  async function cancelar() {
  setMensaje(null);
  setCancelando(true);

  try {
    const actualizada = await actualizarReserva(reserva.id, {
      estado_reserva: "cancelada",
      visibilidad: false
    });
    setReserva(actualizada);
    setMensaje({ tipo: "success", texto: "La reserva se canceló correctamente" });
  } catch (error) {
    setMensaje({ tipo: "danger", texto: error.message });
  } finally {
    setCancelando(false);
    setConfirmandoCancelacion(false);
  }
}

  async function quitar(idUsuario) {
    setMensaje(null);
    setQuitandoId(idUsuario);

    try {
      await quitarParticipante(reserva.id, idUsuario);
      setParticipantes((anteriores) => anteriores.filter((p) => p.id !== idUsuario));

      setEquipos((anteriores) =>
        anteriores.map((equipo) => ({
          ...equipo,
          participantes: equipo.participantes.filter((p) => p.id !== idUsuario)
        }))
      );
      setMensaje({ tipo: "success", texto: "El participante se quitó de la reserva" });
    } catch (error) {
      setMensaje({ tipo: "danger", texto: error.message });
    } finally {
      setQuitandoId(null);
      setConfirmandoQuitarId(null);
    }
  }

  async function crearNuevoEquipo(evento) {
    evento.preventDefault();
    setErrorEquipo("");
    setMensaje(null);
    setCreandoEquipo(true);

    try {
      const nuevo = await crearEquipo(reserva.id, { tipo: nombreEquipo });
      setEquipos((anteriores) => [...anteriores, nuevo]);
      setNombreEquipo("");
      setMensaje({ tipo: "success", texto: "El equipo se creó correctamente" });
    } catch (error) {
      if (error.status === 400) {
        setErrorEquipo(error.detalles[0]?.mensaje ?? error.message);
      } else if (error.status === 409) {
        setErrorEquipo(error.message);
      } else {
        setMensaje({ tipo: "danger", texto: error.message });
      }
    } finally {
      setCreandoEquipo(false);
    }
  }

  function reemplazarEquipo(actualizado) {
    setEquipos((anteriores) => anteriores.map((equipo) => (equipo.id === actualizado.id ? actualizado : equipo)));
  }

  function quitarEquipo(idEquipo) {
    setEquipos((anteriores) => anteriores.filter((equipo) => equipo.id !== idEquipo));
  }

  if (!usuario) {
    return (
      <>
        <BarraMenu titulo="Detalle de reserva" />
        <main className="container py-4 text-center">
          <p>Iniciá sesión para ver la reserva.</p>
          <Link className="btn btn-primary" to="/cuenta/login">Iniciar sesión</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <BarraMenu titulo="Detalle de reserva" />
      <main className="container py-4 detalle-reserva">
        <Link className="detalle-reserva__volver" to="/mis-reservas">Volver a mis reservas</Link>

        {mensaje && <div className={`alert alert-${mensaje.tipo}`} role="alert">{mensaje.texto}</div>}

        {cargando && <p className="text-center">Cargando reserva...</p>}

        {reserva && (
          <>
            {reserva.estado_reserva === "cancelada" && (
              <div className="alert alert-warning">La reserva está cancelada, ya no se puede modificar.</div>
            )}

            <section
              className={`card detalle-reserva__resumen ${reserva.estado_reserva === "cancelada" ? "detalle-reserva__resumen--cancelada" : ""}`}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <p className="detalle-reserva__dia">{formatearDia(reserva.dia)}</p>
                  <span className={`badge ${ETIQUETA_ESTADO[reserva.estado_reserva] ?? "bg-secondary"}`}>
                    {reserva.estado_reserva}
                  </span>
                </div>

                <p className="detalle-reserva__datos">
                  {formatearHora(reserva.horario_inicio)} a {formatearHora(reserva.horario_fin)} hs, cancha {reserva.numero_cancha}
                  {cancha && ` (${cancha.tipo})`}
                </p>
                <p className="detalle-reserva__datos">
                  ${Number(reserva.precio).toLocaleString("es-AR")} · {reserva.estado_pago ? "Pagada" : "Sin pagar"}
                </p>

                <div className="form-check form-switch mt-3 mb-0">
                  <input
                    id="visibilidad"
                    type="checkbox"
                    className="form-check-input"
                    checked={reserva.visibilidad}
                    onChange={cambiarVisibilidad}
                    disabled={!puedeGestionar || cambiandoVisibilidad}
                  />
                  <label className="form-check-label" htmlFor="visibilidad">
                    {reserva.visibilidad
                      ? "Reserva pública (otros jugadores pueden verla y pedir unirse)"
                      : "Reserva privada (solo se puede unir quien tenga la invitación)"}
                  </label>
                </div>
                  {puedeGestionar && (confirmandoCancelacion ? (
                      <div className="alert alert-danger mt-3 mb-0">
                        <p>¿Seguro que querés cancelar esta reserva? Se libera el horario y después ya no la vas a poder modificar.</p>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-danger btn-sm" onClick={cancelar} disabled={cancelando}>
                            {cancelando ? "Cancelando..." : "Sí, cancelar reserva"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setConfirmandoCancelacion(false)}
                            disabled={cancelando}
                          >
                            Volver
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm mt-3"
                        onClick={() => setConfirmandoCancelacion(true)}
                        disabled={cambiandoVisibilidad}
                      >
                        Cancelar reserva
                      </button>
                    )
                )}
              </div>
            </section>

            <section className="mt-4">
              <h2 className="h5">
                Participantes{cancha && ` (${participantes.length} de ${cancha.capacidad})`}
              </h2>

              <ul className="list-group">
                {participantes.map((participante) => (
                  <li
                    key={participante.id}
                    className="list-group-item d-flex justify-content-between align-items-center gap-2"
                  >
                    <div>
                      <span>{participante.nombre} {participante.apellido}</span>
                      {participante.es_creador && <span className="badge bg-primary ms-2">Creador</span>}
                      {equipoDe(participante.id) && (
                        <span className="badge bg-secondary ms-2">{equipoDe(participante.id)}</span>
                      )}
                    </div>

                    {puedeGestionar && !participante.es_creador && (
                      confirmandoQuitarId === participante.id ? (
                        <div className="d-flex align-items-center gap-2">
                          <span>¿Quitarlo?</span>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => quitar(participante.id)}
                            disabled={quitandoId === participante.id}
                          >
                            {quitandoId === participante.id ? "Quitando..." : "Sí"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setConfirmandoQuitarId(null)}
                            disabled={quitandoId === participante.id}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setConfirmandoQuitarId(participante.id)}
                          disabled={quitandoId !== null}
                        >
                          Quitar
                        </button>
                      )
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-4">
              <h2 className="h5">Equipos ({equipos.length} de {MAX_EQUIPOS})</h2>

              {equipos.length === 0 && <p>Todavía no hay equipos en esta reserva.</p>}

              <ul className="list-unstyled d-flex flex-column gap-3">
                {equipos.map((equipo) => (
                  <EquipoItem
                    key={equipo.id}
                    equipo={equipo}
                    idReserva={reserva.id}
                    disponibles={sinEquipo}
                    puedeGestionar={puedeGestionar}
                    onActualizado={reemplazarEquipo}
                    onEliminado={quitarEquipo}
                    onMensaje={setMensaje}
                  />
                ))}
              </ul>

              {puedeGestionar && equipos.length < MAX_EQUIPOS && (
                <form onSubmit={crearNuevoEquipo}>
                  <h3 className="h6">Nuevo equipo</h3>
                  <fieldset disabled={creandoEquipo}>
                    <CampoFormulario
                      etiqueta="Nombre del equipo"
                      nombre="tipo-nuevo"
                      valor={nombreEquipo}
                      onChange={(evento) => setNombreEquipo(evento.target.value)}
                      error={errorEquipo}
                      required
                      maxLength={30}
                    />
                    <button type="submit" className="btn btn-primary">
                      {creandoEquipo ? "Creando..." : "Crear equipo"}
                    </button>
                  </fieldset>
                </form>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}