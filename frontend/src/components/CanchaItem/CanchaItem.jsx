import "./CanchaItem.css";
import cancha5 from "../../assets/imagenes/cancha5.jpg";
import cancha6 from "../../assets/imagenes/cancha6.jpg";
import cancha7 from "../../assets/imagenes/cancha7.jpg";
import cancha8 from "../../assets/imagenes/cancha8.jpg";
import cancha11 from "../../assets/imagenes/cancha11.jpg";
import canchaFutsal from "../../assets/imagenes/canchaFutsal.jpg";

function formatearPrecio(precio) {
  return Number(precio).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });
}

const imagenesPorTipo = {
  "cancha de 5": cancha5,
  "cancha de 6": cancha6,
  "cancha de 7": cancha7,
  "cancha de 8": cancha8,
  "cancha de 11": cancha11,
  "cancha de futsal": canchaFutsal,
};

export default function CanchaItem({ cancha }) {
  const enMantenimiento = !cancha.habilitada;
  const tipo = cancha.tipo.trim().toLowerCase();
  const imagen = imagenesPorTipo[tipo];

  return (
    <li className={`cancha-item ${enMantenimiento ? "cancha-item--mantenimiento" : ""}`}>
      <div className="cancha-item__foto"> 
      <img src={imagen} alt={`${cancha.tipo}, cancha número ${cancha.numero}`}/>
      </div>

      <div className="cancha-item__info">
        <h3 className="cancha-item__titulo">Cancha {cancha.numero}</h3>
        <p className="cancha-item__dato">{cancha.tipo}</p>
        <p className="cancha-item__dato">Capacidad: {cancha.capacidad} jugadores</p>
        <p className="cancha-item__dato">Precio: {formatearPrecio(cancha.precio)}</p>
        {enMantenimiento && <p className="cancha-item__estado">En mantenimiento</p>}
      </div>
    </li>
  );
}