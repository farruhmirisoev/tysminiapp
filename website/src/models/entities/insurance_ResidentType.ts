import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class ResidentType extends BaseIntegerIdEntity {
  static NAME = "insurance_ResidentType";
  name?: string | null;
  nameUz?: string | null;
  description?: string | null;
  fundId?: number | null;
}
export type ResidentTypeViewName = "_base" | "_local" | "_minimal";
export type ResidentTypeView<V extends ResidentTypeViewName> = V extends "_base"
  ? Pick<ResidentType, "id" | "name" | "nameUz" | "description" | "fundId">
  : V extends "_local"
  ? Pick<ResidentType, "id" | "name" | "nameUz" | "description" | "fundId">
  : V extends "_minimal"
  ? Pick<ResidentType, "id" | "name">
  : never;
