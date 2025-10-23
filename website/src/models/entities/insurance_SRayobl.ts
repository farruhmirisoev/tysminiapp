import { BaseStringIdEntity } from "./base/sys$BaseStringIdEntity";
export class SRayobl extends BaseStringIdEntity {
  static NAME = "insurance_SRayobl";
  id?: string;
  kod?: string | null;
  name?: string | null;
  obl?: number | null;
  por?: number | null;
  ray?: number | null;
  selo?: number | null;
}
export type SRayoblViewName = "_base" | "_local" | "_minimal";
export type SRayoblView<V extends SRayoblViewName> = V extends "_base"
  ? Pick<SRayobl, "id" | "name" | "kod" | "obl" | "por" | "ray" | "selo">
  : V extends "_local"
  ? Pick<SRayobl, "id" | "kod" | "name" | "obl" | "por" | "ray" | "selo">
  : V extends "_minimal"
  ? Pick<SRayobl, "id" | "name">
  : never;
