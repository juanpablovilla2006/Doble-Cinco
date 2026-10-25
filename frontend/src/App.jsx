import { useEffect, useState } from "react";
import { listarCanchas } from "./services/canchaService.js";

function App() {
  const [canchas, setCanchas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
      listarCanchas().then((datos) => setCanchas(datos)).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1>Doble Cinco</h1>
      {error && <p>{error}</p>}
      <ul>
        {canchas.map((cancha) => (
          <li key={cancha.numero}>
            Cancha {cancha.numero} - {cancha.tipo} - ${cancha.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;