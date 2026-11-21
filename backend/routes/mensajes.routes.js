import { Router } from "express";
import * as mensajeService from "../services/mensaje.service.js";
import { mensajeSchema, filtrosMensajeSchema, reservaParamSchema } from "../schemas/mensaje.schema.js";
import { validar } from "../middlewares/validar.js";

// mergeParams para poder leer :idReserva del router padre
// Se monta en index.js: app.use("/reservas/:idReserva/mensajes", mensajeRoutes)
const router = Router({ mergeParams: true });

router.get("/", validar(reservaParamSchema, "params"), validar(filtrosMensajeSchema, "query"), async (req, res) => {
  const { idReserva } = req.validado.params;
  res.json(await mensajeService.listar(idReserva, req.validado.query));
});

router.post("/", validar(reservaParamSchema, "params"), validar(mensajeSchema), async (req, res) => {
  const { idReserva } = req.validado.params;
  const nuevo = await mensajeService.crear(idReserva, req.validado.body);
  res.status(201).json(nuevo);
});

export default router;
