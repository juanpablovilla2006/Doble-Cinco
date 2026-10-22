import express from "express";
import canchaRoutes from "./routes/canchas.routes.js";
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

app.use(errorHandler);