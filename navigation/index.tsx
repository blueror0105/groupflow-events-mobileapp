/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ColorSchemeName, Pressable, View } from "react-native";
import * as Notifications from "expo-notifications";
import { observer } from "mobx-react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ModalScreen from "../screens/AppInfoModal";
import NotificationSettingsScreen from "../screens/NotificationSettingsModal";
import NotFoundScreen from "../screens/NotFoundScreen";
import GroupsScreen from "../screens/GroupsScreen";
import { RootStackParamList } from "../types/navigation";
import LinkingConfiguration from "./LinkingConfiguration";
import PromptEmail from "../screens/PromptEmail";
import ChatMessageScreen from "../screens/ChatMessage";
import GroupHomeScreen from "../screens/GroupHomeScreen";
import { useAppContextStore, useEnvironmentConfig } from "../lib/appContext";
import EventHomeScreen from "../screens/EventHomeScreen";
import GroupEventsScreen from "../screens/GroupEventsScreen";
import { getEvent } from "../lib/api/events";
import { useEffect } from "react";

interface Props {
  colorScheme: ColorSchemeName;
}

function Navigation(props: Props) {
  const { colorScheme } = props;
  const environmentConfig = useEnvironmentConfig();
  if (!environmentConfig) {
    return null;
  }

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

export default observer(Navigation);

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const RootStack = createNativeStackNavigator<RootStackParamList>();

function RootNavigatorImpl() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const store = useAppContextStore();
  const orgs = store?.orgs;
  const accessToken = store?.accessToken;
  const environmentConfig = store?.environmentConfig;

  const handleNotificationResponse = async (response: any) => {
    const { channelId, eventId, orgId } = response?.notification?.request?.content?.data;

    if (accessToken && environmentConfig && orgId && orgs) {
      store.setOrgId(orgId);
      const foundOrg = orgs.find((o) => o.id === orgId);

      if (eventId && foundOrg) {
        const eventResult = await getEvent({
          environmentConfig,
          orgSlug: foundOrg.slug,
          accessToken,
          variables: { id: eventId },
        });

        if (eventResult.error) {
          console.warn("Failed to fetch events");
        } else {
          const { data } = eventResult;

          if (data) {
            navigation.navigate(
              "EventHome" as never,
              { event: JSON.stringify(data) } as never
            );
          }
        }
      } else if (orgId && channelId) {
        const { senderName, body, truncated } = response?.notification?.request?.content?.data;
        navigation.navigate("ChatMessage" as never, {
          channelId: channelId,
          senderName: senderName,
          body: body,
          truncated: truncated,
        } as never);      
      } else if (orgId) {
        navigation.navigate("GroupHome" as never, {} as never);
      }
    }
  };

  useEffect(() => {
    const listener = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return () => {
      Notifications.removeNotificationSubscription(listener);
    };
  }, []);

  function screenOptions({ navigation }: any, extra?: any) {
    return {
      ...(extra || {}),
      headerTitleAlign: "center",
      tabBarIcon: ({ color }: any) => <TabBarIcon name="code" color={color} />,
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate("AppInfo")}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <FontAwesome
            name="bars"
            size={25}
            color={Colors[colorScheme].text}
            style={{ marginRight: 15 }}
          />
        </Pressable>
      ),
    };
  }

  const state = navigation.getState();

  // Transition to GroupsHome after authentication
  useEffect(() => {
    const routes = state?.routes;
    const lastRoute = routes && routes[routes.length - 1];
    if (
      accessToken &&
      (!lastRoute ||
        lastRoute.name === "ConnectGroups" ||
        lastRoute.name === "PromptEmail")
    ) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Groups" as never }],
      });
    }
  }, [accessToken]);

  return (
    <RootStack.Navigator
      initialRouteName={accessToken ? "Groups" : "PromptEmail"}
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <RootStack.Screen
        name="PromptEmail"
        component={PromptEmail}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ConnectGroups"
        component={PromptEmail}
        options={{ headerShown: false }}
      />
      <RootStack.Group screenOptions={screenOptions as any}>
        <RootStack.Screen
          name="Groups"
          component={GroupsScreen}
          options={{ title: "Your Groups" }}
        />
        <RootStack.Screen
          name="GroupHome"
          component={GroupHomeScreen}
          options={({ route }) => ({ title: route.params.orgName })}
        />
        <RootStack.Screen
          name="GroupEvents"
          component={GroupEventsScreen}
          options={({ route }) => ({ title: `${route.params.orgAbbr} Events` })}
        />
        <RootStack.Screen
          name="EventHome"
          component={EventHomeScreen}
          options={{
            title: "Event",
          }}
        />
        <RootStack.Screen
          name="ChatMessage"
          component={ChatMessageScreen}
          options={{
            title: "Message",
            headerLeft: () => (<View />)
          }}
        />
        <RootStack.Group screenOptions={{ presentation: "modal" }}>
          <RootStack.Screen
            name="AppInfo"
            component={ModalScreen}
            options={{ title: "GroupFlow", headerRight: undefined }}
          />
          <RootStack.Screen
            name="NotificationSettings"
            component={NotificationSettingsScreen}
            options={{
              title: "App Notification Settings",
              headerRight: undefined,
            }}
          />
        </RootStack.Group>
      </RootStack.Group>
      <RootStack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </RootStack.Navigator>
  );
}

const RootNavigator = observer(RootNavigatorImpl);

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
