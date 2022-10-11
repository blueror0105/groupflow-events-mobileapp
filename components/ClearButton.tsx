import { TouchableOpacity, useColorScheme } from "react-native";
import Styles from "../styles";
import { Text } from "./Themed";
import { AntDesign } from "@expo/vector-icons";

interface Props {
  onPress?: () => void;
  text?: string;
  rightIcon?: boolean;
  noBorder?: boolean;
}

export default function ClearButton(props: Props) {
  const colorScheme = useColorScheme();
  const { onPress, text, rightIcon, noBorder } = props;
  const iconColor = colorScheme === "dark" ? "#FFFFFF" : "#525252";
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[Styles.standAloneLink, { borderBottomWidth: noBorder ? 0 : 1 }]}
    >
      <Text
        style={[
          Styles.linkText,
          { color: colorScheme === "dark" ? "white" : "#525252" },
        ]}
      >
        {text}
      </Text>
      {rightIcon ? (
        <AntDesign name="right" size={24} color={iconColor} />
      ) : null}
    </TouchableOpacity>
  );
}
