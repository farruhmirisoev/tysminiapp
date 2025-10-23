import { StandardEntity } from "./base/sys$StandardEntity";
import { AgentAgreement } from "./AgentAgreement";
import { AgentActState } from "../enums/enums";
import { AgentActDetail } from "./agentact$AgentActDetail";
import { AgentActAcl } from "./AgentActAcl";
import { AgentActAttachment } from "./AgentActAttachment";
export class AgentAct extends StandardEntity {
  static NAME = "agentact$AgentAct";
  num?: string | null;
  date?: any | null;
  agentAgreement?: AgentAgreement | null;
  premium?: any | null;
  commission?: any | null;
  description?: string | null;
  state?: AgentActState | null;
  details?: AgentActDetail[] | null;
  agentActAcl?: AgentActAcl[] | null;
  legacyId?: any | null;
  attachments?: AgentActAttachment[] | null;
}
export type AgentActViewName = "_base" | "_local" | "_minimal";
export type AgentActView<V extends AgentActViewName> = V extends "_base"
  ? Pick<
      AgentAct,
      | "id"
      | "num"
      | "date"
      | "premium"
      | "commission"
      | "description"
      | "state"
      | "legacyId"
    >
  : V extends "_local"
  ? Pick<
      AgentAct,
      | "id"
      | "num"
      | "date"
      | "premium"
      | "commission"
      | "description"
      | "state"
      | "legacyId"
    >
  : V extends "_minimal"
  ? Pick<AgentAct, "id" | "num">
  : never;
