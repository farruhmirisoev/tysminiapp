import { AbstractParentEntity } from "./AbstractParentEntity";
import { DicCountry } from "./base$DicCountry";
import { DicClientStatus } from "./base$DicClientStatus";
import { FileDescriptor } from "./sys$FileDescriptor";
// import { UserExt } from "./base$UserExt";
export class AbstractParty extends AbstractParentEntity {
  name?: string | null;
  partyType?: any | null;
  nationalIdentifier?: string | null;
  active?: boolean | null;
  resident?: boolean | null;
  residenceCountry?: DicCountry | null;
  clientStatus?: DicClientStatus | null;
  image?: FileDescriptor | null;
  comment?: string | null;
  // responsible?: UserExt | null;
}
