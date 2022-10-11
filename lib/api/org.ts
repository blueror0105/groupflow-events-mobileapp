import { ApiResult } from "../../types/api";
import { EnvironmentConfig } from "../../types/app-config";
import { Org } from "../../types/org";
import { sendGqlRequest } from "./api-util";

export function listOrgs({
  accessToken,
  environmentConfig,
}: {
  accessToken: string;
  environmentConfig: EnvironmentConfig;
}): Promise<ApiResult<Org[]>> {
  const query =
    "query ListOrgs {\n" +
    "  orgs {\n" +
    "    abbreviation\n" +
    "    duesAmount\n" +
    "    id\n" +
    "    logos {\n" +
    "      landscape\n" +
    "      mobileLandscape\n" +
    "      favicon\n" +
    "      square\n" +
    "    }\n" +
    "    mailingAddress\n" +
    "    meetup {\n" +
    "      groupId\n" +
    "      groupSlug\n" +
    "      syncEnabled\n" +
    "      authEnabled\n" +
    "    }\n" +
    "    name\n" +
    "    slug\n" +
    "    timezone\n" +
    "    websiteUrl\n" +
    "  }\n" +
    "}\n";

  return sendGqlRequest({
    environmentConfig,
    opName: "ListOrgs",
    query,
    wrapName: "orgs",
    bearerToken: accessToken,
  });
}
