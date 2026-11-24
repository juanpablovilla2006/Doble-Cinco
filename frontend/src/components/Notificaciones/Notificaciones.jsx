import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import iconoCampana from "../../assets/imagenes/icono-campana.png";
import { useUsuario } from "../../hooks/useUsuario.js";
import {
  listarNotificaciones,
  borrarNotificacion,
  borrarTodasLasNotificaciones
} from "../../services/notificacionService.js";
import "./Notificaciones.css";

const CADA_CUANTO_ACTUALIZAR = 1500; // ms

// A dónde lleva cada tipo de aviso
function destino(notificacion) {
  if (notificacion.tipo === "mensaje") {
    return `/chats/${notificacion.id_reserva}`;
  }

  if (notificacion.tipo === "solicitud_rechazada") {
    return "/reservas-disponibles";
  }

  return `/mis-reservas/${notificacion.id_reserva}`;
}

function formatearMomento(fecha) {
  return new Date(fecha).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Campana de la barra: muestra cuántos avisos hay y los lista al tocarla
export default function Notificaciones() {
  const { usuario } = useUsuario();
  const navigate = useNavigate();
  const idUsuario = usuario?.id;

  const [notificaciones, setNotificaciones] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);

  useEffect(() => {
    if (!idUsuario) {
      return;
    }

    let activo = true;

    async function cargar() {
      try {
        const lista = await listarNotificaciones(idUsuario);
        if (activo) setNotificaciones(lista);
      } catch {
        // Sin conexión con el servidor: se vuelve a intentar en el próximo ciclo
      }
    }

    cargar();
    const intervalo = setInterval(cargar, CADA_CUANTO_ACTUALIZAR);

    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, [idUsuario]);

  // Cierra el menú al hacer clic afuera
  useEffect(() => {
    if (!abierto) {
      return;
    }

    function cerrarSiEsAfuera(evento) {
      if (contenedor.current && !contenedor.current.contains(evento.target)) {
        setAbierto(false);
      }
    }

    document.addEventListener("mousedown", cerrarSiEsAfuera);
    return () => document.removeEventListener("mousedown", cerrarSiEsAfuera);
  }, [abierto]);

  async function abrir(notificacion) {
    setAbierto(false);
    setNotificaciones((anteriores) => anteriores.filter((n) => n.id !== notificacion.id));

    try {
      await borrarNotificacion(notificacion.id, idUsuario);
    } catch {
      // Si falla el borrado, el aviso vuelve a aparecer en el próximo ciclo
    }

    navigate(destino(notificacion));
  }

  async function limpiar() {
    setNotificaciones([]);

    try {
      await borrarTodasLasNotificaciones(idUsuario);
    } catch {
      // Si falla, los avisos vuelven a aparecer en el próximo ciclo
    }
  }

  // Sin sesión no hay avisos: la campana queda de adorno
  if (!usuario) {
    return (
      <button type="button" className="btn p-0 border-0" aria-label="Notificaciones">
        <img src={iconoCampana} alt="" height="38" />
      </button>
    );
  }

  const cantidad = notificaciones.length;

  return (
    <div className="dropdown notificaciones" ref={contenedor}>
      <button
        type="button"
        className="btn p-0 border-0 notificaciones__boton"
        aria-label={cantidad > 0 ? `Notificaciones, ${cantidad} sin leer` : "Notificaciones"}
        aria-expanded={abierto}
        onClick={() => setAbierto(!abierto)}
      >
        <img src={iconoCampana} alt="" height="38" />
        {cantidad > 0 && (
          <span className="notificaciones__contador">{cantidad > 0 && <span className="notificaciones__punto" />}</span>
        )}
      </button>

      <div className={`dropdown-menu top-100 end-0 notificaciones__menu ${abierto ? "show" : ""}`}>
        <div className="notificaciones__encabezado">
          <strong>Notificaciones</strong>
          {cantidad > 0 && (
            <button type="button" className="notificaciones__limpiar" onClick={limpiar}>
              Borrar todas
            </button>
          )}
        </div>

        {cantidad === 0 && <p className="notificaciones__vacio">No tenés notificaciones nuevas.</p>}

        <ul className="notificaciones__lista">
          {notificaciones.map((notificacion) => (
            <li key={notificacion.id}>
              <button type="button" className="dropdown-item notificaciones__item" onClick={() => abrir(notificacion)}>
                <span>{notificacion.descripcion}</span>
                <small>{formatearMomento(notificacion.fecha)}</small>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
