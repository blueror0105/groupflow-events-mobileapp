import * as SecureStore from "expo-secure-store";
import { makeAutoObservable, runInAction } from "mobx";
import { getDefaultEnvironmentConfig } from "../lib/api/appEnvironment";
import AppConfig from "../lib/AppConfig";
import { getValue, storeValue } from "../lib/keyValueStorage";
import { EnvironmentConfig } from "../types/app-config";
import { AppContextData, AppContextSecrets } from "../types/app-context";
import { Org } from "../types/org";

export default class AppContextStore {
  contextData: AppContextData = {};

  secretsData: AppContextSecrets = {
    accessToken: null,
  };

  constructor() {
    makeAutoObservable(this);
    this.loadFromStore();
  }

  async clearAll() {
    runInAction(() => {
      const environmentConfig = this.contextData.environmentConfig;
      this.contextData = { environmentConfig };
      this.secretsData = { accessToken: null };
    });
    this.writeToSecretsStore();
    this.writeToStore();
  }

  async loadFromStore() {
    const json = await getValue("contextData");
    let contextData: AppContextData = (json && JSON.parse(json)) || {};
    const json2 = await SecureStore.getItemAsync("secretsData");
    let secretsData = (json2 && JSON.parse(json2)) || {};
    let needsWrite = true;

    if (!contextData.environmentConfig) {
      const environmentConfig = getDefaultEnvironmentConfig();
      contextData = { ...contextData, environmentConfig };
    } else if (contextData.environmentConfig.slug === "development") {
      const environmentConfig = {
        ...contextData.environmentConfig,
        apiUrl: AppConfig.developmentApiBaseUrl,
        webUrl: AppConfig.developmentWebBaseUrl,
      };
      contextData = { ...contextData, environmentConfig };
    } else {
      needsWrite = false;
    }

    runInAction(() => {
      this.contextData = contextData;
      this.secretsData = secretsData;
    });

    if (needsWrite) {
      this.writeToStore();
    }
  }

  async writeToStore() {
    const json = JSON.stringify(this.contextData);
    return storeValue("contextData", json);
  }

  async writeToSecretsStore() {
    const json = JSON.stringify(this.secretsData);
    return SecureStore.setItemAsync("secretsData", json);
  }

  async setEnvironmentConfig(environmentConfig: EnvironmentConfig) {
    runInAction(() => {
      this.contextData.environmentConfig = environmentConfig;
    });
    this.writeToStore();
  }

  async setAccessToken(accessToken: string | null) {
    runInAction(() => {
      this.secretsData.accessToken = accessToken;
    });
    this.writeToSecretsStore();
  }

  get accessToken() {
    return this.secretsData.accessToken;
  }

  get environmentConfig() {
    return this.contextData.environmentConfig || null;
  }

  get dateRequestedNotifs() { 
    return this.contextData.dateRequestedNotifs || null;
  }

  async setDateRequestedNotifs(value: string | null) {
    runInAction(() => {
      this.contextData.dateRequestedNotifs = value;
    });
    this.writeToStore();
  }

  get countRequestedNotifs() { 
    return this.contextData.countRequestedNotifs || 0;
  }

  async setCountRequestedNotifs(value: number) {
    runInAction(() => {
      this.contextData.countRequestedNotifs = value;
    });
    this.writeToStore();
  }

  get statusNotifs() { 
    return this.contextData.statusNotifs || '';
  }

  async setStatusNotifs(value: string) {
    runInAction(() => {
      this.contextData.statusNotifs = value;
    });
    this.writeToStore();
  }

  get orgs() {
    return this.contextData.orgs;
  }

  async setOrgs(orgs: Org[]) {
    runInAction(() => {
      this.contextData.orgs = orgs;
    });
    this.writeToStore();
  }

  async setOrgId(orgId: string | null) {
    runInAction(() => {
      this.contextData.orgId = orgId;
    });
    this.writeToStore();
  }

  get org() {
    const orgId = this.contextData.orgId;
    const orgs = this.contextData.orgs;
    if (orgs && orgId) {
      return orgs.find((o) => o.id === orgId);
    }
    return undefined;
  }
}
