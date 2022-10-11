import React, { ReactNode } from "react";
import { TouchableOpacity } from "react-native";

import Styles from "../styles";
import { Text, View } from "./Themed";
import { AntDesign } from "@expo/vector-icons";
import { EnvironmentSlug } from "../types/app-config";
import { EnvironmentConfigs } from "../lib/api/appEnvironment";
import { useAppContextStore, useEnvironmentConfig } from "../lib/appContext";
import { observer } from "mobx-react";
import AppConfig from "../lib/AppConfig";

const transparent = "rgba(255, 255, 255, 0)";

function EnvironmentSelector() {
  const environmentConfig = useEnvironmentConfig();
  const appContextStore = useAppContextStore();

  function handleOnEnvironmentPressed(environment: EnvironmentSlug) {
    let config = EnvironmentConfigs.find((e) => e.slug === environment);
    if (!config || !appContextStore) return;
    if (environment === "development") {
      config = {
        ...config,
        apiUrl: AppConfig.developmentApiBaseUrl,
        webUrl: AppConfig.developmentWebBaseUrl,
      };
    }
    appContextStore.setEnvironmentConfig(config);
  }

  if (!environmentConfig) {
    return null;
  }

  return (
    <View style={{ backgroundColor: transparent }}>
      <Text style={Styles.title}>Environment</Text>

      <View style={{ backgroundColor: transparent, marginBottom: 20 }}>
        {EnvironmentConfigs.map((conf) => (
          <React.Fragment key={conf.slug}>
            <TouchableOpacity
              key={conf.slug}
              onPress={() => handleOnEnvironmentPressed(conf.slug)}
              style={{
                backgroundColor: transparent,
                marginBottom: 1,
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: transparent,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>{conf.title}</Text>
                {conf.slug === environmentConfig.slug ? (
                  <AntDesign name="check" size={20} color="#00C298" />
                ) : null}
              </View>
            </TouchableOpacity>
            <View
              style={{ height: 1 }}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />
          </React.Fragment>
        ))}
      </View>

      <Spacer />

      <View style={{ backgroundColor: transparent }}>
        <Label>Backend URL</Label>
        <Text>{environmentConfig.apiUrl}</Text>
      </View>

      <Spacer />

      <View style={{ backgroundColor: transparent }}>
        <Label>Website URL</Label>
        <Text>{environmentConfig.webUrl || "from Group config"}</Text>
      </View>
    </View>
  );
}

export default observer(EnvironmentSelector);

function Label({ children }: { children: ReactNode }) {
  return <Text style={{ fontWeight: "bold" }}>{children}</Text>;
}

function Spacer() {
  return <View style={{ height: 20, backgroundColor: transparent }} />;
}
