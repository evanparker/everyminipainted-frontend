import { IconType } from "react-icons";

export type Social = {
  name: string;
  link?: string;
  service: SocialService;
  icon: IconType;
};

export enum SocialService {
  Facebook = "facebook",
  Bluesky = "bluesky",
  Mastodon = "mastodon",
  Instagram = "instagram",
  Twitch = "twitch",
  YouTube = "youtube",
  Twitter = "twitter",
}
