import { BaseStringIdEntity } from "./base/sys$BaseStringIdEntity";
export class SMfo extends BaseStringIdEntity {
  static NAME = "insurance_SMfo";
  id?: string;
  act?: string | null;
  bankAdress?: string | null;
  bankName?: string | null;
  bankType?: string | null;
  dClose?: any | null;
  dOpen?: any | null;
  header?: string | null;
  region?: string | null;
  union?: string | null;
}
export type SMfoViewName = "_base" | "_local" | "_minimal";
export type SMfoView<V extends SMfoViewName> = V extends "_base"
  ? Pick<
      SMfo,
      | "id"
      | "act"
      | "bankAdress"
      | "bankName"
      | "bankType"
      | "dClose"
      | "dOpen"
      | "header"
      | "region"
      | "union"
    >
  : V extends "_local"
  ? Pick<
      SMfo,
      | "id"
      | "act"
      | "bankAdress"
      | "bankName"
      | "bankType"
      | "dClose"
      | "dOpen"
      | "header"
      | "region"
      | "union"
    >
  : never;
