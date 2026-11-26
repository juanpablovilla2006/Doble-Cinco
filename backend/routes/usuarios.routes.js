import { Router } from "express";
import * as usuarioService from "../services/usuario.service.js";
import { usuarioSchema, editarUsuarioSchema, idParamSchema, loginSchema } from "../schemas/usuario.schema.js";
import { validar } from "../middlewares/validar.js";
import { autenticar } from "../middlewares/autenticar.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await usuarioService.listar());
});

// Datos del usuario que tiene la sesión iniciada (sirve también para probar el token)
router.get("/yo", autenticar, async (req, res) => {
  res.json(await usuarioService.obtener(req.usuario.id));
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

router.post("/login", validar(loginSchema), async (req, res) => {
  res.json(await usuarioService.ingresar(req.validado.body));
});

export default router;
