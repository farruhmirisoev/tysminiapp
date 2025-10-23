import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
export class DogovorAgent extends BaseLongIdEntity {
  static NAME = "insurance_DogovorAgent";
  idDogovor?: any | null;
  idMembers?: any | null;
  perc?: any | null;
  vDate?: any | null;
}
export type DogovorAgentViewName = "_base" | "_local" | "_minimal";
export type DogovorAgentView<V extends DogovorAgentViewName> = V extends "_base"
  ? Pick<DogovorAgent, "id" | "idDogovor" | "idMembers" | "perc" | "vDate">
  : V extends "_local"
  ? Pick<DogovorAgent, "id" | "idDogovor" | "idMembers" | "perc" | "vDate">
  : never;
