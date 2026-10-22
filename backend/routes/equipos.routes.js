import { Router } from "express";
import * as equipoService from "../services/equipo.service.js";
import {
  equipoSchema,
  editarEquipoSchema,
  participanteSchema,
  reservaParamSchema,
  equipoParamSchema,
  equipoUsuarioParamSchema
} from "../schemas/equipo.schema.js";
import { validar } from "../middlewares/validar.js";

// mergeParams para poder leer :idReserva del router padre
// Se monta en app.js: app.use("/api/reservas/:idReserva/equipos", equiposRoutes)
const router = Router({ mergeParams: true });

router.get("/", validar(reservaParamSchema, "params"), async (req, res) => {
  const { idReserva } = req.validado.params;
  res.json(await equipoService.listar(idReserva));
});

router.get("/:id", validar(equipoParamSchema, "params"), async (req, res) => {
  const { idReserva, id } = req.validado.params;
  res.json(await equipoService.obtener(idReserva, id));
});

router.post("/", validar(reservaParamSchema, "params"), validar(equipoSchema), async (req, res) => {
  const { idReserva } = req.validado.params;
  const nuevo = await equipoService.crear(idReserva, req.validado.body);
  res.status(201).json(nuevo);
});

router.put("/:id", validar(equipoParamSchema, "params"), validar(editarEquipoSchema), async (req, res) => {
  const { idReserva, id } = req.validado.params;
  res.json(await equipoService.actualizar(idReserva, id, req.validado.body));
});

router.delete("/:id", validar(equipoParamSchema, "params"), async (req, res) => {
  const { idReserva, id } = req.validado.params;
  await equipoService.eliminar(idReserva, id);
  res.status(204).end();
});

router.post(
  "/:id/participantes",
  validar(equipoParamSchema, "params"),
  validar(participanteSchema),
  async (req, res) => {
    const { idReserva, id } = req.validado.params;
    const equipo = await equipoService.agregarParticipante(idReserva, id, req.validado.body.id_usuario);
    res.status(201).json(equipo);
  }
);

router.delete(
  "/:id/participantes/:idUsuario",
  validar(equipoUsuarioParamSchema, "params"),
  async (req, res) => {
    const { idReserva, id, idUsuario } = req.validado.params;
    await equipoService.quitarParticipante(idReserva, id, idUsuario);
    res.status(204).end();
  }
);

export default router;
