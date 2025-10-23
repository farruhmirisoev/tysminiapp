import { AbstractTimeBasedEntity } from "./AbstractTimeBasedEntity";
import { Party } from "./base$Party";
export class AbstractContract extends AbstractTimeBasedEntity {
  partyType?: any | null;
  party?: Party | null;
  contractNumber?: string | null;
  contractDate?: any | null;
  contractStartDate?: any | null;
  contractEndDate?: any | null;
  description?: string | null;
  fixDate?: any | null;
}
