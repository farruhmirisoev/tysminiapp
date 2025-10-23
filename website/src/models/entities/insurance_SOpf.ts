import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class SOpf extends BaseIntegerIdEntity {
  static NAME = "insurance_SOpf";
  nameR?: string | null;
  nameSmallR?: string | null;
  nameSmallU?: string | null;
  nameU?: string | null;
  status?: number | null;
}
export type SOpfViewName = "_base" | "_local" | "_minimal";
export type SOpfView<V extends SOpfViewName> = V extends "_base"
  ? Pick<
      SOpf,
      "id" | "nameR" | "nameSmallR" | "nameSmallU" | "nameU" | "status"
    >
  : V extends "_local"
  ? Pick<
      SOpf,
      "id" | "nameR" | "nameSmallR" | "nameSmallU" | "nameU" | "status"
    >
  : never;
