import { Image, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";

import Styles from "../styles";
import { Event } from "../types/event";
import { Text, View } from "./Themed";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";

interface Props {
  event: Event;
}

export function EventListItem(props: Props) {
  const colorScheme = useColorScheme();
  const { event } = props;
  const navigation = useNavigation();
  const imageUrl = event.image?.thumbUrl;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(
          "EventHome" as never,
          { event: JSON.stringify(event) } as never
        )
      }
    >
      <View
        style={{
          ...Styles.row,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: colorScheme === "dark" ? "#00C29822" : "#00C29810",
          padding: 15,
          marginBottom: 10,
        }}
      >
        {imageUrl && (
          <>
            <Image
              style={{ width: 80, height: 45 }}
              source={{ uri: imageUrl }}
            />
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: "rgba(255, 255, 255, 0)",
              }}
            />
          </>
        )}
        <View
          style={{
            flexGrow: 1,
            flex: 1,
            backgroundColor: "rgba(255, 255, 255, 0)",
          }}
        >
          <Text
            style={{
              color: colorScheme === "dark" ? "white" : "#00B48D",
              flexGrow: 1,
              flex: 1,
              fontWeight: "bold",
            }}
          >
            {event.title}
          </Text>
          <Text style={{ color: colorScheme === "dark" ? "white" : "#00B48D" }}>
            {format(event.startAt, "EEEE, MMMM d, yyyy")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
