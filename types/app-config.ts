export type EnvironmentSlug = "production" | "staging" | "development";

export interface AppConfigType {
  developmentApiBaseUrl: string;
  developmentWebBaseUrl: string;
  environment: EnvironmentSlug;
}

export interface EnvironmentConfig {
  slug: EnvironmentSlug;
  title: string;
  apiUrl: string;
  webUrl?: string;
}
