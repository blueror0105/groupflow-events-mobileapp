import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeValue(key: string, value: string | null) {
  try {
    if (value === null) {
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn("Failed to store item", e);
  }
}

export async function getValue(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.warn("Failed to get item", e);
    return null;
  }
}
