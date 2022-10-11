import { MobileVersions } from "../hooks/useGetMinimumAvailableVersion";
import AppContextStore from "../stores/AppContextStore";
import { EnvironmentConfig } from "./app-config";

export type TokenResult = TokenSuccessResult | TokenErrorResult;

export interface TokenSuccessResult {
  error: false;
  token: string;
  accountId: string;
}

export interface TokenErrorResult {
  error: true;
}

export interface EmailPromptFormType {
  email: string;
}

export interface AppContextType {
  appContextStore: AppContextStore;
  handleConnectToken: (v: string) => Promise<false | { accessToken: string }>;
  initializeFromAccessToken: (
    t: string,
    opts?: { isDemo: boolean }
  ) => Promise<void>;
  handleGetMinimalAvailableVersion: (
    environmentConfig: EnvironmentConfig
  ) => Promise<MobileVersions>;
  loading: boolean;
}
