import { useEffect, useState } from "react";
import { listarCanchas } from "../services/canchaService.js";
import { listarReservasPublicas, listarReservasDeUsuario } from "../services/reservaService.js";
import { esFutura } from "../utils/fechas.js";
import { useUsuario } from "./useUsuario.js";

// Reservas públicas a las que se puede pedir unirse: futuras, no canceladas, con lugar
// y (si hay sesión) sin las que el usuario ya integra, incluidas las que creó.
// Cada reserva trae el tipo de cancha, la capacidad y los lugares que quedan.
export function useReservasDisponibles() {
  const { usuario } = useUsuario();
  const [reservas, setReservas] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      listarReservasPublicas(),
      usuario ? listarReservasDeUsuario(usuario.id) : [],
      listarCanchas()
    ])
      .then(([publicas, propias, todasLasCanchas]) => {
        const idsPropias = new Set(propias.map((reserva) => reserva.id));
        const porNumero = new Map(todasLasCanchas.map((cancha) => [cancha.numero, cancha]));

        setCanchas(todasLasCanchas);
        setReservas(
          publicas
            .filter((r) => r.estado_reserva !== "cancelada" && esFutura(r) && !idsPropias.has(r.id))
            .map((r) => {
              const cancha = porNumero.get(r.numero_cancha);
              return {
                ...r,
                tipo: cancha?.tipo,
                capacidad: cancha?.capacidad,
                lugares: cancha ? cancha.capacidad - r.cantidad_participantes : null
              };
            })
            .filter((r) => r.lugares === null || r.lugares > 0)
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [usuario]);

  return { reservas, canchas, cargando, error };
}