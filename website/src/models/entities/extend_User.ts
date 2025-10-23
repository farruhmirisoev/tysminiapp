import { UserExt } from "./base/base$UserExt";
import { ProductUser } from "./productProductUser";
import { Individual } from "./base/base$Individual";
import { InventoryType } from "./inventory_Type";
export class UserExtend extends UserExt {
  static NAME = "extend_User";
  products?: ProductUser[] | null;
  individual?: Individual | null;
  legacyId?: any | null;
  eimzoSerialNumber?: string | null;
  eimzoGuid?: string | null;
  eimzoData?: string | null;
  inventoryTypes?: InventoryType[] | null;
}
export type UserExtendViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "userExtend-view";
export type UserExtendView<V extends UserExtendViewName> = V extends "_base"
  ? Pick<
      UserExtend,
      | "id"
      | "name"
      | "legacyId"
      | "eimzoSerialNumber"
      | "eimzoGuid"
      | "eimzoData"
      | "login"
      | "loginLowerCase"
      | "password"
      | "passwordEncryption"
      | "firstName"
      | "lastName"
      | "middleName"
      | "position"
      | "email"
      | "language"
      | "timeZone"
      | "timeZoneAuto"
      | "active"
      | "changePasswordAtNextLogon"
      | "groupNames"
      | "ipMask"
      | "sysTenantId"
      | "innerNumber"
      | "availability"
      | "mobilePhone"
      | "telegramCode"
      | "telegramChatId"
      | "passwordChangeDate"
      | "shortName"
      | "fullName"
      | "smsCode"
    >
  : V extends "_local"
  ? Pick<
      UserExtend,
      | "id"
      | "legacyId"
      | "eimzoSerialNumber"
      | "eimzoGuid"
      | "eimzoData"
      | "login"
      | "loginLowerCase"
      | "password"
      | "passwordEncryption"
      | "name"
      | "firstName"
      | "lastName"
      | "middleName"
      | "position"
      | "email"
      | "language"
      | "timeZone"
      | "timeZoneAuto"
      | "active"
      | "changePasswordAtNextLogon"
      | "groupNames"
      | "ipMask"
      | "sysTenantId"
      | "innerNumber"
      | "availability"
      | "mobilePhone"
      | "telegramCode"
      | "telegramChatId"
      | "passwordChangeDate"
      | "shortName"
      | "fullName"
      | "smsCode"
    >
  : V extends "_minimal"
  ? Pick<UserExtend, "id" | "name">
  : V extends "userExtend-view"
  ? Pick<
      UserExtend,
      | "id"
      | "name"
      | "firstName"
      | "lastName"
      | "middleName"
      | "email"
      | "active"
      | "individual"
      | "language"
      | "timeZone"
      | "organization"
    >
  : never;
