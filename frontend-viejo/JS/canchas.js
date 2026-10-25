const listaCanchas = document.getElementById("lista_canchas");
const estadoCanchas = document.getElementById("estado_canchas");

async function cargarCanchas() {
  try {
    const respuesta = await fetch("http://localhost:3000/canchas");

    if (!respuesta.ok) {
      throw new Error("El servidor no pudo devolver las canchas");
    }

    const canchas = await respuesta.json();

    listaCanchas.replaceChildren();

    for (const cancha of canchas) {
      const tarjeta = document.createElement("article");

      const titulo = document.createElement("h3");
      titulo.textContent = `Cancha ${cancha.numero}`;

      const tipo = document.createElement("p");
      tipo.textContent = `Tipo: ${cancha.tipo}`;

      const capacidad = document.createElement("p");
      capacidad.textContent = `Capacidad: ${cancha.capacidad} jugadores`;

      const precio = document.createElement("p");
      precio.textContent = `Precio: $${cancha.precio}`;

      const disponibilidad = document.createElement("p");
      disponibilidad.textContent = cancha.habilitada
        ? "Habilitada"
        : "No habilitada";

      tarjeta.append(titulo, tipo, capacidad, precio, disponibilidad);
      listaCanchas.append(tarjeta);
    }

    estadoCanchas.textContent =
      canchas.length === 0 ? "No hay canchas para mostrar." : "";
  } catch (error) {
    estadoCanchas.textContent = "No se pudieron cargar las canchas.";
    console.error(error);
  }
}

cargarCanchas();