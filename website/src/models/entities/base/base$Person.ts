import { AbstractTimeBasedEntity } from "./AbstractTimeBasedEntity";
import { FileDescriptor } from "./sys$FileDescriptor";
export class Person extends AbstractTimeBasedEntity {
  static NAME = "base$Person";
  image?: FileDescriptor | null;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  hireDate?: any | null;
  nationalIdentifier?: string | null;
  dateOfBirth?: any | null;
  gender?: any | null;
  employeeNumber?: string | null;
  fullName?: string | null;
  firstLastName?: string | null;
  shortName?: string | null;
  fioWithEmployeeNumber?: string | null;
}
export type PersonViewName = "_base" | "_local" | "_minimal";
export type PersonView<V extends PersonViewName> = V extends "_base"
  ? Pick<
      Person,
      | "id"
      | "lastName"
      | "firstName"
      | "middleName"
      | "employeeNumber"
      | "hireDate"
      | "nationalIdentifier"
      | "dateOfBirth"
      | "gender"
      | "legacyId"
      | "fundId"
      | "startDate"
      | "endDate"
      | "writeHistory"
    >
  : V extends "_local"
  ? Pick<
      Person,
      | "id"
      | "firstName"
      | "lastName"
      | "middleName"
      | "hireDate"
      | "nationalIdentifier"
      | "dateOfBirth"
      | "gender"
      | "employeeNumber"
      | "legacyId"
      | "fundId"
      | "startDate"
      | "endDate"
      | "writeHistory"
    >
  : V extends "_minimal"
  ? Pick<
      Person,
      "id" | "lastName" | "firstName" | "middleName" | "employeeNumber"
    >
  : never;
