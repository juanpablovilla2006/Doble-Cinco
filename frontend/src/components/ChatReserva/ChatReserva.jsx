import { useCallback, useEffect, useRef, useState } from "react";
import { listarMensajes, enviarMensaje } from "../../services/mensajeService.js";
import "./ChatReserva.css";

const CADA_CUANTO_ACTUALIZAR = 5000; // ms
const LARGO_MAXIMO = 500;

function formatearMomento(fecha) {
  return new Date(fecha).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Chat de la reserva. Se actualiza solo cada pocos segundos.
// cancelada: la reserva está cancelada, el chat queda en solo lectura
export default function ChatReserva({ idReserva, idUsuario, cancelada }) {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const ultimoId = useRef(0);
  const lista = useRef(null);

  // Suma mensajes sin repetir ninguno (un refresco y un envío pueden traer el mismo)
  const agregar = useCallback((nuevos) => {
    if (nuevos.length === 0) return;

    setMensajes((anteriores) => {
      const ids = new Set(anteriores.map((m) => m.id));
      return [...anteriores, ...nuevos.filter((m) => !ids.has(m.id))];
    });
    ultimoId.current = Math.max(ultimoId.current, ...nuevos.map((m) => m.id));
  }, []);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const nuevos = await listarMensajes(idReserva, idUsuario, ultimoId.current || undefined);
        if (!activo) return;
        agregar(nuevos);
        setError("");
      } catch (e) {
        if (activo) setError(e.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargar();
    const intervalo = setInterval(cargar, CADA_CUANTO_ACTUALIZAR);

    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, [idReserva, idUsuario, agregar]);

  // Al llegar mensajes nuevos, baja la lista hasta el último
  useEffect(() => {
    if (lista.current) {
      lista.current.scrollTop = lista.current.scrollHeight;
    }
  }, [mensajes.length]);

  async function enviar(evento) {
    evento.preventDefault();
    if (!texto.trim() || enviando) return;

    setError("");
    setEnviando(true);

    try {
      const nuevo = await enviarMensaje(idReserva, idUsuario, texto);
      agregar([nuevo]);
      setTexto("");
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="mt-4 chat-reserva">
      <h2 className="h5 titulo-seccion">Chat de la reserva</h2>

      <div className="chat-reserva__lista" ref={lista}>
        {cargando && <p className="text-muted mb-0">Cargando mensajes...</p>}
        {!cargando && mensajes.length === 0 && (
          <p className="text-muted mb-0">Todavía no hay mensajes. ¡Escribí el primero!</p>
        )}

        {mensajes.map((mensaje) => {
          const propio = mensaje.id_usuario === idUsuario;

          return (
            <div key={mensaje.id} className={`chat-reserva__mensaje ${propio ? "chat-reserva__mensaje--propio" : ""}`}>
              {!propio && (
                <span className="chat-reserva__autor">{mensaje.nombre} {mensaje.apellido}</span>
              )}
              <p className="chat-reserva__texto">{mensaje.contenido}</p>
              <span className="chat-reserva__hora">{formatearMomento(mensaje.fecha_enviado)}</span>
            </div>
          );
        })}
      </div>

      {error && <div className="alert alert-danger mt-2 mb-0" role="alert">{error}</div>}

      {cancelada ? (
        <p className="text-muted mt-2 mb-0">La reserva está cancelada: el chat quedó en solo lectura.</p>
      ) : (
        <form className="d-flex gap-2 mt-2" onSubmit={enviar}>
          <input
            type="text"
            className="form-control"
            aria-label="Escribir un mensaje"
            placeholder="Escribí un mensaje"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            maxLength={LARGO_MAXIMO}
            disabled={enviando}
          />
          <button type="submit" className="btn chat-reserva__enviar" disabled={enviando || !texto.trim()}>
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        </form>
      )}
    </section>
  );
}
