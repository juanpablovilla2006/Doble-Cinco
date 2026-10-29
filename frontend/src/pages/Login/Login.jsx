import { useState } from "react";
import { Link, useNavigate } from "react-router";
import BarraMenu from "../../components/BarraMenu/BarraMenu.jsx";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario.jsx";
import { useUsuario } from "../../hooks/useUsuario.js";
import { ingresarUsuario } from "../../services/usuarioService.js";
import "./Login.css";

export default function Login() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const { iniciarSesion } = useUsuario();
  const navigate = useNavigate();

  async function enviar(evento) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const usuario = await ingresarUsuario(mail, password);
      iniciarSesion(usuario);
      navigate("/cuenta");
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <BarraMenu titulo="Iniciar sesión" />
      <main className="container py-4">
        <form className="login__formulario tarjeta" onSubmit={enviar}>
          {error && <div className="alert alert-danger">{error}</div>}

          <CampoFormulario etiqueta="Mail" nombre="mail" tipo="email" valor={mail} onChange={(e) => setMail(e.target.value)} required placeholder="Tú mail" />
          <CampoFormulario etiqueta="Contraseña" nombre="password" tipo="password" valor={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Tú contraseña"/>

          <button type="submit" className="btn btn-primary btn-lg w-100" disabled={enviando}>
            {enviando ? "Ingresando..." : "Ingresar"}
          </button>

          <p className="login__pie">
            ¿No tenés cuenta? <Link to="/cuenta/registro">Registrate</Link>
          </p>
        </form>
      </main>
    </>
  );
}