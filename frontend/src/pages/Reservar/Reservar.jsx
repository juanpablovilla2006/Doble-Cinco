import { useEffect, useState } from "react";
import { Link } from "react-router";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import { useUsuario } from "../../hooks/useUsuario.js";
import { listarCanchas } from "../../services/canchaService.js";
import { buscarCanchasDisponibles, crearReserva } from "../../services/reservaService.js"
import "./Reservar.css";
import { HORARIOS_DE_INICIO, horariosDeFin } from "../../utils/horarios.js";

// Fecha de hoy en formato YYYY-MM-DD según la hora local (no UTC)
function hoy() {
  return new Date().toLocaleDateString("sv-SE");
}

const FILTROS_INICIALES = { dia: "", horario_inicio: "", horario_fin: "", tipo: "" };

export default function Reservar() {
  const { usuario } = useUsuario();

  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [tipos, setTipos] = useState([]);
  const [canchas, setCanchas] = useState(null); // null = todavía no se buscó
  const [seleccionada, setSeleccionada] = useState(null);
  const [publica, setPublica] = useState(false);

  const [buscando, setBuscando] = useState(false);
  const [reservando, setReservando] = useState(false);
  const [error, setError] = useState("");
  const [detalles, setDetalles] = useState([]);
  const [reservaCreada, setReservaCreada] = useState(null);

  // Tipos de cancha para el filtro (se sacan de las canchas existentes)
  useEffect(() => {
    listarCanchas()
      .then((lista) => setTipos([...new Set(lista.map((c) => c.tipo))]))
      .catch(() => setTipos([]));
  }, []);

  function cambiarFiltro(e) {
    const { name, value } = e.target;
    const nuevos = { ...filtros, [name]: value };

    // Si el fin ya no cumple la duración mínima con el nuevo inicio, se borra
    if (name === "horario_inicio" && !horariosDeFin(value).includes(nuevos.horario_fin)) {
      nuevos.horario_fin = "";
    }

    setFiltros(nuevos);
    // Si cambia el turno, los resultados anteriores ya no sirven
    setCanchas(null);
    setSeleccionada(null);
    setReservaCreada(null);
    setError("");
    setDetalles([]);
  }

  function manejarError(err) {
    setError(err.message ?? "Ocurrió un error inesperado");
    setDetalles(err.detalles ?? []);
  }

  async function buscar(e) {
    e.preventDefault();
    setError("");
    setDetalles([]);

    if (filtros.dia < hoy()) {
      setError("El día no puede ser anterior a hoy");
      return;
    }
    if (filtros.horario_fin <= filtros.horario_inicio) {
      setError("El horario de fin tiene que ser posterior al de inicio");
      return;
    }

    setBuscando(true);
    try {
      const resultado = await buscarCanchasDisponibles(filtros);
      setCanchas(resultado);
      setSeleccionada(null);
    } catch (err) {
      manejarError(err);
    } finally {
      setBuscando(false);
    }
  }

  async function reservar() {
    setError("");
    setDetalles([]);
    setReservando(true);
    try {
      const nueva = await crearReserva({
        numero_cancha: seleccionada.numero,
        id_creador: usuario.id,
        dia: filtros.dia,
        horario_inicio: filtros.horario_inicio,
        horario_fin: filtros.horario_fin,
        visibilidad: publica
      });
      setReservaCreada(nueva);
      setCanchas(null);
      setSeleccionada(null);
      setFiltros(FILTROS_INICIALES);
    } catch (err) {
      manejarError(err);
      // Si alguien tomó el turno mientras tanto, hay que volver a buscar
      if (err.status === 409) setCanchas(null);
    } finally {
      setReservando(false);
    }
    if (!usuario) {
    return (
      <>
        <BarraMenu titulo="Reservar" />
        <main className="container py-4 reservar text-center">
          <p className="mb-4">Tenés que iniciar sesión para reservar una cancha.</p>
          <div className="d-grid gap-3">
            <Link className="btn btn-primary btn-lg" to="/cuenta/login">
              Iniciar sesión
            </Link>
            <Link className="btn btn-outline-primary btn-lg" to="/cuenta/registro">
              Registrarte
            </Link>
          </div>
        </main>
      </>
    );
  }
  }

  return (
    <>
      <BarraMenu titulo="Reservar" />
      <main className="container py-4 reservar">
        {!usuario && (
          <div className="alert alert-warning">
            Tenés que iniciar sesión para reservar.{" "}
            <Link to="/cuenta/login">Ir al login</Link>
          </div>
        )}

        {reservaCreada && (
          <div className="alert alert-success">
            ¡Reserva creada! Cancha {reservaCreada.numero_cancha}, {reservaCreada.dia} de{" "}
            {reservaCreada.horario_inicio.slice(0, 5)} a {reservaCreada.horario_fin.slice(0, 5)}.{" "}
            <Link to="/mis-reservas">Ver mis reservas</Link>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            <p className="mb-0">{error}</p>
            {detalles.length > 0 && (
              <ul className="mb-0 mt-2">
                {detalles.map((d, i) => (
                  <li key={i}>
                    {d.campo ? `${d.campo}: ` : ""}
                    {d.mensaje}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form className="reservar__form" onSubmit={buscar}>
          <div>
            <label className="form-label" htmlFor="dia">Día</label>
            <input
              id="dia"
              name="dia"
              type="date"
              className="form-control"
              min={hoy()}
              value={filtros.dia}
              onChange={cambiarFiltro}
              required
            />
          </div>

          <div className="reservar__horarios">
            <div>
              <label className="form-label" htmlFor="horario_inicio">Desde</label>
              <select id="horario_inicio" name="horario_inicio" className="form-select" value={filtros.horario_inicio} onChange={cambiarFiltro} required>
                <option value="">Elegí</option>
                {HORARIOS_DE_INICIO.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="horario_fin">Hasta</label>
              <select
                id="horario_fin" name="horario_fin" className="form-select" value={filtros.horario_fin} onChange={cambiarFiltro} disabled={!filtros.horario_inicio} required>
                <option value="">Elegí</option>
                {horariosDeFin(filtros.horario_inicio).map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="tipo">Tipo de cancha</label>
            <select
              id="tipo"
              name="tipo"
              className="form-select"
              value={filtros.tipo}
              onChange={cambiarFiltro}
            >
              <option value="">Cualquiera</option>
              {tipos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={buscando}>
            {buscando ? "Buscando..." : "Buscar canchas disponibles"}
          </button>
        </form>

        {canchas && canchas.length === 0 && (
          <p className="text-center mt-4">No hay canchas disponibles para ese día y horario.</p>
        )}

        {canchas && canchas.length > 0 && (
          <section className="mt-4">
            <h2 className="h5">Elegí una cancha</h2>
            <div className="reservar__canchas">
              {canchas.map((c) => (
                <button
                  key={c.numero}
                  type="button"
                  className={`reservar__cancha ${seleccionada?.numero === c.numero ? "reservar__cancha--activa" : ""}`}
                  onClick={() => setSeleccionada(c)}
                >
                  <strong>Cancha {c.numero}</strong>
                  <span>{c.tipo}</span>
                  <span>{c.capacidad} jugadores</span>
                  <span>${Number(c.precio).toLocaleString("es-AR")}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {seleccionada && (
          <section className="mt-4 reservar__confirmar">
            <div className="form-check form-switch">
              <input
                id="publica"
                type="checkbox"
                className="form-check-input"
                checked={publica}
                onChange={(e) => setPublica(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="publica">
                Reserva pública (otros jugadores pueden verla y pedir unirse)
              </label>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={reservar}
              disabled={!usuario || reservando}
            >
              {reservando ? "Reservando..." : `Reservar cancha ${seleccionada.numero}`}
            </button>
          </section>
        )}
      </main>
    </>
  );
}