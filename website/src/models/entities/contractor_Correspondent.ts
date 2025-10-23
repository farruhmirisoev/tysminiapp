import { StandardEntity } from "./base/sys$StandardEntity";
import { Organization } from "./company_Organization";
export class Correspondent extends StandardEntity {
  static NAME = "contractor_Correspondent";
  name?: string | null;
  organization?: Organization | null;
  userpId?: any | null;
}
export type CorrespondentViewName = "_base" | "_local" | "_minimal";
export type CorrespondentView<V extends CorrespondentViewName> =
  V extends "_base"
    ? Pick<Correspondent, "id" | "name" | "userpId">
    : V extends "_local"
    ? Pick<Correspondent, "id" | "name" | "userpId">
    : V extends "_minimal"
    ? Pick<Correspondent, "id" | "name">
    : never;
