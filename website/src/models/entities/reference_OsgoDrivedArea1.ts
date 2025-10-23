import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class DrivedArea extends BaseIntegerIdEntity {
  static NAME = "reference_OsgoDrivedArea1";
  name?: string | null;
  nameUz?: string | null;
  coefficient?: any | null;
  order?: number | null;
  fundId?: number | null;
  vehicleRegionCode?: number | null;
}
export type DrivedAreaViewName = "_base" | "_local" | "_minimal";
export type DrivedAreaView<V extends DrivedAreaViewName> = V extends "_base"
  ? Pick<
      DrivedArea,
      | "id"
      | "name"
      | "nameUz"
      | "coefficient"
      | "order"
      | "fundId"
      | "vehicleRegionCode"
    >
  : V extends "_local"
  ? Pick<
      DrivedArea,
      | "id"
      | "name"
      | "nameUz"
      | "coefficient"
      | "order"
      | "fundId"
      | "vehicleRegionCode"
    >
  : V extends "_minimal"
  ? Pick<DrivedArea, "id" | "name">
  : never;
