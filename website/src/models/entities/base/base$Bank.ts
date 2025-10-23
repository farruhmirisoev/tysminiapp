import { AbstractDictionary } from "./AbstractDictionary";
export class Bank extends AbstractDictionary {
  static NAME = "base$Bank";
  bankIdentificationCode?: string | null;
  businessIdentificationNumber?: string | null;
  beneficiaryCode?: string | null;
  addressLang1?: string | null;
  addressLang2?: string | null;
  addressLang3?: string | null;
  addressLang4?: string | null;
  addressLang5?: string | null;
  address?: string | null;
  name?: string | null;
  fullName?: string | null;
}
export type BankViewName = "_base" | "_local" | "_minimal";
export type BankView<V extends BankViewName> = V extends "_base"
  ? Pick<
      Bank,
      | "id"
      | "code"
      | "name"
      | "bankIdentificationCode"
      | "businessIdentificationNumber"
      | "beneficiaryCode"
      | "addressLang1"
      | "addressLang2"
      | "addressLang3"
      | "addressLang4"
      | "addressLang5"
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
      | "isSystemRecord"
      | "active"
      | "isDefault"
      | "order"
    >
  : V extends "_local"
  ? Pick<
      Bank,
      | "id"
      | "bankIdentificationCode"
      | "businessIdentificationNumber"
      | "beneficiaryCode"
      | "addressLang1"
      | "addressLang2"
      | "addressLang3"
      | "addressLang4"
      | "addressLang5"
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
  ? Pick<Bank, "id" | "code" | "name">
  : never;
