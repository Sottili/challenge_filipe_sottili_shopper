// Import do client do Prisma
import { PrismaClient } from "@prisma/client";

// Import da interface do Mensurement
import { IMeasurement } from "../interfaces/IMeasurement";

export class MeasurementService {
  private prisma = new PrismaClient();

  async create(data: IMeasurement): Promise<IMeasurement | null> {
    const measurement = await this.prisma.measurement.create({
      data: {
        measure_uuid: data.measure_uuid,
        measure_value: data.measure_value,
        measure_datetime: data.measure_datetime,
        measure_type: data.measure_type,
        image_url: data.image_url,
        confirmed: data.confirmed!,
        customer: {
          connectOrCreate: {
            where: { customer_code: data.customer_code },
            create: { customer_code: data.customer_code },
          },
        },
      },
    });
    return measurement ? (measurement as IMeasurement) : null;
  }

  async findMeasurementUpload(
    customer_code: string,
    measure_type: string
  ): Promise<IMeasurement | null> {
    const measurement = await this.prisma.measurement.findFirst({
      where: {
        measure_type: measure_type,
        measure_datetime: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
        customer: {
          some: {
            customer_code: customer_code,
          },
        },
      },
    });
    return measurement ? (measurement as IMeasurement) : null;
  }

  async findMeasurementConfirm(
    measure_uuid: string
  ): Promise<IMeasurement | null> {
    const measurement = await this.prisma.measurement.findUnique({
      where: {
        measure_uuid: measure_uuid,
      },
    });
    return measurement ? (measurement as IMeasurement) : null;
  }

  async updateMeasurement(
    measure_uuid: string,
    confirmed_value: number
  ): Promise<IMeasurement | null> {
    const measurement = await this.prisma.measurement.update({
      where: {
        measure_uuid: measure_uuid,
      },
      data: {
        measure_value: confirmed_value,
        confirmed: 1,
      },
    });
    return measurement ? (measurement as IMeasurement) : null;
  }
}
