import { useState } from "react";
import { Link } from "react-router";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import BotonSolicitud from "../../components/BotonSolicitud/BotonSolicitud.jsx";
import { useUsuario } from "../../hooks/useUsuario.js";
import { useReservasDisponibles } from "../../hooks/useReservasDisponibles.js";
import { textoCupo } from "../../utils/cupo.js";
import { fechaLimiteReserva, fechaMinimaReserva, formatearDia, formatearHora } from "../../utils/fechas.js";
import "./ReservasDisponibles.css";

export default function ReservasDisponibles() {
  const { usuario } = useUsuario();
  const { reservas, cargando, error } = useReservasDisponibles();
  const [filtros, setFiltros] = useState({ dia: "", tipo: "" });

  const tipos = [...new Set(reservas.map((r) => r.tipo).filter(Boolean))];
  const filtradas = reservas.filter(
    (r) => (!filtros.dia || r.dia === filtros.dia) && (!filtros.tipo || r.tipo === filtros.tipo)
  );

  function cambiarFiltro(e) {
    setFiltros((anteriores) => ({ ...anteriores, [e.target.name]: e.target.value }));
  }

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

        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {cargando && <p className="text-center">Cargando reservas...</p>}

        {!cargando && !error && reservas.length > 0 && (
          <form className="reservas-disponibles__filtros row g-2 align-items-end">
            <div className="col-12 col-sm-5">
              <label className="form-label" htmlFor="dia">Día</label>
              <input
                id="dia"
                name="dia"
                type="date"
                className="form-control"
                min={fechaMinimaReserva()}
                max={fechaLimiteReserva()}
                value={filtros.dia}
                onChange={cambiarFiltro}
              />
            </div>
            <div className="col-12 col-sm-5">
              <label className="form-label" htmlFor="tipo">Tipo de cancha</label>
              <select id="tipo" name="tipo" className="form-select" value={filtros.tipo} onChange={cambiarFiltro}>
                <option value="">Cualquiera</option>
                {tipos.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-sm-2">
              <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={() => setFiltros({ dia: "", tipo: "" })}
              >
                Limpiar
              </button>
            </div>
          </form>
        )}

        {!cargando && !error && reservas.length === 0 && (
          <p className="text-center">No hay reservas públicas a las que te puedas unir por el momento.</p>
        )}

        {!cargando && reservas.length > 0 && filtradas.length === 0 && (
          <p className="text-center">Ninguna reserva coincide con los filtros elegidos.</p>
        )}

        <ul className="reservas-disponibles__lista">
          {filtradas.map((reserva) => (
            <li key={reserva.id} className="tarjeta-item">
              <p className="reservas-disponibles__dia">{formatearDia(reserva.dia)}</p>
              <p className="reservas-disponibles__datos">
                {formatearHora(reserva.horario_inicio)} a {formatearHora(reserva.horario_fin)} hs, cancha {reserva.numero_cancha}
                {reserva.tipo && ` (${reserva.tipo})`}
              </p>
              <p className="reservas-disponibles__datos">
                ${Number(reserva.precio).toLocaleString("es-AR")}
              </p>
              {reserva.capacidad && <p className="reservas-disponibles__cupo">{textoCupo(reserva)}</p>}

              <BotonSolicitud idReserva={reserva.id} idUsuario={usuario.id} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}