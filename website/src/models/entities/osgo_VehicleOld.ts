import { StandardEntity } from "./base/sys$StandardEntity";
import { CarType } from "./referenceOsgoCarType1";
export class Vehicle extends StandardEntity {
  static NAME = "osgo_VehicleOld";
  carType?: CarType | null;
  modelName?: string | null;
  volume?: any | null;
  createdYear?: number | null;
  govNumber?: string | null;
  bodyNumber?: string | null;
  engineNumber?: string | null;
  techPassportSeries?: string | null;
  techPassportNumber?: string | null;
  techPassportIssueDate?: any | null;
  fixData?: boolean | null;
  inn?: string | null;
  pinfl?: string | null;
}
export type VehicleViewName = "_base" | "_local" | "_minimal";
export type VehicleView<V extends VehicleViewName> = V extends "_base"
  ? Pick<
      Vehicle,
      | "id"
      | "engineNumber"
      | "techPassportSeries"
      | "techPassportNumber"
      | "modelName"
      | "volume"
      | "createdYear"
      | "govNumber"
      | "bodyNumber"
      | "techPassportIssueDate"
      | "fixData"
      | "inn"
      | "pinfl"
    >
  : V extends "_local"
  ? Pick<
      Vehicle,
      | "id"
      | "modelName"
      | "volume"
      | "createdYear"
      | "govNumber"
      | "bodyNumber"
      | "engineNumber"
      | "techPassportSeries"
      | "techPassportNumber"
      | "techPassportIssueDate"
      | "fixData"
      | "inn"
      | "pinfl"
    >
  : V extends "_minimal"
  ? Pick<
      Vehicle,
      "id" | "engineNumber" | "techPassportSeries" | "techPassportNumber"
    >
  : never;
