import "./BarraMenu.css";
import MenuDesplegable from "../MenuDesplegable/MenuDesplegable.jsx";
import iconoCampana from "../../assets/imagenes/icono-campana.png";
import iconoCuenta from "../../assets/imagenes/icono-cuenta.png";
import logo from "../../assets/imagenes/LogoBarraMenu.png";
import { Link } from "react-router";

export default function BarraMenu({ titulo, conLogo = false }) {
  return (
    <header className="barra-menu">
      <MenuDesplegable />

      <h1 className="barra-menu__titulo">
        {conLogo ? (
          <Link to="/" aria-label="Doble Cinco, ir al inicio">
            <img src={logo} alt="Doble Cinco" className="barra-menu__logo" />
          </Link>
        ) : (
          titulo
        )}
      </h1>

      <div className="barra-menu__acciones">
        <button type="button" className="btn p-0 border-0" aria-label="Notificaciones">
          <img src={iconoCampana} alt="" height="38" />
        </button>
        <Link to="/cuenta" aria-label="Mi cuenta">
          <img src={iconoCuenta} alt="" height="42" />
        </Link>
      </div>
    </header>
  );
}