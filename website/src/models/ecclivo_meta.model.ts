import type { Beneficiary } from "@/models/entities/reference_OsgoBeneficiary";
import type { CarType } from "@/models/entities/referenceOsgoCarType";
import type { DrivedArea } from "@/models/entities/reference_OsgoDrivedArea";
import type { IncidentFrequency } from "@/models/entities/reference_OsgoIncidentFrequency";
import type { OsgoPeriodType } from "@/models/enums/enums";
import type { Period } from "@/models/entities/reference_OsgoPeriod";
import type { Relative } from "./entities/insurance_Relative1";

export interface PeriodType {
  type: OsgoPeriodType;
  ru: string;
  uz: string;
}

export interface EcclivoMeta {
  version: number;
  carType: CarType[];
  beneficiary: Beneficiary[];
  drivedArea: DrivedArea[];
  incidentFrequency: IncidentFrequency[];
  period: Period[];
  periodType: PeriodType[];
  relative: Relative[];
}
