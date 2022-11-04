import { ExpoConfig, ConfigContext } from "@expo/config";
import { networkInterfaces } from "os";

const nets = networkInterfaces();
let results: { name: string; address: string }[] = [];

for (const name of Object.keys(nets)) {
  for (const net of nets[name] as any) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
    const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
    if (net.family === familyV4Value && !net.internal) {
      results = [...results, { name, address: net.address }];
    }
  }
}

let localhost = "192.168.0.95";
if (results.length > 0) {
  localhost = results[0].address;
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "GroupFlow",
  description: "An online platform for member-driven groups and communities",
  slug: "groupflow",
  owner: "moxleydata",
  version: "1.1.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "groupflow",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "app.groupflow",
    supportsTablet: false,
    buildNumber: "12",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    googleServicesFile: "./google-services.json",
    package: "app.groupflow",
    permissions: [],
    versionCode: 13,
  },
  web: {
    favicon: "./assets/images/favicon.png",
  },
  primaryColor: "#FFFFFF",
  plugins: ["sentry-expo"],
  hooks: {
    postPublish: [
      {
        file: "sentry-expo/upload-sourcemaps",
        config: {
        },
      },
    ],
  },
  extra: {
    developmentApiBaseUrl:
      process.env.API_BASE_URL || `http://${localhost}:4040/api`,
    developmentWebBaseUrl:
      process.env.WEB_BASE_URL || `http://${localhost}:3002`,
    environment: process.env.APP_ENV || "development",
    eas: {
    },
  },
});
