// Import dos types do Express
import { Request, Response } from "express";

// Import dos Services do Controller
import { model, uploadImage } from "../services/GeminiService";
import { MeasurementService } from "../services/MeasurementService";
import { CustomerService } from "../services/CustomerService";

// Import do uuid para geração
import { v4 as uuidv4 } from "uuid";

export const uploadMeasurement = async (req: Request, res: Response) => {
  const measurement = new MeasurementService();

  const { image, customer_code, measurement_datetime, measure_type } = req.body;

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
  const uploadResponse = await uploadImage.uploadFile(`${image}`, {
    mimeType: "image/jpeg",
  });

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    { text: "Read the image and return ONLY the meter value" },
  ]);

  const data = {
    image_url: uploadResponse.file.uri,
    measure_value: parseInt(result.response.text()),
    measure_uuid: uuidv4(),
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

  if (existsMeasure.confirmed) {
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
