import { TouchableOpacity, useColorScheme } from "react-native";
import Styles from "../styles";
import { Text } from "./Themed";

interface Props {
  onPress: () => void;
  children: React.ReactNode;
  alignCenter: boolean;
  textStyle?: any;
}

export default function Link(props: Props) {
  const { onPress, children, alignCenter, textStyle } = props;
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity style={{ paddingVertical: 10 }} onPress={onPress}>
      <Text
        style={[
          Styles.linkText,
          {
            ...textStyle,
            textAlign: alignCenter ? "center" : "left",
            textDecorationLine: "underline",
            color: colorScheme === "dark" ? "white" : "#525252",
          },
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}
