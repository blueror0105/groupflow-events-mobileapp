import { ApiResult } from "../../types/api";
import { EnvironmentConfig } from "../../types/app-config";
import { Event } from "../../types/event";
import { sendGqlRequest } from "./api-util";
import { decodeDate } from "./date";

export async function getEvent({
  accessToken,
  environmentConfig,
  orgSlug,
  variables,
}: {
  accessToken: string;
  environmentConfig: EnvironmentConfig;
  orgSlug: string;
  variables: { id: string };
}): Promise<ApiResult<{ event: Event }>> {
  const query = `query GetEvent($id: ID!) {
      event(id: $id) {
        id
        startAt
        title
        description
        image {
          url
          thumbUrl
        }
      }
    }
    `;

  let result = await sendGqlRequest({
    bearerToken: accessToken,
    environmentConfig,
    opName: "GetEvent",
    orgSlug,
    query,
    variables,
    wrapName: "event",
  });

  return result;
}

export async function listEvents({
  authToken,
  environmentConfig,
  orgSlug,
  variables,
}: {
  authToken: string;
  environmentConfig: EnvironmentConfig;
  orgSlug: string;
  variables: { input: { past: boolean }};
}): Promise<ApiResult<{ entries: Event[] }>> {
  const query = `query ListEvents($input: EventsInput) {
      events(input: $input) {
        entries {
          id
          startAt
          title
          description
          image {
              url
              thumbUrl
          }
        }
      }
    }
    `;

  let result = await sendGqlRequest({
    bearerToken: authToken,
    environmentConfig,
    opName: "ListEvents",
    orgSlug,
    query,
    variables,
    wrapName: "events",
  });

  if (!result.error) {
    const entries = result.data.entries.map((event: any) => {
      const startAt = decodeDate(event.startAt);
      return { ...event, startAt };
    });
    const data = { ...result.data, entries };
    result = { ...result, data };
  }

  return result;
}
