// Import do client do Prisma
import { PrismaClient } from "@prisma/client";

// Import da interface do Customer
import { ICustomer } from "../interfaces/ICustomer";

export class CustomerService {
  private prisma = new PrismaClient();

  async findMeasurementCustomer(
    customer_code: String
  ): Promise<ICustomer[] | null> {
    const measurementsUser = await this.prisma.customer.findMany({
      where: {
        customer_code: {
          equals: `${customer_code}`,
        },
      },
      select: {
        customer_code: true,
        measurement: true,
      },
    });
    return measurementsUser.length > 0 ? measurementsUser : null;
  }
}
