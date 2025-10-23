import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
import { Branch } from "./insurance_Branch";
import { STipActAgent } from "./insurance_STipActAgent";
export class AgentWork extends BaseLongIdEntity {
  static NAME = "insurance_AgentWork";
  branch?: Branch | null;
  coment?: string | null;
  idMembers?: any | null;
  idSTipActAgent?: STipActAgent | null;
  kom?: any | null;
  num?: string | null;
  prem?: any | null;
  state?: number | null;
  vDate?: any | null;
  legacyId?: any | null;
}
export type AgentWorkViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "agentWork-view";
export type AgentWorkView<V extends AgentWorkViewName> = V extends "_base"
  ? Pick<
      AgentWork,
      | "id"
      | "coment"
      | "idMembers"
      | "kom"
      | "num"
      | "prem"
      | "state"
      | "vDate"
      | "legacyId"
    >
  : V extends "_local"
  ? Pick<
      AgentWork,
      | "id"
      | "coment"
      | "idMembers"
      | "kom"
      | "num"
      | "prem"
      | "state"
      | "vDate"
      | "legacyId"
    >
  : V extends "agentWork-view"
  ? Pick<
      AgentWork,
      | "id"
      | "coment"
      | "idMembers"
      | "kom"
      | "num"
      | "prem"
      | "state"
      | "vDate"
      | "legacyId"
      | "branch"
    >
  : never;
