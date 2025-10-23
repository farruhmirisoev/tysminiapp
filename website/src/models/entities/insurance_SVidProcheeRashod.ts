import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class SVidProcheeRashod extends BaseIntegerIdEntity {
  static NAME = "insurance_SVidProcheeRashod";
  name?: string | null;
  tip?: number | null;
}
export type SVidProcheeRashodViewName = "_base" | "_local" | "_minimal";
export type SVidProcheeRashodView<V extends SVidProcheeRashodViewName> =
  V extends "_base"
    ? Pick<SVidProcheeRashod, "id" | "name" | "tip">
    : V extends "_local"
    ? Pick<SVidProcheeRashod, "id" | "name" | "tip">
    : V extends "_minimal"
    ? Pick<SVidProcheeRashod, "id" | "name">
    : never;
