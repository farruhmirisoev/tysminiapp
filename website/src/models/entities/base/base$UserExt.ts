import { User } from "./sec$User";
import { FileDescriptor } from "./sys$FileDescriptor";
import { UserEmailSettings } from "./base$UserEmailSettings";
import { AddressBook } from "./base$AddressBook";
import { Organization } from "./base$Organization";
export class UserExt extends User {
  static NAME = "base$UserExt";
  image?: FileDescriptor | null;
  innerNumber?: string | null;
  availability?: boolean | null;
  mobilePhone?: string | null;
  telegramCode?: string | null;
  telegramChatId?: string | null;
  emailSettings?: UserEmailSettings[] | null;
  addressBookEntries?: AddressBook[] | null;
  passwordChangeDate?: any | null;
  shortName?: string | null;
  fullName?: string | null;
  smsCode?: number | null;
  organization?: Organization | null;
}
export type UserExtViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "user.browse"
  | "user.edit"
  | "user.receiveAndSendEmails";
export type UserExtView<V extends UserExtViewName> = V extends "_base"
  ? Pick<
      UserExt,
      | "id"
      | "login"
      | "name"
      | "innerNumber"
      | "availability"
      | "mobilePhone"
      | "telegramCode"
      | "telegramChatId"
      | "passwordChangeDate"
      | "shortName"
      | "fullName"
      | "smsCode"
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
    >
  : V extends "_local"
  ? Pick<
      UserExt,
      | "id"
      | "innerNumber"
      | "availability"
      | "mobilePhone"
      | "telegramCode"
      | "telegramChatId"
      | "passwordChangeDate"
      | "shortName"
      | "fullName"
      | "smsCode"
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
    >
  : V extends "_minimal"
  ? Pick<UserExt, "id" | "login" | "name">
  : V extends "user.browse"
  ? Pick<
      UserExt,
      | "id"
      | "version"
      | "createTs"
      | "createdBy"
      | "updateTs"
      | "updatedBy"
      | "deleteTs"
      | "deletedBy"
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
      | "group"
      | "image"
      | "login"
    >
  : V extends "user.edit"
  ? Pick<
      UserExt,
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
      | "groupNames"
      | "ipMask"
      | "sysTenantId"
      | "group"
      | "userRoles"
      | "substitutions"
      | "organization"
      | "image"
      | "addressBookEntries"
      | "availability"
      | "innerNumber"
      | "fullName"
      | "shortName"
      | "login"
    >
  : V extends "user.receiveAndSendEmails"
  ? Pick<UserExt, "id" | "login" | "name" | "emailSettings" | "email">
  : never;
