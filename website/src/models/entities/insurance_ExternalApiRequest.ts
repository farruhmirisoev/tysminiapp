import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
export class ExternalApiRequest extends BaseUuidEntity {
  static NAME = "insurance_ExternalApiRequest";
  service?: string | null;
  method?: string | null;
  path?: string | null;
  time?: any | null;
  request?: string | null;
  response?: string | null;
}
export type ExternalApiRequestViewName = "_base" | "_local" | "_minimal";
export type ExternalApiRequestView<V extends ExternalApiRequestViewName> =
  V extends "_base"
    ? Pick<
        ExternalApiRequest,
        "id" | "service" | "method" | "path" | "time" | "request" | "response"
      >
    : V extends "_local"
    ? Pick<
        ExternalApiRequest,
        "id" | "service" | "method" | "path" | "time" | "request" | "response"
      >
    : V extends "_minimal"
    ? Pick<ExternalApiRequest, "id" | "service">
    : never;
