import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import * as Linking from "expo-linking";
import { Entypo } from "@expo/vector-icons";
import { observer } from "mobx-react";

import { Text, View } from "../components/Themed";
import Styles from "../styles";
import { Event } from "../types/event";
import { Org } from "../types/org";
import ClearButton from "../components/ClearButton";
import { listEvents } from "../lib/api/events";
import { webBaseUrl } from "../lib/web";
import EventsListSummary from "../components/EventsListSummary";
import {
  useAccessToken,
  useCurrentOrg,
  useEnvironmentConfig,
} from "../lib/appContext";
import { EnvironmentConfig } from "../types/app-config";

function GroupHomeScreen(props: { route: any; navigation: any }) {
  const { navigation } = props;
  const colorScheme = useColorScheme();
  const org = useCurrentOrg();
  const [events, setEvents] = useState<Event[] | undefined>();
  const environmentConfig = useEnvironmentConfig();
  const baseUrl =
    org && environmentConfig && webBaseUrl(org, environmentConfig);
  const authToken = useAccessToken();

  const loadEvents = async (org: Org) => {
    if (!authToken || !environmentConfig) return;
    const result = await listEvents({
      environmentConfig,
      orgSlug: org.slug,
      authToken,
      variables: { input: { past: false } },
    });
    if (result.error) {
      Alert.alert("Error", "Failed to get this group's events");
      console.warn("Failed to fetch events");
    } else {
      setEvents(result.data.entries);
    }
  };

  useEffect(() => {
    if (authToken && org) {
      navigation?.setOptions({
        title: org.name,
      });
      loadEvents(org);
    }
  }, [authToken, org]);

  const logos = org?.logos;
  const logoUrl = logos?.mobileLandscape || logos?.landscape;

  if (!org || !authToken || !baseUrl) {
    return null;
  }

  const handleMoreEvents = () => { 
    navigation.navigate(
      "GroupEvents" as never,
      { ...props.route?.params } as never
    );
  }

  return (
    <ScrollView
      style={{
        backgroundColor: colorScheme === "dark" ? "#18302B" : "#F5F8FF",
      }}
    >
      <TouchableOpacity
        onPress={() =>
          Linking.openURL(`${baseUrl}/?org=${org.slug}&jwt=${authToken || ""}`)
        }
      >
        <View style={{ alignItems: "center" }}>
          {logoUrl && (
            <Image
              style={{
                height: Dimensions.get("window").width / (16 / 9),
                width: "100%",
              }}
              resizeMode="cover"
              source={{ uri: logoUrl }}
            />
          )}
        </View>
      </TouchableOpacity>
      <View style={{ padding: 20, backgroundColor: "transparent" }}>
        {events && (
          <>
            <EventsListSummary events={events} org={org} onPress={handleMoreEvents} limit={3} />
            <View style={{ width: 0, height: 20 }}></View>
          </>
        )}
        <MembersSection
          environmentConfig={environmentConfig}
          org={org}
          authToken={authToken}
          navigation={navigation}
        />
      </View>
    </ScrollView>
  );
}

export default observer(GroupHomeScreen);

function MembersSection(props: {
  environmentConfig: EnvironmentConfig;
  org: Org;
  authToken: string;
  navigation: any;
}) {
  const colorScheme = useColorScheme();
  const { authToken, environmentConfig, org, navigation } = props;
  const baseUrl = environmentConfig && webBaseUrl(org, environmentConfig);
  const iconColor = colorScheme === "dark" ? "#00B48D" : "#292D32";
  return (
    <View style={{ paddingHorizontal: 15 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <Entypo
          name="users"
          style={{ marginRight: 10 }}
          size={24}
          color={iconColor}
        />
        <Text style={{ ...Styles.title, marginTop: 0, marginBottom: 0 }}>
          Members
        </Text>
      </View>
      <ClearButton
        text="Members List"
        onPress={() => Linking.openURL(`${baseUrl}/members?jwt=${authToken}`)}
        rightIcon={true}
        noBorder={false}
      />
      <ClearButton
        text="Messages"
        onPress={() =>
          Linking.openURL(`${baseUrl}/members/messages?jwt=${authToken}`)
        }
        rightIcon={true}
        noBorder={false}
      />
      <ClearButton
        text="Membership Dues"
        onPress={() =>
          Linking.openURL(`${baseUrl}/members/dues?jwt=${authToken}`)
        }
        rightIcon={true}
        noBorder={false}
      />
      <ClearButton
        text="Notification Settings"
        onPress={() => navigation.navigate("NotificationSettings")}
        rightIcon={true}
        noBorder={true}
      />
    </View>
  );
}
