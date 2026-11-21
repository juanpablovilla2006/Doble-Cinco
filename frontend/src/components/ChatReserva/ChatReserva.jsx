import { useEffect, useRef, useState } from "react";
import { listarMensajes, enviarMensaje, eliminarMensaje } from "../../services/mensajeService.js";
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

export default function ChatReserva({ idReserva, idUsuario, esCreador, cancelada }) {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [abierto, setAbierto] = useState(null); // NUEVO

  const lista = useRef(null);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        //sin el tercer parámetro, trae la lista completa
        const actuales = await listarMensajes(idReserva, idUsuario);
        if (!activo) return;
        //reemplaza la lista en vez de agregar
        setMensajes(actuales);
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
    //sin `agregar` en las dependencias
  }, [idReserva, idUsuario]);

  // Al llegar mensajes nuevos, baja la lista hasta el último (igual que antes)
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
      //evita repetirlo si el refresco ya lo trajo
      setMensajes((anteriores) =>
        anteriores.some((m) => m.id === nuevo.id) ? anteriores : [...anteriores, nuevo]
      );
      setTexto("");
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  // Tocar un mensaje (si podés borrarlo) muestra u oculta sus puntitos

  async function borrar(id) {
  setError("");
  try {
    await eliminarMensaje(idReserva, id, idUsuario);
    setMensajes((anteriores) => anteriores.filter((m) => m.id !== id));
  } catch (e) {
    setError(e.message);
  } finally {
    setAbierto(null);
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
          const puedeBorrar = !cancelada && (propio || esCreador);
          const seleccionado = abierto?.id === mensaje.id;

          return (
            <div
              key={mensaje.id}
              className={`chat-reserva__mensaje ${propio ? "chat-reserva__mensaje--propio" : ""} ${puedeBorrar ? "chat-reserva__mensaje--clicable" : ""}`}
            >
              {!propio && (
                <span className="chat-reserva__autor">{mensaje.nombre} {mensaje.apellido}</span>
              )}
              <p className="chat-reserva__texto">{mensaje.contenido}</p>
              <span className="chat-reserva__hora">{formatearMomento(mensaje.fecha_enviado)}</span>

              {puedeBorrar && (
                <button
                  type="button"
                  className={`chat-reserva__puntos ${seleccionado ? "chat-reserva__puntos--activo" : ""}`}
                  aria-label="Opciones del mensaje"
                  onClick={() => setAbierto(seleccionado ? null : { id: mensaje.id, paso: "menu" })}
              >
                <i className="bi bi-three-dots"></i>
              </button>
              )}
              
              
              {puedeBorrar && seleccionado && (
                <div className="chat-reserva__opciones" onClick={(evento) => evento.stopPropagation()}>
                  {abierto.paso === "puntos" && (
                    <button
                      type="button"
                      className="chat-reserva__puntos"
                      aria-label="Opciones del mensaje"
                      onClick={() => setAbierto({ id: mensaje.id, paso: "menu" })}
                    >
                      <i className="bi bi-three-dots"></i>
                    </button>
                  )}

                  {abierto.paso === "menu" && (
                    <button
                      type="button"
                      className="chat-reserva__opcion"
                      onClick={() => setAbierto({ id: mensaje.id, paso: "confirmar" })}
                    >
                      Borrar mensaje
                    </button>
                  )}

                  {abierto.paso === "confirmar" && (
                    <div className="chat-reserva__confirmar">
                      <span className="chat-reserva__pregunta">¿Borrar?</span>
                      <button type="button" className="chat-reserva__si" onClick={() => borrar(mensaje.id)}>Sí</button>
                      <button type="button" className="chat-reserva__no" onClick={() => setAbierto(null)}>No</button>
                    </div>
                  )}
                </div>
              )}
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