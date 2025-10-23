import { StandardEntity } from "./base/sys$StandardEntity";
import { GrantType } from "./productGrantType";
import { UserExtend } from "./extend_User";
export class GrantTypeSolver extends StandardEntity {
  static NAME = "productGrantTypeSolver";
  grantType?: GrantType | null;
  user?: UserExtend | null;
  description?: string | null;
}
export type GrantTypeSolverViewName = "_base" | "_local" | "_minimal";
export type GrantTypeSolverView<V extends GrantTypeSolverViewName> =
  V extends "_base"
    ? Pick<GrantTypeSolver, "id" | "description">
    : V extends "_local"
    ? Pick<GrantTypeSolver, "id" | "description">
    : V extends "_minimal"
    ? Pick<GrantTypeSolver, "id" | "description">
    : never;
