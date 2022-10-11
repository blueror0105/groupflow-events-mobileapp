import { Image } from "./image";

export interface Event {
  id: string;
  image: Image | null;
  photoUrl: string;
  startAt: Date;
  title: string;
  description: string;
}
