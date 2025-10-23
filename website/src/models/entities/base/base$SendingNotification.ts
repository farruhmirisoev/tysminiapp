import { AbstractParentEntity } from "./AbstractParentEntity";
import { NotificationTemplate } from "./base$NotificationTemplate";
import { NotificationRecipient } from "./base$NotificationRecipient";
import { UserExt } from "./base$UserExt";
import { SendingSms } from "./base$SendingSms";
import { SendingTelegram } from "./base$SendingTelegram";
import { SendingMessage } from "./sys$SendingMessage";
export class SendingNotification extends AbstractParentEntity {
  static NAME = "base$SendingNotification";
  template?: NotificationTemplate | null;
  recipient?: NotificationRecipient | null;
  user?: UserExt | null;
  sendingSms?: SendingSms | null;
  sendingTelegram?: SendingTelegram | null;
  sendingMessage?: SendingMessage | null;
  read?: boolean | null;
  sendDate?: any | null;
}
export type SendingNotificationViewName =
  | "_base"
  | "_local"
  | "_minimal"
  | "sendingNotification.check.def"
  | "sendingNotification.view";
export type SendingNotificationView<V extends SendingNotificationViewName> =
  V extends "_base"
    ? Pick<
        SendingNotification,
        "id" | "read" | "sendDate" | "legacyId" | "fundId"
      >
    : V extends "_local"
    ? Pick<
        SendingNotification,
        "id" | "read" | "sendDate" | "legacyId" | "fundId"
      >
    : V extends "_minimal"
    ? Pick<SendingNotification, "id">
    : V extends "sendingNotification.check.def"
    ? Pick<
        SendingNotification,
        | "id"
        | "read"
        | "sendDate"
        | "legacyId"
        | "fundId"
        | "sendingSms"
        | "sendingMessage"
        | "createTs"
      >
    : V extends "sendingNotification.view"
    ? Pick<
        SendingNotification,
        | "id"
        | "read"
        | "sendDate"
        | "legacyId"
        | "fundId"
        | "template"
        | "recipient"
        | "user"
        | "sendingSms"
        | "sendingMessage"
        | "createTs"
      >
    : never;
