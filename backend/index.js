import express from "express";
import canchaRoutes from "./routes/canchas.routes.js";
import usuarioRoutes from "./routes/usuarios.routes.js";
import reservaRoutes from "./routes/reservas.routes.js";
import equipoRoutes from "./routes/equipos.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { z } from "zod";

z.config(z.locales.es());

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola, funciona!");
});

app.listen(3000, () => {
  console.log("Servidor andando en http://localhost:3000");
});

app.use("/canchas", canchaRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/reservas", reservaRoutes);
app.use("/reservas/:idReserva/equipos", equipoRoutes);

app.use(errorHandler);