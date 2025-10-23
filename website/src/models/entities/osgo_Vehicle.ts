import { StandardEntity } from "./base/sys$StandardEntity";
import { CarType } from "./referenceOsgoCarType";
import { DicVehicleType } from "./DicVehicleType";
import { OsgopVehicleType } from "./osgopVehicleType";
import { Manufacturer } from "./reference_OsgoManufacturer";
import { CarModel } from "./reference_OsgoCarModel";
import { DicRegion } from "./base/base$DicRegion";
import { Party } from "./base/base$Party";
import { OsgopLossRatio } from "./referenceOsgopLossRatio";
export class Vehicle extends StandardEntity {
  static NAME = "osgo_Vehicle";
  isForign?: boolean | null;
  carType?: CarType | null;
  vehicleType?: DicVehicleType | null;
  vehicleTypeOsgop?: OsgopVehicleType | null;
  manufacturer?: Manufacturer | null;
  model?: CarModel | null;
  modelName?: string | null;
  volume?: any | null;
  createdYear?: number | null;
  govNumber?: string | null;
  bodyNumber?: string | null;
  engineNumber?: string | null;
  liftingCapacity?: any | null;
  numberOfSeats?: number | null;
  techPassportSeries?: string | null;
  techPassportNumber?: string | null;
  techPassportIssueDate?: any | null;
  region?: DicRegion | null;
  fixData?: boolean | null;
  inn?: string | null;
  pinfl?: string | null;
  ownerType?: any | null;
  owner?: Party | null;
  osgopLossRatio?: OsgopLossRatio | null;
  online?: boolean | null;
}
export type VehicleViewName = "_base" | "_local" | "_minimal";
export type VehicleView<V extends VehicleViewName> = V extends "_base"
  ? Pick<
      Vehicle,
      | "id"
      | "engineNumber"
      | "techPassportSeries"
      | "techPassportNumber"
      | "isForign"
      | "modelName"
      | "volume"
      | "createdYear"
      | "govNumber"
      | "bodyNumber"
      | "liftingCapacity"
      | "numberOfSeats"
      | "techPassportIssueDate"
      | "fixData"
      | "inn"
      | "pinfl"
      | "ownerType"
      | "online"
    >
  : V extends "_local"
  ? Pick<
      Vehicle,
      | "id"
      | "isForign"
      | "modelName"
      | "volume"
      | "createdYear"
      | "govNumber"
      | "bodyNumber"
      | "engineNumber"
      | "liftingCapacity"
      | "numberOfSeats"
      | "techPassportSeries"
      | "techPassportNumber"
      | "techPassportIssueDate"
      | "fixData"
      | "inn"
      | "pinfl"
      | "ownerType"
      | "online"
    >
  : V extends "_minimal"
  ? Pick<
      Vehicle,
      "id" | "engineNumber" | "techPassportSeries" | "techPassportNumber"
    >
  : never;
