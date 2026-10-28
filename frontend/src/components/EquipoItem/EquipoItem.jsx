import { useState } from "react";
import CampoFormulario from "../CampoFormulario/CampoFormulario.jsx";
import { actualizarEquipo, eliminarEquipo, agregarIntegrante, quitarIntegrante} from "../../services/equipoService.js";
import "./EquipoItem.css";

// puedeGestionar: solo el creador (y con la reserva activa) puede cambiar el equipo
// disponibles: participantes de la reserva que todavía no están en ningún equipo
export default function EquipoItem({ equipo,idReserva,disponibles,puedeGestionar,onActualizado,onEliminado,onMensaje}) {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(equipo.tipo);
  const [errorNombre, setErrorNombre] = useState("");
  const [elegido, setElegido] = useState("");
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);
  const [ocupado, setOcupado] = useState(false);

  function empezarEdicion() {
    setNombre(equipo.tipo);
    setErrorNombre("");
    setEditando(true);
  }

  async function guardarNombre(evento) {
    evento.preventDefault();
    setErrorNombre("");
    setOcupado(true);

    try {
      const actualizado = await actualizarEquipo(idReserva, equipo.id, { tipo: nombre });
      onActualizado(actualizado);
      setEditando(false);
      onMensaje({ tipo: "success", texto: "El equipo se actualizó correctamente" });
    } catch (error) {
      if (error.status === 400) {
        setErrorNombre(error.detalles[0]?.mensaje ?? error.message);
      } else if (error.status === 409) {
        setErrorNombre(error.message);
      } else {
        onMensaje({ tipo: "danger", texto: error.message });
      }
    } finally {
      setOcupado(false);
    }
  }

  async function borrar() {
    setOcupado(true);

    try {
      await eliminarEquipo(idReserva, equipo.id);
      onEliminado(equipo.id);
      onMensaje({ tipo: "success", texto: "El equipo se eliminó correctamente" });
    } catch (error) {
      setConfirmandoBorrado(false);
      onMensaje({ tipo: "danger", texto: error.message });
    } finally {
      setOcupado(false);
    }
  }

  async function agregar() {
    if (!elegido) return;
    setOcupado(true);

    try {
      // El select entrega texto; el backend espera un número
      const actualizado = await agregarIntegrante(idReserva, equipo.id, Number(elegido));
      onActualizado(actualizado);
      setElegido("");
    } catch (error) {
      onMensaje({ tipo: "danger", texto: error.message });
    } finally {
      setOcupado(false);
    }
  }

  async function quitar(idUsuario) {
    setOcupado(true);

    try {
      await quitarIntegrante(idReserva, equipo.id, idUsuario);
      onActualizado({
        ...equipo,
        participantes: equipo.participantes.filter((participante) => participante.id !== idUsuario)
      });
    } catch (error) {
      onMensaje({ tipo: "danger", texto: error.message });
    } finally {
      setOcupado(false);
    }
  }

  return (
    <li className="card equipo-item">
      <div className="card-body">
        {editando ? (
          <form onSubmit={guardarNombre}>
            <fieldset disabled={ocupado}>
              <CampoFormulario
                etiqueta="Nombre del equipo"
                nombre={`tipo-editar-${equipo.id}`}
                valor={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                error={errorNombre}
                required
                maxLength={30}
              />
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary btn-sm">
                  {ocupado ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditando(false)}>
                  Cancelar
                </button>
              </div>
            </fieldset>
          </form>
        ) : (
          <div className="d-flex justify-content-between align-items-start gap-2">
            <h3 className="equipo-item__nombre">{equipo.tipo}</h3>
            {puedeGestionar && !confirmandoBorrado && (
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={empezarEdicion} disabled={ocupado}>
                  Renombrar
                </button>
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setConfirmandoBorrado(true)} disabled={ocupado}>
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )}

        {confirmandoBorrado && (
          <div className="alert alert-danger mt-3 mb-0">
            <p>¿Seguro que querés eliminar el equipo {equipo.tipo}? Sus integrantes siguen en la reserva, pero sin equipo.</p>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-danger btn-sm" onClick={borrar} disabled={ocupado}>
                {ocupado ? "Eliminando..." : "Sí, eliminar"}
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setConfirmandoBorrado(false)} disabled={ocupado}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        <p className="equipo-item__cantidad">
          {equipo.participantes.length} {equipo.participantes.length === 1 ? "integrante" : "integrantes"}
        </p>

        {equipo.participantes.length === 0 && <p className="text-muted mb-0">Todavía no hay integrantes.</p>}

        <ul className="list-unstyled mb-0">
          {equipo.participantes.map((participante) => (
            <li key={participante.id} className="equipo-item__integrante">
              <span>{participante.nombre} {participante.apellido}</span>
              {puedeGestionar && (
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => quitar(participante.id)} disabled={ocupado}>
                  Quitar
                </button>
              )}
            </li>
          ))}
        </ul>

        {puedeGestionar && disponibles.length > 0 && (
          <div className="d-flex gap-2 mt-3">
            <select
              className="form-select"
              aria-label={`Agregar integrante al equipo ${equipo.tipo}`}
              value={elegido}
              onChange={(evento) => setElegido(evento.target.value)}
              disabled={ocupado}
            >
              <option value="">Agregar integrante</option>
              {disponibles.map((participante) => (
                <option key={participante.id} value={participante.id}>
                  {participante.nombre} {participante.apellido}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn-primary" onClick={agregar} disabled={ocupado || !elegido}>
              Agregar
            </button>
          </div>
        )}
      </div>
    </li>
  );
}