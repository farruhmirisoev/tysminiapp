import { StandardEntity } from "./base/sys$StandardEntity";
import { Policy } from "./base$Policy";
import { DicCountry } from "./base/base$DicCountry";
export class Auto extends StandardEntity {
  static NAME = "customs$Auto";
  policy?: Policy | null;
  driverName?: string | null;
  driverCitizenship?: DicCountry | null;
  driverPassportSeries?: string | null;
  driverPassportNumber?: string | null;
  autoCountry?: DicCountry | null;
  regNumber?: string | null;
}
export type AutoViewName = "_base" | "_local" | "_minimal";
export type AutoView<V extends AutoViewName> = V extends "_base"
  ? Pick<
      Auto,
      | "id"
      | "driverName"
      | "driverPassportSeries"
      | "driverPassportNumber"
      | "regNumber"
    >
  : V extends "_local"
  ? Pick<
      Auto,
      | "id"
      | "driverName"
      | "driverPassportSeries"
      | "driverPassportNumber"
      | "regNumber"
    >
  : V extends "_minimal"
  ? Pick<Auto, "id" | "driverName">
  : never;
