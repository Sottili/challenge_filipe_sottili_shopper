export interface IMeasurement {
  id?: number;
  measure_uuid: string;
  measure_value: number;
  measure_datetime: Date;
  measure_type: "WATER" | "GAS";
  image_url: string;
  confirmed?: number;
  customer_code: string;
}
