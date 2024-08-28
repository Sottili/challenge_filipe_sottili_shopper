import { Router } from "express";
import {
  confirmMeasurement,
  uploadMeasurement,
} from "./controllers/MeasurementController";

const router = Router({ caseSensitive: true });

export default router
  .post("/upload", uploadMeasurement)
  .patch("/confirm", confirmMeasurement)
  .get("/:customer_code/list");
