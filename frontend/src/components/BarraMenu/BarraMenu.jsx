import "./BarraMenu.css";
import MenuDesplegable from "../MenuDesplegable/MenuDesplegable.jsx";
import iconoCampana from "../../assets/imagenes/icono-campana.png";
import iconoCuenta from "../../assets/imagenes/icono-cuenta.png";
import logo from "../../assets/imagenes/LogoBarraMenu.png";
import { Link } from "react-router";
import { useTema } from "../../hooks/useTema.js";

;

export default function BarraMenu({ titulo, conLogo = false }) {
  const { tema, alternarTema } = useTema()
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
        <div className="barra-menu__tema">
          <i className="bi bi-sun-fill" aria-hidden="true"></i>

          <div className="form-check form-switch m-0 p-0">
            <input
                id="switch-tema"
                className="form-check-input m-0"
                type="checkbox"
                role="switch"
                checked={tema === "dark"}
                onChange={alternarTema}
                aria-label="Modo noche"
            />
          </div>

          <i className="bi bi-moon-stars-fill" aria-hidden="true"></i>
        </div>

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