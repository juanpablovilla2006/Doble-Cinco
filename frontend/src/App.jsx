import { Routes, Route } from "react-router";
import Inicio from "./pages/Inicio/Inicio.jsx";
import Canchas from "./pages/Canchas/Canchas.jsx";
import Reservar from "./pages/Reservar/Reservar.jsx";
import MisReservas from "./pages/MisReservas/MisReservas.jsx";
import MiCuenta from "./pages/MiCuenta/MiCuenta.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/canchas" element={<Canchas />} />
      <Route path="/reservar" element={<Reservar />} />
      <Route path="/mis-reservas" element={<MisReservas />} />
      <Route path="/cuenta" element={<MiCuenta />} />
    </Routes>
  );
}