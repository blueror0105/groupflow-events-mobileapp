export interface Org {
  abbreviation: string;
  duesAmount: string;
  id: string;
  logos: {
    favicon: string | null;
    landscape: string | null;
    mobileLandscape: string | null;
    square: string | null;
  };
  mailingAddress: string | null;
  meetup: MeetupConfig | null;
  name: string;
  slug: string;
  websiteUrl: string;
}

export interface MeetupConfig {
  authEnabled: boolean;
  groupId: string;
  groupSlug: string;
  syncEnabled: boolean;
}
