const botonMenu = document.getElementById("boton_menu");
const menu = document.getElementById("menu_desplegable");

botonMenu.addEventListener("click", () =>{
  menu.hidden = !menu.hidden;

  botonMenu.setAttribute("aria-expanded", String(!menu.hidden));
  botonMenu.setAttribute(
    "aria-label",
    menu.hidden ? "Abrir menú" : "Cerrar menú"
  );
});