import { EnvironmentConfig } from "../types/app-config";
import { Org } from "../types/org";
import AppConfig from "./AppConfig";

export function webBaseUrl(org: Org, environmentConfig: EnvironmentConfig) {
  return environmentConfig.slug === "development"
    ? AppConfig.developmentWebBaseUrl
    : org.websiteUrl;
}
