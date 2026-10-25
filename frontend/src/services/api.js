const API_URL = "http://localhost:3000";

// Error que devuelve el backend si algo sale mal. Trae el status HTTP, el mensaje y el detalle por campo
export class ErrorApi extends Error {
  constructor(status, mensaje, detalles = []) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

export async function pedir(ruta, { metodo = "GET", cuerpo } = {}) {
  const opciones = { method: metodo, headers: {} };

  if (cuerpo !== undefined) {
    opciones.headers["Content-Type"] = "application/json";
    opciones.body = JSON.stringify(cuerpo);
  }

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, opciones);
  } catch {
    throw new ErrorApi(0, "No se pudo conectar con el servidor");
  }

  if (respuesta.status === 204) {
    return null;
  }

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new ErrorApi(
      respuesta.status,
      datos?.mensaje ?? "Ocurrió un error inesperado",
      datos?.detalles ?? []
    );
  }

  return datos;
}