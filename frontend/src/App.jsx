import { Routes, Route } from "react-router";
import Inicio from "./pages/Inicio/Inicio.jsx";
import Canchas from "./pages/Canchas/Canchas.jsx";
import Reservar from "./pages/Reservar/Reservar.jsx";
import MisReservas from "./pages/MisReservas/MisReservas.jsx";
import MiCuenta from "./pages/MiCuenta/MiCuenta.jsx";
import Registro from "./pages/Registro/Registro.jsx";
import Login from "./pages/Login/Login.jsx";
import MisDatos from "./pages/MisDatos/MisDatos.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/canchas" element={<Canchas />} />
      <Route path="/reservar" element={<Reservar />} />
      <Route path="/mis-reservas" element={<MisReservas />} />
      <Route path="/cuenta" element={<MiCuenta />} />
      <Route path="/cuenta/registro" element={<Registro />} />
      <Route path="/cuenta/login" element={<Login />} />
      <Route path="/cuenta/datos" element={<MisDatos />} />
    </Routes>
  );
}