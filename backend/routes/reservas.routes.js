import { Router } from "express";
import * as reservaService from "../services/reserva.service.js";
import {
  reservaSchema,
  editarReservaSchema,
  filtrosReservaSchema,
  idParamSchema
} from "../schemas/reserva.schema.js";
import { validar } from "../middlewares/validar.js";

const router = Router();

router.get("/", validar(filtrosReservaSchema, "query"), async (req, res) => {
  res.json(await reservaService.listar(req.validado.query));
});

router.get("/:id", validar(idParamSchema, "params"), async (req, res) => {
  const id = req.validado.params.id;
  res.json(await reservaService.obtener(id));
});

router.post("/", validar(reservaSchema), async (req, res) => {
  const nueva = await reservaService.crear(req.validado.body);
  res.status(201).json(nueva);
});

router.put("/:id", validar(idParamSchema, "params"), validar(editarReservaSchema), async (req, res) => {
  const id = req.validado.params.id;
  res.json(await reservaService.actualizar(id, req.validado.body));
});

router.delete("/:id", validar(idParamSchema, "params"), async (req, res) => {
  const id = req.validado.params.id;
  await reservaService.eliminar(id);
  res.status(204).end();
});

export default router;
