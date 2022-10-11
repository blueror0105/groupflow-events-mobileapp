import { EnvironmentConfig } from "./app-config";
import { Org } from "./org";

export interface AppContextData {
  environmentConfig?: EnvironmentConfig;
  orgId?: string | null;
  orgs?: Org[];
  dateRequestedNotifs?: string | null
  countRequestedNotifs?: number, 
  statusNotifs?: string | null,
}

export interface AppContextSecrets {
  accessToken: string | null;
}
