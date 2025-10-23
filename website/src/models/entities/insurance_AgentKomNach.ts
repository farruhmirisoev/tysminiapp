import { BaseLongIdEntity } from "./base/sys$BaseLongIdEntity";
import { AgentWork } from "./insurance_AgentWork";
import { Members } from "./insurance_Members";
export class AgentKomNach extends BaseLongIdEntity {
  static NAME = "insurance_AgentKomNach";
  debitor?: number | null;
  idAgentKomVip?: any | null;
  idAgentWork?: AgentWork | null;
  idDogovor?: any | null;
  idDogovorOplata?: any | null;
  idMembers?: Members | null;
  state?: number | null;
  summa?: any | null;
  vDate?: any | null;
}
export type AgentKomNachViewName = "_base" | "_local" | "_minimal";
export type AgentKomNachView<V extends AgentKomNachViewName> = V extends "_base"
  ? Pick<
      AgentKomNach,
      | "id"
      | "debitor"
      | "idAgentKomVip"
      | "idDogovor"
      | "idDogovorOplata"
      | "state"
      | "summa"
      | "vDate"
    >
  : V extends "_local"
  ? Pick<
      AgentKomNach,
      | "id"
      | "debitor"
      | "idAgentKomVip"
      | "idDogovor"
      | "idDogovorOplata"
      | "state"
      | "summa"
      | "vDate"
    >
  : never;
