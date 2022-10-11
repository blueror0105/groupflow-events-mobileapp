import Constants from "expo-constants";

import { ApiResult } from "../../types/api";
import { EnvironmentConfig } from "../../types/app-config";
import { AuthenticateContactVariables } from "../../types/device";
import { sendGqlRequest } from "./api-util";

export function startContactVerification({
  environmentConfig,
  data,
}: {
  environmentConfig: EnvironmentConfig;
  data: {
    email: string;
  };
}): Promise<ApiResult<any>> {
  const variables = {
    ...data,
    app: Constants.appOwnership === "expo" ? "expo" : "groupflow",
    appOwnership: Constants.appOwnership,
    linkingUri: Constants.linkingUri,
  };
  const query =
    "mutation StartContactVerification($email: String!, $app: String, $appOwnership: String, $linkingUri: String) {\n" +
    "  startContactVerification(email: $email, app: $app, appOwnership: $appOwnership, linkingUri: $linkingUri) {\n" +
    "    authToken\n" +
    "  }\n" +
    "}";

  return sendGqlRequest({
    environmentConfig,
    opName: "StartContactVerification",
    query,
    variables,
    wrapName: "startContactVerification",
  });
}

export function authenticateLinkedAccount({
  environmentConfig,
  variables,
}: {
  environmentConfig: EnvironmentConfig;
  variables: AuthenticateContactVariables;
}): Promise<ApiResult<{ accessToken: string }>> {
  const query =
    "mutation AuthenticateLinkedAccount($token: String!) {\n" +
    "  authenticateLinkedAccount(token: $token) {\n" +
    "    accessToken\n" +
    "  }\n" +
    "}";

  return sendGqlRequest({
    environmentConfig,
    opName: "AuthenticateLinkedAccount",
    variables,
    query,
    wrapName: "authenticateLinkedAccount",
  });
}
