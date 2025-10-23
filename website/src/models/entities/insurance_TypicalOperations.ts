import { StandardEntity } from "./base/sys$StandardEntity";
export class TypicalOperations extends StandardEntity {
  static NAME = "insurance_TypicalOperations";
  code?: string | null;
  name?: string | null;
  descriptions?: string | null;
}
export type TypicalOperationsViewName = "_base" | "_local" | "_minimal";
export type TypicalOperationsView<V extends TypicalOperationsViewName> =
  V extends "_base"
    ? Pick<TypicalOperations, "id" | "name" | "code" | "descriptions">
    : V extends "_local"
    ? Pick<TypicalOperations, "id" | "code" | "name" | "descriptions">
    : V extends "_minimal"
    ? Pick<TypicalOperations, "id" | "name">
    : never;
