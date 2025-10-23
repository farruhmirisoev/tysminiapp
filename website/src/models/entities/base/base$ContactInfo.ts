import { AbstractParentEntity } from "./AbstractParentEntity";
import { DicContactInfoType } from "./base$DicContactInfoType";
import { Party } from "./base$Party";
import { AddressBook } from "./base$AddressBook";
export class ContactInfo extends AbstractParentEntity {
  static NAME = "base$ContactInfo";
  type?: DicContactInfoType | null;
  value?: string | null;
  valueUnformatted?: string | null;
  active?: boolean | null;
  doNotDisturb?: boolean | null;
  silenceStartTime?: any | null;
  silenceEndTime?: any | null;
  party?: Party | null;
  addressBookEntry?: AddressBook | null;
}
export type ContactInfoViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "contactInfo.editAndUpdateAddressBook"
  | "contactInfo.searchPartyByEmail"
  | "contactInfo.searchPartyByPhone"
  | "contactInfo.view";
export type ContactInfoView<V extends ContactInfoViewName> = V extends "_base"
  ? Pick<
      ContactInfo,
      | "id"
      | "type"
      | "value"
      | "valueUnformatted"
      | "active"
      | "doNotDisturb"
      | "silenceStartTime"
      | "silenceEndTime"
      | "legacyId"
      | "fundId"
    >
  : V extends "_local"
  ? Pick<
      ContactInfo,
      | "id"
      | "value"
      | "valueUnformatted"
      | "active"
      | "doNotDisturb"
      | "silenceStartTime"
      | "silenceEndTime"
      | "legacyId"
      | "fundId"
    >
  : V extends "_minimal"
  ? Pick<ContactInfo, "id" | "type" | "value">
  : V extends "contactInfo.editAndUpdateAddressBook"
  ? Pick<
      ContactInfo,
      | "id"
      | "value"
      | "valueUnformatted"
      | "active"
      | "doNotDisturb"
      | "silenceStartTime"
      | "silenceEndTime"
      | "legacyId"
      | "fundId"
      | "type"
      | "party"
      | "addressBookEntry"
    >
  : V extends "contactInfo.searchPartyByEmail"
  ? Pick<
      ContactInfo,
      "id" | "type" | "value" | "type" | "active" | "party" | "updatedBy"
    >
  : V extends "contactInfo.searchPartyByPhone"
  ? Pick<ContactInfo, "id" | "value" | "active" | "party" | "updateTs">
  : V extends "contactInfo.view"
  ? Pick<
      ContactInfo,
      | "id"
      | "value"
      | "valueUnformatted"
      | "active"
      | "doNotDisturb"
      | "silenceStartTime"
      | "silenceEndTime"
      | "legacyId"
      | "fundId"
      | "type"
    >
  : never;
