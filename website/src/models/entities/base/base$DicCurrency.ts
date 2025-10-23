import { AbstractDictionary } from "./AbstractDictionary";
import { Exchange } from "./base$Exchange";
export class DicCurrency extends AbstractDictionary {
  static NAME = "base$DicCurrency";
  nominal?: number | null;
  exchanges?: Exchange[] | null;
}
export type DicCurrencyViewName = "_base" | "_local" | "_minimal";
export type DicCurrencyView<V extends DicCurrencyViewName> = V extends "_base"
  ? Pick<
      DicCurrency,
      | "id"
      | "langValue"
      | "nominal"
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
      DicCurrency,
      | "id"
      | "nominal"
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
  ? Pick<DicCurrency, "id" | "langValue">
  : never;
