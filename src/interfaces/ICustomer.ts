export interface ICustomer {
  customer_code: String;
  measurement?: {
    measure_uuid: string;
    measure_value: number;
    measure_datetime: Date;
    measure_type: string;
    image_url: string;
    confirmed: number;
  }[];
}
