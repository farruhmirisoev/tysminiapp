import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { AgentAct } from "./agentact$AgentAct";
import { AgentAgreement } from "./AgentAgreement";
import { ContractExt } from "./base$ContractExt";
import { Policy } from "./base$Policy";
export class AgentActDetail extends BaseUuidEntity {
  static NAME = "agentact$AgentActDetail";
  agentAct?: AgentAct | null;
  agentAgreement?: AgentAgreement | null;
  contract?: ContractExt | null;
  policy?: Policy | null;
  premium?: any | null;
  commission?: any | null;
  date?: any | null;
}
export type AgentActDetailViewName = "_base" | "_local" | "_minimal";
export type AgentActDetailView<V extends AgentActDetailViewName> =
  V extends "_base"
    ? Pick<AgentActDetail, "id" | "premium" | "commission" | "date">
    : V extends "_local"
    ? Pick<AgentActDetail, "id" | "premium" | "commission" | "date">
    : V extends "_minimal"
    ? Pick<AgentActDetail, "id">
    : never;
