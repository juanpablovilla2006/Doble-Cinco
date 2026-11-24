import express from "express";
import cors from "cors";
import canchaRoutes from "./routes/canchas.routes.js";
import usuarioRoutes from "./routes/usuarios.routes.js";
import reservaRoutes from "./routes/reservas.routes.js";
import equipoRoutes from "./routes/equipos.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import solicitudRoutes from "./routes/solicitudes.routes.js";
import mensajeRoutes from "./routes/mensajes.routes.js";
import notificacionRoutes from "./routes/notificaciones.routes.js";
import { z } from "zod";


z.config(z.locales.es());

const app = express();
app.use(cors({origin: "http://localhost:5173"}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola, funciona!");
});

app.use("/canchas", canchaRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/reservas", reservaRoutes);
app.use("/reservas/:idReserva/equipos", equipoRoutes);
app.use("/reservas/:idReserva/solicitudes", solicitudRoutes);
app.use("/reservas/:idReserva/mensajes", mensajeRoutes);
app.use(errorHandler);
app.use("/notificaciones", notificacionRoutes);

app.listen(3000, () => {
  console.log("Servidor andando en http://localhost:3000");
});