import { StandardEntity } from "./base/sys$StandardEntity";
import { Product } from "./product_Product";
import { UserExtend } from "./extend_User";
export class ProductUser extends StandardEntity {
  static NAME = "productProductUser";
  product?: Product | null;
  user?: UserExtend | null;
  date?: any | null;
  confirmation?: boolean | null;
  maxLiability?: any | null;
  commissionPossibility?: boolean | null;
  checkFixedCommission?: boolean | null;
  fixedCommission?: any | null;
  maxCommission?: any | null;
  checkMinPremiumSum?: boolean | null;
  minPremiumSum?: any | null;
  checkMinPremiumPercentYear?: boolean | null;
  minPremiumPercentYear?: any | null;
  checkMaxPremiumPercentYear?: boolean | null;
  maxPremiumPercentYear?: any | null;
  checkMinPremiumPercentPeriod?: boolean | null;
  minPremiumPercentPeriod?: any | null;
  checkMaxPremiumPercentPeriod?: boolean | null;
  maxPremiumPercentPeriod?: any | null;
}
export type ProductUserViewName = "_base" | "_local" | "_minimal";
export type ProductUserView<V extends ProductUserViewName> = V extends "_base"
  ? Pick<
      ProductUser,
      | "id"
      | "product"
      | "date"
      | "confirmation"
      | "maxLiability"
      | "commissionPossibility"
      | "checkFixedCommission"
      | "fixedCommission"
      | "maxCommission"
      | "checkMinPremiumSum"
      | "minPremiumSum"
      | "checkMinPremiumPercentYear"
      | "minPremiumPercentYear"
      | "checkMaxPremiumPercentYear"
      | "maxPremiumPercentYear"
      | "checkMinPremiumPercentPeriod"
      | "minPremiumPercentPeriod"
      | "checkMaxPremiumPercentPeriod"
      | "maxPremiumPercentPeriod"
    >
  : V extends "_local"
  ? Pick<
      ProductUser,
      | "id"
      | "date"
      | "confirmation"
      | "maxLiability"
      | "commissionPossibility"
      | "checkFixedCommission"
      | "fixedCommission"
      | "maxCommission"
      | "checkMinPremiumSum"
      | "minPremiumSum"
      | "checkMinPremiumPercentYear"
      | "minPremiumPercentYear"
      | "checkMaxPremiumPercentYear"
      | "maxPremiumPercentYear"
      | "checkMinPremiumPercentPeriod"
      | "minPremiumPercentPeriod"
      | "checkMaxPremiumPercentPeriod"
      | "maxPremiumPercentPeriod"
    >
  : V extends "_minimal"
  ? Pick<ProductUser, "id" | "product">
  : never;
