import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
} from "react-native";
import * as Linking from "expo-linking";
import { marked } from "marked";
import RenderHtml from "react-native-render-html";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";

import { Text, View } from "../components/Themed";
import Styles from "../styles";
import { webBaseUrl } from "../lib/web";
import {
  useAccessToken,
  useCurrentOrg,
  useEnvironmentConfig,
} from "../lib/appContext";
import { observer } from "mobx-react";

function EventHomeScreen(props: { route: any; navigation: any }) {
  const { route } = props;
  const { event } = route.params;
  const colorScheme = useColorScheme();
  const org = useCurrentOrg();
  const environmentConfig = useEnvironmentConfig();
  const baseUrl =
    org && environmentConfig && webBaseUrl(org, environmentConfig);
  const authToken = useAccessToken();

  if (!org || !event || !authToken || !baseUrl) {
    return null;
  }

  const parsedEvent = JSON.parse(event);

  const descriptionHTML =
    parsedEvent?.description && marked.parse(parsedEvent.description);

  return (
    <ScrollView
      style={{
        backgroundColor: colorScheme === "dark" ? "#18302B" : "#F5F8FF",
      }}
    >
      <View
        style={{
          ...styles.container,
          backgroundColor: colorScheme === "dark" ? "#18302B" : "#F5F8FF",
        }}
      >
        <Text style={{ ...Styles.title, textAlign: "center" }}>
          {parsedEvent.title}
        </Text>
        <Text>
          {format(new Date(parsedEvent.startAt), "EEEE, MMMM do    p")}{" "}
          <Text style={{ fontSize: 12, color: "#8795a1" }}>
            {format(new Date(parsedEvent.startAt), "OOO")}
          </Text>
        </Text>
        {parsedEvent?.image?.url ? (
          <TouchableOpacity
            style={{
              height: Dimensions.get("window").width / (16 / 9),
              width: "100%",
              marginVertical: 20,
            }}
            onPress={() => {
              Linking.openURL(
                `${baseUrl}/events/${parsedEvent.id}?jwt=${authToken || ""}`
              );
            }}
          >
            <Image
              style={{
                height: "100%",
                width: "100%",
              }}
              resizeMode="cover"
              source={{ uri: parsedEvent.image.url }}
            />
          </TouchableOpacity>
        ) : null}
        {descriptionHTML ? (
          <TouchableOpacity
            style={styles.detailsContainer}
            onPress={() => {
              Linking.openURL(
                `${baseUrl}/events/${parsedEvent.id}?jwt=${authToken || ""}`
              );
            }}
          >
            <Text style={styles.detailsTitle}>Details</Text>
            <RenderHtml
              contentWidth={Dimensions.get("window").width}
              source={{ html: descriptionHTML }}
              baseStyle={{
                color: colorScheme === "dark" ? "white" : "black",
              }}
            />
            <LinearGradient
              colors={[
                colorScheme === "dark"
                  ? "rgba(24, 48, 43, 0)"
                  : "rgba(245, 248, 255, 0)",
                colorScheme === "dark" ? "#18302B" : "#F5F8FF",
              ]}
              locations={[0.7, 1]}
              style={{
                position: "absolute",
                height: 180,
                width: Dimensions.get("window").width,
              }}
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={Styles.button}
          onPress={() =>
            Linking.openURL(
              `${baseUrl}/events/${parsedEvent.id}?jwt=${authToken || ""}`
            )
          }
        >
          <Text style={Styles.buttonText}>Details and RVSP</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default observer(EventHomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    marginTop: 20,
  },
  detailsContainer: {
    backgroundColor: "transparent",
    minHeight: 100,
    maxHeight: 180,
    marginBottom: 30,
    alignItems: "center",
    overflow: "hidden",
    marginTop: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
});
