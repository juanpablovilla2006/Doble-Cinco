import { Router } from "express";
import * as solicitudService from "../services/solicitud.service.js";
import {
  solicitudSchema,
  resolverSolicitudSchema,
  filtrosSolicitudSchema,
  actorQuerySchema,
  reservaParamSchema,
  solicitudParamSchema
} from "../schemas/solicitud.schema.js";
import { validar } from "../middlewares/validar.js";

// mergeParams para poder leer :idReserva del router padre
// Se monta en index.js: app.use("/reservas/:idReserva/solicitudes", solicitudRoutes)
const router = Router({ mergeParams: true });

router.get("/", validar(reservaParamSchema, "params"), validar(filtrosSolicitudSchema, "query"), async (req, res) => {
  const { idReserva } = req.validado.params;
  res.json(await solicitudService.listar(idReserva, req.validado.query));
});

router.get("/:id", validar(solicitudParamSchema, "params"), validar(actorQuerySchema, "query"), async (req, res) => {
  const { idReserva, id } = req.validado.params;
  res.json(await solicitudService.obtener(idReserva, id, req.validado.query.id_usuario));
});

router.post("/", validar(reservaParamSchema, "params"), validar(solicitudSchema), async (req, res) => {
  const { idReserva } = req.validado.params;
  const nueva = await solicitudService.crear(idReserva, req.validado.body);
  res.status(201).json(nueva);
});

router.put("/:id", validar(solicitudParamSchema, "params"), validar(resolverSolicitudSchema), async (req, res) => {
  const { idReserva, id } = req.validado.params;
  res.json(await solicitudService.resolver(idReserva, id, req.validado.body));
});

router.delete("/:id", validar(solicitudParamSchema, "params"), validar(actorQuerySchema, "query"), async (req, res) => {
  const { idReserva, id } = req.validado.params;
  await solicitudService.eliminar(idReserva, id, req.validado.query.id_usuario);
  res.status(204).end();
});

export default router;
