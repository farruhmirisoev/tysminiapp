import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class IncidentFrequency extends BaseIntegerIdEntity {
  static NAME = "reference_OsgoIncidentFrequency1";
  name?: string | null;
  nameUz?: string | null;
  coefficient?: any | null;
  order?: number | null;
}
export type IncidentFrequencyViewName = "_base" | "_local" | "_minimal";
export type IncidentFrequencyView<V extends IncidentFrequencyViewName> =
  V extends "_base"
    ? Pick<
        IncidentFrequency,
        "id" | "name" | "coefficient" | "nameUz" | "order"
      >
    : V extends "_local"
    ? Pick<
        IncidentFrequency,
        "id" | "name" | "nameUz" | "coefficient" | "order"
      >
    : V extends "_minimal"
    ? Pick<IncidentFrequency, "id" | "name" | "coefficient">
    : never;
