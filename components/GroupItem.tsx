import { Image, TouchableOpacity, View, useColorScheme } from "react-native";

import { Text } from "./Themed";
import { Org } from "../types/org";

export default function GroupItem(props: {
  org: Org;
  handleOrgClick: (org: Org) => void;
}) {
  const colorScheme = useColorScheme();
  const { org, handleOrgClick } = props;
  const { logos } = org;
  const logoUrl = logos.square || logos.landscape;

  return (
    <TouchableOpacity
      key={org.id}
      style={{
        width: "90%",
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 8,
        padding: 5,
        backgroundColor: colorScheme === "dark" ? "black" : "white",
      }}
      onPress={() => handleOrgClick(org)}
    >
      <View style={{ justifyContent: "center" }}>
        {logoUrl && (
          <Image
            style={{
              width: 65,
              height: 65,
              borderRadius: 6,
              borderColor: "#C0C0C0",
              borderWidth: 1,
            }}
            source={{ uri: logoUrl }}
            resizeMode="contain"
          />
        )}
      </View>
      <View style={{ width: 20, height: 10 }} />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {org.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
