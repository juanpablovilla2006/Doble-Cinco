import express from "express";
import { db } from "./src/db/conexion.js";
import { cancha } from "./src/db/schema.js";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/canchas", async (req, res) => {
  try {
    const canchas = await db.select().from(cancha);
    res.json(canchas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "No se pudieron consultar las canchas"
    });
  }
});