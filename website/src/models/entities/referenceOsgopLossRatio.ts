import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class OsgopLossRatio extends BaseIntegerIdEntity {
  static NAME = "referenceOsgopLossRatio";
  name?: string | null;
  nameUz?: string | null;
  coefficient?: any | null;
  order?: number | null;
  fundId?: number | null;
  active?: boolean | null;
}
export type OsgopLossRatioViewName = "_base" | "_local" | "_minimal";
export type OsgopLossRatioView<V extends OsgopLossRatioViewName> =
  V extends "_base"
    ? Pick<
        OsgopLossRatio,
        "id" | "name" | "nameUz" | "coefficient" | "order" | "fundId" | "active"
      >
    : V extends "_local"
    ? Pick<
        OsgopLossRatio,
        "id" | "name" | "nameUz" | "coefficient" | "order" | "fundId" | "active"
      >
    : V extends "_minimal"
    ? Pick<OsgopLossRatio, "id" | "name">
    : never;
