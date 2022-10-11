import { useEffect, useState } from "react";
import { Platform, ScrollView, Switch, Linking } from "react-native";

import { StatusBar } from "expo-status-bar";
import * as Sentry from "sentry-expo";

import { Text, View } from "../components/Themed";
import useColorScheme from "../hooks/useColorScheme";
import {
  useAccessToken,
  useCurrentOrg,
  useEnvironmentConfig,
} from "../lib/appContext";
import { webBaseUrl } from "../lib/web";
import {
  getNotificationSettings,
  setNotificationSettings,
} from "../lib/api/notifications";
import { Notification } from "../types/notifications";
import Styles from "../styles";
import Link from "../components/Link";
import { observer } from "mobx-react";

const slugMap: any = {
  groupAnnouncements: "Group-wide announcements",
  memberMessages: "Notification of new messages to you",
  eventAnnouncements: "New event announcement",
  eventComments:
    "Notification of new messages from the event’s discussion thread",
  eventReminders: "‘Last chance’ reminder of upcoming events",
  rsvpReminders:
    "Reminder of an event tomorrow you have RSVPd ‘yes’ or ‘maybe’ to",
  newRsvps: "Notification of new RSVPs to an event you’re hosting",
};

function NotificationSettingsModal() {
  const [notificationData, setNotificationData] = useState<any>([]);
  const colorScheme = useColorScheme();
  const org = useCurrentOrg();
  const environmentConfig = useEnvironmentConfig();
  const baseUrl =
    org && environmentConfig && webBaseUrl(org, environmentConfig);
  const authToken = useAccessToken();

  const loadNotificationSettings = async () => {
    if (!authToken || !environmentConfig || !org) return;
    const result = await getNotificationSettings({
      environmentConfig,
      orgSlug: org.slug,
      authToken,
    });

    if (result.error) {
      console.warn("Failed to fetch events");
    } else {
      const parsedResult = Object.keys(slugMap).map((slug) => {
        return result.data.find((n) => n.slug === slug);
      });
      setNotificationData(parsedResult);
    }
  };

  const saveNotificationSettings = async (data: Notification) => {
    if (!authToken || !environmentConfig || !org) return;
    const result = await setNotificationSettings({
      environmentConfig,
      orgSlug: org.slug,
      authToken,
      variables: { notificationSettings: [data] },
    });
    if (result.error) {
      throw new Error("Unable to save notifications");
    }
  };

  function onEmailNotificationSettings() {
    if (!org || !authToken) return;
    Linking.openURL(
      `${baseUrl}/members/subscriptions?org=${org.slug}&jwt=${authToken}`
    );
  }

  useEffect(() => {
    loadNotificationSettings();
  }, [authToken, org, environmentConfig]);

  const transparent = "rgba(255, 255, 255, 0)";

  const NotificationItem = ({ data }: { data: Notification }) => {
    return (
      <View style={[Styles.notificationItem, { backgroundColor: transparent }]}>
        <Text style={{ fontSize: 14, width: "80%" }}>{slugMap[data.slug]}</Text>

        <Switch
          value={data.push}
          onValueChange={async (value) => {
            try {
              const updatedData = { ...data, push: value };
              await saveNotificationSettings(updatedData);

              setNotificationData((notificationData: any) =>
                notificationData.map((n: Notification) => {
                  if (n.slug === data.slug) {
                    return { ...n, push: value };
                  }
                  return n;
                })
              );
            } catch (err) {
              Sentry.Native.captureException(err);
            }
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView
      style={{
        backgroundColor: colorScheme === "dark" ? "#18302B" : "#FFFFFF",
      }}
    >
      <View
        style={[Styles.notificationContainer, { backgroundColor: transparent }]}
      >
        <Text style={Styles.notificationHeader}>Annoucements</Text>
        {notificationData.slice(0, 1).map((n: any) => (
          <NotificationItem key={n.slug} data={n} />
        ))}
        <Text style={Styles.notificationHeader}>Messaging</Text>
        {notificationData.slice(1, 2).map((n: any) => (
          <NotificationItem key={n.slug} data={n} />
        ))}
        <Text style={Styles.notificationHeader}>Events</Text>
        {notificationData.slice(2, notificationData.length).map((n: any) => (
          <NotificationItem key={n.slug} data={n} />
        ))}
        <Link
          textStyle={{ flex: 0, marginTop: 15 }}
          alignCenter={true}
          onPress={onEmailNotificationSettings}
        >
          Manage email settings
        </Link>
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

export default observer(NotificationSettingsModal);
