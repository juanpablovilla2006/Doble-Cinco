import { useEffect, useState } from "react";
import { TemaContext } from "./TemaContext.js";

function temaInicial() {
  const guardado = localStorage.getItem("tema");
  if (guardado === "light" || guardado === "dark") return guardado;
  // Si nunca eligió, respeta la preferencia del sistema operativo
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  function alternarTema() {
    setTema((actual) => (actual === "dark" ? "light" : "dark"));
  }

  return (
    <TemaContext.Provider value={{ tema, alternarTema }}>
      {children}
    </TemaContext.Provider>
  );
}