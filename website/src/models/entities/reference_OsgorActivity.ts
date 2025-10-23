import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
import { ActivityCoefficient } from "./reference_OsgorActivityCoefficient";
export class OsgorActivity extends BaseIntegerIdEntity {
  static NAME = "reference_OsgorActivity";
  name?: string | null;
  activityClass?: ActivityCoefficient | null;
}
export type OsgorActivityViewName = "_base" | "_local" | "_minimal";
export type OsgorActivityView<V extends OsgorActivityViewName> =
  V extends "_base"
    ? Pick<OsgorActivity, "id" | "name">
    : V extends "_local"
    ? Pick<OsgorActivity, "id" | "name">
    : V extends "_minimal"
    ? Pick<OsgorActivity, "id" | "name">
    : never;
