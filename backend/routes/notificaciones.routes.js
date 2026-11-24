import { Router } from "express";
import * as notificacionService from "../services/notificacion.service.js";
import { usuarioQuerySchema, notificacionParamSchema } from "../schemas/notificacion.schema.js";
import { validar } from "../middlewares/validar.js";

const router = Router();

router.get("/", validar(usuarioQuerySchema, "query"), async (req, res) => {
  res.json(await notificacionService.listar(req.validado.query.id_usuario));
});

router.delete("/", validar(usuarioQuerySchema, "query"), async (req, res) => {
  await notificacionService.eliminarTodas(req.validado.query.id_usuario);
  res.status(204).end();
});

router.delete("/:id", validar(notificacionParamSchema, "params"), validar(usuarioQuerySchema, "query"), async (req, res) => {
  await notificacionService.eliminar(req.validado.params.id, req.validado.query.id_usuario);
  res.status(204).end();
});

export default router;
