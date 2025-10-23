import { StandardEntity } from "./base/sys$StandardEntity";
import { WorkType } from "../enums/enums";
export class Work extends StandardEntity {
  static NAME = "insurance_Work";
  from?: any | null;
  to?: any | null;
  message?: string | null;
  workType?: WorkType | null;
  state?: boolean | null;
}
export type WorkViewName = "_base" | "_local" | "_minimal";
export type WorkView<V extends WorkViewName> = V extends "_base"
  ? Pick<Work, "id" | "workType" | "from" | "to" | "message" | "state">
  : V extends "_local"
  ? Pick<Work, "id" | "from" | "to" | "message" | "workType" | "state">
  : V extends "_minimal"
  ? Pick<Work, "id" | "workType">
  : never;
