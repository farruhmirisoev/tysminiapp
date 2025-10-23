import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class Manufacturer extends BaseIntegerIdEntity {
  static NAME = "reference_OsgoManufacturer";
  name?: string | null;
  order?: number | null;
  deleteTs?: any | null;
  deletedBy?: string | null;
}
export type ManufacturerViewName = "_base" | "_local" | "_minimal";
export type ManufacturerView<V extends ManufacturerViewName> = V extends "_base"
  ? Pick<Manufacturer, "id" | "name" | "order">
  : V extends "_local"
  ? Pick<Manufacturer, "id" | "name" | "order">
  : V extends "_minimal"
  ? Pick<Manufacturer, "id" | "name">
  : never;
