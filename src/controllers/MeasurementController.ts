import { Request, Response } from "express";

import { GeminiService } from "../services/GeminiService";
import { MeasurementService } from "../services/MeasurementService";
import { LLMService } from "../services/LLMService";

import { v4 as uuidv4 } from "uuid";
import { CustomerService } from "../services/CustomerService";

export const uploadMeasurement = async (req: Request, res: Response) => {
  const gemini = new GeminiService();
  const measurement = new MeasurementService();
  const llm = new LLMService();

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

  // Return value of measurement
  const valueMeasurement = await llm.extractMeasurementValue(
    uploadResponse.file.uri
  );

  const data = {
    image_url: valueMeasurement?.image_url!,
    measure_value: valueMeasurement?.measure_value!,
    measure_uuid: `${valueMeasurement?.measure_uuid}`,
    measure_datetime: new Date(measurement_datetime),
    measure_type: measure_type,
    confirmed: 0,
    customer_code: customer_code,
  };

  await measurement.create(data);

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

export const listMeasurement = async (req: Request, res: Response) => {
  const customer = new CustomerService();

  const { customer_code } = req.params;
  const measure_type = req.query.measure_type as string;

  if (measure_type && !["WATER", "GAS"].includes(measure_type.toUpperCase())) {
    res.status(400).json({
      error_code: "INVALID_TYPE",
      error_description: "Tipo de medição não permitido",
    });
  }

  try {
    const listMeasurements = await customer.findMeasurementCustomer(
      customer_code
    );

    if (listMeasurement.length === 0) {
      res.status(404).json({
        error_code: "MEASURES_NOT_FOUND",
        error_description: "Nenhuma leitura encontrada",
      });
    }

    res.status(200).json({ customer_code, measures: listMeasurements });
  } catch (error) {
    res.send(error);
  }
};
