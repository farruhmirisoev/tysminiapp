import { BaseIntegerIdEntity } from "./base/sys$BaseIntegerIdEntity";
export class CarType extends BaseIntegerIdEntity {
  static NAME = "referenceOsgoCarType1";
  name?: string | null;
  nameUz?: string | null;
  tariffCompany?: any | null;
  tariffPerson?: any | null;
  order?: number | null;
  fundId?: number | null;
}
export type CarTypeViewName = "_base" | "_local" | "_minimal";
export type CarTypeView<V extends CarTypeViewName> = V extends "_base"
  ? Pick<
      CarType,
      | "id"
      | "name"
      | "nameUz"
      | "tariffCompany"
      | "tariffPerson"
      | "order"
      | "fundId"
    >
  : V extends "_local"
  ? Pick<
      CarType,
      | "id"
      | "name"
      | "nameUz"
      | "tariffCompany"
      | "tariffPerson"
      | "order"
      | "fundId"
    >
  : V extends "_minimal"
  ? Pick<CarType, "id" | "name">
  : never;
