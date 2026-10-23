import { Router } from "express";
import * as canchaService from "../services/cancha.service.js";
import { canchaSchema, editarCanchaSchema, numeroParamSchema, disponiblesQuerySchema } from "../schemas/cancha.schema.js";
import { validar } from "../middlewares/validar.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await canchaService.listar());
});

router.get("/disponibles", validar(disponiblesQuerySchema, "query"), async (req, res) => {
  res.json(await canchaService.listarDisponibles(req.validado.query));
});

router.get("/:numero", validar(numeroParamSchema,"params") , async (req, res) => {
  const numero = req.validado.params.numero;
  res.json(await canchaService.obtener(numero));
});

router.post("/", validar(canchaSchema), async (req, res) => {
  const nueva = await canchaService.crear(req.validado.body);
  res.status(201).json(nueva);
});

router.put("/:numero", validar(numeroParamSchema, "params"), validar(editarCanchaSchema), async (req, res) => {
  const numero = req.validado.params.numero;
  res.json(await canchaService.actualizar(numero, req.validado.body));
});

router.delete("/:numero", validar(numeroParamSchema, "params"), async (req, res) => {
  const numero = req.validado.params.numero; 
  await canchaService.eliminar(numero);
  res.status(204).end();
});

export default router;
