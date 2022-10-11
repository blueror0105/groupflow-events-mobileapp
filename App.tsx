import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as Sentry from "sentry-expo";

import useAppState from "./hooks/useAppState";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { AppContext } from "./components/AppContext";
import { useInitializeAppContext } from "./lib/appContext";
import AppConfig from "./lib/AppConfig";
import AppVersionModal from "./screens/AppVersionModal";
import { Image } from "react-native";

export default function App() {
  const { isLoadingComplete } = useAppState();
  const { environment } = AppConfig;

  Sentry.init({
    dsn: "https://2bac9daed5294fa79a30887aa979bc22@o1305402.ingest.sentry.io/6604409",
    enableInExpoDevelopment: true,
    debug: environment !== "production",
    environment: environment,
  });

  const colorScheme = useColorScheme();
  let appContext = useInitializeAppContext();

  // Splash screen will display while loading version
  const LoadingComponent = (
    <Image
      source={require("./assets/images/splash.png")}
      style={{ width: "100%", height: "100%" }}
    />
  );

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <AppContext.Provider value={appContext}>
        <SafeAreaProvider>
          <AppVersionModal loadingComponent={LoadingComponent}>
            <Navigation colorScheme={colorScheme} />
          </AppVersionModal>
          <StatusBar />
        </SafeAreaProvider>
      </AppContext.Provider>
    );
  }
}
