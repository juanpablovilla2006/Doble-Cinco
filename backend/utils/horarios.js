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

// Horario del complejo: se puede reservar de 08:00 a 24:00 (medianoche).
// La medianoche se guarda como 24:00 y no como 00:00, así sigue siendo posterior al inicio
export const HORA_APERTURA = "08:00";
export const HORA_CIERRE = "24:00";

export function estaDentroDelHorario(inicio, fin) {
  return aMinutos(inicio) >= aMinutos(HORA_APERTURA) && aMinutos(fin) <= aMinutos(HORA_CIERRE);
}

// Válido si los minutos son 00, 15, 30 o 45 y no trae segundos
export function esHorarioDeTurno(horario) {
  const sinSegundos = horario.length === 5 || horario.slice(6, 8) === "00";
  return sinSegundos && aMinutos(horario) % MINUTOS_POR_PASO === 0;
}