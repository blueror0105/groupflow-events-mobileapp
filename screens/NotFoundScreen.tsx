import ClearButton from "../components/ClearButton";
import { Text, View } from "../components/Themed";
import Styles from "../styles";

export default function NotFoundScreen({ navigation }: any) {
  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>This screen doesn't exist.</Text>
      <ClearButton
        text="Go to home screen!"
        onPress={() => navigation.replace("Root")}
      />
    </View>
  );
}
