import { useState } from "react";
import { Link } from "react-router";
import { crearSolicitud } from "../../services/solicitudService.js";

// Botón "Pedir unirse" para una reserva pública.
// idUsuario: usuario logueado (undefined si no hay sesión)
export default function BotonSolicitud({ idReserva, idUsuario }) {
  const [estado, setEstado] = useState("inicial"); // inicial | enviando | enviada
  const [error, setError] = useState("");

  async function pedirUnirse() {
    setError("");
    setEstado("enviando");

    try {
      await crearSolicitud(idReserva, idUsuario);
      setEstado("enviada");
    } catch (e) {
      // 409: ya es participante o ya tiene una pendiente; 403/404: reserva privada o inexistente
      setError(e.message);
      setEstado("inicial");
    }
  }

  if (!idUsuario) {
    return <Link className="btn btn-primary btn-sm mt-2" to="/cuenta/login">Iniciá sesión para unirte</Link>;
  }

  if (estado === "enviada") {
    return <p className="mt-2 mb-0">Solicitud enviada. El creador tiene que aceptarla.</p>;
  }

  return (
    <div className="mt-2">
      <button type="button" className="btn btn-primary btn-sm" onClick={pedirUnirse} disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando..." : "Pedir unirse"}
      </button>
      {error && <p className="text-danger mt-2 mb-0">{error}</p>}
    </div>
  );
}
