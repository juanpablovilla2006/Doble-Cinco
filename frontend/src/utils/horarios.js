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

// Horario del complejo: de 08:00 a 24:00 (medianoche), igual que en el backend
const HORA_APERTURA = "08:00";
const HORA_CIERRE = "24:00";

// 08:00, 08:15, 08:30 ... 23:45, 24:00
const HORARIOS = Array.from(
  { length: (aMinutos(HORA_CIERRE) - aMinutos(HORA_APERTURA)) / MINUTOS_POR_PASO + 1 },
  (_, i) => aTexto(aMinutos(HORA_APERTURA) + i * MINUTOS_POR_PASO)
);

// Horarios de fin posibles para un inicio dado (al menos 1 hora después)
export function horariosDeFin(inicio) {
  if (!inicio) {
    return [];
  }

  return HORARIOS.filter((horario) => aMinutos(horario) - aMinutos(inicio) >= DURACION_MINIMA);
}

// Solo se puede empezar en horarios que dejan lugar para al menos 1 hora
export const HORARIOS_DE_INICIO = HORARIOS.filter((horario) => horariosDeFin(horario).length > 0);