import { observer } from "mobx-react";
import { Fragment, useEffect } from "react";
import { Alert, ScrollView, useColorScheme, View } from "react-native";
import PushNotificationModal from "../components/PushNotificationModal";
import GroupItem from "../components/GroupItem";
import { Text } from "../components/Themed";
import { listOrgs } from "../lib/api/org";
import { useAppContextStore } from "../lib/appContext";
import { Org } from "../types/org";

function GroupsScreen({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const store = useAppContextStore();
  const orgs = store?.orgs;

  function handleOrgClick(org: Org) {
    if (!store) throw new Error("appContextStore is not set");
    store.setOrgId(org.id);
    navigation.navigate("GroupHome", {
      orgId: org.id,
      orgName: org.name,
      orgAbbr: org.abbreviation,
    } as any);
  }

  function resetNavigation() {
    navigation.reset({
      index: 0,
      routes: [{ name: "Groups" }],
    });
  }

  async function loadOrgs() {
    const { accessToken, environmentConfig } = store || {};
    if (!store || !environmentConfig || !accessToken) return;
    const resp = await listOrgs({ environmentConfig, accessToken });

    if (resp.error) {
      Alert.alert("Error", "Failed to load your groups");
      console.warn("API error", resp.error);
    } else {
      const orgs = resp.data;
      store.setOrgs(orgs);
    }
  }

  useEffect(() => {
    if (!store?.orgs) {
      loadOrgs();
    }
  }, [store?.accessToken, store?.environmentConfig]);

  useEffect(() => {
    const state = navigation.getState();
    if (state.index > 0) {
      resetNavigation();
    }
  }, [false]);

  return (
    <ScrollView
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colorScheme === "dark" ? "#18302B" : "#F5F8FF",
      }}
    >
      <View style={{ paddingTop: 10, width: "100%", alignItems: "center" }}>
        {orgs ? (
          orgs.map((org) => (
            <Fragment key={org.id}>
              <GroupItem org={org} handleOrgClick={handleOrgClick} />
            </Fragment>
          ))
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
      {orgs ? (
        <PushNotificationModal />
      ) : null}
    </ScrollView>
  );
}

export default observer(GroupsScreen);
