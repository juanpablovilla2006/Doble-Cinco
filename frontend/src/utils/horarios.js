// Los turnos van de a 15 minutos y la reserva dura al menos 1 hora (mismas reglas que el backend)
const MINUTOS_POR_PASO = 15;
export const DURACION_MINIMA = 60;

function aMinutos(horario) {
  const [horas, minutos] = horario.split(":").map(Number);
  return horas * 60 + minutos;
}

function aTexto(minutos) {
  const horas = String(Math.floor(minutos / 60)).padStart(2, "0");
  const resto = String(minutos % 60).padStart(2, "0");
  return `${horas}:${resto}`;
}

// 00:00, 00:15, 00:30 ... 23:45
const HORARIOS = Array.from({ length: (24 * 60) / MINUTOS_POR_PASO }, (_, i) => aTexto(i * MINUTOS_POR_PASO));

// Horarios de fin posibles para un inicio dado (al menos 1 hora después)
export function horariosDeFin(inicio) {
  if (!inicio) {
    return [];
  }

  return HORARIOS.filter((horario) => aMinutos(horario) - aMinutos(inicio) >= DURACION_MINIMA);
}

// Solo se puede empezar en horarios que dejan lugar para al menos 1 hora
export const HORARIOS_DE_INICIO = HORARIOS.filter((horario) => horariosDeFin(horario).length > 0);