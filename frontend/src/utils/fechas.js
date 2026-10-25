// Tiene que coincidir con la edad mínima del backend (schemas/usuario.schema.js)
export const EDAD_MINIMA = 14;

// Fecha de nacimiento más reciente permitida, en formato YYYY-MM-DD
export function fechaMaximaDeNacimiento() {
  const limite = new Date();
  limite.setFullYear(limite.getFullYear() - EDAD_MINIMA);
  return limite.toISOString().slice(0, 10);
}