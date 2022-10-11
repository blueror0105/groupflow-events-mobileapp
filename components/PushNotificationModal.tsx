import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Styles from "../styles";
import { useAppContextStore } from "../lib/appContext";
import { differenceInDays } from "date-fns";
import { getPushToken, getUserPermission } from "../lib/push-notifications";
import { savePushToken } from "../lib/api/device";

const isAndroid = Platform.OS === 'android';
const NOTIFICATION_REQUEST_LIMIT = 3;

const PushNotificationModal = () => {
  const appContextStore = useAppContextStore();
  const [showPrompt, setShowPrompt] = useState(false);
  const mountedRef = useRef(true);

  const onGetPushToken = async () => {
    const token = await getPushToken();

    if(appContextStore == null) return null;

    if (token) {
      const accessToken = appContextStore.accessToken ?? "";
      const envConfig = appContextStore.environmentConfig;
      if (!envConfig) {
        throw new Error("envConfig needs to be set here (3)");
      }
      else if(accessToken === "") {
        throw new Error("no accessToken available");
      }

      const result = await savePushToken({
        environmentConfig: envConfig,
        variables: { token },
        bearerToken: accessToken,
      });

      if (result.error) {
        Alert.alert("Error", "Failed to register device for notifications");
      }
      else {
        appContextStore?.setStatusNotifs("granted");
        appContextStore?.setCountRequestedNotifs(0);
        appContextStore?.setDateRequestedNotifs(new Date().toUTCString());
      }
    }
    else {
      appContextStore?.setStatusNotifs("denied");
      appContextStore?.setDateRequestedNotifs(new Date().toUTCString());
    }

    setShowPrompt(false);

    return null;
  };

  const onClose = () => {
    try {
      const shownCount = appContextStore?.countRequestedNotifs ?? 0;
      appContextStore?.setCountRequestedNotifs(shownCount + 1);
      appContextStore?.setDateRequestedNotifs(new Date().toUTCString());
    }
    catch(e) { }
    setShowPrompt(false);
  };

  const fetchCurrentStatus = useCallback(async () => { 
    if(isAndroid) {
      await onGetPushToken();
    }
    else if(appContextStore !== null) {
      const accessToken = appContextStore.accessToken;
      const storedStatus = appContextStore.statusNotifs;
      const dateLastShown = appContextStore.dateRequestedNotifs;
      const shownCount = appContextStore.countRequestedNotifs;
      const checkEveryNDays = 2;
      const shouldCheck = 
        accessToken !== null && 
        storedStatus !== "granted" &&
        shownCount < NOTIFICATION_REQUEST_LIMIT &&
        (!dateLastShown || differenceInDays(new Date(), Date.parse(dateLastShown)) >= checkEveryNDays);

      if(shouldCheck) { 
        await getUserPermission().then((status)=> { 
          if(status == null || status == 'undetermined') {
            setShowPrompt(true);
          }
          else if(status == 'granted' && storedStatus !== status) {
            onGetPushToken();
          }
        });
      }
    }
  }, [mountedRef]);
 
  useEffect(() => {
    fetchCurrentStatus();
    return () => { mountedRef.current = false }
  }, [fetchCurrentStatus]);

  return showPrompt ? (
    <View style={styles.container}>
      <Modal
        animationType='slide'
        transparent={true}
        visible={showPrompt}
        onRequestClose={() => onClose()}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={Styles.title}>Push Notifications</Text>
            <Text style={Styles.text}>{`Your group sends notifications about events, chat messages, and other important information.\nEach type of notification can be controlled from within the app.\n\nTo opt-in press OK to continue.`}</Text>
            <TouchableOpacity
              style={[Styles.button, styles.buttonMargin]}
              onPress={() => onGetPushToken()}>
              <Text style={Styles.buttonText}>OK, Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[Styles.button, styles.buttonOutline, styles.buttonMargin]}
              onPress={() => onClose()}>
              <Text style={[Styles.buttonText, styles.buttonTextOutline]}>Remind me later...</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: { 
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 6,
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonMargin: { 
    marginTop: 20,
  },
  buttonOutline: { 
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ccc'
  },
  buttonTextOutline: { 
    color: '#888',
  },
});

export default PushNotificationModal;