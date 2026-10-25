import { useEffect, useState } from "react";
import BarraMenu from "./components/BarraMenu/BarraMenu.jsx";
import { listarCanchas } from "./services/canchaService.js";
import CanchaItem from "./components/CanchaItem/CanchaItem.jsx";

function App() {
  const [canchas, setCanchas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    listarCanchas()
      .then((datos) => setCanchas(datos))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <BarraMenu titulo="Nuestras canchas" />
      <main className="container py-4">
        {error && <p className="text-danger">{error}</p>}
        <ul className="list-unstyled d-flex flex-column gap-3">
          {canchas.map((cancha) => (
            <CanchaItem key={cancha.numero} cancha={cancha}/>
          ))}
        </ul>
      </main>
    </>
  );
}

export default App;