import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class SVidProchee extends BaseIntegerIdEntity {
  static NAME = "insurance_SVidProchee";
  name?: string | null;
  tip?: number | null;
}
export type SVidProcheeViewName = "_base" | "_local" | "_minimal";
export type SVidProcheeView<V extends SVidProcheeViewName> = V extends "_base"
  ? Pick<SVidProchee, "id" | "name" | "tip">
  : V extends "_local"
  ? Pick<SVidProchee, "id" | "name" | "tip">
  : V extends "_minimal"
  ? Pick<SVidProchee, "id" | "name">
  : never;
