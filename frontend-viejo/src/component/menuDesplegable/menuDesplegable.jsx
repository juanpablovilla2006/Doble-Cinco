import { useState } from "react";

export default function MenuDesplegable() {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="first_rectangulo_desplegable">
      <button
        className="boton_barras_menu"
        id="boton_menu"
        type="button"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={abierto}
        aria-controls="menu_desplegable"
        onClick={() => setAbierto(!abierto)}
      >
        <img src="../IMAGENES/barrita_menu.png" alt="" />
      </button>

      <nav
        className="menu_desplegable"
        id="menu_desplegable"
        hidden={!abierto}
      >
        <a href="index.html">Inicio</a>
        <a href="cuenta.html">Cuenta</a>
        <a href="canchas.html">Canchas</a>
        <a href="reservar.html">Reservar</a>
        <a href="misReservas.html">Mis Reservas</a>
      </nav>
    </div>
  );
}