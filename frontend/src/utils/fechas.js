// Tiene que coincidir con la edad mínima del backend (schemas/usuario.schema.js)
export const EDAD_MINIMA = 14;
export const EDAD_MAXIMA = 100;
export const DIAS_MAXIMOS_ANTICIPACION = 90;
// Fecha de nacimiento más reciente permitida, en formato YYYY-MM-DD
export function fechaMaximaDeNacimiento() {
  const limite = new Date();
  limite.setFullYear(limite.getFullYear() - EDAD_MINIMA);
  return limite.toISOString().slice(0, 10);
}

// Pone más linda la fecha, pasa de un string de fecha a una fecha con día en oración
export function formatearDia(dia) {
  return new Date(`${dia}T12:00:00`).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// "18:00:00" -> "18:00"
export const formatearHora = (hora) => hora.slice(0, 5);
// Fecha de nacimiento más antigua permitida, en formato YYYY-MM-DD
export function fechaMinimaDeNacimiento() {
  const limite = new Date();
  limite.setFullYear(limite.getFullYear() - EDAD_MAXIMA);
  return limite.toISOString().slice(0, 10);
}

export function fechaMinimaReserva() {
  return new Date().toLocaleDateString("sv-SE");
}


export function fechaLimiteReserva() {
  const limite = new Date();
  limite.setDate(limite.getDate() + DIAS_MAXIMOS_ANTICIPACION);
  return limite.toLocaleDateString("sv-SE");
}
