import { ApiResult } from "../../types/api";
import { EnvironmentConfig } from "../../types/app-config";
import { Notification } from "../../types/notifications";
import { sendGqlRequest } from "./api-util";

export async function getNotificationSettings({
  authToken,
  environmentConfig,
  orgSlug,
}: {
  authToken: string;
  environmentConfig: EnvironmentConfig;
  orgSlug: string;
}): Promise<ApiResult<Notification[]>> {
  const query = `
    query GetNotificationSettings {
        notificationSettings {
          slug
          email
          text
          push
        }
      }
      `;

  let result = await sendGqlRequest({
    bearerToken: authToken,
    environmentConfig,
    opName: "GetNotificationSettings",
    orgSlug,
    query,
    wrapName: "notificationSettings",
  });

  return result;
}

export async function setNotificationSettings({
  authToken,
  environmentConfig,
  orgSlug,
  variables,
}: {
  authToken: string;
  environmentConfig: EnvironmentConfig;
  orgSlug: string | undefined;
  variables: { notificationSettings: { slug: string; push: boolean }[] };
}): Promise<ApiResult<Notification[]>> {
  const query = `
    mutation UpdateNotificationSettings($notificationSettings: [NotificationSettingParams]!) {
      updateNotificationSettings(notificationSettings: $notificationSettings) {
        slug
        email
        text
        push
      }
    }
      `;

  let result = await sendGqlRequest({
    bearerToken: authToken,
    environmentConfig,
    opName: "UpdateNotificationSettings",
    orgSlug,
    query,
    variables,
    wrapName: "updateNotificationSettings",
  });

  return result;
}
