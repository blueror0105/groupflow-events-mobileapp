import { EnvironmentConfig } from "../../types/app-config";

interface Request {
  bearerToken?: string;
  environmentConfig: EnvironmentConfig;
  path: string;
  method?: string;
  data?: { [index: string]: any };
  headers?: { [index: string]: string };
  orgSlug?: string;
}

const logRequests = false;

export async function sendApiRequest(request: Request) {
  let { environmentConfig, method, path, headers } = request;
  try {
    method = method || "GET";
    const reqBody = request.data ? JSON.stringify(request.data) : "";
    if (!environmentConfig) {
      console.error("Empty environmentConfig for request:", request);
      throw new Error("Empty environmentConfig for request");
    }
    let baseUrl = environmentConfig.apiUrl;

    const url = `${baseUrl}/${path.replace(/^\//, "")}`;
    const orgHeader: { [index: string]: string } = request.orgSlug
      ? { "mp-org": request.orgSlug }
      : {};

    headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...orgHeader,
      ...headers,
    };
    if (request.bearerToken) {
      headers = { ...headers, Authorization: `Bearer ${request.bearerToken}` };
    }

    if (logRequests) {
      const debugInfo = {
        url,
        method,
        headers,
        body: reqBody,
      };

      console.log("Request", debugInfo);
    }

    const resp = await fetch(url, {
      method,
      headers,
      body: reqBody,
    });
    const contentTypeHeader = resp.headers.get("content-type");
    const [contentType] = (contentTypeHeader || "").split(";");
    const [_, type] = contentType.split("/");
    if (type === "json") {
      if (resp.status >= 300) {
        console.warn("Unsuccessful HTTP status for response", resp);
      }
      const respBody = await resp.json();
      if (logRequests) {
        console.debug("Request", { url, method, reqBody, respBody });
      }
      if (respBody.errors) {
        return { error: true, ...respBody };
      } else {
        return { error: false, ...respBody };
      }
    } else {
      console.debug("Request", { url, method, reqBody });
      console.warn("Unrecognized content-type header", contentTypeHeader);
      return { error: true, errorType: "unexpectedContentType" };
    }
  } catch (error) {
    console.warn("Network error", error);
    return { error: true, errorType: "transport" };
  }
}

export async function sendGqlRequest({
  bearerToken,
  environmentConfig,
  opName,
  orgSlug,
  query,
  variables,
  wrapName,
}: {
  bearerToken?: string;
  environmentConfig: EnvironmentConfig;
  opName: string;
  orgSlug?: string;
  query: string;
  variables?: any;
  wrapName?: string;
}) {
  const body = { query, variables };
  let uriQuery = `op=${opName}`;
  if (orgSlug) {
    uriQuery = `${uriQuery}&org=${orgSlug}`;
  }

  const request = {
    bearerToken,
    environmentConfig,
    method: "POST",
    data: body,
    path: `/gql?${uriQuery}`,
  };

  const resp = await sendApiRequest(request);
  if (resp.error) {
    return resp;
  } else if (wrapName) {
    const data = resp.data[wrapName];
    return { error: false, data };
  } else {
    return { error: false, ...resp };
  }
}
