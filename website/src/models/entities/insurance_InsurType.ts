import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
import { InsurOtr } from "./insurance_InsurOtr";
import { SClasses } from "./insurance_SClasses";
import { SStatus } from "./insurance_SStatus";
import { SUchGroup } from "./insurance_SUchGroup";
export class InsurType extends BaseIntegerIdEntity {
  static NAME = "insurance_InsurType";
  idInsurOtr?: InsurOtr | null;
  idSClasses?: SClasses | null;
  idSStatus?: SStatus | null;
  idSUchGroup?: SUchGroup | null;
  name?: string | null;
  ob?: boolean | null;
  state?: boolean | null;
}
export type InsurTypeViewName = "_base" | "_local" | "_minimal";
export type InsurTypeView<V extends InsurTypeViewName> = V extends "_base"
  ? Pick<InsurType, "id" | "name" | "ob" | "state">
  : V extends "_local"
  ? Pick<InsurType, "id" | "name" | "ob" | "state">
  : V extends "_minimal"
  ? Pick<InsurType, "id" | "name">
  : never;
