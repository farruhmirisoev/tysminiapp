import { BaseUuidEntity } from "./sys$BaseUuidEntity";
import { Organization } from "./base$Organization";
export class OrganizationHierarchy extends BaseUuidEntity {
  static NAME = "base_OrganizationHierarchy";
  organization?: Organization | null;
  parent?: Organization | null;
  level?: number | null;
}
export type OrganizationHierarchyViewName = "_base" | "_local" | "_minimal";
export type OrganizationHierarchyView<V extends OrganizationHierarchyViewName> =
  V extends "_base"
    ? Pick<OrganizationHierarchy, "id" | "organization" | "level">
    : V extends "_local"
    ? Pick<OrganizationHierarchy, "id" | "level">
    : V extends "_minimal"
    ? Pick<OrganizationHierarchy, "id" | "organization">
    : never;
