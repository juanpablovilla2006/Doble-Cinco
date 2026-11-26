export function textoCupo({ cantidad_participantes, capacidad, lugares }) {
  const quedan = lugares === 1 ? "queda 1 lugar" : `quedan ${lugares} lugares`;
  return `${cantidad_participantes} de ${capacidad} jugadores · ${quedan}`;
}