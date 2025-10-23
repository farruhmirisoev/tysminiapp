import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class OsgopVehicleType extends BaseIntegerIdEntity {
  static NAME = "osgopVehicleType";
  name?: string | null;
  nameUz?: string | null;
  tariff?: any | null;
  order?: number | null;
  fundId?: number | null;
}
export type OsgopVehicleTypeViewName = "_base" | "_local" | "_minimal";
export type OsgopVehicleTypeView<
  V extends OsgopVehicleTypeViewName
> = V extends "_base"
  ? Pick<
      OsgopVehicleType,
      "id" | "name" | "nameUz" | "tariff" | "order" | "fundId"
    >
  : V extends "_local"
  ? Pick<
      OsgopVehicleType,
      "id" | "name" | "nameUz" | "tariff" | "order" | "fundId"
    >
  : V extends "_minimal"
  ? Pick<OsgopVehicleType, "id" | "name">
  : never;
