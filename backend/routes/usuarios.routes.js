import { Router } from "express";
import * as usuarioService from "../services/usuario.service.js";
import { usuarioSchema, editarUsuarioSchema, idParamSchema } from "../schemas/usuario.schema.js";
import { validar } from "../middlewares/validar.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await usuarioService.listar());
});

router.get("/:id", validar(idParamSchema, "params"), async (req, res) => {
  const id = req.validado.params.id;
  res.json(await usuarioService.obtener(id));
});

router.post("/", validar(usuarioSchema), async (req, res) => {
  const nuevo = await usuarioService.crear(req.validado.body);
  res.status(201).json(nuevo);
});

router.put("/:id", validar(idParamSchema, "params"), validar(editarUsuarioSchema), async (req, res) => {
  const id = req.validado.params.id;
  res.json(await usuarioService.actualizar(id, req.validado.body));
});

router.delete("/:id", validar(idParamSchema, "params"), async (req, res) => {
  const id = req.validado.params.id;
  await usuarioService.eliminar(id);
  res.status(204).end();
});

export default router;
