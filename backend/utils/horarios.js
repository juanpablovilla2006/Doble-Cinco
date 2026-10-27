// Reglas de los turnos: los horarios van de a 15 minutos y la reserva dura al menos 1 hora
export const MINUTOS_POR_PASO = 15;
export const DURACION_MINIMA = 60;

// Minutos desde las 00:00 de un horario "HH:MM" o "HH:MM:SS"
function aMinutos(horario) {
  return Number(horario.slice(0, 2)) * 60 + Number(horario.slice(3, 5));
}

export function minutosEntre(inicio, fin) {
  return aMinutos(fin) - aMinutos(inicio);
}

// Válido si los minutos son 00, 15, 30 o 45 y no trae segundos
export function esHorarioDeTurno(horario) {
  const sinSegundos = horario.length === 5 || horario.slice(6, 8) === "00";
  return sinSegundos && aMinutos(horario) % MINUTOS_POR_PASO === 0;
}