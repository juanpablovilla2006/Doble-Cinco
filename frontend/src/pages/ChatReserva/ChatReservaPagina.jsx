import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import ChatReserva from "../../components/ChatReserva/ChatReserva.jsx";
import { useUsuario } from "../../hooks/useUsuario.js";
import { obtenerReserva } from "../../services/reservaService.js";
import { formatearDia, formatearHora } from "../../utils/fechas.js";
import "./ChatReservaPagina.css";

// Pantalla de un chat: /chats/:id (el id es el de la reserva)
export default function ChatReservaPagina() {
  const { id } = useParams();
  const { usuario } = useUsuario();
  const [reserva, setReserva] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuario) {
      return;
    }

    obtenerReserva(id)
      .then(setReserva)
      .catch((e) => setError(e.message));
  }, [id, usuario]);

  if (!usuario) {
    return (
      <>
        <BarraMenu titulo="Chat" />
        <main className="container py-4 text-center">
          <p>Iniciá sesión para ver el chat.</p>
          <Link className="btn btn-primary" to="/cuenta/login">Iniciar sesión</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <BarraMenu titulo="Chat" />
      <main className="container py-4 chat-pagina">
        <div className="d-flex gap-2 mb-3">
          <Link className="btn btn-primary btn-sm" to="/chats">Volver a mis chats</Link>
          {reserva && (
            <Link className="btn btn-secondary btn-sm" to={`/mis-reservas/${reserva.id}`}>
              Ver detalle de la reserva
            </Link>
          )}
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        {reserva && (
          <>
            <p className="chat-pagina__resumen titulo-seccion">
              {formatearDia(reserva.dia)} · {formatearHora(reserva.horario_inicio)} a {formatearHora(reserva.horario_fin)} hs, cancha {reserva.numero_cancha}
            </p>

            <ChatReserva
              idReserva={reserva.id}
              idUsuario={usuario.id}
              cancelada={reserva.estado_reserva === "cancelada"}
            />

          </>
        )}
      </main>
    </>
  );
}
