import { StandardEntity } from "./base/sys$StandardEntity";
import { CarModel } from "./reference_OsgoCarModel";
export class CarPrice extends StandardEntity {
  static NAME = "reference_CarPrice";
  carModel?: CarModel | null;
  date?: any | null;
  price?: any | null;
}
export type CarPriceViewName = "_base" | "_local" | "_minimal";
export type CarPriceView<V extends CarPriceViewName> = V extends "_base"
  ? Pick<CarPrice, "id" | "carModel" | "date" | "price">
  : V extends "_local"
  ? Pick<CarPrice, "id" | "date" | "price">
  : V extends "_minimal"
  ? Pick<CarPrice, "id" | "carModel" | "date">
  : never;
