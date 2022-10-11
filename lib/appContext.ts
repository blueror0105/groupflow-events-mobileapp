import { useContext, useRef } from "react";
import { AppContext } from "../components/AppContext";
import { useEffect } from "react";
import { URLListener } from "expo-linking";
import * as Linking from "expo-linking";
import Constants from "expo-constants";

import { AppContextType } from "../types/auth";
import { authenticateLinkedAccount } from "./api/account";
import { EnvironmentConfig } from "../types/app-config";
import { useGetMinimalAvailableVersion } from "../hooks/useGetMinimumAvailableVersion";
import AppContextStore from "../stores/AppContextStore";
import { Alert } from "react-native";

export function useInitializeAppContext(): AppContextType {
  const appContextStoreRef = useRef(new AppContextStore());

  const { handleGetMinimalAvailableVersion, loading } =
    useGetMinimalAvailableVersion();

  // Deep link listener
  const handleUrl: URLListener = async ({ url }) => {
    const { hostname, path, queryParams } = Linking.parse(url);
    const routePath = Constants.appOwnership === "expo" ? path : hostname;

    if (routePath === "connect-groups") {
      const { token } = queryParams;
      if (token) {
        const result = await handleConnectToken(token);
        if (!result) return;
      } else {
        setTimeout(() => {
          Alert.alert("Error", "Invalid link from email. Please try again.");
        }, 100);
        console.warn("Invalid url", url);
      }
    } else {
      console.log("Other URL", url);
    }
  };

  const handleConnectToken = async (token: string) => {
    const result = await callAuthenticate({ token });

    if (result) {
      initializeFromAccessToken(result.accessToken);
    } else {
      Alert.alert("Error", "There was a problem verifying your email address.");
    }

    return result;
  };

  const initializeFromAccessToken = async (accessToken: string) => {
    await appContextStoreRef.current.setAccessToken(accessToken);
    const envConfig = appContextStoreRef.current.environmentConfig;
    if (!envConfig) {
      throw new Error("envConfig needs to be set here (1)");
    }
    return;
  };

  // Authenticate from a deep link token
  const callAuthenticate = async (data: { token: string }) => {
    const envConfig = appContextStoreRef.current.environmentConfig;
    if (!envConfig) {
      throw new Error("envConfig needs to be set here (2)");
    }

    const resp = await authenticateLinkedAccount({
      environmentConfig: envConfig,
      variables: data,
    });

    if (resp.error) {
      console.warn("API error", resp);
      Alert.alert(
        "Error",
        "Failed to authenticate via email link. Please try again."
      );
      return false;
    } else {
      // Returns { accessToken }
      return resp.data;
    }
  };

  const loadTokenIfSaved = async () => {
    const accessToken = appContextStoreRef.current.accessToken;

    if (accessToken) {
      const envConfig = appContextStoreRef.current.environmentConfig;
      if (!envConfig) {
        throw new Error("envConfig needs to be set here (4)");
      }
    }
  };

  // Set up URL Listener
  useEffect(() => {
    Linking.addEventListener("url", handleUrl);

    return () => {
      Linking.removeEventListener("url", handleUrl);
    };
  });

  useEffect(() => {
    loadTokenIfSaved();
  }, []);

  return {
    appContextStore: appContextStoreRef.current,
    handleConnectToken,
    initializeFromAccessToken,
    handleGetMinimalAvailableVersion,
    loading,
  };
}

export function useAppContext(): Partial<AppContextType> {
  return useContext(AppContext);
}

export function useAppContextStore() {
  const appContext = useAppContext();
  if (!appContext.appContextStore) {
    return null;
  }
  return appContext.appContextStore;
}

export function useAccessToken(): string | null {
  const store = useAppContextStore();
  return store?.accessToken || null;
}

export function useEnvironmentConfig(): EnvironmentConfig | null {
  const appContextStore = useAppContextStore();
  if (!appContextStore) {
    return null;
  }
  return appContextStore.environmentConfig;
}

export function useCurrentOrg() {
  const store = useAppContextStore();
  return store?.org;
}
