import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function usePushNotifications() {
  // const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  async function registerForPush() {
    // This listener is fired whenever a notification is received while the app is foregrounded
    // notificationListener.current =
    //   Notifications.addNotificationReceivedListener((notification) => {
    //     setNotification(notification);
    //   });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User response to notification", response);
      });
  }

  function unregisterForPush() {
    notificationListener.current &&
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    responseListener.current &&
      Notifications.removeNotificationSubscription(responseListener.current);
  }

  useEffect(() => {
    registerForPush();
    return unregisterForPush;
  }, []);
}

export async function getUserPermission() { 
  if(Device.isDevice) { 
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    return existingStatus;
  }

  return null;
}

export async function getPushToken() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        experienceId: "@moxleydata/groupflow",
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export function usePushToken() {
  const [pushToken, setPushToken] = useState<string | undefined>();

  async function loadToken() {
    const token = await getPushToken();
    setPushToken(token);
  }

  useEffect(() => {
    loadToken();
  }, []);

  return pushToken;
}
