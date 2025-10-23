import { StandardEntity } from "./base/sys$StandardEntity";
import { Organization } from "./company_Organization";
export class UserLegacy extends StandardEntity {
  static NAME = "insurance_UserLegacy";
  login?: string | null;
  loginLowerCase?: string | null;
  password?: string | null;
  passwordEncryption?: string | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  position?: string | null;
  email?: string | null;
  language?: string | null;
  timeZone?: string | null;
  timeZoneAuto?: boolean | null;
  active?: boolean | null;
  changePasswordAtNextLogon?: boolean | null;
  group?: any | null;
  groupNames?: string | null;
  ipMask?: string | null;
  sysTenantId?: string | null;
  smsCode?: number | null;
  organization?: Organization | null;
}
export type UserLegacyViewName = "_base" | "_local" | "_minimal";
export type UserLegacyView<V extends UserLegacyViewName> = V extends "_base"
  ? Pick<
      UserLegacy,
      | "id"
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
      | "group"
      | "groupNames"
      | "ipMask"
      | "sysTenantId"
      | "smsCode"
    >
  : V extends "_local"
  ? Pick<
      UserLegacy,
      | "id"
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
      | "group"
      | "groupNames"
      | "ipMask"
      | "sysTenantId"
      | "smsCode"
    >
  : never;
