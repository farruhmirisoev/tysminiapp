import { AbstractDictionary } from "./AbstractDictionary";
export class DicClientStatus extends AbstractDictionary {
  static NAME = "base$DicClientStatus";
}
export type DicClientStatusViewName = "_base" | "_local" | "_minimal";
export type DicClientStatusView<V extends DicClientStatusViewName> =
  V extends "_base"
    ? Pick<
        DicClientStatus,
        | "id"
        | "langValue"
        | "legacyId"
        | "fundId"
        | "langValue1"
        | "description1"
        | "langValue2"
        | "description2"
        | "langValue3"
        | "description3"
        | "langValue4"
        | "description4"
        | "langValue5"
        | "description5"
        | "startDate"
        | "endDate"
        | "code"
        | "isSystemRecord"
        | "active"
        | "isDefault"
        | "order"
      >
    : V extends "_local"
    ? Pick<
        DicClientStatus,
        | "id"
        | "legacyId"
        | "fundId"
        | "langValue1"
        | "description1"
        | "langValue2"
        | "description2"
        | "langValue3"
        | "description3"
        | "langValue4"
        | "description4"
        | "langValue5"
        | "description5"
        | "startDate"
        | "endDate"
        | "code"
        | "isSystemRecord"
        | "active"
        | "isDefault"
        | "order"
      >
    : V extends "_minimal"
    ? Pick<DicClientStatus, "id" | "langValue">
    : never;
