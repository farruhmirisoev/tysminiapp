import { BaseStringIdEntity } from "./base/sys$BaseStringIdEntity";
export class SDistr extends BaseStringIdEntity {
  static NAME = "insurance_SDistr";
  id?: string;
  act?: boolean | null;
  dateClose?: any | null;
  dateOpen?: any | null;
  distrName?: string | null;
  region?: string | null;
}
export type SDistrViewName = "_base" | "_local" | "_minimal";
export type SDistrView<V extends SDistrViewName> = V extends "_base"
  ? Pick<
      SDistr,
      "id" | "act" | "dateClose" | "dateOpen" | "distrName" | "region"
    >
  : V extends "_local"
  ? Pick<
      SDistr,
      "id" | "act" | "dateClose" | "dateOpen" | "distrName" | "region"
    >
  : never;
