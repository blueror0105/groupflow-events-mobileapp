import Styles from "../styles";
import { Text, View } from "./Themed";
import { Image, TouchableOpacity } from "react-native";

interface Props {
  email: string;
  onSwitchEmailPresssed?: () => void;
}

export default function EmailSent(props: Props) {
  const { email } = props;

  return (
    <>
      <Text style={[Styles.title, { textAlign: "center", color: "#00B48D" }]}>
        Email Sent
      </Text>
      <Image
        style={{ alignSelf: "center", width: 108 }}
        resizeMode="contain"
        source={require("../assets/images/emailCheck.png")}
      />
      <Text style={[Styles.text, { textAlign: "center", marginTop: 20 }]}>
        A verification email was sent to
      </Text>
      <Text
        style={[
          Styles.text,
          {
            marginBottom: 40,
            marginTop: 10,
            textAlign: "center",
            fontWeight: "bold",
          },
        ]}
      >
        {email}
      </Text>
      <Text style={[Styles.text, { lineHeight: 28 }]}>
        Please check your email and follow the contained link.
      </Text>
      <TouchableOpacity
        onPress={props.onSwitchEmailPresssed}
        style={[Styles.button, { marginTop: 20 }]}
      >
        <View style={{ backgroundColor: "transparent" }}>
          <Text style={Styles.buttonText}>
            Switch to different email address
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
}
