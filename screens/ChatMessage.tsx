import { observer } from "mobx-react";
import { useEffect } from 'react';
import { useEnvironmentConfig, useCurrentOrg } from "../lib/appContext";
import { webBaseUrl } from "../lib/web";
import { ScrollView, useColorScheme, Linking, View, Text, TouchableOpacity } from "react-native";
import Styles from "../styles";
import { AntDesign } from "@expo/vector-icons";

function ChatMessageScreen(props: { route: any; navigation: any }) {
  const colorScheme = useColorScheme();
  const { route } = props;
  const environmentConfig = useEnvironmentConfig();
  const org = useCurrentOrg();
  if(!org) {
    return null;
  }

  const baseUrl = environmentConfig && webBaseUrl(org, environmentConfig);
  if (!baseUrl) {
    return null;
  }

  const senderName = route.params?.senderName ?? "Unknown Sender";
  const body = route.params?.body ?? "No Message Content";
  const channelId = route.params?.channelId ?? '';

  useEffect(() => {
    props.navigation?.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={()=> {
          props.navigation?.navigate("GroupHome" as never, {} as never);
        }} style={{flexDirection: 'row', alignItems: 'center'}}>
          <AntDesign name="left" size={24} color={'blue'} style={{marginRight: 5}} />
          <Text style={{fontSize: 16, color: 'blue'}}>Group Home</Text>
        </TouchableOpacity>
      )
    });
  }, []);

  return (
    <ScrollView
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colorScheme === "dark" ? "#18302B" : "#F5F8FF",
      }}
    >
      <View style={{ paddingTop: 10, width: '100%', alignItems: 'center' }}>
        <Text style={Styles.title}>{senderName}</Text>
        <Text style={Styles.text}>{body}</Text>
        <View style={{padding: 20, marginTop: 20}}>
        <TouchableOpacity onPress={()=> {
          Linking.openURL(`${baseUrl}/members/messages/${channelId}`)
        }} style={Styles.button}><Text style={Styles.buttonText}>View Message Details</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default observer(ChatMessageScreen);
