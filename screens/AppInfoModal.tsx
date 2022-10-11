import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import * as Linking from "expo-linking";

import { Text, View } from "../components/Themed";
import AppConfig from "../lib/AppConfig";
import { useAppContext } from "../lib/appContext";
import { useLogout } from "../lib/auth";
import Styles from "../styles";
import EnvironmentSelector from "../components/EnvironmentSelector";
import useColorScheme from "../hooks/useColorScheme";

export default function AppInfoModalScreen() {
  const environment = AppConfig.environment;
  const logout = useLogout();
  const navigator = useNavigation();
  const { handleConnectToken } = useAppContext();
  const [connectToken, setConnectToken] = useState<string>("");
  const colorScheme = useColorScheme();

  function handleLogoutPress() {
    logout();
    navigator.goBack();
    navigator.navigate("PromptEmail" as never, {} as never);
  }

  function handleAuthorize() {
    if (connectToken) {
      if (!handleConnectToken) {
        throw new Error("handleConnectToken is not set");
      }
      handleConnectToken(connectToken);
      navigator.reset({ index: 0, routes: [{ name: "Groups" as never }] });
    }
  }

  const textInputStyle = {
    borderRadius: 8,
    borderWidth: 1,
    height: 50,
    marginBottom: 5,
    paddingHorizontal: 5,
    paddingLeft: 10,
    paddingVertical: 2,
    borderColor: "#aaa",
  };

  const transparent = "rgba(255, 255, 255, 0)";

  return (
    <ScrollView
      style={{
        backgroundColor: colorScheme === "dark" ? "#18302B" : "#FFFFFF",
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: transparent,
        }}
      >
        <View style={{ marginTop: 20, backgroundColor: transparent }}>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.groupflow.app/")}
          >
            <Text
              style={{
                ...Styles.text,
                textAlign: "center",
                color: "#6af",
                textDecorationLine: "underline",
              }}
            >
              GroupFlow
            </Text>
          </TouchableOpacity>
          <Text style={{ ...Styles.text, textAlign: "center" }}>
            Version {Constants.manifest?.version}
          </Text>
        </View>

        <View
          style={Styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <TouchableOpacity
          onPress={handleLogoutPress}
          style={{ ...Styles.button, backgroundColor: "#E64508" }}
        >
          <View style={{ backgroundColor: "transparent" }}>
            <Text style={Styles.buttonText}>Logout</Text>
          </View>
        </TouchableOpacity>

        {environment !== "production" ? (
          <>
            <View
              style={Styles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />
            <View style={{ width: "100%", backgroundColor: transparent }}>
              <View style={{ backgroundColor: transparent }}>
                <Text style={Styles.title}>Connect Token</Text>
                <TextInput
                  style={{
                    ...textInputStyle,
                    color: colorScheme === "dark" ? "#fff" : undefined,
                    backgroundColor:
                      colorScheme === "dark" ? "#444" : undefined,
                  }}
                  value={connectToken}
                  onChangeText={setConnectToken}
                />
                <View style={{ backgroundColor: transparent, height: 15 }} />
                <TouchableOpacity
                  onPress={handleAuthorize}
                  style={Styles.button}
                >
                  <Text style={Styles.buttonText}>Authorize</Text>
                </TouchableOpacity>
              </View>
              <View
                style={Styles.separator}
                lightColor="#eee"
                darkColor="rgba(255,255,255,0.1)"
              />
              <EnvironmentSelector />
            </View>
            <View
              style={Styles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />
          </>
        ) : null}
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}
