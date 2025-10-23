import { StandardEntity } from "./base/sys$StandardEntity";
import { Product } from "./product_Product";
import { InsuredObjectType } from "./reference_InsuredObjectType";
import { InsuredObjectSubType } from "./reference_InsuredObjectSubType";
export class ProductObject extends StandardEntity {
  static NAME = "ProductObject";
  product?: Product | null;
  insuredObjectType?: InsuredObjectType | null;
  insuredObjectSubType?: InsuredObjectSubType | null;
  name?: string | null;
}
export type ProductObjectViewName = "_base" | "_local" | "_minimal";
export type ProductObjectView<V extends ProductObjectViewName> =
  V extends "_base"
    ? Pick<ProductObject, "id" | "product" | "name">
    : V extends "_local"
    ? Pick<ProductObject, "id" | "name">
    : V extends "_minimal"
    ? Pick<ProductObject, "id" | "product">
    : never;
