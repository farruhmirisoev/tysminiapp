import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
import { CarType } from "./referenceOsgoCarType";
import { Manufacturer } from "./reference_OsgoManufacturer";
import { CarPrice } from "./reference_CarPrice";
export class CarModel extends BaseIntegerIdEntity {
  static NAME = "reference_OsgoCarModel";
  carType?: CarType | null;
  manufacturer?: Manufacturer | null;
  name?: string | null;
  volume?: any | null;
  carPrice?: CarPrice[] | null;
  deleteTs?: any | null;
  deletedBy?: string | null;
}
export type CarModelViewName = "_base" | "_local" | "_minimal";
export type CarModelView<V extends CarModelViewName> = V extends "_base"
  ? Pick<CarModel, "id" | "name" | "volume">
  : V extends "_local"
  ? Pick<CarModel, "id" | "name" | "volume">
  : V extends "_minimal"
  ? Pick<CarModel, "id" | "name">
  : never;
