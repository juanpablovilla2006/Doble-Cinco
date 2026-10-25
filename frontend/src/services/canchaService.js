const API_URL = "http://localhost:3000";

export async function listarCanchas() {
  const respuesta = await fetch(`${API_URL}/canchas`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron traer las canchas");
  }

  return respuesta.json();
}