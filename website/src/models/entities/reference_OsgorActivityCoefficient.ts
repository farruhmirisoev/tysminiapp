import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class ActivityCoefficient extends BaseIntegerIdEntity {
  static NAME = "reference_OsgorActivityCoefficient";
  className?: string | null;
  coefficient?: any | null;
}
export type ActivityCoefficientViewName = "_base" | "_local" | "_minimal";
export type ActivityCoefficientView<V extends ActivityCoefficientViewName> =
  V extends "_base"
    ? Pick<ActivityCoefficient, "id" | "className" | "coefficient">
    : V extends "_local"
    ? Pick<ActivityCoefficient, "id" | "className" | "coefficient">
    : V extends "_minimal"
    ? Pick<ActivityCoefficient, "id" | "className">
    : never;
