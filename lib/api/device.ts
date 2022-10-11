import { MobileVersions } from "../../hooks/useGetMinimumAvailableVersion";
import { ApiResult } from "../../types/api";
import { EnvironmentConfig } from "../../types/app-config";
import { sendGqlRequest } from "./api-util";

export function savePushToken({
  bearerToken,
  environmentConfig,
  variables,
}: {
  bearerToken: string;
  environmentConfig: EnvironmentConfig;
  variables: { token: string };
}): Promise<ApiResult<any>> {
  const query =
    "mutation SavePushToken($token: String!) {\n" +
    "  savePushToken(token: $token) {\n" +
    "    id token\n" +
    "  }\n" +
    "}";

  return sendGqlRequest({
    bearerToken,
    environmentConfig,
    opName: "SavePushToken",
    query,
    variables,
    wrapName: "savePushToken",
  });
}

export async function getMobileVersions({
  environmentConfig,
}: {
  environmentConfig: EnvironmentConfig;
}): Promise<MobileVersions> {
  const query = `
    query GetMobileVersions {
      mobileVersions {
        minimumVersion
        recalledVersions
        version
      }
    }
  `;

  const result = await sendGqlRequest({
    environmentConfig,
    opName: "GetMobileVersions",
    query,
    wrapName: "mobileVersions",
  });

  return result.data;
}
