import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class STipActAgent extends BaseIntegerIdEntity {
  static NAME = "insurance_STipActAgent";
  name?: string | null;
}
export type STipActAgentViewName = "_base" | "_local" | "_minimal";
export type STipActAgentView<V extends STipActAgentViewName> = V extends "_base"
  ? Pick<STipActAgent, "id" | "name">
  : V extends "_local"
  ? Pick<STipActAgent, "id" | "name">
  : V extends "_minimal"
  ? Pick<STipActAgent, "id" | "name">
  : never;
