import { useState, useContext } from "react";
import { Link } from "react-router";
import iconoMenu from "../../assets/imagenes/icono-menu.png";
import { UsuarioContext } from "../../context/UsuarioContext.js";

const opciones = [
  { texto: "Inicio", ruta: "/" },
  { texto: "Cuenta", ruta: "/cuenta" },
  { texto: "Canchas", ruta: "/canchas" },
  { texto: "Administrar Canchas", ruta: "/administrar-canchas", soloAdmin:true },
  { texto: "Reservar", ruta: "/reservar" },
  { texto: "Mis reservas", ruta: "/mis-reservas" }
];

export default function MenuDesplegable() {
  const [abierto, setAbierto] = useState(false);
  const { usuario } = useContext(UsuarioContext);

  const opcionesVisibles = opciones.filter(
    (opcion) => !opcion.soloAdmin || usuario?.rol === "admin"
  );

  return (
    <div className="dropdown">
      <button
        type="button"
        className="btn p-0 border-0"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={abierto}
        aria-controls="menu-principal"
        onClick={() => setAbierto(!abierto)}
      >
        <img src={iconoMenu} alt="" height="48" />
      </button>

      <ul
        id="menu-principal"
        className={`dropdown-menu top-100 start-0 ${abierto ? "show" : ""}`}
      >
        {opcionesVisibles.map((opcion) => (
          <li key={opcion.ruta}>
            <Link
              className="dropdown-item"
              to={opcion.ruta}
              onClick={() => setAbierto(false)}
            >
              {opcion.texto}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}