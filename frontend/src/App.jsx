import { useEffect, useState } from "react";
import BarraMenu from "./components/BarraMenu/BarraMenu.jsx";
import { listarCanchas } from "./services/canchaService.js";

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
        <h2 className="h4 mb-3">Canchas disponibles</h2>
        {error && <p className="text-danger">{error}</p>}
        <ul className="list-group">
          {canchas.map((cancha) => (
            <li key={cancha.numero} className="list-group-item">
              Cancha {cancha.numero} - {cancha.tipo} - ${cancha.precio} - {cancha.capacidad}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

export default App;