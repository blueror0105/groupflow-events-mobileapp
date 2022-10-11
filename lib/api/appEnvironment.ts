import { EnvironmentConfig } from "../../types/app-config";
import AppConfig from "../AppConfig";
import { getValue } from "../keyValueStorage";

export const EnvironmentConfigs: EnvironmentConfig[] = [
  {
    slug: "production",
    title: "Production",
    apiUrl: "https://api.mp1md.com/api",
  },
  {
    slug: "staging",
    title: "Staging",
    apiUrl: "https://api-staging.mp1md.com/api",
  },
  {
    slug: "development",
    title: "Development",
    apiUrl: AppConfig.developmentApiBaseUrl,
    webUrl: AppConfig.developmentWebBaseUrl,
  },
];

export async function getEnvironmentConfig(): Promise<EnvironmentConfig> {
  const raw = await getValue("environmentConfig");

  if (raw) {
    return JSON.parse(raw);
  } else {
    return getDefaultEnvironmentConfig();
  }
}

export function getDefaultEnvironmentConfig(): EnvironmentConfig {
  const defaultEnvironmentConfig = EnvironmentConfigs.find(
    (e) => e.slug === AppConfig.environment
  );
  if (!defaultEnvironmentConfig) {
    throw new Error("No default environment set");
  }
  return defaultEnvironmentConfig;
}
