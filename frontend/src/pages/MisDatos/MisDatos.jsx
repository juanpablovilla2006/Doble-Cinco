import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario.jsx";
import { useUsuario } from "../../hooks/useUsuario.js";
import { actualizarUsuario, eliminarUsuario, obtenerUsuario } from "../../services/usuarioService.js";
import { fechaMaximaDeNacimiento } from "../../utils/fechas.js";
import "./MisDatos.css";

const GENEROS = ["Hombre", "Mujer", "Otro"];

export default function MisDatos() {
  const { usuario, iniciarSesion, cerrarSesion } = useUsuario();
  const id = usuario?.id;

  const [original, setOriginal] = useState(null);
  const [datos, setDatos] = useState(null);
  const [passwordNueva, setPasswordNueva] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);

  useEffect(() => {
    if (id === undefined) {
      return;
    }

    obtenerUsuario(id)
      .then((guardado) => {
        setOriginal(guardado);
        setDatos(guardado);
      })
      .catch((e) => setMensaje({ tipo: "danger", texto: e.message }));
  }, [id]);

  // Si no hay nadie logueado o se borró la cuenta, no hay nada que mostrar
  if (!usuario) {
    return <Navigate to="/cuenta" replace />;
  }

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  function cancelar() {
    setDatos(original);
    setPasswordNueva("");
    setRepetirPassword("");
    setErrores({});
    setEditando(false);
  }

  async function guardar(evento) {
    evento.preventDefault();
    setErrores({});
    setMensaje(null);

    if (passwordNueva !== repetirPassword) {
      setErrores({ repetirPassword: "Las contraseñas no coinciden" });
      return;
    }

    const { nombre, apellido, dni, mail, fecha_nac, genero, descripcion, telefono } = datos;
    const cuerpo = { nombre, apellido, dni, mail, fecha_nac, genero, descripcion, telefono };

    // Si la dejó vacía, no se manda y el back mantiene la contraseña actual
    if (passwordNueva) {
      cuerpo.password = passwordNueva;
    }

    setGuardando(true);

    try {
      const actualizado = await actualizarUsuario(id, cuerpo);
      setOriginal(actualizado);
      setDatos(actualizado);
      iniciarSesion(actualizado);
      setPasswordNueva("");
      setRepetirPassword("");
      setEditando(false);
      setMensaje({ tipo: "success", texto: "Tus datos se guardaron correctamente" });
    } catch (error) {
      if (error.status === 400) {
        setErrores(Object.fromEntries(error.detalles.map((d) => [d.campo, d.mensaje])));
      } else if (error.status === 409) {
        setErrores({ mail: error.message });
      } else {
        setMensaje({ tipo: "danger", texto: error.message });
      }
    } finally {
      setGuardando(false);
    }
  }

  async function borrarCuenta() {
    setMensaje(null);

    try {
      await eliminarUsuario(id);
      // Al quedar sin usuario, el redirect de arriba nos lleva a /cuenta
      cerrarSesion();
    } catch (error) {
      setConfirmandoBorrado(false);
      setMensaje({ tipo: "danger", texto: error.message });
    }
  }

  return (
    <>
      <BarraMenu titulo="Mis datos" />
      <main className="container py-4">
        <div className="mis-datos__formulario tarjeta">
          {mensaje && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}

          {!datos && !mensaje && <p>Cargando tus datos...</p>}

          {datos && (
            <form onSubmit={guardar}>
              <CampoFormulario etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} disabled={!editando} required maxLength={50} />
              <CampoFormulario etiqueta="Apellido" nombre="apellido" valor={datos.apellido} onChange={cambiar} error={errores.apellido} disabled={!editando} required maxLength={50} />
              <CampoFormulario etiqueta="DNI" nombre="dni" valor={datos.dni} onChange={cambiar} error={errores.dni} disabled={!editando} required inputMode="numeric" maxLength={10} />
              <CampoFormulario etiqueta="Mail" nombre="mail" tipo="email" valor={datos.mail} onChange={cambiar} error={errores.mail} disabled={!editando} required maxLength={100} />
              <CampoFormulario etiqueta="Fecha de nacimiento" nombre="fecha_nac" tipo="date" valor={datos.fecha_nac} onChange={cambiar} error={errores.fecha_nac} disabled={!editando} required max={fechaMaximaDeNacimiento()} />
              <CampoFormulario etiqueta="Género" nombre="genero" tipo="select" opciones={GENEROS} valor={datos.genero} onChange={cambiar} error={errores.genero} disabled={!editando} required />
              <CampoFormulario etiqueta="Teléfono" nombre="telefono" tipo="tel" valor={datos.telefono} onChange={cambiar} error={errores.telefono} disabled={!editando} required />
              <CampoFormulario etiqueta="Descripción" nombre="descripcion" tipo="textarea" valor={datos.descripcion} onChange={cambiar} error={errores.descripcion} disabled={!editando} maxLength={200} />

              {editando && (
                <>
                  <CampoFormulario etiqueta="Nueva contraseña (dejala vacía para no cambiarla)" nombre="password" tipo="password" valor={passwordNueva} onChange={(e) => setPasswordNueva(e.target.value)} error={errores.password} minLength={8} maxLength={72} />
                  <CampoFormulario etiqueta="Repetir nueva contraseña" nombre="repetirPassword" tipo="password" valor={repetirPassword} onChange={(e) => setRepetirPassword(e.target.value)} error={errores.repetirPassword} />
                </>
              )}

              <div className="mis-datos__acciones">
                {editando ? (
                  <>
                    <button key="guardar" type="submit" className="btn btn-primary" disabled={guardando}>
                      {guardando ? "Guardando..." : "Guardar cambios"}
                    </button>
                    <button key="cancelar" type="button" className="btn btn-outline-secondary" onClick={cancelar} disabled={guardando}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button key="editar" type="button" className="btn btn-primary" onClick={() => { setMensaje(null); setEditando(true); }}>
                    Editar datos
                  </button>
                )}
              </div>
            </form>
          )}

          <section className="mis-datos__peligro">
            <h2 className="h5">Eliminar cuenta</h2>

            {confirmandoBorrado ? (
              <div className="alert alert-danger">
                <p className="mb-3">¿Seguro que querés eliminar tu cuenta? Esta acción no se puede deshacer.</p>
                <div className="mis-datos__acciones">
                  <button type="button" className="btn btn-danger" onClick={borrarCuenta}>
                    Sí, eliminar mi cuenta
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setConfirmandoBorrado(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className="btn btn-outline-danger" onClick={() => setConfirmandoBorrado(true)}>
                Eliminar mi cuenta
              </button>
            )}
          </section>
        </div>
      </main>
    </>
  );
}