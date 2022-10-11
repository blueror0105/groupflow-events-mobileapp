import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Text, View } from "../components/Themed";
import Styles from "../styles";
import { usePushNotifications } from "../lib/push-notifications";
import EmailPromptForm from "../components/EmailPromptForm";
import { EmailPromptFormType } from "../types/auth";
import EmailSent from "../components/EmailSent";
import { startContactVerification } from "../lib/api/account";
import {
  Alert,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from "react-native";
import { useAppContext, useEnvironmentConfig } from "../lib/appContext";
import AppConfig from "../lib/AppConfig";
import { observer } from "mobx-react";

interface Props {
  navigation: any;
  onSubmit?: (data: any) => void;
  onAuthTokenChange?: (token: string) => void;
  route: any;
}

function PromptEmail(props: Props) {
  const { navigation, route } = props;
  const emailParam = route?.params?.email;
  const form = useForm<EmailPromptFormType>({
    defaultValues: {
      email: "",
    },
  });
  const environmentConfig = useEnvironmentConfig();
  const { setValue } = form;
  const [savedEmail, setSavedEmail] = useState<string>("");
  usePushNotifications();
  const { initializeFromAccessToken } = useAppContext();
  if (!initializeFromAccessToken) {
    throw new Error("initializeFromAccessToken is not set");
  }
  const environment = AppConfig.environment;

  useEffect(() => {
    if (emailParam) {
      setSavedEmail(emailParam);
    }
  }, [emailParam]);

  const clearEmail = () => {
    setSavedEmail("");
    setValue("email", "");
  };

  const onSubmit = async (data: EmailPromptFormType) => {
    if (!environmentConfig) return;
    const resp = await startContactVerification({ environmentConfig, data });
    if (resp.error) {
      Alert.alert(
        "Whoops",
        "There was a problem contacting our servers. This issue may be temporary."
      );
    } else {
      setSavedEmail(data.email);
      props.onSubmit && props.onSubmit(data);

      const { authToken } = resp.data;
      if (authToken) {
        await initializeFromAccessToken(authToken, { isDemo: true });
        navigation && navigation.navigate("Groups", {});
      } else {
        console.log("No authToken");
      }
    }
  };

  return (
    <ImageBackground
      blurRadius={savedEmail ? 3 : 0}
      source={require("../assets/images/email_prompt_bg.jpg")}
      resizeMode="cover"
      style={{ flex: 1, position: "relative" }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: savedEmail ? "rgba(0,0,0,.7)" : "rgba(0,0,0,.6)",
          paddingTop: "16%",
        }}
      >
        {savedEmail ? (
          <Image
            source={require("../assets/images/group_logo.png")}
            resizeMode="contain"
            blurRadius={savedEmail ? 1.4 : 0}
            style={{ width: 168, alignSelf: "center" }}
          />
        ) : null}
        <View
          style={{
            ...Styles.container,
            paddingHorizontal: 20,
            flex: 1,
          }}
        >
          {savedEmail ? (
            <View
              style={{
                paddingVertical: 30,
                paddingHorizontal: 20,
                borderRadius: 10,
              }}
            >
              <EmailSent
                email={savedEmail}
                onSwitchEmailPresssed={clearEmail}
              />
            </View>
          ) : (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              contentContainerStyle={{
                width: "100%",
                flex: 1,
                paddingHorizontal: 20,
              }}
            >
              <MaybeScrollView>
                <Image
                  source={require("../assets/images/group_logo.png")}
                  style={{ width: 168, alignSelf: "center", marginTop: 20 }}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    Keyboard.dismiss();
                  }}
                  style={{
                    backgroundColor: "transparent",
                    paddingBottom: Platform.OS == "ios" ? 60 : "7%", // Button height + 10 pixels
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    flex: 1,
                  }}
                >
                  <EmailPromptForm
                    form={form}
                    onSubmit={onSubmit}
                    navigation={navigation}
                  />
                </TouchableOpacity>
              </MaybeScrollView>
            </KeyboardAvoidingView>
          )}
          {environment !== "production" ? (
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: "transparent",
                paddingBottom: Platform.OS == "ios" ? 60 : "7%", // Button height + 10 pixels
                paddingTop: 0,
                marginTop: 0,
                alignItems: "center",
                justifyContent: "flex-end",
                flex: 0,
              }}
              onPress={() => navigation.navigate("AppInfo")}
            >
              <Text
                style={{
                  ...Styles.text,
                  color: "white",
                  lineHeight: 15,
                  textAlign: "center",
                }}
              >
                Dev Menu
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </ImageBackground>
  );
}

export default observer(PromptEmail);

function MaybeScrollView({ children }: { children: ReactNode }) {
  if (Platform.OS === "ios") {
    return (
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        bounces={false}
        keyboardShouldPersistTaps="always"
      >
        {children}
      </ScrollView>
    );
  }

  return <>{children}</>;
}
