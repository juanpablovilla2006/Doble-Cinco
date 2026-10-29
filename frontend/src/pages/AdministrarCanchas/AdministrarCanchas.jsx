import { useEffect, useState } from "react";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import CanchaItem from "../../components/CanchaItem/CanchaItem.jsx";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario.jsx";
import { listarCanchas, crearCancha, actualizarCancha, eliminarCancha } from "../../services/canchaService.js";
import "./AdministrarCanchas.css";

const TIPOS = ["Cancha de 5", "Cancha de 6", "Cancha de 7", "Cancha de 8", "Cancha de 11", "Cancha de futsal"];

const DATOS_INICIALES = {
  numero: "",
  tipo: "",
  capacidad: "",
  precio: "",
  habilitada: true
};

export default function AdministrarCanchas() {
  const [canchas, setCanchas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [accion, setAccion] = useState(null);
  const [original, setOriginal] = useState(null);
  const [datos, setDatos] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);

  useEffect(() => {
    listarCanchas()
      .then((guardadas) => setCanchas(guardadas))
      .catch((e) => setMensaje({ tipo: "danger", texto: e.message }))
      .finally(() => setCargando(false));
  }, []);

  function elegirAccion(nuevaAccion) {
    setAccion(nuevaAccion);
    setOriginal(null);
    setDatos(nuevaAccion === "crear" ? { ...DATOS_INICIALES } : null);
    setErrores({});
    setMensaje(null);
    setConfirmandoBorrado(false);
  }

  function seleccionar(evento) {
    const cancha = canchas.find((cancha) => String(cancha.numero) === evento.target.value);
    setOriginal(cancha ?? null);
    setDatos(cancha ? { ...cancha } : null);
    setErrores({});
    setMensaje(null);
    setConfirmandoBorrado(false);
  }

  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;
    setDatos({ ...datos, [name]: type === "checkbox" ? checked : value });
  }

  function cancelar() {
    setDatos(original);
    setErrores({});
    setAccion(null);
    setConfirmandoBorrado(false);
  }

  async function guardar(evento) {
    evento.preventDefault();
    setErrores({});
    setMensaje(null);

    const { tipo, capacidad, precio, habilitada } = datos;
    // Los inputs numéricos también entregan texto; el backend espera números.
    const cuerpo = { tipo, capacidad: Number(capacidad), precio: Number(precio), habilitada };

    if (accion === "crear") {
      cuerpo.numero = Number(datos.numero);
    }

    setGuardando(true);

    try {
      if (accion === "crear") {
        const nueva = await crearCancha(cuerpo);
        setCanchas((anteriores) => [...anteriores, nueva]);
        setOriginal(nueva);
        setDatos(nueva);
        setMensaje({ tipo: "success", texto: "La cancha se creó correctamente" });
      } else {
        const actualizada = await actualizarCancha(original.numero, cuerpo);
        setCanchas((anteriores) => anteriores.map((cancha) => cancha.numero === actualizada.numero ? actualizada : cancha));
        setOriginal(actualizada);
        setDatos(actualizada);
        setMensaje({ tipo: "success", texto: "Los datos se guardaron correctamente" });
      }

      setAccion(null);
    } catch (error) {
      if (error.status === 400) {
        setErrores(Object.fromEntries(error.detalles.map((d) => [d.campo, d.mensaje])));
      } else if (error.status === 409 && accion === "crear") {
        setErrores({ numero: error.message });
      } else {
        setMensaje({ tipo: "danger", texto: error.message });
      }
    } finally {
      setGuardando(false);
    }
  }

  async function borrarCancha() {
    if (!original || borrando) return;
    setMensaje(null);
    setBorrando(true);

    try {
      await eliminarCancha(original.numero);
      setCanchas((anteriores) => anteriores.filter((cancha) => cancha.numero !== original.numero));
      setOriginal(null);
      setDatos(null);
      setAccion(null);
      setConfirmandoBorrado(false);
      setMensaje({ tipo: "success", texto: "La cancha se eliminó correctamente" });
    } catch (error) {
      setConfirmandoBorrado(false);
      setMensaje({ tipo: "danger", texto: error.message });
    } finally {
      setBorrando(false);
    }
  }

  // Conserva el valor de canchas existentes aunque su tipo tenga otra escritura.
  const tiposDisponibles = [...new Set([...TIPOS, datos?.tipo].filter(Boolean))];

  return (
    <>
      <BarraMenu titulo="Administrar canchas" />
      <main className="container py-4">
        {mensaje && <div className={`alert alert-${mensaje.tipo}`} role="alert">{mensaje.texto}</div>}

        {cargando && <p>Cargando canchas...</p>}
        {!cargando && canchas.length === 0 && <p>No hay canchas cargadas.</p>}

        <ul className="list-unstyled d-flex flex-column gap-3 administrar__canchas">
          {canchas.map((cancha) => <CanchaItem key={cancha.numero} cancha={cancha} />)}
        </ul>

        <div className="tarjeta">
        <div className="d-flex flex-wrap gap-2 my-4">
          <button type="button" className="btn btn-primary" onClick={() => elegirAccion("crear")} disabled={cargando || guardando || borrando}>
            Crear nueva cancha
          </button>
          <button type="button" className="btn btn-primary-azul" onClick={() => elegirAccion("modificar")} disabled={cargando || guardando || borrando || canchas.length === 0}>
            Modificar cancha
          </button>
          <button type="button" className="btn btn-outline-danger" onClick={() => elegirAccion("borrar")} disabled={cargando || guardando || borrando || canchas.length === 0}>
            Borrar cancha
          </button>
        </div>

        {(accion === "modificar" || accion === "borrar") && (
          <div className="mb-3">
            <label htmlFor="seleccionar-cancha" className="form-label">Seleccioná una cancha</label>
            <select id="seleccionar-cancha" className="form-select" value={original?.numero ?? ""} onChange={seleccionar} disabled={guardando || borrando}>
              <option value="">Elegí una cancha</option>
              {canchas.map((cancha) => (
                <option key={cancha.numero} value={cancha.numero}>Cancha {cancha.numero} — {cancha.tipo}</option>
              ))}
            </select>
          </div>
        )}

        {(accion === "crear" || accion === "modificar") && datos && (
          <form onSubmit={guardar}>
            <h2 className="h5">{accion === "crear" ? "Nueva cancha" : `Modificar cancha ${original.numero}`}</h2>
            <fieldset disabled={guardando}>
              <CampoFormulario etiqueta="Número" nombre="numero" tipo="number" valor={datos.numero} onChange={cambiar} error={errores.numero} disabled={accion === "modificar"} required min={1} step={1} />
              <CampoFormulario etiqueta="Tipo" nombre="tipo" tipo="select" opciones={tiposDisponibles} valor={datos.tipo} onChange={cambiar} error={errores.tipo} required />
              <CampoFormulario etiqueta="Capacidad de jugadores" nombre="capacidad" tipo="number" valor={datos.capacidad} onChange={cambiar} error={errores.capacidad} required min={1} step={1} />
              <CampoFormulario etiqueta="Precio" nombre="precio" tipo="number" valor={datos.precio} onChange={cambiar} error={errores.precio} required min={0} step="0.01" />

              <div className="form-check mb-3">
                <input id="cancha-habilitada" className={`form-check-input ${errores.habilitada ? "is-invalid" : ""}`} type="checkbox" name="habilitada" checked={datos.habilitada} onChange={cambiar} />
                <label htmlFor="cancha-habilitada" className="form-check-label">Cancha habilitada</label>
                {errores.habilitada && <div className="invalid-feedback">{errores.habilitada}</div>}
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">{guardando ? "Guardando..." : "Guardar"}</button>
                <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>Cancelar</button>
              </div>
            </fieldset>
          </form>
        )}

        {accion === "borrar" && original && (
          <section>
            <h2 className="h5">Eliminar cancha {original.numero}</h2>
            {confirmandoBorrado ? (
              <div className="alert alert-danger">
                <p>¿Seguro que querés eliminar la cancha {original.numero}? Esta acción no se puede deshacer.</p>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-danger" onClick={borrarCancha} disabled={borrando}>{borrando ? "Eliminando..." : "Sí, eliminar cancha"}</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setConfirmandoBorrado(false)} disabled={borrando}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-danger" onClick={() => setConfirmandoBorrado(true)}>Eliminar cancha</button>
                <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>Cancelar</button>
              </div>
            )}
          </section>
        )}
        </div>
      </main>
    </>
  );
}
