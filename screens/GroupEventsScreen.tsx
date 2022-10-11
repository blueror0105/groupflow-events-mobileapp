import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Text,
  ViewStyle,
  TextStyle,
} from "react-native";
import { observer } from "mobx-react";

import { View } from "../components/Themed";
import { Event } from "../types/event";
import { Org } from "../types/org";
import { listEvents } from "../lib/api/events";
import { webBaseUrl } from "../lib/web";
import EventsListSummary from "../components/EventsListSummary";
import {
  useAccessToken,
  useCurrentOrg,
  useEnvironmentConfig,
} from "../lib/appContext";
import Styles from "../styles";

function FilterButton(props: { 
 style: ViewStyle | ViewStyle[];
 onPress: () => void;
 lblText: string;
 lblStyle?: TextStyle,
}) {

  const { style, onPress, lblText, lblStyle } = props;

  return (
    <TouchableOpacity style={[Styles.button, style]} onPress={onPress}>
      <Text style={[Styles.buttonText, lblStyle]}>{lblText}</Text>
    </TouchableOpacity>
  );
}

function GroupEventsScreen() {
  const colorScheme = useColorScheme();
  const org = useCurrentOrg();
  const [events, setEvents] = useState<Event[] | undefined>();
  const environmentConfig = useEnvironmentConfig();
  const baseUrl =
    org && environmentConfig && webBaseUrl(org, environmentConfig);
  const authToken = useAccessToken();

  const [viewPastEvents, setViewPastEvents] = useState<boolean>(false);

  const loadEvents = async (org: Org) => {
    if (!authToken || !environmentConfig) return;
    const result = await listEvents({
      environmentConfig,
      orgSlug: org.slug,
      authToken,
      variables: { input: { past: viewPastEvents } },
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
      loadEvents(org);
    }
  }, [authToken, org, viewPastEvents]);

  if (!org || !authToken || !baseUrl) {
    return null;
  }

  return (
    <ScrollView
      style={{
        backgroundColor: colorScheme === "dark" ? "#18302B" : "#F5F8FF",
      }}
    >
      <View style={{flex: 1, flexDirection: 'row', padding: 20}}>
        <FilterButton style={[viewPastEvents ? Styles.buttonAlt : {}, { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0}]}
          onPress={() => {
            setViewPastEvents(false);
          }}
          lblText="Upcoming"
          lblStyle={viewPastEvents ? Styles.buttonAltText : {}} />
        <FilterButton style={[viewPastEvents ? {} : Styles.buttonAlt, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]}
          onPress={() => {
            setViewPastEvents(true);
          }}
          lblText="Past"
          lblStyle={viewPastEvents ? {} : Styles.buttonAltText} />
      </View>
      <View style={{ padding: 20, backgroundColor: "transparent" }}>
        {events && (
          <>
            <EventsListSummary events={events} limit={0} org={org} onPressLbl="View on Website" />
            <View style={{ width: 0, height: 20 }}></View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

export default observer(GroupEventsScreen);
