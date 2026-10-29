import { useState } from "react";
import { Link, useNavigate } from "react-router";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario.jsx";
import { useUsuario } from "../../hooks/useUsuario.js";
import { registrarUsuario } from "../../services/usuarioService.js";
import "./Registro.css";
import { fechaMaximaDeNacimiento } from "../../utils/fechas.js";
import { fechaMinimaDeNacimiento } from "../../utils/fechas.js";  
const GENEROS = ["Hombre", "Mujer", "Otro"];

const DATOS_INICIALES = {
  nombre: "",
  apellido: "",
  dni: "",
  mail: "",
  fecha_nac: "",
  genero: "",
  telefono: "",
  descripcion: "",
  password: ""
};

export default function Registro() {
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [repetirPassword, setRepetirPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const { iniciarSesion } = useUsuario();
  const navigate = useNavigate();

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErrores({});
    setErrorGeneral(null);

    if (datos.password !== repetirPassword) {
      setErrores({ repetirPassword: "Las contraseñas no coinciden" });
      return;
    }

    setEnviando(true);

    try {
      const nuevoUsuario = await registrarUsuario(datos);
      iniciarSesion(nuevoUsuario);
      navigate("/cuenta");
    } catch (error) {
      if (error.status === 400) {
        setErrores(Object.fromEntries(error.detalles.map((d) => [d.campo, d.mensaje])));
      } else if (error.status === 409) {
        setErrores({ mail: error.message });
      } else {
        setErrorGeneral(error.message);
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <BarraMenu titulo="Registrarte" />
      <main className="container py-4">
        <form className="registro__formulario tarjeta" onSubmit={enviar}>
          {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}

          <CampoFormulario etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} required maxLength={50} placeholder="Tú nombre" />
          <CampoFormulario etiqueta="Apellido" nombre="apellido" valor={datos.apellido} onChange={cambiar} error={errores.apellido} required maxLength={50} placeholder="Tú apellido"/>
          <CampoFormulario etiqueta="DNI" nombre="dni" valor={datos.dni} onChange={cambiar} error={errores.dni} required inputMode="numeric" maxLength={10} placeholder="XXXXXXXX" />
          <CampoFormulario etiqueta="Mail" nombre="mail" tipo="email" valor={datos.mail} onChange={cambiar} error={errores.mail} required maxLength={100} placeholder="tumail@gmail.com"/>
          <CampoFormulario etiqueta="Fecha de nacimiento" nombre="fecha_nac" tipo="date" valor={datos.fecha_nac} onChange={cambiar} error={errores.fecha_nac} required max={fechaMaximaDeNacimiento()} min={fechaMinimaDeNacimiento()} />
          <CampoFormulario etiqueta="Género" nombre="genero" tipo="select" opciones={GENEROS} valor={datos.genero} onChange={cambiar} error={errores.genero} required />
          <CampoFormulario etiqueta="Teléfono" nombre="telefono" tipo="tel" valor={datos.telefono} onChange={cambiar} error={errores.telefono} required placeholder="341 XXX XXXX"/>
          <CampoFormulario etiqueta="Descripción (opcional)" nombre="descripcion" tipo="textarea" valor={datos.descripcion} onChange={cambiar} error={errores.descripcion} maxLength={200} placeholder="Me gusta jugar a la pelota"/>
          <CampoFormulario etiqueta="Contraseña" nombre="password" tipo="password" valor={datos.password} onChange={cambiar} error={errores.password} required minLength={8} maxLength={72}  placeholder="Tú contraseña"/>
          <CampoFormulario etiqueta="Repetir contraseña" nombre="repetirPassword" tipo="password" valor={repetirPassword} onChange={(e) => setRepetirPassword(e.target.value)} error={errores.repetirPassword} required placeholder="Repetí tu contraseña"/>

          <button type="submit" className="btn btn-primary btn-lg w-100" disabled={enviando}>
            {enviando ? "Registrando..." : "Registrarme"}
          </button>

          <p className="registro__pie">
            ¿Ya tenés cuenta? <Link to="/cuenta/login">Ingresá</Link>
          </p>
        </form>
      </main>
    </>
  );
}