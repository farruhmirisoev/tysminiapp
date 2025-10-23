import { StandardEntity } from "./base/sys$StandardEntity";
import { OrganizationExt } from "./base$OrganizationExt";
import { UserExtend } from "./extend_User";
import { AgentAct } from "./agentact$AgentAct";
export class AgentActAcl extends StandardEntity {
  static NAME = "AgentActAcl";
  organizationExt?: OrganizationExt | null;
  user?: UserExtend | null;
  act?: AgentAct | null;
}
export type AgentActAclViewName = "_base" | "_local" | "_minimal";
export type AgentActAclView<V extends AgentActAclViewName> = V extends "_base"
  ? Pick<AgentActAcl, "id" | "act">
  : V extends "_minimal"
  ? Pick<AgentActAcl, "id" | "act">
  : never;
