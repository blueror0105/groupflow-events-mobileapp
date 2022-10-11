import compareVersions from "compare-versions";
import React, { useCallback, useState, useEffect } from "react";
import {
  Linking,
  Platform,
  Text,
  View,
  ImageBackground,
  Image,
  StyleSheet,
} from "react-native";
import * as Application from "expo-application";
import Constants from "expo-constants";
import { useAppContext, useEnvironmentConfig } from "../lib/appContext";
import Link from "../components/Link";
import { observer } from "mobx-react";

function AppVersionModal(props: any) {
  const { handleGetMinimalAvailableVersion, loading } = useAppContext();
  const environmentConfig = useEnvironmentConfig();

  const [minimumAvailableVersion, setMinimumAvailableVersion] =
    useState<string>("0.0.0");
  const [recalledVersions, setRecalledVersions] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      if (environmentConfig) {
        const version = await handleGetMinimalAvailableVersion?.(
          environmentConfig
        );
        if (version?.minimumVersion) {
          setMinimumAvailableVersion(version.minimumVersion);
        }
        if (version?.recalledVersions) {
          setRecalledVersions(version?.recalledVersions);
        }
      }
    };
    init();
  }, [props.children, environmentConfig]);

  const onPress = useCallback(() => {
    const url =
      Platform.OS === "android"
        ? "https://play.google.com/store/apps/details?id=app.groupflow"
        : "https://apps.apple.com/us/app/groupflow-community/id1634247691";
    Linking.canOpenURL(url)
      .then(() => Linking.openURL(url))
      .catch();
  }, []);

  // Avoid if using Expo app, Application.nativeApplicationVersion will grab the expo version
  if (
    Constants.appOwnership !== "expo" &&
    Application.nativeApplicationVersion &&
    (recalledVersions.includes(Application.nativeApplicationVersion) ||
      compareVersions.compare(
        Application.nativeApplicationVersion,
        minimumAvailableVersion,
        "<"
      ))
  ) {
    return (
      <ImageBackground
        source={require("../assets/images/email_prompt_bg.jpg")}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <View style={styles.tint}>
          <View style={styles.container}>
            <Image
              source={require("../assets/images/group_logo.png")}
              resizeMode="contain"
              style={styles.img}
            />
            <Text style={styles.header}>Your version is outdated!</Text>
            <Text style={styles.txt}>
              You must upgrade to continue using the app
            </Text>
            <Link textStyle={{ flex: 0 }} alignCenter={true} onPress={onPress}>
              Redirect to store
            </Link>
          </View>
        </View>
      </ImageBackground>
    );
  } else if (loading) {
    return props.loadingComponent;
  } else {
    return props.children;
  }
}

export default observer(AppVersionModal);

const styles = StyleSheet.create({
  tint: {
    backgroundColor: "rgba(0,0,0,.6)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "black",
    width: "70%",
    height: "50%",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
  },
  img: {
    width: 168,
    alignSelf: "center",
  },
  header: {
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  txt: {
    color: "white",
    textAlign: "center",
  },
});
