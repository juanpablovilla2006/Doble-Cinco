import MenuDesplegable from "../menuDesplegable/menuDesplegable.jsx";

export default function BarraMenu({titulo}) {
  return (
    <div className="barraMenu">
            <MenuDesplegable />
                <div className="rectangulo_titulo">
                    <h1 className="titulo_pagina">{titulo}</h1>
                </div>


                <div className="botones_interactuables"> 
                    <div className="second_rectangulo_desplegable">
                      <img src="../IMAGENES/bell_logo.png" alt="Icono para acceder a notificaciones" />
                    </div>

                    <div className="third_rectangulo_desplegable">
                      <a href="cuenta.html">
                        <img src="../IMAGENES/account_logo.png" alt="Icono para ir a mi cuenta" />
                      </a>
                    </div>
                </div>
    </div>            
    );
}