import express from "express";
import { db } from "./src/db/conexion.js";
import { cancha } from "./src/db/schema.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

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

app.post("/canchas", async (req, res) => {
  const {
    numero,
    tipo,
    capacidad,
    precio,
    habilitada = true
  } = req.body ?? {};

  if (
    !Number.isInteger(numero) || numero <= 0 ||
    !Number.isInteger(capacidad) || capacidad <= 0 ||
    typeof tipo !== "string" ||
    tipo.trim().length === 0 || tipo.trim().length > 30 ||
    typeof precio !== "number" ||
    !Number.isFinite(precio) ||
    precio < 0 || precio > 99999999.99 ||
    typeof habilitada !== "boolean"
  ) {
    return res.status(400).json({
      mensaje: "Revisá los datos de la cancha"
    });
  }

  try {
    await db.insert(cancha).values({
      numero,
      tipo: tipo.trim(),
      capacidad,
      precio: precio.toFixed(2),
      habilitada
    });

    res.status(201).json({
      mensaje: "Cancha creada correctamente",
      numero
    });
  } catch (error) {
    if (
      error.code === "ER_DUP_ENTRY" ||
      error.cause?.code === "ER_DUP_ENTRY"
    ) {
      return res.status(409).json({
        mensaje: "Ya existe una cancha con ese número"
      });
    }

    console.error(error);
    res.status(500).json({
      mensaje: "No se pudo crear la cancha"
    });
  }
});