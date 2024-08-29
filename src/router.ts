// Import Router do Express para criação das rotas
import { Router } from "express";

// Import do controller
import {
  confirmMeasurement,
  listMeasurement,
  uploadMeasurement,
} from "./controllers/MeasurementController";

const router = Router({ caseSensitive: true });

export default router
  .post("/upload", uploadMeasurement)
  .patch("/confirm", confirmMeasurement)
  .get("/:customer_code/list", listMeasurement);
