/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  ConnectGroups: undefined;
  LoggedIn: undefined;
  NotFound: undefined;
  PromptEmail: undefined;
  Groups: undefined;
  GroupHome: { orgId: string; orgName: string };
  GroupEvents: { orgId: string; orgAbbr: string };
  EventHome: { event: string };
  AppInfo: undefined;
  NotificationSettings: undefined;
  ChatMessage: { orgId: string, channelId: string, senderName: string, body: string, truncated: boolean };
};
