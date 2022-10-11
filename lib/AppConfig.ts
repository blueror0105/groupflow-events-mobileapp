import Constants from "expo-constants";
import { AppConfigType } from "../types/app-config";
const AppConfig: AppConfigType = Constants.manifest?.extra as AppConfigType;

export default AppConfig;
