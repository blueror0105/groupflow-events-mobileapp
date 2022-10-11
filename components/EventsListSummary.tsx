import * as Linking from "expo-linking";

import { useAccessToken, useEnvironmentConfig } from "../lib/appContext";
import { webBaseUrl } from "../lib/web";
import Styles from "../styles";
import { Org } from "../types/org";
import { Event } from "../types/event";
import { EventListItem } from "./EventListItem";
import Link from "./Link";
import { Text, View } from "./Themed";
import { useColorScheme } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { observer } from "mobx-react";

interface Props {
  events: Event[];
  org: Org;
  onPress?: () => void;
  onPressLbl?: string;
  limit?: number;
}

function EventsListSummary(props: Props) {
  const colorScheme = useColorScheme();
  const { events, org, limit = 0, onPressLbl = "See all events" } = props;
  const environmentConfig = useEnvironmentConfig();
  const baseUrl = environmentConfig && webBaseUrl(org, environmentConfig);
  const authToken = useAccessToken();
  const filteredEvents = limit > 0 ? events.slice(0, limit) : events;

  function onMoreEvents() {
    const { onPress } = props;

    if(onPress) {
      onPress();
    }
    else {
      if (!baseUrl) return;
      Linking.openURL(`${baseUrl}/events?org=${org.slug}&jwt=${authToken || ""}`);
    }
  }
  const iconColor = colorScheme === "dark" ? "#00B48D" : "#292D32";
  return (
    <View style={{ paddingHorizontal: 15, paddingBottom: 15 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <FontAwesome
          name="calendar"
          style={{ marginRight: 10 }}
          size={24}
          color={iconColor}
        />
        <Text style={{ ...Styles.title, marginTop: 0, marginBottom: 0 }}>Events</Text>
      </View>
      {filteredEvents.map((item) => (
        <EventListItem key={item.id} event={item} />
      ))}
      <Link alignCenter={true} onPress={onMoreEvents}>{onPressLbl}</Link>
    </View>
  );
}

export default observer(EventsListSummary);
