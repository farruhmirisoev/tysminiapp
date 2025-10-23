import { BaseStringIdEntity } from "./base/sys$BaseStringIdEntity";
export class SRegion extends BaseStringIdEntity {
  static NAME = "insurance_SRegion";
  id?: string;
  act?: boolean | null;
  dateClose?: any | null;
  dateOpen?: any | null;
  dopField?: string | null;
  nsi?: string | null;
  regionNam?: string | null;
}
export type SRegionViewName = "_base" | "_local" | "_minimal";
export type SRegionView<V extends SRegionViewName> = V extends "_base"
  ? Pick<
      SRegion,
      "id" | "act" | "dateClose" | "dateOpen" | "dopField" | "nsi" | "regionNam"
    >
  : V extends "_local"
  ? Pick<
      SRegion,
      "id" | "act" | "dateClose" | "dateOpen" | "dopField" | "nsi" | "regionNam"
    >
  : never;
