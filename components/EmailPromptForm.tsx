import { useController, UseFormReturn } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import Styles from "../styles";
import { EmailPromptFormType } from "../types/auth";
import { Text, View } from "./Themed";
import { useState } from "react";

interface Props {
  form: UseFormReturn<EmailPromptFormType>;
  onSubmit?: (values: EmailPromptFormType) => Promise<void>;
  navigation: any;
}

export default function EmailPromptForm(props: Props) {
  const { form } = props;
  const { control, handleSubmit, watch } = form;
  const formEmail = watch("email");
  const emailIsValid = Boolean(formEmail && formEmail.match(/\S+@\S+\.\S+/));
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: EmailPromptFormType) => {
    if (!emailIsValid) {
      Alert.alert(
        "Something looks wrong",
        "That doesn't look like an email address"
      );
      return;
    }

    if (props.onSubmit) {
      setLoading(true);
      props.onSubmit(data);
    }
  };

  function onReturnPressed() {
    const email = watch("email");
    onSubmit({ email });
  }

  const { field } = useController({
    control,
    defaultValue: "",
    name: "email",
  });

  return (
    <>
      <View
        style={{
          backgroundColor: "transparent",
          width: "100%",
          paddingHorizontal: "5%",
        }}
      >
        <View style={{ marginTop: 10, backgroundColor: "transparent" }}>
          <Text style={[Styles.title, { color: "white", marginVertical: 15 }]}>
            Connect to your group
          </Text>
          <Text style={{ ...Styles.text, color: "white", lineHeight: 22 }}>
            Enter the email address you use to sign in into your GroupFlow
            group. We'll find your groups and send you a login link.
          </Text>
        </View>
        <View style={Styles.inputContStyle}>
          <Image
            source={require("../assets/images/emailDropDown.png")}
            style={Styles.inputIcon}
          />
          <TextInput
            autoFocus
            value={field.value}
            style={Styles.inputStyle}
            placeholderTextColor="white"
            placeholder="Enter Email Address"
            onChangeText={(ev) => field.onChange(ev)}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="go"
            onSubmitEditing={onReturnPressed}
          />
        </View>

        <View
          style={{
            marginTop: 15,
            marginBottom: 10,
            backgroundColor: "transparent",
          }}
        >
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={!emailIsValid}
            style={Styles.button}
          >
            <View style={{ backgroundColor: "transparent" }}>
              {(loading && (
                <ActivityIndicator size="large" color="#00c298" />
              )) || <Text style={Styles.buttonText}>Send me the link</Text>}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
