import { useState } from "react";
import iconoMenu from "../../assets/imagenes/icono-menu.png";

const opciones = [
  { texto: "Inicio", ruta: "/" },
  { texto: "Cuenta", ruta: "/cuenta" },
  { texto: "Canchas", ruta: "/canchas" },
  { texto: "Reservar", ruta: "/reservar" },
  { texto: "Mis reservas", ruta: "/mis-reservas" }
];

export default function MenuDesplegable() {
  const [abierto, setAbierto] = useState(false);

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

      <ul id="menu-principal" className={`dropdown-menu top-100 start-0 ${abierto ? "show" : ""}`}>
        {opciones.map((opcion) => (
          <li key={opcion.ruta}>
            <a className="dropdown-item" href={opcion.ruta}>{opcion.texto}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}