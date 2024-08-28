import { Request, Response } from "express";
import { GeminiService } from "../services/gemini";
import { MeasurementService } from "../services/MeasurementService";
import { v4 as uuidv4 } from "uuid";

export const uploadMeasurement = async (req: Request, res: Response) => {
  const gemini = new GeminiService();
  const measurement = new MeasurementService();

  const { image, customer_code, measurement_datetime, measure_type } =
    req.body();

  // Validação de dados
  if (!image || !customer_code || !measurement_datetime || !measure_type) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Dados inválidos fornecidos",
    });
  }

  // Verificação de Existência no Banco
  const existsMeasure = await measurement.findMeasurementUpload(
    customer_code,
    measure_type
  );

  if (existsMeasure) {
    return res.status(409).json({
      error_code: "DOUBLE_REPORT",
      error_description: "Leitura do mês já realizada",
    });
  }

  // Upload da Foto no Gemini
  const uploadResponse = await gemini.upload(`${image}`, {
    mimeType: "image/jpeg",
    displayName: "Measurement",
  });

  // Criação dele no Banco
  const data = {
    customer_code: customer_code as string,
    measure_datetime: new Date(measurement_datetime),
    measure_type: measure_type,
    measure_value: 123123,
    image_url: `${uploadResponse.file.uri}`,
    measure_uuid: `${uuidv4()}`,
  };

  await measurement.create(data).then();

  res.status(200).json({
    image_url: data.image_url,
    measure_value: data.measure_value,
    measure_uuid: data.measure_uuid,
  });
};

export const confirmMeasurement = async (req: Request, res: Response) => {
  const measurement = new MeasurementService();

  const { measure_uuid, confirmed_value } = req.body;

  // Validação de dados
  if (!measure_uuid || !confirmed_value) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Dados inválidos fornecidos",
    });
  }

  // Validação se já existe
  const existsMeasure = await measurement.findMeasurementConfirm(measure_uuid);

  if (!existsMeasure) {
    return res.status(404).json({
      error_code: "MEASURE_NOT_FOUND",
      error_description: "Leitura do mês já realizada",
    });
  }

  if (existsMeasure) {
    return res.status(409).json({
      error_code: "CONFIRMATION_DUPLICATE",
      error_description: "Leitura do mês já realizada",
    });
  }

  const updateMeasure = await measurement.updateMeasurement(
    measure_uuid,
    confirmed_value
  );

  res.status(200).json({ success: true });
};

export const listMeasurement = (req: Request, res: Response) => {};
